import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment-success")({
  head: () => ({ meta: [{ title: "Payment Successful — TODELLAA" }] }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const ref = searchParams.get("ref") || "TODELLAA_" + Math.floor(Math.random() * 1000000);
  const plan = searchParams.get("plan") || "starter";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate({ to: "/dashboard" });
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

        {/* Success Card */}
        <div className="bg-[#18181b] border border-emerald-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
              Payment Successful
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-4 font-sans">
              Subscription Activated!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed font-sans">
              Your <strong className="text-white capitalize">{plan}</strong> plan is now active. Thank you for choosing TODELLAA.
            </p>
          </div>

          {/* Details Box */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>Transaction Ref:</span>
              <span className="text-emerald-400 font-bold">{ref}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Plan Tier:</span>
              <span className="text-white capitalize">{plan}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">VERIFIED</span>
            </div>
          </div>

          {/* Countdown & Redirect Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Redirecting to Dashboard...</span>
              <span className="font-mono font-bold text-white">{countdown}s</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 gap-2 transition-all font-sans"
          >
            <span>Go to Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
