/**
 * Paystack API Routes
 * 
 * POST /api/paystack/sync     — Sync all recent Paystack transactions for org
 * POST /api/paystack/verify   — Verify a single transaction by reference
 */

import { Router, Request, Response } from "express";
import { syncPaystackTransactions, verifyPaystackTransaction } from "../services/paystack.js";
import { reconcileTransaction } from "../services/reconciliation.js";

const router = Router();

// ─── POST /api/paystack/sync ───
// Triggers full transaction sync and reconciliation
router.post("/sync", async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.body;

    if (!organization_id) {
      res.status(400).json({ error: "Missing organization_id" });
      return;
    }

    const result = await syncPaystackTransactions(organization_id);

    res.json({
      success: true,
      message: `Paystack sync completed. ${result.reconciled} transactions reconciled.`,
      ...result,
    });
  } catch (err: any) {
    console.error("[Paystack] Sync error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/paystack/verify ───
// Verify a single Paystack transaction and reconcile it
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { organization_id, reference } = req.body;

    if (!organization_id || !reference) {
      res.status(400).json({ error: "Missing organization_id or reference" });
      return;
    }

    const verification = await verifyPaystackTransaction(organization_id, reference);

    if (!verification.success || !verification.transaction) {
      res.status(400).json({ success: false, message: verification.message });
      return;
    }

    const txn = verification.transaction;

    // Reconcile the verified transaction
    const result = await reconcileTransaction({
      organization_id,
      amount: txn.amount / 100,
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

    res.json({
      success: true,
      verification: verification.message,
      reconciliation: result,
    });
  } catch (err: any) {
    console.error("[Paystack] Verify error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
