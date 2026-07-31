import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck, Loader2, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

export const Route = createFileRoute("/payment-success")({
  head: () => ({ meta: [{ title: "Payment Successful — TODELLAA" }] }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);
  const [verifying, setVerifying] = useState(true);
  const [verifiedInvoice, setVerifiedInvoice] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  
  const reference = searchParams.get("reference") || searchParams.get("trxref") || searchParams.get("ref");
  const invoiceId = searchParams.get("invoice_id");
  const plan = searchParams.get("plan");

  useEffect(() => {
    async function verifyPayment() {
      if (!reference && !invoiceId) {
        setVerifying(false);
        return;
      }

      try {
        setVerifying(true);
        const res = await fetch(`${API_URL}/api/paystack/verify-invoice-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: reference || undefined,
            invoice_id: invoiceId || undefined,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setVerifiedInvoice(data.invoice || { invoice_number: invoiceId, status: "paid" });
        } else {
          // If already paid or standard verification message
          if (data.message?.includes("already") || data.invoice) {
            setVerifiedInvoice(data.invoice);
          } else {
            setErrorMsg(data.message || "Payment verification incomplete.");
          }
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setErrorMsg("Failed to verify payment with server.");
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [reference, invoiceId]);

  useEffect(() => {
    if (verifying) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate({ to: invoiceId ? `/invoice/${invoiceId}` : "/dashboard" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, verifying, invoiceId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0e12] text-white px-4 py-12 relative overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 text-center">
        {/* Brand Header */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <ShieldCheck className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              TODELLAA
            </span>
          </Link>
        </div>

        {/* Card Body */}
        <div className="bg-[#18181b] border border-emerald-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          {verifying ? (
            <div className="py-8 space-y-4">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
              <h2 className="text-xl font-bold text-white">Verifying Payment...</h2>
              <p className="text-xs text-neutral-400">
                Confirming transaction with Paystack and updating invoice status.
              </p>
            </div>
          ) : errorMsg && !verifiedInvoice ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                  Verification Pending
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-white mt-4">
                  Payment Processed
                </h1>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                  Payment Successful
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-4 font-sans">
                  {verifiedInvoice ? "Invoice Paid!" : plan ? "Subscription Activated!" : "Payment Verified!"}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed font-sans">
                  {verifiedInvoice ? (
                    <>
                      Invoice <strong className="text-white">#{verifiedInvoice.invoice_number}</strong> has been marked as <strong className="text-emerald-400 uppercase">Paid</strong>.
                    </>
                  ) : (
                    "Thank you for choosing TODELLAA. Your transaction has been verified."
                  )}
                </p>
              </div>

              {/* Details Box */}
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
                {reference && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Paystack Ref:</span>
                    <span className="text-emerald-400 font-bold max-w-[180px] truncate">{reference}</span>
                  </div>
                )}
                {verifiedInvoice?.invoice_number && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Invoice #:</span>
                    <span className="text-white font-bold">{verifiedInvoice.invoice_number}</span>
                  </div>
                )}
                {verifiedInvoice?.amount && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Amount Paid:</span>
                    <span className="text-white font-bold">
                      {verifiedInvoice.currency || "NGN"} {Number(verifiedInvoice.amount).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">AUTOMATICALLY PAID</span>
                </div>
              </div>
            </>
          )}

          {!verifying && (
            <>
              {/* Countdown & Redirect Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Redirecting soon...</span>
                  <span className="font-mono font-bold text-white">{countdown}s</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${(countdown / 7) * 100}%` }}
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2">
                {invoiceId ? (
                  <Button
                    onClick={() => navigate({ to: `/invoice/${invoiceId}` })}
                    className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 gap-2 transition-all font-sans"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Invoice Details</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate({ to: "/dashboard" })}
                    className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 gap-2 transition-all font-sans"
                  >
                    <span>Go to Dashboard Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
