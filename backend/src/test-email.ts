/**
 * Dual-Provider Integration Test Script with Paystack Payment Link
 * Run this directly via terminal to verify your SMTP connection, Paystack link initialization, and email delivery.
 */

import "dotenv/config";
import { sendInvoiceEmail } from "./services/email.js";
import { initializePaystackInvoicePayment } from "./services/paystack.js";

const TEST_RECIPIENT_EMAIL = "kishore.05mk@gmail.com"; 

async function runTest() {
  console.log("=========================================");
  console.log("⚡ Starting Direct Paystack Payment Email Test...");
  console.log("=========================================");

  console.log(`🔑 Brevo Key Configured: ...${process.env.BREVO_API_KEY ? "Yes" : "No"}`);
  console.log(`🔑 Paystack Secret Key Configured: ...${process.env.PAYSTACK_SECRET_KEY ? "Yes" : "No"}`);
  console.log(`📧 Target Recipient: ${TEST_RECIPIENT_EMAIL}`);
  
  // 1. Initialize Paystack payment session
  console.log("💳 Initializing Paystack Checkout Link...");
  const paystackInit = await initializePaystackInvoicePayment({
    organizationId: "test-org-id",
    invoiceId: "test-inv-uuid-12345",
    invoiceNumber: "INV-PAYSTACK-8888",
    amount: 10,
    currency: "NGN",
    customerEmail: TEST_RECIPIENT_EMAIL,
    customerName: "Kishore Kumar",
    frontendUrl: "http://localhost:8080",
  });

  console.log("Paystack Init Status:", paystackInit);

  // 2. Send email with paystackUrl
  console.log("📤 Sending transactional email with Paystack button...");
  const result = await sendInvoiceEmail({
    customerName: "Kishore Kumar",
    customerEmail: TEST_RECIPIENT_EMAIL,
    invoiceNumber: "INV-PAYSTACK-8888",
    amount: 10,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    currency: "NGN",
    portalUrl: "http://localhost:8080/invoice/test-inv-uuid-12345",
    paystackUrl: paystackInit.authorizationUrl,
    organizationName: "Todella Direct Payment",
  });

  console.log("\n=========================================");
  if (result.success) {
    console.log(`🎉 SUCCESS! Email dispatched via: ${result.provider}`);
    console.log(`🔗 Paystack Payment URL: ${paystackInit.authorizationUrl}`);
    console.log(`👉 Check ${TEST_RECIPIENT_EMAIL} for the 'PAY NOW WITH PAYSTACK' button!`);
  } else {
    console.log("❌ FAILED! Email dispatch failed.");
    console.log(`⚠️ Error details: ${result.error}`);
  }
  console.log("=========================================");
}

runTest();
