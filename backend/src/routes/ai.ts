import { Router, Request, Response } from "express";
import { processBusinessQuery } from "../services/ai-analytics.js";

const router = Router();

// POST /api/ai/chat
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { organization_id, message } = req.body;

    if (!organization_id) {
      res.status(400).json({ error: "Missing organization_id" });
      return;
    }

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Missing or invalid query message" });
      return;
    }

    const result = await processBusinessQuery(message, organization_id);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("[AI Chat Route] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/dashboard-summary
router.post("/dashboard-summary", async (req: Request, res: Response) => {
  try {
    const { organization_id, stats } = req.body;

    if (!organization_id) {
      res.status(400).json({ error: "Missing organization_id" });
      return;
    }

    if (!stats) {
      res.status(400).json({ error: "Missing dashboard stats" });
      return;
    }

    const { queryOpenRouterText } = await import("../services/ai.js");

    const prompt = `You are a Senior Financial Auditor. Analyze these organization dashboard metrics:
Total Expected Revenue: ${stats.expected}
Total Received: ${stats.received}
Total Overdue/Due: ${stats.due}
Partial Payments: ${stats.partialCount}
Unpaid Accounts: ${stats.unpaidCount}
Duplicate Receipts Stopped: ${stats.duplicateCount}
Mismatched Payments Flagged: ${stats.mismatchCount}
Completed Refund Payouts: ${stats.completedRefundsCount} (Amount: ${stats.completedRefundsAmount})

Provide a concise, 3-4 sentence high-level executive summary of the organization's financial health, ledger matching accuracy, and any leakage warnings (like duplicates or mismatches). Use normal paragraphs, do not return markdown lists.`;

    const summary = await queryOpenRouterText([
      { role: "system", content: "You are a brief, professional financial audit writer." },
      { role: "user", content: prompt }
    ], { temperature: 0.2, max_tokens: 250 });

    res.json({
      success: true,
      summary,
    });
  } catch (err: any) {
    console.error("[AI Summary Route] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
