/**
 * Paystack Integration Service
 * 
 * Fetches transactions from Paystack API and reconciles them
 * against the organization's customers and invoices.
 */

import { supabaseAdmin } from "../config/supabase.js";
import { reconcileTransaction } from "./reconciliation.js";

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_MODE = process.env.PAYSTACK_MODE || "live";

// Safety indicator — visible in server logs on startup
console.log(
  `[Paystack] Running in ${PAYSTACK_MODE.toUpperCase()} MODE. ${
    PAYSTACK_MODE === "test"
      ? "Using test keys — no real money will be moved."
      : "⚠️  LIVE MODE — real transactions are active."
  }`
);


interface PaystackTransaction {
  id: number;
  reference: string;
  amount: number; // in kobo (divide by 100)
  currency: string;
  status: string;
  channel: string;
  paid_at: string;
  customer: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

/**
 * Fetch the Paystack secret key for an organization from payment_providers table.
 */
async function getPaystackSecretKey(organizationId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("payment_providers")
    .select("credentials_json")
    .eq("organization_id", organizationId)
    .eq("provider_type", "paystack")
    .eq("active", true)
    .limit(1)
    .single();

  if (!data?.credentials_json) return null;
  return (data.credentials_json as any).secret_key || null;
}

/**
 * Fetch transactions from Paystack API.
 */
async function fetchPaystackTransactions(
  secretKey: string,
  perPage: number = 50,
  page: number = 1
): Promise<PaystackTransaction[]> {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction?perPage=${perPage}&page=${page}&status=success`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Paystack API error (${res.status}): ${errText}`);
  }

  const body = (await res.json()) as { data?: PaystackTransaction[] };
  return body.data ?? [];
}

/**
 * Verify a single Paystack transaction by reference.
 */
export async function verifyPaystackTransaction(
  organizationId: string,
  reference: string
): Promise<{ success: boolean; message: string; transaction?: PaystackTransaction }> {
  const secretKey = await getPaystackSecretKey(organizationId);
  if (!secretKey) {
    return { success: false, message: "No active Paystack provider configured for this organization." };
  }

  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    return { success: false, message: `Paystack verification failed (${res.status}).` };
  }

  const body = (await res.json()) as { status?: boolean; data?: PaystackTransaction; message?: string };
  if (!body.status || !body.data) {
    return { success: false, message: body.message || "Verification failed." };
  }

  return { success: true, message: "Transaction verified.", transaction: body.data };
}

/**
 * Sync Paystack transactions for an organization.
 * Fetches recent transactions, stores them in paystack_transactions cache,
 * and reconciles unreconciled ones.
 */
export async function syncPaystackTransactions(organizationId: string): Promise<{
  fetched: number;
  newTransactions: number;
  reconciled: number;
  duplicates: number;
  errors: string[];
}> {
  const secretKey = await getPaystackSecretKey(organizationId);
  if (!secretKey) {
    throw new Error("No active Paystack provider configured for this organization.");
  }

  const errors: string[] = [];
  let fetched = 0;
  let newTransactions = 0;
  let reconciled = 0;
  let duplicates = 0;

  try {
    // Fetch up to 100 recent successful transactions (2 pages)
    const page1 = await fetchPaystackTransactions(secretKey, 50, 1);
    const page2 = await fetchPaystackTransactions(secretKey, 50, 2);
    const allTransactions = [...page1, ...page2];
    fetched = allTransactions.length;

    for (const txn of allTransactions) {
      // Check if already cached
      const { data: existing } = await supabaseAdmin
        .from("paystack_transactions")
        .select("id, reconciled")
        .eq("organization_id", organizationId)
        .eq("paystack_id", txn.id)
        .limit(1);

      if (existing && existing.length > 0) {
        // Already cached
        if (!existing[0].reconciled) {
          // Try to reconcile if not already done
          const result = await reconcileTransaction({
            organization_id: organizationId,
            amount: txn.amount / 100, // kobo → currency unit
            reference: txn.reference,
            customer_email: txn.customer?.email || null,
            customer_phone: txn.customer?.phone || null,
            customer_name: txn.customer
              ? [txn.customer.first_name, txn.customer.last_name].filter(Boolean).join(" ") || null
              : null,
            transaction_id: String(txn.id),
            payment_date: txn.paid_at ? new Date(txn.paid_at).toISOString().slice(0, 10) : undefined,
            source: "paystack",
            channel: txn.channel,
            currency: txn.currency,
          });

          if (result.status === "duplicate") {
            duplicates++;
          } else {
            reconciled++;
            // Mark as reconciled
            await supabaseAdmin
              .from("paystack_transactions")
              .update({
                reconciled: true,
                linked_payment_id: result.payment_id || null,
              })
              .eq("id", existing[0].id);
          }
        }
        continue;
      }

      // Insert into cache
      const customerName = txn.customer
        ? [txn.customer.first_name, txn.customer.last_name].filter(Boolean).join(" ") || null
        : null;

      const { error: insertErr } = await supabaseAdmin
        .from("paystack_transactions")
        .insert({
          organization_id: organizationId,
          paystack_id: txn.id,
          reference: txn.reference,
          amount: txn.amount / 100,
          currency: txn.currency,
          customer_email: txn.customer?.email || null,
          customer_name: customerName,
          customer_phone: txn.customer?.phone || null,
          status: txn.status,
          channel: txn.channel,
          paid_at: txn.paid_at,
          metadata: txn.metadata || null,
          reconciled: false,
        });

      if (insertErr) {
        errors.push(`Failed to cache txn ${txn.reference}: ${insertErr.message}`);
        continue;
      }

      newTransactions++;

      // Reconcile
      const result = await reconcileTransaction({
        organization_id: organizationId,
        amount: txn.amount / 100,
        reference: txn.reference,
        customer_email: txn.customer?.email || null,
        customer_phone: txn.customer?.phone || null,
        customer_name: customerName,
        transaction_id: String(txn.id),
        payment_date: txn.paid_at ? new Date(txn.paid_at).toISOString().slice(0, 10) : undefined,
        source: "paystack",
        channel: txn.channel,
        currency: txn.currency,
      });

      if (result.status === "duplicate") {
        duplicates++;
      } else {
        reconciled++;
        // Update cache with reconciliation link
        await supabaseAdmin
          .from("paystack_transactions")
          .update({
            reconciled: true,
            linked_payment_id: result.payment_id || null,
          })
          .eq("organization_id", organizationId)
          .eq("paystack_id", txn.id);
      }
    }
  } catch (err: any) {
    errors.push(err.message);
  }

  // Audit log
  await supabaseAdmin.from("audit_logs").insert({
    organization_id: organizationId,
    action_type: "paystack_sync",
    action_description: `Paystack sync completed. Fetched: ${fetched}, New: ${newTransactions}, Reconciled: ${reconciled}, Duplicates: ${duplicates}.`,
  });

  // Notification
  await supabaseAdmin.from("notifications").insert({
    organization_id: organizationId,
    title: "Paystack Sync Complete",
    message: `Synced ${fetched} transactions. ${reconciled} reconciled, ${duplicates} duplicates, ${newTransactions} new.`,
    type: "reminder",
  });

  return { fetched, newTransactions, reconciled, duplicates, errors };
}
