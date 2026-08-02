import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment-failed")({
  head: () => ({ meta: [{ title: "Payment Cancelled — TODELLAA" }] }),
  component: PaymentFailedPage,
});

function PaymentFailedPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const reason = searchParams.get("reason") || "cancelled";
  const plan = searchParams.get("plan") || "starter";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate({ to: "/" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0e12] text-white px-4 py-12 relative overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 text-center">
        {/* Brand Header */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="h-10 w-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <ShieldCheck className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              TODELLAA
            </span>
          </Link>
        </div>

        {/* Failed / Cancelled Card */}
        <div className="bg-[#18181b] border border-rose-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
              Payment {reason === "cancelled" ? "Cancelled" : "Failed"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-4 font-sans">
              {reason === "cancelled" ? "Transaction Cancelled" : "Payment Error"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed font-sans">
              The payment attempt for the <strong className="text-white capitalize">{plan}</strong> plan was not completed. No charges were made.
            </p>
          </div>

          {/* Countdown & Redirect Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Returning to Home Page...</span>
              <span className="font-mono font-bold text-white">{countdown}s</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={() => navigate({ to: "/" })}
              className="w-full h-12 rounded-2xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold text-sm gap-2 transition-all font-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Landing Page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
