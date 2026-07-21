/**
 * Dual-Provider Integration Test Script
 * Run this directly via terminal to verify your SMTP connection, API keys, and failover support.
 */

import "dotenv/config";
import { sendInvoiceEmail } from "./services/email.js";

// Testing both email addresses
const TEST_RECIPIENT_EMAIL = "kishore.05mk@gmail.com"; 

async function runTest() {
  console.log("=========================================");
  console.log("⚡ Starting Dual-Provider Email SMTP Test...");
  console.log("=========================================");

  console.log(`🔑 Brevo Key Configured: ...${process.env.BREVO_API_KEY ? "Yes" : "No"}`);
  console.log(`🔑 Resend Key Configured: ...${process.env.RESEND_API_KEY ? "Yes" : "No"}`);
  console.log(`📧 Target Recipient: ${TEST_RECIPIENT_EMAIL}`);
  console.log("📤 Sending transactional template...");

  const result = await sendInvoiceEmail({
    customerName: "Kishore Kumar",
    customerEmail: TEST_RECIPIENT_EMAIL,
    invoiceNumber: "INV-TEST-9999",
    amount: 75000,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    currency: "NGN",
    portalUrl: "http://localhost:8080/invoice/test-reconciliation-uuid",
    organizationName: "Todella Dual Suite",
  });

  console.log("\n=========================================");
  if (result.success) {
    console.log(`🎉 SUCCESS! Sent successfully via: ${result.provider}`);
    console.log(`✉️ Message ID: ${result.messageId}`);
    console.log(`👉 Check ${TEST_RECIPIENT_EMAIL} (and your spam folder) now!`);
  } else {
    console.log("❌ FAILED! Both email providers rejected dispatch.");
    console.log(`⚠️ Error details: ${result.error}`);
  }
  console.log("=========================================");
}

runTest();
