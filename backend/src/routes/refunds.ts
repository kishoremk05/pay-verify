/**
 * Refunds API Routes
 * 
 * POST /api/refunds/create    — Record a custom manual refund request
 * POST /api/refunds/:id/approve  — Staff/Manager approves a pending refund request
 * POST /api/refunds/:id/reject   — Staff/Manager rejects a pending refund request
 * POST /api/refunds/:id/complete — Staff/Manager marks an approved refund as completed (paid out)
 */

import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";

const router = Router();

// ─── POST /api/refunds/create ───
// Manually create a refund request
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { organization_id, customer_id, payment_id, refund_amount, reason, processed_by } = req.body;

    if (!organization_id || !customer_id || !refund_amount || !reason) {
      res.status(400).json({ error: "Missing required fields for refund processing" });
      return;
    }

    const amountVal = parseFloat(refund_amount);
    if (isNaN(amountVal) || amountVal <= 0) {
      res.status(400).json({ error: "Refund amount must be a positive number" });
      return;
    }

    // Insert refund request in pending status
    const { data: refund, error } = await supabaseAdmin
      .from("refunds")
      .insert({
        organization_id,
        customer_id,
        payment_id: payment_id || null,
        refund_amount: amountVal,
        reason,
        processed_by: processed_by || null,
        status: "pending"
      })
      .select()
      .single();

    if (error) {
      console.error("[Refund] Create error:", error.message);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Refund request initiated successfully (Pending Approval).",
      refund
    });
  } catch (err: any) {
    console.error("[Refund] Create exception:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/refunds/:id/approve ───
// Manager approves a pending refund request
router.post("/:id/approve", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;

    if (!approved_by) {
      res.status(400).json({ error: "Approver user reference is required" });
      return;
    }

    // Fetch refund to ensure it exists and is pending
    const { data: refund, error: fetchErr } = await supabaseAdmin
      .from("refunds")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !refund) {
      res.status(404).json({ error: "Refund request not found" });
      return;
    }

    if (refund.status !== "pending") {
      res.status(400).json({ error: `Cannot approve a refund that is already ${refund.status}` });
      return;
    }

    // Update status to approved
    const { data: updatedRefund, error: updateErr } = await supabaseAdmin
      .from("refunds")
      .update({
        status: "approved",
        approved_by,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      res.status(500).json({ error: updateErr.message });
      return;
    }

    res.json({
      success: true,
      message: "Refund request approved. Awaiting payout completion.",
      refund: updatedRefund
    });
  } catch (err: any) {
    console.error("[Refund] Approve exception:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/refunds/:id/reject ───
// Manager rejects a pending refund request
router.post("/:id/reject", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rejected_by } = req.body;

    if (!rejected_by) {
      res.status(400).json({ error: "Rejecter user reference is required" });
      return;
    }

    // Fetch refund
    const { data: refund, error: fetchErr } = await supabaseAdmin
      .from("refunds")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !refund) {
      res.status(404).json({ error: "Refund request not found" });
      return;
    }

    if (refund.status !== "pending" && refund.status !== "approved") {
      res.status(400).json({ error: `Cannot reject a refund that is already ${refund.status}` });
      return;
    }

    // Update status to rejected
    const { data: updatedRefund, error: updateErr } = await supabaseAdmin
      .from("refunds")
      .update({
        status: "rejected",
        rejected_by,
        rejected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      res.status(500).json({ error: updateErr.message });
      return;
    }

    res.json({
      success: true,
      message: "Refund request rejected.",
      refund: updatedRefund
    });
  } catch (err: any) {
    console.error("[Refund] Reject exception:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/refunds/:id/complete ───
// Staff marks an approved refund as completed (paid out to client bank)
router.post("/:id/complete", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completed_by } = req.body;

    if (!completed_by) {
      res.status(400).json({ error: "Completed-by user reference is required" });
      return;
    }

    // Fetch refund
    const { data: refund, error: fetchErr } = await supabaseAdmin
      .from("refunds")
      .select("*, payments(id, reference)")
      .eq("id", id)
      .single();

    if (fetchErr || !refund) {
      res.status(404).json({ error: "Refund request not found" });
      return;
    }

    if (refund.status !== "approved") {
      res.status(400).json({ error: "Only approved refunds can be marked as completed" });
      return;
    }

    // Update status to completed
    const { data: updatedRefund, error: updateErr } = await supabaseAdmin
      .from("refunds")
      .update({
        status: "completed",
        completed_by,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      res.status(500).json({ error: updateErr.message });
      return;
    }

    // Resolve any overpayment alert associated with this payment
    if (refund.payment_id) {
      await supabaseAdmin
        .from("alerts")
        .update({ is_resolved: true })
        .eq("payment_id", refund.payment_id);
    }

    res.json({
      success: true,
      message: "Refund marked as COMPLETED (Paid Out) and client ledger updated.",
      refund: updatedRefund
    });
  } catch (err: any) {
    console.error("[Refund] Complete exception:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
