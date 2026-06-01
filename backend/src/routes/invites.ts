import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { sendInvitationEmail } from "../services/email.js";
import crypto from "crypto";

const router = Router();

// POST /api/invites
// Creates staff invitation row, writes audit log, and dispatches custom HTML invitation email
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      organization_id,
      email,
      role,
      invited_by,
      organization_name,
      invited_by_name,
      frontend_url,
    } = req.body;

    if (!organization_id || !email || !role || !invited_by || !organization_name || !invited_by_name) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const inviteEmail = email.trim().toLowerCase();
    const token = crypto.randomUUID();

    // 1. Insert invitation record bypassing RLS on server-side
    const { data: invitation, error: inviteErr } = await supabaseAdmin
      .from("invitations")
      .insert({
        organization_id,
        email: inviteEmail,
        role,
        token,
        invited_by,
      })
      .select()
      .single();

    if (inviteErr) {
      console.error("[Invite] Insert error:", inviteErr.message);
      res.status(500).json({ error: inviteErr.message });
      return;
    }

    // 2. Log system audit log
    await supabaseAdmin.from("audit_logs").insert({
      organization_id,
      action_type: "staff_invite",
      action_description: `Staff invitation sent to ${inviteEmail} with role '${role}'.`,
      performed_by: invited_by,
    });

    // 3. Build registration URL
    const baseUrl = process.env.FRONTEND_URL || frontend_url || "http://localhost:8080";
    const inviteUrl = `${baseUrl}/signup?invite=${token}`;

    // 4. Dispatch email via brevo, resend, or smtp
    const emailResult = await sendInvitationEmail({
      email: inviteEmail,
      role,
      inviteUrl,
      organizationName: organization_name,
      invitedBy: invited_by_name,
    });

    res.status(201).json({
      invitation,
      inviteUrl,
      emailSent: emailResult.success,
    });
  } catch (err: any) {
    console.error("[Invite] Create error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
