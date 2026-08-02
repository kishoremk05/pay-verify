import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Stethoscope,
  Wallet,
  Check,
  Zap,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export default function WhoWeServe() {
  const audiences = [
    {
      icon: Building2,
      badge: "SMEs & Businesses",
      title: "Small & Medium Enterprises",
      desc: "Streamline daily invoicing, track outstanding customer balances, and auto-match payments without manual ledger entries.",
      metrics: "99.4% Match Accuracy",
      highlights: ["Invoice automation", "Customer balance tracking", "Instant bank verification"],
      tagline: "Paystack + Bank Transfer",
    },
    {
      icon: GraduationCap,
      badge: "Schools & Universities",
      title: "Educational Institutions",
      desc: "Reconcile student tuition, admission fees, and term payments across multiple bank accounts and Mobile Money numbers.",
      metrics: "Zero Tuition Errors",
      highlights: ["Tuition fee matching", "Student ID references", "Multi-branch reports"],
      tagline: "MoMo + Bank Deposits",
    },
    {
      icon: HeartHandshake,
      badge: "NGOs & Churches",
      title: "Non-Profits & Faith Orgs",
      desc: "Keep audit-ready records of member contributions, tithes, pledge receipts, and donor grant transfers.",
      metrics: "Audit-Ready Logs",
      highlights: ["Donor deposit logs", "Audit-ready trails", "Transparent reporting"],
      tagline: "Pledges + Donor Grants",
    },
    {
      icon: Stethoscope,
      badge: "Clinics & Hospitals",
      title: "Healthcare Facilities",
      desc: "Track patient bills, pharmacy payments, insurance settlements, and point-of-sale collections accurately.",
      metrics: "Instant Billing Sync",
      highlights: ["Patient billing sync", "Insurance reconciliation", "Multi-cashier logs"],
      tagline: "Insurance + POS Cash",
    },
    {
      icon: Wallet,
      badge: "Multi-Channel Merchants",
      title: "Bank, MoMo & Cash Outlets",
      desc: "Unify fragmented payment feeds—Bank transfers, MTN MoMo, Telecel Cash, AirtelTigo, Paystack & Cash deposits—in one hub.",
      metrics: "< 2s Real-Time Sync",
      highlights: ["Bank statement import", "Instant MoMo sync", "Zero-error matching"],
      tagline: "All Payment Channels",
    },
  ];

  return (
    <section id="solutions" className="py-20 sm:py-28 bg-[#faf9f5] border-t border-[#e6e4dc] text-[#010101] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#fcdcc5] bg-[#fef3eb] select-none mb-4">
            <Zap className="w-3.5 h-3.5 text-[#e8562a]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#e8562a]">Built for your organization</span>
          </div>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[44px] tracking-tight text-[#010101] leading-tight mb-4">
            Who TODELLAA is built for
          </h2>
          <p className="text-[#525252] text-base sm:text-lg font-normal">
            Whether you operate a school, enterprise, clinic, or non-profit, TODELLAA fits seamlessly into your payment workflows.
          </p>
        </div>

        {/* 5 Audience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`bg-white border border-[#e6e4dc] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#e8562a]/40 hover:shadow-md transition-all flex flex-col justify-between group ${
                  idx === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#fef3eb] border border-[#fcdcc5] text-[#e8562a] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-[#dcfce7] text-[#16a34a] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {item.metrics}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#e8562a] uppercase tracking-wider block mb-1">
                    {item.badge}
                  </span>

                  <h3 className="text-xl font-bold text-[#010101] tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#737373] leading-relaxed font-normal mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Highlight List & Channel Tagline */}
                <div>
                  <div className="border-t border-[#f0eee6] pt-4 space-y-2 mb-4">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#404040]">
                        <div className="w-4 h-4 rounded-full bg-[#fef3eb] text-[#e8562a] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        </div>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#faf9f5] border border-[#ecebe4] p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#737373]">Supported Channel:</span>
                    <span className="font-bold text-[#010101] text-[11px]">{item.tagline}</span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
