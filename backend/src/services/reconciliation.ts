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
}

/**
 * Check if a transaction is a duplicate by reference or transaction_id.
 */
async function checkDuplicate(orgId: string, reference?: string | null, transactionId?: string | null): Promise<boolean> {
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
  return false;
}

/**
 * Attempt to find a matching customer using the priority chain:
 * 1. Invoice Number (in reference)
 * 2. Customer Email
 * 3. Customer Phone
 * 4. Account Number (in reference)
 * 5. Customer Name (fuzzy)
 */
async function findCustomer(orgId: string, input: ReconcileInput): Promise<{ customerId: string | null; invoiceId: string | null }> {
  // Priority 1: Match by invoice number in reference
  if (input.reference) {
    const { data: invoices } = await supabaseAdmin
      .from("invoices")
      .select("id, customer_id")
      .eq("organization_id", orgId)
      .eq("invoice_number", input.reference)
      .limit(1);
    if (invoices && invoices.length > 0) {
      return { customerId: invoices[0].customer_id, invoiceId: invoices[0].id };
    }
  }

  // Priority 2: Match by customer email
  if (input.customer_email) {
    const { data: customers } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("organization_id", orgId)
      .ilike("email", input.customer_email)
      .limit(1);
    if (customers && customers.length > 0) {
      return { customerId: customers[0].id, invoiceId: null };
    }
  }

  // Priority 3: Match by customer phone
  if (input.customer_phone || input.mobile_number) {
    const phone = input.customer_phone || input.mobile_number;
    const { data: customers } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("organization_id", orgId)
      .eq("phone", phone)
      .limit(1);
    if (customers && customers.length > 0) {
      return { customerId: customers[0].id, invoiceId: null };
    }
  }

  // Priority 4: Match by account number (stored in reference field)
  if (input.reference) {
    const { data: customers } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("organization_id", orgId)
      .eq("account_number", input.reference)
      .limit(1);
    if (customers && customers.length > 0) {
      return { customerId: customers[0].id, invoiceId: null };
    }
  }

  // Priority 5: Match by customer name (case-insensitive)
  if (input.customer_name) {
    const { data: customers } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("organization_id", orgId)
      .ilike("name", input.customer_name)
      .limit(1);
    if (customers && customers.length > 0) {
      return { customerId: customers[0].id, invoiceId: null };
    }
  }

  return { customerId: null, invoiceId: null };
}

/**
 * Determine the reconciliation outcome based on amount vs expected.
 */
function determineOutcome(paid: number, expected: number): "matched" | "partial" | "overpaid" {
  if (paid >= expected && expected > 0) {
    if (paid > expected) return "overpaid";
    return "matched";
  }
  if (paid > 0 && paid < expected) return "partial";
  return "matched";
}

/**
 * Core reconciliation function.
 * Takes a single transaction input and creates a linked payment record.
 */
export async function reconcileTransaction(input: ReconcileInput): Promise<ReconcileResult> {
  const orgId = input.organization_id;

  // Step 1: Duplicate check
  const isDuplicate = await checkDuplicate(orgId, input.reference, input.transaction_id);
  if (isDuplicate) {
    return {
      status: "duplicate",
      message: `Duplicate transaction detected (ref: ${input.reference || input.transaction_id}).`,
    };
  }

  // Step 2: Find customer and optional invoice
  const { customerId, invoiceId } = await findCustomer(orgId, input);

  // Step 3: Determine status
  let outcome: "matched" | "partial" | "overpaid" | "unmatched" = "unmatched";

  if (customerId) {
    // Get customer expected amount
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("expected_amount, due_amount")
      .eq("id", customerId)
      .single();

    if (customer) {
      const expected = Number(customer.expected_amount || 0);
      outcome = determineOutcome(input.amount, expected);
    } else {
      outcome = "matched";
    }
  }

  // Step 4: Determine payment status for DB enum
  let paymentStatus: string = "paid";
  if (outcome === "partial") paymentStatus = "partial";
  else if (outcome === "overpaid") paymentStatus = "mismatch";
  else if (outcome === "unmatched") paymentStatus = "paid"; // still record as paid, just unlinked

  // Step 5: Insert payment record
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
        ? `Auto-reconciled via ${input.source}. Status: ${outcome}.`
        : `Unmatched transaction from ${input.source}. No customer linked.`,
      status: paymentStatus,
      source: input.source,
      transaction_id: input.transaction_id || null,
      currency: input.currency || "NGN",
      bank_name: input.bank_name || null,
      mobile_number: input.mobile_number || null,
      paid_by_name: input.paid_by_name || null,
      paid_by_phone: input.paid_by_phone || null,
      relationship: input.relationship || null,
    })
    .select()
    .single();

  if (payErr || !payment) {
    console.error("[Reconciliation] Payment insert error:", payErr?.message);
    return { status: "unmatched", message: `Failed to insert payment: ${payErr?.message}` };
  }

  // Step 6: If overpayment — create alert and refund candidate
  if (outcome === "overpaid" && customerId) {
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("expected_amount, name")
      .eq("id", customerId)
      .single();

    if (customer) {
      const excess = input.amount - Number(customer.expected_amount);

      // Create overpayment alert
      await supabaseAdmin.from("alerts").insert({
        organization_id: orgId,
        invoice_id: invoiceId,
        payment_id: payment.id,
        type: "overpayment",
        amount: excess,
        message: `Overpayment of ${excess.toLocaleString()} detected for ${customer.name || "customer"}. Paid: ${input.amount.toLocaleString()}, Expected: ${Number(customer.expected_amount).toLocaleString()}.`,
      });

      // Create pending refund
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
  }

  // Step 7: If matched invoice — update invoice status
  if (invoiceId) {
    const invoiceStatus = outcome === "overpaid" ? "overpaid" : outcome === "partial" ? "partial" : "paid";
    await supabaseAdmin
      .from("invoices")
      .update({ status: invoiceStatus })
      .eq("id", invoiceId);
  }

  // Step 8: Audit log
  await supabaseAdmin.from("audit_logs").insert({
    organization_id: orgId,
    action_type: "payment_reconciled",
    action_description: `Payment of ${input.amount.toLocaleString()} auto-reconciled from ${input.source}. Status: ${outcome}. Customer: ${customerId ? "linked" : "unmatched"}.`,
    related_record_id: payment.id,
  });

  return {
    status: outcome,
    payment_id: payment.id,
    customer_id: customerId,
    invoice_id: invoiceId,
    message: `Transaction reconciled: ${outcome}.`,
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
