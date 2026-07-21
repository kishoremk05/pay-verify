import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Database,
  ShieldCheck,
  Zap,
  Lock,
  FileText,
  Users,
  HardDrive,
  Key,
  CreditCard,
  X,
  Loader2,
} from "lucide-react";

const tiersData = [
  {
    id: "starter",
    num: "01",
    name: "Starter",
    pop: "Up to 10,000 monthly invoices",
    price: "$48,000",
    amountKobo: 50000,
    period: "/ year",
    desc: "For smaller schools & organizations requiring essential automated matching.",
    features: [
      { icon: Database, text: "Paystack & 1 primary bank integration" },
      { icon: Lock, text: "100% Data ownership & local export" },
      { icon: Zap, text: "Standard invoice mapping template" },
      { icon: Users, text: "Up to 3 administrative departments" },
      { icon: ShieldCheck, text: "Standard email & phone support desk" },
    ],
  },
  {
    id: "growth",
    num: "02",
    name: "Growth",
    pop: "Up to 50,000 monthly invoices",
    price: "$95,050",
    amountKobo: 100000,
    period: "/ year",
    desc: "Replaces manual reconciliation across core financial departments.",
    features: [
      { icon: Database, text: "Paystack & multi-bank integrations" },
      { icon: Lock, text: "100% Data ownership & local export" },
      { icon: Zap, text: "Custom AI policy matching engine" },
      { icon: Users, text: "Up to 6 departments supported" },
      { icon: ShieldCheck, text: "SLA-bound technical support & logs" },
      { icon: HardDrive, text: "Statutory records retention at write" },
      { icon: Key, text: "SOC 2 Type II compliance audit logs" },
    ],
  },
  {
    id: "enterprise",
    num: "03",
    name: "Enterprise",
    pop: "Unlimited monthly invoices",
    price: "$185,000",
    amountKobo: 200000,
    period: "/ year",
    desc: "Comprehensive financial operations substrate for high-volume institutions.",
    features: [
      { icon: Database, text: "Unlimited gateway & bank integrations" },
      { icon: Lock, text: "100% Data ownership & local export" },
      { icon: Zap, text: "Full cross-agency rules compiler" },
      { icon: Users, text: "Unlimited administrative departments" },
      { icon: ShieldCheck, text: "24/7 dedicated support desk" },
      { icon: HardDrive, text: "Statutory records retention at write" },
      { icon: Key, text: "Custom enterprise sandbox node" },
      { icon: FileText, text: "Cryptographic hash-chain audit logs" },
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("starter");
  const [showScoped, setShowScoped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedTier = tiersData.find((t) => t.id === selectedId) || tiersData[0];

  const handleOpenPaymentModal = () => {
    setIsModalOpen(true);
  };

  const handlePaystackPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const paystackPublicKey =
      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_f4cd532e0f6a2042bb921a713a4f5122b145cb0b";

    if (!(window as any).PaystackPop) {
      toast.error("Paystack SDK not loaded yet. Please refresh the page and try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const handler = (window as any).PaystackPop.setup({
        key: paystackPublicKey,
        email: email,
        amount: selectedTier.amountKobo,
        currency: "GHS",
        channels: ["card"],
        ref: `TODELLAA_${selectedTier.id.toUpperCase()}_${Date.now()}`,
        metadata: {
          plan_id: selectedTier.id,
          plan_name: selectedTier.name,
          custom_fields: [
            {
              display_name: "Plan Name",
              variable_name: "plan_name",
              value: selectedTier.name,
            },
          ],
        },
        callback: (response: any) => {
          setIsProcessing(false);
          setIsModalOpen(false);
          toast.success(`Payment verified! Ref: ${response.reference}`);
          navigate({ to: "/signup" });
        },
        onClose: () => {
          setIsProcessing(false);
          toast.info("Payment cancelled.");
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(`Paystack initialization failed: ${err.message || err}`);
    }
  };

  return (
    <section id="pricing" className="relative py-20 sm:py-28 bg-[#121214] text-white z-10 scroll-mt-20 font-sans border-t border-neutral-800">
      
      {/* Dark Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#6366f1]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-12 sm:mb-16">
          
          <div className="md:col-span-8 text-left">
            <h2 className="font-sans font-bold text-4xl sm:text-5xl lg:text-[56px] tracking-[-0.035em] text-white leading-[1.08]">
              Simple and sustainable pricing
            </h2>
            <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl font-normal font-sans">
              Get the infrastructure automation you need for your organization without seat limits or hidden tiers. Start with a <strong className="text-white font-semibold underline decoration-[#818cf8] underline-offset-4">14-day free trial</strong> and pay a fair, predictable rate scaled to your transaction volume.
            </p>
          </div>

          {/* Top Right Bar Chart SVG Illustration */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative w-48 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#6366f1]/20 rounded-full blur-2xl opacity-70" />
              
              <svg className="w-44 h-36 relative z-10 select-none" viewBox="0 0 160 130" fill="none">
                <circle cx="20" cy="30" r="3" fill="#818cf8" opacity="0.8" />
                <circle cx="20" cy="50" r="3" fill="#818cf8" opacity="0.8" />
                <circle cx="20" cy="70" r="3" fill="#818cf8" opacity="0.8" />
                <circle cx="20" cy="90" r="3" fill="#818cf8" opacity="0.8" />
                
                <line x1="30" y1="20" x2="30" y2="105" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                <line x1="30" y1="105" x2="150" y2="105" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

                <line x1="55" y1="105" x2="55" y2="110" stroke="#475569" strokeWidth="2" />
                <line x1="85" y1="105" x2="85" y2="110" stroke="#475569" strokeWidth="2" />
                <line x1="115" y1="105" x2="115" y2="110" stroke="#475569" strokeWidth="2" />

                <rect x="42" y="55" width="24" height="50" rx="4" fill="#18181b" stroke="#818cf8" strokeWidth="2" />
                <circle cx="50" cy="67" r="1.5" fill="#818cf8" />
                <circle cx="58" cy="67" r="1.5" fill="#818cf8" />
                <path d="M51 72 Q54 75 57 72" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                <rect x="72" y="25" width="24" height="80" rx="4" fill="#18181b" stroke="#a5b4fc" strokeWidth="2" />
                <rect x="102" y="45" width="24" height="60" rx="4" fill="#18181b" stroke="#818cf8" strokeWidth="2" />
              </svg>
            </div>
          </div>

        </div>

        {/* 2-Column Pricing Main UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selectable Tier Options */}
          <div className="lg:col-span-6 space-y-4 text-left">
            {tiersData.map((tier) => {
              const isSelected = selectedId === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedId(tier.id)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all flex items-center justify-between shadow-lg ${
                    isSelected
                      ? "border-[#818cf8] bg-[#18181b] ring-2 ring-[#818cf8]/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                      : "border-neutral-800/80 bg-[#18181b]/70 hover:border-neutral-700 hover:bg-[#18181b]"
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-2xl sm:text-3xl font-extrabold font-sans tracking-tight ${isSelected ? "text-[#818cf8]" : "text-white"}`}>
                        {tier.price}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">/ yr</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-neutral-400 mt-1 block font-sans">
                      {tier.pop}
                    </span>
                  </div>

                  <div className="shrink-0 pl-4">
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-[#818cf8]" />
                    ) : (
                      <Circle className="w-6 h-6 text-neutral-600" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Action Buttons Row */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowScoped(!showScoped)}
                className="px-4 py-2 rounded-full bg-[#10b981]/15 text-[#34d399] text-xs font-semibold hover:bg-[#10b981]/25 transition-colors border border-[#10b981]/30"
              >
                {showScoped ? "Hide custom plans" : "Get custom enterprise quote"}
              </button>
              <Link
                to="/contact"
                className="px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors border border-neutral-700"
              >
                Inquire custom MSA
              </Link>
            </div>
          </div>

          {/* Right Column: Feature Details Card */}
          <div className="lg:col-span-6 bg-[#18181b] border border-neutral-800 rounded-3xl p-8 sm:p-9 text-left shadow-2xl flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                  All {selectedTier.name} plans include:
                </h3>
                <span className="text-xs font-mono font-bold text-[#818cf8] bg-[#6366f1]/15 border border-[#6366f1]/30 px-3 py-1 rounded-full uppercase">
                  Tier {selectedTier.num}
                </span>
              </div>

              <ul className="space-y-4">
                {selectedTier.features.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-neutral-300 font-sans">
                      <div className="w-7 h-7 rounded-lg bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#818cf8] flex items-center justify-center shrink-0 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3">
              <Link
                to="/signup"
                search={{ plan: selectedTier.id }}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#09a5db] hover:bg-[#0788b5] text-white font-semibold text-sm shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Now with Paystack ({selectedTier.price})</span>
              </Link>
              <Link
                to="/signup"
                search={{ plan: selectedTier.id }}
                className="w-full block text-center py-3 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs border border-neutral-700 transition-all"
              >
                Or start 14-day trial without payment
              </Link>
            </div>
          </div>

        </div>

        {/* Subtext Footer */}
        <p className="mt-12 text-center text-xs text-neutral-500 font-sans leading-relaxed max-w-2xl mx-auto">
          All pricing is in USD and scales with transaction volume footprint. If you need custom enterprise scoping,{" "}
          <Link to="/contact" className="underline text-neutral-300 hover:text-white">
            get in touch with our team
          </Link>.
        </p>

      </div>

      {/* Paystack Email Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#18181b] border border-neutral-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-left shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#09a5db]/20 border border-[#09a5db]/40 text-[#09a5db] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">
                    Complete Order — {selectedTier.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {selectedTier.price} / year via Paystack
                  </p>
                </div>
              </div>

              <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
                Enter your email address to initiate payment. You will be prompted by Paystack's secure checkout.
              </p>

              <form onSubmit={handlePaystackPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5 font-sans">
                    Billing Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="billing@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#09a5db] transition-colors"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#09a5db] hover:bg-[#0788b5] text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Opening Paystack...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Proceed to Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

