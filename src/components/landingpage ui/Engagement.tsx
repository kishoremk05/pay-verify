import React from "react";
import { motion } from "framer-motion";
import { Sliders, ChevronRight } from "lucide-react";

const steps = [
  {
    step: "01",
    phase: "Phase 01 · Feed Integration",
    week: "Week 01",
    title: "Connect payment channels",
    desc: "Link Paystack API keys, bank statement feeds, and CSV invoice templates into TODELLAA.",
  },
  {
    step: "02",
    phase: "Phase 02 · AI Tuning",
    week: "Wks 01–02",
    title: "Configure matching rules",
    desc: "Train TODELLAA's matching engine against historical reference numbers, partial payments, and fee structures.",
  },
  {
    step: "03",
    phase: "Phase 03 · Live Sync",
    week: "Wks 02–03",
    title: "Activate real-time matching",
    desc: "Automate invoice verification and instant status syncing across billing databases and portals.",
  },
  {
    step: "04",
    phase: "Phase 04 · Continuous Audit",
    week: "Ongoing",
    title: "Automate compliance & insights",
    desc: "Continuous operations with real-time audit logging, anomaly flags, and automated financial reporting.",
  },
];

export default function Engagement() {
  return (
    <section id="engagement" className="relative py-20 sm:py-28 border-t border-neutral-300/80 shadow-[inset_0_20px_35px_-15px_rgba(0,0,0,0.03)] bg-[#f7f6f1]/60 z-10 scroll-mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          
          {/* Left Column - STICKY Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-300/80 bg-white/70 backdrop-blur-xs text-xs font-normal text-neutral-800 shadow-2xs select-none">
              <Sliders className="w-3.5 h-3.5 text-neutral-800" />
              <span>Onboarding</span>
            </div>

            <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-[46px] tracking-[-0.035em] text-[#0a0a0a] leading-[1.12]">
              <span className="block">How We Onboard.</span>
              <span className="block">In Days, Not Months</span>
            </h2>

            <p className="text-neutral-500 text-base sm:text-lg leading-[1.6] font-normal">
              TODELLAA integrates with your existing billing software, bank feeds, and payment gateways in <strong className="text-neutral-900 font-semibold">days</strong>.
            </p>

            <p className="text-neutral-500 text-base sm:text-lg leading-[1.6] font-normal">
              Eliminate manual reconciliation backlogs without altering how your organization accepts payments.
            </p>

            <div className="pt-4">
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
                <span className="text-sm sm:text-base font-semibold text-neutral-800">
                  Setup to live reconciliation
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#3675ff]">
                  1–4 weeks
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - SCROLLABLE Timeline */}
          <div className="lg:col-span-7 relative pl-8 sm:pl-10 space-y-16 sm:space-y-20 border-l-2 border-[#3675ff]/40">
            
            {steps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative bg-white/70 border border-neutral-200/80 rounded-2xl p-7 sm:p-8 shadow-2xs text-left group hover:border-neutral-300 hover:bg-white transition-all"
              >
                {/* Timeline Node Dot on Vertical Line */}
                <div className="absolute -left-[41px] sm:-left-[49px] top-8 w-5 h-5 rounded-full bg-[#3675ff] border-4 border-[#f7f6f1] shadow-2xs" />

                {/* Top Row: Number & Week Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold font-mono text-[#3675ff]">
                    {item.step}
                  </span>
                  
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-neutral-200 bg-white text-xs font-mono font-medium text-neutral-700 shadow-2xs">
                    <ChevronRight className="w-3 h-3 text-neutral-500" />
                    <span>{item.week}</span>
                  </div>
                </div>

                {/* Phase Label */}
                <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase block font-sans">
                  {item.phase}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[#0a0a0a] tracking-tight mt-1 font-sans">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-neutral-600 text-base leading-relaxed font-normal font-sans">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}
