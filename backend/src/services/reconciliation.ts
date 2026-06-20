/**
 * Reconciliation Engine
 * 
 * Shared logic for matching Paystack, Bank Transfer, and Mobile Money
 * transactions to customers and invoices, then creating payment records.
 */

import { supabaseAdmin } from "../config/supabase.js";

interface ReconcileInput {
  organization_id: string;
  amount: number;
  reference?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_name?: string | null;
  transaction_id?: string | null;
  payment_date?: string;
  source: string;
  channel?: string | null;
  bank_name?: string | null;
  mobile_number?: string | null;
  paid_by_name?: string | null;
  paid_by_phone?: string | null;
  relationship?: string | null;
  currency?: string;
}

interface ReconcileResult {
  status: "matched" | "partial" | "overpaid" | "duplicate" | "unmatched";
  payment_id?: string;
  customer_id?: string | null;
  invoice_id?: string | null;
  message: string;
  confidence_score?: number;
  verification_status?: string;
}

/**
 * Check if a transaction is a duplicate by reference, transaction_id,
 * or the amount + payment_date + customer combination.
 */
async function checkDuplicate(
  orgId: string,
  amount: number,
  paymentDate: string,
  customerId: string | null,
  customerPhone: string | null,
  reference?: string | null,
  transactionId?: string | null
): Promise<boolean> {
  if (reference) {
    const { data } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("organization_id", orgId)
      .eq("reference", reference)
      .limit(1);
    if (data && data.length > 0) return true;
  }
  
  if (transactionId) {
    const { data } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("organization_id", orgId)
      .eq("transaction_id", transactionId)
      .limit(1);
    if (data && data.length > 0) return true;
  }

  // Heuristic check: Same customer, same amount, same date
  if (customerId && amount && paymentDate) {
    const { data } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("organization_id", orgId)
      .eq("customer_id", customerId)
      .eq("amount_paid", amount)
      .eq("payment_date", paymentDate)
      .limit(1);
    if (data && data.length > 0) return true;
  }

  return false;
}

/**
 * Core reconciliation function.
 * Takes a single transaction input, calculates a matching score, and creates a linked payment record.
 */
export async function reconcileTransaction(input: ReconcileInput): Promise<ReconcileResult> {
  const orgId = input.organization_id;

  // Step 1: Fetch organization currency to ensure currency-aware matching
  const { data: org } = await supabaseAdmin
    .from("organizations")
    .select("currency")
    .eq("id", orgId)
    .single();
  const orgCurrency = org?.currency || "GHS";

  const currencyMatch = !input.currency || input.currency.toUpperCase() === orgCurrency.toUpperCase();
  const currencyPenalty = currencyMatch ? 0 : -30;

  // Step 2: Fetch candidate customers and invoices in this organization
  const { data: allCustomers } = await supabaseAdmin
    .from("customers")
    .select("id, name, phone, email, customer_code, expected_amount, due_amount")
    .eq("organization_id", orgId);

  const { data: allInvoices } = await supabaseAdmin
    .from("invoices")
    .select("id, customer_id, invoice_number, amount, status")
    .eq("organization_id", orgId)
    .neq("status", "paid");

  // Step 3: Match heuristics and scoring
  let bestCustomer: any = null;
  let bestInvoice: any = null;
  let maxScore = 0;

  const cleanPhone = (p?: string | null) => p ? p.replace(/\D/g, "") : "";
  const cleanName = (n?: string | null) => n ? n.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

  const refClean = input.reference ? input.reference.trim().toUpperCase() : "";
  const inputPhone = cleanPhone(input.customer_phone || input.mobile_number || input.paid_by_phone);
  const inputEmail = input.customer_email ? input.customer_email.trim().toLowerCase() : "";
  const inputName = cleanName(input.customer_name || input.paid_by_name);

  for (const c of (allCustomers || [])) {
    let score = 0;
    let matchedInvoice: any = null;

    // A. Reference / Invoice matching
    if (c.customer_code && refClean === c.customer_code.trim().toUpperCase()) {
      score += 50;
    }

    const customerInvoices = (allInvoices || []).filter(inv => inv.customer_id === c.id);
    const invMatch = customerInvoices.find(inv => inv.invoice_number.trim().toUpperCase() === refClean);
    if (invMatch) {
      score += 50;
      matchedInvoice = invMatch;
    }

    // B. Phone Match (+25 points)
    const cPhone = cleanPhone(c.phone);
    if (cPhone && inputPhone && (cPhone.endsWith(inputPhone) || inputPhone.endsWith(cPhone))) {
      score += 25;
    }

    // C. Email Match (+25 points)
    const cEmail = c.email ? c.email.trim().toLowerCase() : "";
    if (cEmail && inputEmail && cEmail === inputEmail) {
      score += 25;
    }

    // D. Fuzzy Name Match (+10 points)
    const cName = cleanName(c.name);
    if (cName && inputName && (cName.includes(inputName) || inputName.includes(cName))) {
      score += 10;
    }

    // E. Amount Match (+15 points)
    if (Math.abs(Number(c.due_amount) - input.amount) < 0.01 || Math.abs(Number(c.expected_amount) - input.amount) < 0.01) {
      score += 15;
    }
    const amtMatch = customerInvoices.find(inv => Math.abs(Number(inv.amount) - input.amount) < 0.01);
    if (amtMatch) {
      score += 15;
      if (!matchedInvoice) {
        matchedInvoice = amtMatch;
      }
    }

    // F. Currency Penalty
    score += currencyPenalty;

    if (score > maxScore) {
      maxScore = score;
      bestCustomer = c;
      bestInvoice = matchedInvoice;
    }
  }

  const confidenceScore = Math.max(0, Math.min(100, maxScore));
  const customerId = bestCustomer?.id || null;
  const invoiceId = bestInvoice?.id || null;

  // Step 4: Check duplicates
  const isDuplicate = await checkDuplicate(
    orgId,
    input.amount,
    input.payment_date || new Date().toISOString().slice(0, 10),
    customerId,
    input.customer_phone || input.mobile_number || null,
    input.reference,
    input.transaction_id
  );

  if (isDuplicate) {
    return {
      status: "duplicate",
      message: `Duplicate transaction detected (ref: ${input.reference || input.transaction_id}).`,
    };
  }

  // Step 5: Determine verification status based on threshold (50 points)
  // If matched and score >= 50, it auto-verifies. Else, it stays pending review.
  const verificationStatus = (customerId && confidenceScore >= 50) ? "auto_verified" : "pending";

  // Step 6: Determine outcome status
  let outcome: "matched" | "partial" | "overpaid" | "unmatched" = "unmatched";

  if (customerId) {
    // Determine status relative to customer expectations
    const expected = Number(bestCustomer.expected_amount || 0);
    if (input.amount >= expected && expected > 0) {
      outcome = input.amount > expected ? "overpaid" : "matched";
    } else if (input.amount > 0 && input.amount < expected) {
      outcome = "partial";
    } else {
      outcome = "matched";
    }
  }

  // Determine payment status column value
  let paymentStatus: string = "paid";
  if (outcome === "partial") paymentStatus = "partial";
  else if (outcome === "overpaid") paymentStatus = "mismatch";
  else if (outcome === "unmatched") paymentStatus = "paid";

  // Step 7: Insert payment record
  const { data: payment, error: payErr } = await supabaseAdmin
    .from("payments")
    .insert({
      organization_id: orgId,
      customer_id: customerId,
      invoice_id: invoiceId,
      amount_paid: input.amount,
      payment_method: input.channel || null,
      reference: input.reference || null,
      payment_date: input.payment_date || new Date().toISOString().slice(0, 10),
      notes: customerId
        ? `Reconciled via ${input.source}. Match score: ${confidenceScore}. Status: ${outcome}. Verification: ${verificationStatus}.`
        : `Unmatched transaction from ${input.source}. Verification: pending staff match.`,
      status: paymentStatus,
      source: input.source,
      transaction_id: input.transaction_id || null,
      currency: input.currency || "GHS",
      bank_name: input.bank_name || null,
      mobile_number: input.mobile_number || null,
      paid_by_name: input.paid_by_name || null,
      paid_by_phone: input.paid_by_phone || null,
      relationship: input.relationship || null,
      confidence_score: confidenceScore,
      verification_status: verificationStatus,
    })
    .select()
    .single();

  if (payErr || !payment) {
    console.error("[Reconciliation] Payment insert error:", payErr?.message);
    return { status: "unmatched", message: `Failed to insert payment: ${payErr?.message}` };
  }

  // Step 8: If overpayment and verified, create alert & refund request
  if (outcome === "overpaid" && customerId && verificationStatus === "auto_verified") {
    const excess = input.amount - Number(bestCustomer.expected_amount);

    await supabaseAdmin.from("alerts").insert({
      organization_id: orgId,
      invoice_id: invoiceId,
      payment_id: payment.id,
      type: "overpayment",
      amount: excess,
      message: `Overpayment of ${excess.toLocaleString()} detected for ${bestCustomer.name}. Paid: ${input.amount.toLocaleString()}, Expected: ${bestCustomer.expected_amount.toLocaleString()}.`,
    });

    await supabaseAdmin.from("refunds").insert({
      organization_id: orgId,
      customer_id: customerId,
      payment_id: payment.id,
      invoice_id: invoiceId,
      refund_amount: excess,
      reason: `Automated refund candidate for overpayment via ${input.source}.`,
      status: "pending",
    });
  }

  // Step 9: If verified & matched invoice, update invoice status
  if (invoiceId && verificationStatus === "auto_verified") {
    const invoiceStatus = outcome === "overpaid" ? "overpaid" : outcome === "partial" ? "partial" : "paid";
    await supabaseAdmin
      .from("invoices")
      .update({ status: invoiceStatus })
      .eq("id", invoiceId);
  }

  // Step 10: Audit Log
  await supabaseAdmin.from("audit_logs").insert({
    organization_id: orgId,
    action_type: "payment_reconciled",
    action_description: `Payment of ${input.amount.toLocaleString()} processed from ${input.source}. Score: ${confidenceScore}. Status: ${outcome}. Verification: ${verificationStatus}.`,
    related_record_id: payment.id,
  });

  return {
    status: outcome,
    payment_id: payment.id,
    customer_id: customerId,
    invoice_id: invoiceId,
    message: `Transaction processed: ${outcome}. Score: ${confidenceScore}. Verification: ${verificationStatus}.`,
    confidence_score: confidenceScore,
    verification_status: verificationStatus,
  };
}

/**
 * Batch reconciliation for CSV/Excel imports.
 */
export async function reconcileBatch(orgId: string, rows: ReconcileInput[]): Promise<{
  total: number;
  matched: number;
  partial: number;
  overpaid: number;
  duplicates: number;
  unmatched: number;
  results: ReconcileResult[];
}> {
  const results: ReconcileResult[] = [];
  let matched = 0, partial = 0, overpaid = 0, duplicates = 0, unmatched = 0;

  for (const row of rows) {
    const result = await reconcileTransaction({
      ...row,
      organization_id: orgId,
    });
    results.push(result);

    switch (result.status) {
      case "matched": matched++; break;
      case "partial": partial++; break;
      case "overpaid": overpaid++; break;
      case "duplicate": duplicates++; break;
      case "unmatched": unmatched++; break;
    }
  }

  return { total: rows.length, matched, partial, overpaid, duplicates, unmatched, results };
}
