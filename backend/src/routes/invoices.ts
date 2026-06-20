/**
 * Invoice API Routes
 * 
 * POST   /api/invoices           — Create invoice + send Brevo email
 * GET    /api/invoices/:id       — Public: fetch invoice details for customer portal
 * POST   /api/invoices/:id/verify — Public: upload receipt & trigger AI consensus verification
 * POST   /api/invoices/:id/approve — Auth: staff approves a flagged invoice
 * POST   /api/invoices/:id/reject  — Auth: staff rejects a flagged invoice
 */

import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { sendInvoiceEmail } from "../services/email.js";
import { analyzeReceipt } from "../services/ai.js";
import { uploadToCloudinary } from "../services/cloudinary.js";

const router = Router();

// ─── POST /api/invoices ───
// Called by the authenticated frontend when admin creates an invoice
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      organization_id,
      customer_id,
      invoice_number,
      amount,
      due_date,
      generated_by,
      customer_email,
      customer_name,
      organization_name,
      frontend_url,
      line_items,
      invoice_discount_type,
      invoice_discount_value,
      invoice_discount_ref,
      subtotal,
    } = req.body;

    if (!organization_id || !customer_id || !invoice_number || !amount || !due_date) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // 1. Fetch org currency
    const { data: orgData } = await supabaseAdmin
      .from("organizations")
      .select("currency")
      .eq("id", organization_id)
      .single();
    const orgCurrency = orgData?.currency || "GHS";

    // 2. Insert invoice with dynamic currency and discounts
    const { data: invoice, error: invError } = await supabaseAdmin
      .from("invoices")
      .insert({
        organization_id,
        customer_id,
        invoice_number,
        amount: parseFloat(amount),
        due_date,
        status: "pending",
        generated_by: generated_by || null,
        currency: orgCurrency,
        invoice_discount_type: invoice_discount_type || null,
        invoice_discount_value: invoice_discount_value ? parseFloat(invoice_discount_value) : 0,
        invoice_discount_ref: invoice_discount_ref || null,
        subtotal: subtotal ? parseFloat(subtotal) : parseFloat(amount),
      })
      .select()
      .single();

    if (invError) {
      console.error("[Invoice] Insert error:", invError.message);
      res.status(500).json({ error: invError.message });
      return;
    }

    // 3. Insert invoice line items if present
    if (line_items && Array.isArray(line_items) && line_items.length > 0) {
      const itemsToInsert = line_items.map((item: any) => ({
        invoice_id: invoice.id,
        service_id: item.serviceId || null,
        service_name: item.name,
        unit_price: parseFloat(item.unitPrice || 0),
        quantity: parseInt(item.quantity || 1, 10),
        discount_type: item.discountType || null,
        discount_value: item.discountValue ? parseFloat(item.discountValue) : 0,
        discount_ref: item.discountRef || null,
        subtotal: parseFloat(item.subtotal || item.unitPrice || 0),
      }));

      const { error: lineItemsError } = await supabaseAdmin
        .from("invoice_line_items")
        .insert(itemsToInsert);

      if (lineItemsError) {
        console.error("[Invoice] Line items insert error:", lineItemsError.message);
      }
    }

    // 4. Fetch customer details for email routing
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("service, account_number")
      .eq("id", customer_id)
      .single();

    // 5. Write audit log
    await supabaseAdmin.from("audit_logs").insert({
      organization_id,
      action_type: "invoice_creation",
      action_description: `Invoice #${invoice_number} of ${orgCurrency} ${parseFloat(amount).toLocaleString()} created for ${customer_name || "customer"}.`,
      performed_by: generated_by || null,
      related_record_id: invoice.id,
    });

    // 6. Build portal URL
    const baseUrl = process.env.FRONTEND_URL || frontend_url || "http://localhost:3000";
    const portalUrl = `${baseUrl}/invoice/${invoice.id}`;

    // 7. Send email via Resend/Brevo
    let emailResult: any = { success: false, error: "No email sent" };
    if (customer_email) {
      const lineItemNames = line_items && Array.isArray(line_items)
        ? line_items.map((item: any) => item.name).join(", ")
        : (customer?.service || undefined);

      emailResult = await sendInvoiceEmail({
        customerName: customer_name || "Customer",
        customerEmail: customer_email,
        invoiceNumber: invoice_number,
        amount: parseFloat(amount),
        dueDate: due_date,
        currency: orgCurrency,
        portalUrl,
        organizationName: organization_name || "PayVerify",
        subscribedService: lineItemNames,
        accountNumber: customer?.account_number || undefined,
      });

      // Log email send to audit
      await supabaseAdmin.from("audit_logs").insert({
        organization_id,
        action_type: "invoice_creation",
        action_description: `Payment request email sent to ${customer_email} for Invoice #${invoice_number}.`,
        performed_by: generated_by || null,
        related_record_id: invoice.id,
      });
    }

    res.status(201).json({
      invoice,
      portalUrl,
      emailSent: emailResult.success,
    });
  } catch (err: any) {
    console.error("[Invoice] Create error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/invoices/:id ───
// Public endpoint for customer payment portal
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: invoice, error } = await supabaseAdmin
      .from("invoices")
      .select(`
        *,
        customers!customer_id (
          id, name, customer_code, email, expected_amount, due_amount, account_number
        ),
        organizations!organization_id (
          id, name
        )
      `)
      .eq("id", id)
      .single();

    if (error || !invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    res.json({ invoice });
  } catch (err: any) {
    console.error("[Invoice] Fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/invoices/:id/verify ───
// Customer uploads receipt image (base64) for AI verification
router.post("/:id/verify", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { receipt_base64, simulate_status } = req.body;

    if (!receipt_base64 && !simulate_status) {
      res.status(400).json({ error: "No receipt image provided" });
      return;
    }

    // 1. Fetch invoice
    const { data: invoice, error: invErr } = await supabaseAdmin
      .from("invoices")
      .select("*, customers!customer_id (id, name, email, expected_amount)")
      .eq("id", id)
      .single();

    if (invErr || !invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    if (invoice.status === "paid") {
      res.status(400).json({ error: "Invoice is already paid" });
      return;
    }

    // 2. Upload image to Cloudinary (document storage platform)
    let cloudinaryUrl: string | null = null;
    if (receipt_base64) {
      console.log("[Invoice] Uploading document proof to Cloudinary...");
      cloudinaryUrl = await uploadToCloudinary(receipt_base64);
    }

    // 3. Run AI Consensus Engine
    const aiResult = await analyzeReceipt(
      receipt_base64 || "",
      simulate_status as "success" | "fail" | undefined
    );

    const extractedAmount = aiResult.consensus?.amount ?? 0;
    const invoiceAmount = Number(invoice.amount);

    // 4. Determine match and overpayment (tolerance of ±1% for rounding)
    const tolerance = invoiceAmount * 0.01;
    const isMatch =
      aiResult.consensusReached &&
      extractedAmount >= invoiceAmount - tolerance;
    
    const isOverpayment = 
      aiResult.consensusReached &&
      extractedAmount > invoiceAmount + tolerance;

    // 5. Save receipt and AI data to invoice
    await supabaseAdmin
      .from("invoices")
      .update({
        receipt_url: cloudinaryUrl || (receipt_base64 ? `data:image/jpeg;base64,${receipt_base64.substring(0, 100)}...` : null),
        ai_extracted_data: {
          consensus: aiResult.consensus,
          engines: aiResult.engineResults.map((e) => ({
            engine: e.engine,
            success: e.success,
            error: e.error || null,
          })),
          consensusReached: aiResult.consensusReached,
          matchResult: isMatch ? (isOverpayment ? "overpaid" : "matched") : "mismatched",
        },
      })
      .eq("id", id);

    if (isMatch) {
      // ─── SUCCESS / OVERPAID PATH ───
      // a. Mark invoice as paid
      await supabaseAdmin
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", id);

      // b. Insert linked payment record
      const { data: payment } = await supabaseAdmin
        .from("payments")
        .insert({
          organization_id: invoice.organization_id,
          customer_id: invoice.customer_id,
          invoice_id: id,
          amount_paid: extractedAmount,
          payment_method: "Receipt Upload (AI Verified)",
          reference: aiResult.consensus?.transaction_id || "REF-" + Date.now().toString().slice(-6),
          payment_date: aiResult.consensus?.date || new Date().toISOString().slice(0, 10),
          notes: `Auto-reconciled via AI Consensus Engine. Confidence: ${(aiResult.consensus?.confidence ?? 0) * 100}%. ${isOverpayment ? "Overpayment detected." : ""}`,
          status: "paid",
          source: "manual",
          transaction_id: aiResult.consensus?.transaction_id || null,
          currency: "NGN",
        })
        .select()
        .single();

      if (isOverpayment && payment) {
        const excessAmount = extractedAmount - invoiceAmount;

        // c. Create overpayment alert
        await supabaseAdmin.from("alerts").insert({
          organization_id: invoice.organization_id,
          invoice_id: id,
          payment_id: payment.id,
          type: "overpayment",
          amount: excessAmount,
          message: `Overpayment of ₦${excessAmount.toLocaleString()} detected on Invoice #${invoice.invoice_number} (Paid: ₦${extractedAmount.toLocaleString()}, Expected: ₦${invoiceAmount.toLocaleString()})`
        });

        // d. Automatically generate pending refund request
        await supabaseAdmin.from("refunds").insert({
          organization_id: invoice.organization_id,
          customer_id: invoice.customer_id,
          payment_id: payment.id,
          invoice_id: id,
          refund_amount: excessAmount,
          reason: `Automated refund request for overpayment on Invoice #${invoice.invoice_number}`,
          status: "pending",
          processed_by: null, // system automated
        });

        // e. Audit log
        await supabaseAdmin.from("audit_logs").insert({
          organization_id: invoice.organization_id,
          action_type: "invoice_creation",
          action_description: `Invoice #${invoice.invoice_number} auto-reconciled with overpayment of ₦${excessAmount.toLocaleString()}. Automatic refund request created.`,
          related_record_id: id,
        });
      } else {
        // Standard Success Audit Log
        await supabaseAdmin.from("audit_logs").insert({
          organization_id: invoice.organization_id,
          action_type: "invoice_creation",
          action_description: `Invoice #${invoice.invoice_number} auto-reconciled. AI extracted ₦${extractedAmount.toLocaleString()} matching expected ₦${invoiceAmount.toLocaleString()}. Payment recorded.`,
          related_record_id: id,
        });
      }

      res.json({
        status: isOverpayment ? "overpaid" : "matched",
        message: isOverpayment 
          ? "Payment verified! Overpayment detected. A refund request has been automatically created." 
          : "Payment verified and recorded successfully!",
        extracted: aiResult.consensus,
        expected_amount: invoiceAmount,
      });
    } else {
      // ─── REVIEW REQUIRED PATH ───
      // a. Mark invoice for review
      await supabaseAdmin
        .from("invoices")
        .update({
          status: "review_required",
        })
        .eq("id", id);

      // b. Insert notification for staff
      await supabaseAdmin.from("notifications").insert({
        organization_id: invoice.organization_id,
        title: "Receipt Review Required",
        message: `Invoice #${invoice.invoice_number}: AI extracted ₦${extractedAmount.toLocaleString()} but expected ₦${invoiceAmount.toLocaleString()}. Manual review needed.`,
        type: "mismatch",
      });

      // c. Write audit log
      await supabaseAdmin.from("audit_logs").insert({
        organization_id: invoice.organization_id,
        action_type: "invoice_creation",
        action_description: `Invoice #${invoice.invoice_number} flagged for review. AI extracted ₦${extractedAmount.toLocaleString()} vs expected ₦${invoiceAmount.toLocaleString()}.`,
        related_record_id: id,
      });

      res.json({
        status: "review_required",
        message: "Receipt submitted for manual staff review.",
        extracted: aiResult.consensus,
        expected_amount: invoiceAmount,
      });
    }
  } catch (err: any) {
    console.error("[Invoice] Verify error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/invoices/:id/approve ───
// Staff manually approves a flagged invoice
router.post("/:id/approve", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;

    const { data: invoice, error: invErr } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (invErr || !invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    const invoiceAmount = Number(invoice.amount);
    const aiData = invoice.ai_extracted_data as any;
    const extractedAmount = Number(aiData?.consensus?.amount || invoiceAmount);

    // 1. Mark invoice as paid
    await supabaseAdmin
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", id);

    // 2. Insert payment record
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .insert({
        organization_id: invoice.organization_id,
        customer_id: invoice.customer_id,
        invoice_id: id,
        amount_paid: extractedAmount,
        payment_method: "Receipt Upload (Staff Approved)",
        reference: aiData?.consensus?.transaction_id || "REF-" + Date.now().toString().slice(-6),
        payment_date: aiData?.consensus?.date || new Date().toISOString().slice(0, 10),
        notes: `Manually approved by staff. Original AI extraction: ₦${extractedAmount.toLocaleString()}.`,
        status: "paid",
        source: "manual",
        transaction_id: aiData?.consensus?.transaction_id || null,
        currency: "NGN",
      })
      .select()
      .single();

    // Check for overpayment
    const tolerance = invoiceAmount * 0.01;
    const isOverpayment = extractedAmount > invoiceAmount + tolerance;

    if (isOverpayment && payment) {
      const excessAmount = extractedAmount - invoiceAmount;

      // Create alert
      await supabaseAdmin.from("alerts").insert({
        organization_id: invoice.organization_id,
        invoice_id: id,
        payment_id: payment.id,
        type: "overpayment",
        amount: excessAmount,
        message: `Overpayment of ₦${excessAmount.toLocaleString()} detected on Invoice #${invoice.invoice_number} (Paid: ₦${extractedAmount.toLocaleString()}, Expected: ₦${invoiceAmount.toLocaleString()})`
      });

      // Create automated pending refund request
      await supabaseAdmin.from("refunds").insert({
        organization_id: invoice.organization_id,
        customer_id: invoice.customer_id,
        payment_id: payment.id,
        invoice_id: id,
        refund_amount: excessAmount,
        reason: `Automated refund request for overpayment on Invoice #${invoice.invoice_number}`,
        status: "pending",
        processed_by: approved_by || null,
      });

      // Audit Log
      await supabaseAdmin.from("audit_logs").insert({
        organization_id: invoice.organization_id,
        action_type: "invoice_creation",
        action_description: `Invoice #${invoice.invoice_number} approved by staff with overpayment of ₦${excessAmount.toLocaleString()}. Automatic refund request created.`,
        performed_by: approved_by || null,
        related_record_id: id,
      });
    } else {
      // Standard Audit Log
      await supabaseAdmin.from("audit_logs").insert({
        organization_id: invoice.organization_id,
        action_type: "invoice_creation",
        action_description: `Invoice #${invoice.invoice_number} manually approved by staff. Payment of ₦${invoiceAmount.toLocaleString()} recorded.`,
        performed_by: approved_by || null,
        related_record_id: id,
      });
    }

    res.json({ status: "approved", message: "Invoice approved and payment recorded." });
  } catch (err: any) {
    console.error("[Invoice] Approve error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/invoices/:id/reject ───
// Staff rejects a flagged invoice receipt
router.post("/:id/reject", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rejected_by } = req.body;

    const { data: invoice, error: invErr } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (invErr || !invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    // 1. Reset invoice to pending, clear upload
    await supabaseAdmin
      .from("invoices")
      .update({
        status: "pending",
        receipt_url: null,
        ai_extracted_data: null,
      })
      .eq("id", id);

    // 2. Audit log
    await supabaseAdmin.from("audit_logs").insert({
      organization_id: invoice.organization_id,
      action_type: "invoice_creation",
      action_description: `Invoice #${invoice.invoice_number} receipt rejected by staff. Status reset to pending.`,
      performed_by: rejected_by || null,
      related_record_id: id,
    });

    res.json({ status: "rejected", message: "Receipt rejected. Invoice reset to pending." });
  } catch (err: any) {
    console.error("[Invoice] Reject error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/invoices/:id/manual-reconcile ───
// Staff manually reconciles an invoice with a custom amount and optional receipt
router.post("/:id/manual-reconcile", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { actual_amount, receipt_base64, reconciled_by } = req.body;

    if (!actual_amount) {
      res.status(400).json({ error: "Reconciliation amount is required" });
      return;
    }

    // 1. Fetch invoice
    const { data: invoice, error: invErr } = await supabaseAdmin
      .from("invoices")
      .select("*, customers!customer_id (id, name, email)")
      .eq("id", id)
      .single();

    if (invErr || !invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    const invoiceAmount = Number(invoice.amount);
    const paidAmount = Number(actual_amount);

    // 2. Upload to Cloudinary if receipt base64 is provided
    let receiptUrl = invoice.receipt_url;
    if (receipt_base64) {
      console.log("[Invoice] Uploading manual reconcile proof to Cloudinary...");
      receiptUrl = await uploadToCloudinary(receipt_base64);
    }

    // 3. Update invoice
    await supabaseAdmin
      .from("invoices")
      .update({
        status: "paid",
        receipt_url: receiptUrl,
      })
      .eq("id", id);

    // 4. Create payment record
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .insert({
        organization_id: invoice.organization_id,
        customer_id: invoice.customer_id,
        invoice_id: id,
        amount_paid: paidAmount,
        payment_method: "Manual Reconcile (Staff Approved)",
        reference: "MANUAL-" + Date.now().toString().slice(-6),
        payment_date: new Date().toISOString().slice(0, 10),
        notes: `Manually reconciled by staff.`,
        status: "paid",
        source: "manual",
        currency: "NGN",
      })
      .select()
      .single();

    // 5. Check for overpayment
    const tolerance = invoiceAmount * 0.01;
    const isOverpayment = paidAmount > invoiceAmount + tolerance;

    if (isOverpayment && payment) {
      const excessAmount = paidAmount - invoiceAmount;

      // a. Create overpayment alert
      await supabaseAdmin.from("alerts").insert({
        organization_id: invoice.organization_id,
        invoice_id: id,
        payment_id: payment.id,
        type: "overpayment",
        amount: excessAmount,
        message: `Overpayment of ₦${excessAmount.toLocaleString()} detected on Invoice #${invoice.invoice_number} (Paid: ₦${paidAmount.toLocaleString()}, Expected: ₦${invoiceAmount.toLocaleString()})`
      });

      // b. Automatically generate pending refund request
      await supabaseAdmin.from("refunds").insert({
        organization_id: invoice.organization_id,
        customer_id: invoice.customer_id,
        payment_id: payment.id,
        invoice_id: id,
        refund_amount: excessAmount,
        reason: `Automated refund request for overpayment on Invoice #${invoice.invoice_number}`,
        status: "pending",
        processed_by: reconciled_by || null,
      });

      // c. Audit log
      await supabaseAdmin.from("audit_logs").insert({
        organization_id: invoice.organization_id,
        action_type: "invoice_creation",
        action_description: `Invoice #${invoice.invoice_number} manually reconciled with overpayment of ₦${excessAmount.toLocaleString()}. Automatic refund request created.`,
        performed_by: reconciled_by || null,
        related_record_id: id,
      });
    } else {
      // Standard Audit Log
      await supabaseAdmin.from("audit_logs").insert({
        organization_id: invoice.organization_id,
        action_type: "invoice_creation",
        action_description: `Invoice #${invoice.invoice_number} manually reconciled by staff. Payment of ₦${paidAmount.toLocaleString()} recorded.`,
        performed_by: reconciled_by || null,
        related_record_id: id,
      });
    }

    res.json({ status: "success", message: "Invoice manually reconciled and validated successfully!" });
  } catch (err: any) {
    console.error("[Invoice] Manual reconcile error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
