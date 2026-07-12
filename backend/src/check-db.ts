import "dotenv/config";
import { supabaseAdmin } from "./config/supabase.js";

async function main() {
  const orgId = "8c51d7d7-1ce0-4b35-bfd2-eafa788014b0";
  console.log("Checking latest payments for organization:", orgId);

  const { data: payments, error } = await supabaseAdmin
    .from("payments")
    .select("id, amount_paid, verification_status, status, notes, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching payments:", error.message);
  } else {
    console.log(`Found ${payments?.length || 0} payments:`);
    payments?.forEach((p) => {
      console.log(`- ID: ${p.id}, Amount: ${p.amount_paid}, VerifyStatus: ${p.verification_status}, Status: ${p.status}, Created: ${p.created_at}, Notes: ${p.notes}`);
    });
  }
}

main().catch(console.error);
