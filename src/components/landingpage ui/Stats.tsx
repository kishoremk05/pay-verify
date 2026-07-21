import React from "react";
import { motion } from "framer-motion";

export default function Stats() {
  return (
    <section id="resources" className="relative py-14 sm:py-20 bg-[#121214] text-white border-y border-neutral-800 z-10 font-sans scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-800/80">
          
          {/* Card 1: 99.4% */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0 }}
            className="p-6 sm:p-8 flex flex-col justify-between text-left h-full"
          >
            <div>
              <div className="flex items-baseline">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                  99.4%
                </span>
              </div>
              <p className="mt-4 text-neutral-300 text-sm sm:text-base font-medium leading-relaxed font-sans">
                Automated invoice matching accuracy across bank transfers & Paystack
              </p>
            </div>
            <div>
              <div className="w-full h-[1px] bg-neutral-800/80 my-5 sm:my-6" />
              <span className="text-[10px] font-mono font-medium tracking-wider text-neutral-500 uppercase block leading-normal">
                NIGERIAN & GLOBAL PAYMENTS STUDY, 2026
              </span>
            </div>
          </motion.div>

          {/* Card 2: 85% */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 sm:p-8 flex flex-col justify-between text-left h-full"
          >
            <div>
              <div className="flex items-baseline text-white">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight font-sans">
                  85%
                </span>
              </div>
              <p className="mt-4 text-neutral-300 text-sm sm:text-base font-medium leading-relaxed font-sans">
                Reduction in manual reconciliation hours for accounting teams
              </p>
            </div>
            <div>
              <div className="w-full h-[1px] bg-neutral-800/80 my-5 sm:my-6" />
              <span className="text-[10px] font-mono font-medium tracking-wider text-neutral-500 uppercase block leading-normal">
                FINANCIAL OPERATIONS REPORT, FY2026
              </span>
            </div>
          </motion.div>

          {/* Card 3: < 2 sec */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 sm:p-8 flex flex-col justify-between text-left h-full"
          >
            <div>
              <div className="flex items-baseline text-white">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight font-sans">
                  &lt; 2
                </span>
                <span className="text-2xl font-semibold italic ml-1">
                  sec
                </span>
              </div>
              <p className="mt-4 text-neutral-300 text-sm sm:text-base font-medium leading-relaxed font-sans">
                Real-time payment verification and instant invoice status updates
              </p>
            </div>
            <div>
              <div className="w-full h-[1px] bg-neutral-800/80 my-5 sm:my-6" />
              <span className="text-[10px] font-mono font-medium tracking-wider text-neutral-500 uppercase block leading-normal">
                TODELLAA INFRASTRUCTURE BENCHMARK
              </span>
            </div>
          </motion.div>

          {/* Card 4: 10M+ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 sm:p-8 flex flex-col justify-between text-left h-full"
          >
            <div>
              <div className="flex items-baseline text-white">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight font-sans">
                  10M+
                </span>
              </div>
              <p className="mt-4 text-neutral-300 text-sm sm:text-base font-medium leading-relaxed font-sans">
                Invoices & payment records processed with zero reconciliation errors
              </p>
            </div>
            <div>
              <div className="w-full h-[1px] bg-neutral-800/80 my-5 sm:my-6" />
              <span className="text-[10px] font-mono font-medium tracking-wider text-neutral-500 uppercase block leading-normal">
                TODELLAA METRICS FY2026
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
