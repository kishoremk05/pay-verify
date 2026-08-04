import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";

export default function Pricing() {
  const [annualBilling, setAnnualBilling] = useState(true);

  const plans = [
    {
      name: "Starter",
      tagline: "For small businesses",
      monthlyPrice: "12",
      annualPrice: "0",
      currency: "GHS",
      period: "/ month",
      isPopular: false,
      ctaText: "Get Started Free",
      ctaLink: "/signup",
      ctaVariant: "outline",
      features: [
        "Up to 100 invoices / month",
        "Manual reconciliation",
        "Basic reports & CSV exports",
        "Email support desk",
        "Single branch access",
      ],
    },
    {
      name: "Professional",
      tagline: "For growing businesses",
      monthlyPrice: "119",
      annualPrice: "99",
      currency: "GHS",
      period: "/ month",
      isPopular: true,
      popularTag: "Most Popular",
      ctaText: "Start Free Trial",
      ctaLink: "/signup",
      ctaVariant: "solid",
      features: [
        "Unlimited invoices",
        "Auto reconciliation engine",
        "Smart Assistant (Basic)",
        "Advanced financial reports",
        "Priority 24/7 support",
        "Multi-branch & campus scoping",
        "Audit logs & records retention",
      ],
    },
    {
      name: "Enterprise",
      tagline: "For large organizations",
      monthlyPrice: "349",
      annualPrice: "299",
      currency: "GHS",
      period: "/ month",
      isPopular: false,
      ctaText: "Contact Sales",
      ctaLink: "/contact",
      ctaVariant: "outline",
      features: [
        "Everything in Professional",
        "Smart Assistant (Advanced)",
        "Custom ERP & bank integrations",
        "Dedicated account manager",
        "99.9% SLA & premium support",
        "Custom role permissions",
        "Statutory compliance reporting",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-white text-[#010101] font-sans border-t border-[#e6e4dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#e6e4dc] bg-white select-none mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#e8562a]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#404040]">Flexible Plans</span>
          </div>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[44px] tracking-tight text-[#010101] leading-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-[#525252] text-base sm:text-lg font-normal">
            Choose the plan that fits your business.
          </p>

          {/* Billing Toggle Switch */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-bold ${!annualBilling ? "text-[#010101]" : "text-[#737373]"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-12 h-6 rounded-full bg-[#e8562a] p-1 transition-colors cursor-pointer relative"
              aria-label="Toggle Billing"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  annualBilling ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${annualBilling ? "text-[#010101]" : "text-[#737373]"}`}>
              Annual Billing <span className="bg-[#dcfce7] text-[#16a34a] text-[10px] font-extrabold px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => {
            const displayPrice = annualBilling ? plan.annualPrice : plan.monthlyPrice;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? "bg-white border-2 border-[#e8562a] shadow-xl scale-102 z-10"
                    : "bg-white border border-[#e6e4dc] shadow-xs hover:border-[#d4d4d4]"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 right-6 bg-[#e8562a] text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> {plan.popularTag}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-[#010101] tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-[#737373] mt-1 font-normal">{plan.tagline}</p>

                  <div className="flex items-baseline gap-1 my-6">
                    <span className="text-3xl font-extrabold text-[#010101]">{plan.currency}</span>
                    <span className="text-5xl font-extrabold text-[#010101] tracking-tight">{displayPrice}</span>
                    <span className="text-sm font-semibold text-[#737373]">{plan.period}</span>
                  </div>

                  <div className="border-t border-[#f0eee6] pt-6 space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#404040]">
                        <div className="w-4 h-4 rounded-full bg-[#fef3eb] text-[#e8562a] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {plan.ctaVariant === "solid" ? (
                    <Link
                      to={plan.ctaLink}
                      className="w-full bg-[#e8562a] hover:bg-[#d44820] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-xs block text-center"
                    >
                      {plan.ctaText}
                    </Link>
                  ) : (
                    <Link
                      to={plan.ctaLink}
                      className="w-full bg-white hover:bg-neutral-50 text-[#010101] font-bold text-sm py-3.5 px-6 rounded-xl border border-[#d4d4d4] transition-all shadow-2xs block text-center"
                    >
                      {plan.ctaText}
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
