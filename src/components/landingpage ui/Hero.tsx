import React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, FileText, ChevronsRight } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  } as const;

  return (
    <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 bg-transparent z-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-4 sm:gap-5"
        >
          {/* Pill Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-700 bg-[#0a0a0a] shadow-2xs select-none"
          >
            <ChevronsRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span className="text-xs sm:text-sm font-normal text-white tracking-tight">
              ⚡ AI-Powered Payment Reconciliation Platform
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-sans font-semibold sm:font-bold text-2xl sm:text-4xl md:text-[46px] lg:text-[54px] xl:text-[58px] tracking-[-0.03em] text-[#050505] leading-[1.12] max-w-5xl mx-auto text-center"
          >
            <span className="block">Automate Payment Matching.</span>
            <span className="block">From Invoice To Verification.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-neutral-500 text-sm sm:text-base md:text-lg leading-[1.6] max-w-2xl mx-auto font-normal font-sans"
          >
            TODELLAA connects your Paystack feeds, bank transfers, and mobile money into one intelligent reconciliation engine—eliminating manual matching and audit backlog.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-row items-center justify-center gap-3 sm:gap-4 mt-1 sm:mt-2 w-full sm:w-auto"
          >
            <Link
              to="/signup"
              className="bg-[#3675ff] hover:bg-[#2563eb] text-white font-medium text-sm sm:text-base py-3 px-7 rounded-[10px] transition-colors shadow-xs block text-center"
            >
              Start Free Trial
            </Link>
            <a
              href="#system"
              className="bg-[#1c1c1c] hover:bg-black text-white font-medium text-sm sm:text-base py-3 px-7 rounded-[10px] transition-colors shadow-xs block text-center"
            >
              Explore Platform
            </a>
          </motion.div>

          {/* Trust badges / compliance row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 sm:mt-10 text-neutral-600 text-sm font-normal tracking-tight font-sans"
          >
            {/* Paystack */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-[4px] border border-[#22c55e] flex items-center justify-center bg-white text-[#22c55e]">
                <svg className="w-3 h-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Paystack Verified</span>
            </div>

            {/* Instant Verification */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#3675ff] shrink-0" />
              <span>Instant Payment Verification</span>
            </div>

            {/* Audit Logs */}
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#f97316] shrink-0" />
              <span>Audit-Ready Logs</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

