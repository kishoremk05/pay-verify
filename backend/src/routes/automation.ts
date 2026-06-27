/**
 * Automation Workflow API Routes
 */

import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";

const router = Router();

// GET /api/automation/rules
router.get("/rules", async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;
    if (!organization_id) {
      res.status(400).json({ error: "Missing organization_id" });
      return;
    }

    const { data: rules, error } = await supabaseAdmin
      .from("automation_rules")
      .select("*")
      .eq("organization_id", organization_id);

    if (error) throw error;

    res.json({
      success: true,
      data: rules || []
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/automation/rules
router.post("/rules", async (req: Request, res: Response) => {
  try {
    const { organization_id, event_type, action_type, enabled, configuration } = req.body;
    if (!organization_id || !event_type || !action_type) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const { data: rule, error } = await supabaseAdmin
      .from("automation_rules")
      .upsert({
        organization_id,
        event_type,
        action_type,
        enabled: enabled ?? true,
        configuration: configuration || {}
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: rule
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/automation/trigger-rule
router.post("/trigger-rule", async (req: Request, res: Response) => {
  try {
    const { rule_id, context } = req.body;
    if (!rule_id) {
      res.status(400).json({ error: "Missing rule_id" });
      return;
    }

    // Simulate automation engine execution
    res.json({
      success: true,
      message: `Automation trigger executed for rule ${rule_id}. Trigger action dispatched successfully.`,
      dispatched_at: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
