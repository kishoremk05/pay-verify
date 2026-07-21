import React from "react";
import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";

const institutions = [
  {
    num: "01 / Education",
    customer: "Educational Institutions",
    title: "Student Tuition & Fee Matching",
    desc: "Automating student fee reconciliation across bank deposits, online portals, and payment links.",
  },
  {
    num: "02 / Enterprise",
    customer: "Businesses & Enterprises",
    title: "B2B Invoicing & Vendor Reconciliation",
    desc: "Matching high-volume B2B invoices with incoming bank transfer references in real time.",
  },
  {
    num: "03 / Non-Profit",
    customer: "Non-Profits & NGO Orgs",
    title: "Grant & Donation Verification",
    desc: "Tracking grant deposits, member dues, and donor transfers with instant verification.",
  },
  {
    num: "04 / Fintech",
    customer: "Fintech & Service Platforms",
    title: "Settlement & Merchant Payouts",
    desc: "Reconciling merchant payouts, multi-currency collections, and settlement reports.",
  },
];

export default function WhoWeServe() {
  return (
    <section id="solutions" className="relative py-20 sm:py-28 border-t border-neutral-300/80 shadow-[inset_0_20px_35px_-15px_rgba(0,0,0,0.03)] bg-[#f7f6f1]/60 z-10 scroll-mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Intro Header */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-300/80 bg-white/70 backdrop-blur-xs shadow-2xs select-none mb-6">
            <UserCheck className="w-3.5 h-3.5 text-neutral-800" />
            <span className="text-xs sm:text-sm font-normal text-neutral-800 tracking-tight">
              Who we serve
            </span>
          </div>

          <h2 className="font-sans font-bold text-3xl sm:text-5xl lg:text-[60px] tracking-[-0.035em] text-[#0a0a0a] leading-[1.08] text-center">
            <span className="block">For Organizations</span>
            <span className="block">That Process Payments.</span>
          </h2>

          <p className="mt-6 text-neutral-500 text-base sm:text-lg leading-[1.65] max-w-2xl mx-auto text-center font-normal font-sans">
            TODELLAA is built for organizations, educational institutions, and businesses that require zero manual reconciliation errors and complete financial clarity.
          </p>

          <p className="mt-4 text-neutral-500 text-sm sm:text-base leading-[1.65] max-w-2xl mx-auto text-center font-normal font-sans">
            From high-volume invoice matching to multi-bank settlement tracking, we empower finance teams to operate with total confidence.
          </p>
        </div>

        {/* Institutional Table UI Container */}
        <div className="max-w-5xl mx-auto bg-neutral-200/50 p-2.5 sm:p-3.5 rounded-3xl border border-neutral-300/60 shadow-xs space-y-2.5 sm:space-y-3">
          
          {/* Table Header Bar */}
          <div className="bg-[#3675ff] text-white rounded-2xl py-3.5 px-6 sm:px-8 hidden md:grid grid-cols-12 gap-4 items-center text-xs font-bold tracking-tight shadow-2xs">
            <div className="col-span-3">Segment</div>
            <div className="col-span-4">Customer</div>
            <div className="col-span-5">Institutional Logic</div>
          </div>

          {/* Table Rows Cards */}
          {institutions.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-left hover:border-neutral-300 transition-colors shadow-2xs"
            >
              {/* Segment */}
              <div className="md:col-span-3 text-xs font-mono font-medium text-neutral-400">
                {item.num}
              </div>

              {/* Customer */}
              <div className="md:col-span-4 text-xl sm:text-2xl font-bold text-[#0a0a0a] tracking-tight">
                {item.customer}
              </div>

              {/* Institutional Logic */}
              <div className="md:col-span-5">
                <h4 className="text-sm font-bold text-[#0a0a0a] tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
