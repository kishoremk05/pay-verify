import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Simple, Transparent Pricing Plans — Todellaa" },
      { name: "description", content: "Choose the pricing plan that fits your business or educational institution. Standard, Professional, and Custom Enterprise options available." }
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "₵149",
      desc: "For small businesses starting to automate payment matching.",
      features: [
        "Up to 2,000 monthly transactions",
        "Standard Excel/CSV imports",
        "Mobile Money & Paystack support",
        "Email support (24hr response)",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "₵499",
      desc: "For growing businesses needing deep reconciliation workflows.",
      features: [
        "Up to 15,000 monthly transactions",
        "SWIFT MT940 statement parsing",
        "Smart Reconciliation Assistant",
        "Multi-branch workspace support",
        "Priority Slack & email support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For large corporations and educational institutions with custom demands.",
      features: [
        "Unlimited transactions",
        "Custom billing / ERP integrations",
        "Dedicated account manager",
        "Cryptographic compliance vault",
        "Guaranteed 99.9% uptime SLA",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden antialiased relative">
      {/* Background Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] bg-size-[24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem]" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.2em] text-slate-800 mb-5 font-bold shadow-sm">
              // ACCOUNT PLANS
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-5 text-slate-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
              No hidden fees, no setup locks. Choose a plan that aligns with your operational size.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-[32px] border bg-white p-8 shadow-xs flex flex-col justify-between relative ${
                  plan.popular ? "border-slate-900 shadow-md md:scale-105 z-10" : "border-slate-200/60"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono uppercase tracking-widest text-[9px] font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">{plan.name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-xs text-slate-400 font-medium">/month</span>}
                  </div>
                  <p className="text-xs text-slate-500 font-light mb-6 leading-relaxed">{plan.desc}</p>
                  
                  <hr className="border-slate-100 mb-6" />

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex gap-2.5 items-start text-xs text-slate-650 font-medium">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-3 rounded-2xl font-semibold text-xs shadow-3xs hover:shadow-xs transition-all cursor-pointer ${
                  plan.popular ? "bg-slate-900 text-white hover:bg-black" : "bg-slate-50 border border-slate-200/60 hover:bg-slate-100 text-slate-800"
                }`}>
                  {plan.price === "Custom" ? "Contact Sales" : "Start 14-Day Free Trial"}
                </button>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

