/**
 * Monetization API Routes
 */

import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";

const router = Router();

// GET /api/monetization/settings
router.get("/settings", async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;
    if (!organization_id) {
      res.status(400).json({ error: "Missing organization_id" });
      return;
    }

    const { data: settings, error } = await supabaseAdmin
      .from("organization_billing_settings")
      .select("*")
      .eq("organization_id", organization_id)
      .maybeSingle();

    if (error) throw error;

    // Return defaults if not configured
    res.json({
      success: true,
      data: settings || {
        organization_id,
        platform_fee_percent: 0.15,
        transaction_fee_fixed: 50.00,
        monthly_invoice_quota: 50,
        payout_reconciliation_limit: 1000000.00
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/monetization/settings
router.post("/settings", async (req: Request, res: Response) => {
  try {
    const { organization_id, platform_fee_percent, transaction_fee_fixed, monthly_invoice_quota, payout_reconciliation_limit } = req.body;
    if (!organization_id) {
      res.status(400).json({ error: "Missing organization_id" });
      return;
    }

    const { data: settings, error } = await supabaseAdmin
      .from("organization_billing_settings")
      .upsert({
        organization_id,
        platform_fee_percent: Number(platform_fee_percent ?? 0),
        transaction_fee_fixed: Number(transaction_fee_fixed ?? 0),
        monthly_invoice_quota: Number(monthly_invoice_quota ?? 50),
        payout_reconciliation_limit: Number(payout_reconciliation_limit ?? 1000000.00),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: settings
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
