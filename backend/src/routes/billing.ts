/**
 * Billing & Subscription API Routes
 */

import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";

const router = Router();

// GET /api/billing/plans
router.get("/plans", async (req: Request, res: Response) => {
  try {
    const { data: plans, error } = await supabaseAdmin
      .from("subscription_plans")
      .select("*");

    if (error) throw error;

    res.json({
      success: true,
      data: plans || []
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/billing/subscription
router.get("/subscription", async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;
    if (!organization_id) {
      res.status(400).json({ error: "Missing organization_id" });
      return;
    }

    const { data: sub, error } = await supabaseAdmin
      .from("organization_subscriptions")
      .select("*, plan:subscription_plans(*)")
      .eq("organization_id", organization_id)
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      data: sub || null
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/billing/subscription
router.post("/subscription", async (req: Request, res: Response) => {
  try {
    const { organization_id, plan_id } = req.body;
    if (!organization_id || !plan_id) {
      res.status(400).json({ error: "Missing organization_id or plan_id" });
      return;
    }

    const { data: sub, error } = await supabaseAdmin
      .from("organization_subscriptions")
      .upsert({
        organization_id,
        plan_id,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: sub
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
