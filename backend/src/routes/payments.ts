/**
 * Payments API Routes (Batch Reconciliation)
 * 
 * POST /api/payments/reconcile-batch — Batch-reconcile uploaded CSV/Excel rows
 */

import { Router, Request, Response } from "express";
import { reconcileBatch } from "../services/reconciliation.js";

const router = Router();

// ─── POST /api/payments/reconcile-batch ───
// Accepts an array of parsed payment rows from CSV/Excel upload
// and runs each through the reconciliation engine
router.post("/reconcile-batch", async (req: Request, res: Response) => {
  try {
    const { organization_id, rows } = req.body;

    if (!organization_id) {
      res.status(400).json({ error: "Missing organization_id" });
      return;
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ error: "No rows provided for reconciliation" });
      return;
    }

    // Map incoming rows to ReconcileInput format
    const inputs = rows.map((r: any) => ({
      organization_id,
      amount: Number(r.amount_paid ?? r.amount ?? 0),
      reference: r.reference || r.transaction_reference || null,
      customer_email: r.customer_email || null,
      customer_phone: r.customer_phone || r.mobile_number || null,
      customer_name: r.customer_name || null,
      transaction_id: r.transaction_id || r.transaction_reference || null,
      payment_date: r.payment_date || r.date || new Date().toISOString().slice(0, 10),
      source: r.source || r.provider || "bank",
      channel: r.payment_method || r.channel || null,
      bank_name: r.bank_name || null,
      mobile_number: r.mobile_number || null,
      paid_by_name: r.paid_by_name || null,
      paid_by_phone: r.paid_by_phone || null,
      relationship: r.relationship || null,
      currency: r.currency || "NGN",
      customer_id: r.customer_id || null,
    }));

    const result = await reconcileBatch(organization_id, inputs);

    res.json({
      success: true,
      message: `Batch reconciliation complete. ${result.matched} matched, ${result.partial} partial, ${result.overpaid} overpaid, ${result.duplicates} duplicates, ${result.unmatched} unmatched.`,
      ...result,
    });
  } catch (err: any) {
    console.error("[Payments] Batch reconcile error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
