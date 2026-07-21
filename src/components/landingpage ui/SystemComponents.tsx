import React from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

const components = [
  {
    num: "01",
    title: "Intake",
    subtitle: "Omnichannel payment capture",
    desc: "Ingest transactions from Paystack, bank transfers, mobile money, and manual bank deposits into one normalized ledger stream.",
    tagline: "All payment feeds · one ledger",
  },
  {
    num: "02",
    title: "Structure",
    subtitle: "Typed invoice matching",
    desc: "Match incoming funds against issued invoices using intelligent fuzzy reference matching, amounts, and metadata tags.",
    tagline: "Invoice matching · automated",
  },
  {
    num: "03",
    title: "Syncing",
    subtitle: "Real-time payment sync",
    desc: "Instantly update invoice statuses across accounting platforms, student portals, and ERPs as soon as funds clear.",
    tagline: "Real-time sync · zero latency",
  },
  {
    num: "04",
    title: "Intelligence",
    subtitle: "AI Financial Insights",
    desc: "Track cash flow trends, detect payment anomalies, and resolve unallocated deposits through interactive AI insights.",
    tagline: "AI analytics · instant clarity",
  },
  {
    num: "05",
    title: "Visibility",
    subtitle: "Audit-ready transparency",
    desc: "Maintain immutable transaction logs and generate complete audit reports for finance teams, auditors, and leadership.",
    tagline: "Audit-ready · 100% verified",
  },
];

export default function SystemComponents() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 border-t-2 border-neutral-300 shadow-[inset_0_30px_45px_-15px_rgba(0,0,0,0.07)] bg-[#f7f6f1] z-10 scroll-mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Intro */}
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-300/80 bg-white/70 backdrop-blur-xs shadow-2xs select-none mb-6">
            <Cpu className="w-3.5 h-3.5 text-neutral-800" />
            <span className="text-xs sm:text-sm font-normal text-neutral-800 tracking-tight">
              The platform
            </span>
          </div>

          <h2 className="font-sans font-bold text-3xl sm:text-5xl md:text-6xl lg:text-[64px] tracking-[-0.035em] text-[#0a0a0a] leading-[1.1] text-center">
            <span className="block">One Platform. Five Operations.</span>
            <span className="block">Everything Else Is Automation.</span>
          </h2>

          <p className="mt-4 text-neutral-500 text-base sm:text-lg leading-[1.6] max-w-3xl mx-auto text-center font-normal font-sans">
            <span className="block md:inline">TODELLAA enables faster, smarter, and more accurate financial reconciliation</span>{" "}
            <span className="block md:inline">from invoice generation to payment verification.</span>
          </p>
        </div>

        {/* 5 Components Cards Grid */}
        <div className="space-y-6">
          {/* Top row: 3 Cards (01, 02, 03) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {components.slice(0, 3).map((comp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#fcfbf9] border border-neutral-200/90 rounded-2xl p-7 sm:p-8 flex flex-col justify-between min-h-[340px] hover:border-neutral-300 transition-colors shadow-2xs"
              >
                <div>
                  <span className="text-xs font-bold text-[#3675ff] block mb-4">
                    {comp.num}
                  </span>
                  <h3 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
                    {comp.title}
                  </h3>
                  <span className="text-sm font-normal text-neutral-500 block mt-1">
                    {comp.subtitle}
                  </span>
                  <p className="mt-6 text-neutral-600 text-sm leading-relaxed font-normal">
                    {comp.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 text-center text-xs font-normal text-neutral-400">
                  {comp.tagline}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom row: 2 Cards (04, 05) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {components.slice(3, 5).map((comp, idx) => (
              <motion.div
                key={idx + 3}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (idx + 3) * 0.1 }}
                className="bg-[#fcfbf9] border border-neutral-200/90 rounded-2xl p-7 sm:p-8 flex flex-col justify-between min-h-[340px] hover:border-neutral-300 transition-colors shadow-2xs"
              >
                <div>
                  <span className="text-xs font-bold text-[#3675ff] block mb-4">
                    {comp.num}
                  </span>
                  <h3 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
                    {comp.title}
                  </h3>
                  <span className="text-sm font-normal text-neutral-500 block mt-1">
                    {comp.subtitle}
                  </span>
                  <p className="mt-6 text-neutral-600 text-sm leading-relaxed font-normal">
                    {comp.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 text-center text-xs font-normal text-neutral-400">
                  {comp.tagline}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

