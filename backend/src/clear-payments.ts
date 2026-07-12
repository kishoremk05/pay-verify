import "dotenv/config";
import { supabaseAdmin } from "./config/supabase.js";

async function main() {
  const orgId = "8c51d7d7-1ce0-4b35-bfd2-eafa788014b0";
  console.log("Cleaning up payments, refunds, and alerts for organization:", orgId);

  // 1. Delete refunds linked to organization payments
  const { error: refErr } = await supabaseAdmin
    .from("refunds")
    .delete()
    .eq("organization_id", orgId);
  if (refErr) console.error("Error deleting refunds:", refErr.message);

  // 2. Delete alerts
  const { error: alertErr } = await supabaseAdmin
    .from("alerts")
    .delete()
    .eq("organization_id", orgId);
  if (alertErr) console.error("Error deleting alerts:", alertErr.message);

  // 3. Delete payments
  const { error: payErr } = await supabaseAdmin
    .from("payments")
    .delete()
    .eq("organization_id", orgId);
    
  if (payErr) {
    console.error("Error deleting payments:", payErr.message);
  } else {
    console.log("Successfully deleted all payments in organization.");
  }

  // 4. Reset customer statuses and due amounts
  const { data: customers } = await supabaseAdmin
    .from("customers")
    .select("id, expected_amount")
    .eq("organization_id", orgId);

  if (customers) {
    console.log(`Resetting ${customers.length} customers to unpaid...`);
    for (const c of customers) {
      await supabaseAdmin
        .from("customers")
        .update({
          due_amount: c.expected_amount,
          status: "unpaid",
        })
        .eq("id", c.id);
    }
  }

  console.log("Cleanup and reset completed successfully!");
}

main().catch(console.error);
