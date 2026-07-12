import { supabaseAdmin } from "../config/supabase.js";
import { queryOpenRouterText } from "./ai.js";

export interface FraudAuditResult {
  isAnomalous: boolean;
  riskScore: number; // 0 to 100
  reasons: string[];
}

export async function detectPaymentAnomaly(
  payment: any,
  customerId: string
): Promise<FraudAuditResult> {
  const reasons: string[] = [];
  let isAnomalous = false;
  let riskScore = 0;

  try {
    // 1. Fetch customer's past payments
    const { data: pastPayments } = await supabaseAdmin
      .from("payments")
      .select("amount_paid, created_at")
      .eq("customer_id", customerId)
      .eq("status", "paid")
      .order("created_at", { ascending: false });

    // 2. Fetch customer details
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("expected_amount")
      .eq("id", customerId)
      .single();

    const expectedAmount = Number(customer?.expected_amount || 0);
    const amountPaid = Number(payment.amount_paid);

    // Heuristic 1: Amount significantly higher than expected (overpayment check)
    if (expectedAmount > 0 && amountPaid > expectedAmount * 1.5) {
      reasons.push(`Overpayment anomaly: Payment GHS ${amountPaid} is 150%+ of expected GHS ${expectedAmount}`);
      riskScore += 25;
    }

    // Heuristic 2: Velocity / Double submission check
    if (pastPayments && pastPayments.length > 0) {
      const lastPayment = pastPayments[0];
      const timeDiffMs = Date.now() - new Date(lastPayment.created_at).getTime();
      const timeDiffMins = timeDiffMs / (1000 * 60);

      if (timeDiffMins < 5 && Number(lastPayment.amount_paid) === amountPaid) {
        reasons.push(`Velocity anomaly: Identical payment of GHS ${amountPaid} submitted within ${Math.round(timeDiffMins)} minutes`);
        riskScore += 45;
        isAnomalous = true;
      }
    }

    // 3. AI-driven Fraud/Anomaly detection
    const prompt = `You are a financial risk auditor. Analyze this payment transaction for potential fraud, double entry errors, or money laundering indicators.
CUSTOMER EXPECTATION:
- Expected Amount: GHS ${expectedAmount}
- Historical Payments Count: ${pastPayments?.length || 0}

CURRENT TRANSACTION:
- Amount Paid: GHS ${amountPaid}
- Payment Method: ${payment.payment_method || "Unknown"}
- Source/Provider: ${payment.source || "Unknown"}
- Bank Name: ${payment.bank_name || "Unknown"}
- Reference Code: ${payment.reference || "None"}
- Paid By Name: ${payment.paid_by_name || "Unknown"}

Output ONLY a valid JSON object:
{
  "suspicious": boolean,
  "aiRiskScore": number, // 0 to 100
  "explanation": "Short sentence explaining risk factors or stating low risk"
}
Do not write markdown, backticks, or explanations outside the JSON.`;

    const aiResponse = await queryOpenRouterText([
      { role: "system", content: "You are a brief financial security model." },
      { role: "user", content: prompt }
    ], { temperature: 0.1, max_tokens: 120 });

    const parsed = parseJSON(aiResponse);
    if (parsed) {
      if (parsed.suspicious || parsed.aiRiskScore > 40) {
        reasons.push(`AI Audit Warning (Risk: ${parsed.aiRiskScore}%): ${parsed.explanation}`);
        riskScore = Math.max(riskScore, parsed.aiRiskScore);
      }
    }
  } catch (err: any) {
    console.warn("[Fraud Detection] AI risk scoring errored, using heuristics:", err.message);
  }

  isAnomalous = isAnomalous || riskScore >= 50;

  return {
    isAnomalous,
    riskScore,
    reasons,
  };
}

function parseJSON(raw: string): any | null {
  try {
    return JSON.parse(raw.trim());
  } catch {
    const braceMatch = raw.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch {
        // ignore
      }
    }
    return null;
  }
}
