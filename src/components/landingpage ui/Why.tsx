import React from "react";
import { motion } from "framer-motion";

export default function Why() {
  return (
    <section id="why" className="relative py-24 border-b border-neutral-200 bg-[#f5f4ef] z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Siloed Legacy explanation */}
          <div className="flex flex-col items-start max-w-xl text-left">
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase block mb-3">
              // OPERATIONAL PAIN
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tighter text-[#010101] leading-tight">
              Disconnected departments. Slower government.
            </h2>
            <p className="mt-6 text-neutral-500 text-sm sm:text-base leading-relaxed font-normal">
              State and local governments operate through an accumulation of siloed legacy systems—permits, land records, asset managers, and financial ledgers—that don't speak to each other.
            </p>
            <p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed font-normal">
              Information is manually keyed, handoffs are lost, and policy is locked in the heads of senior operators. Staff spend hours searching databases instead of serving residents.
            </p>
          </div>

          {/* Right Column: Founder Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="bg-white/80 border border-neutral-200/80 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            {/* Founder Profile Picture from Framer CDN */}
            <div className="w-20 h-20 rounded bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden relative shadow-sm">
              <img
                src="https://framerusercontent.com/images/6CIScQw8ebpwF9M16j03jXWuE0.png"
                alt="M. Attoh Profile Avatar"
                className="w-full h-full object-cover select-none pointer-events-none"
                decoding="async"
                loading="lazy"
              />
            </div>

            {/* Profile Content */}
            <div className="flex flex-col items-start text-left">
              <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                Founder Profile
              </span>
              <h3 className="text-lg font-semibold text-[#010101] mt-1 font-display">M. Attoh</h3>
              <p className="mt-3 text-neutral-500 text-xs sm:text-[13px] leading-relaxed font-normal">
                He brings years of deep, in-the-trenches local government experience, having managed complex public infrastructure programs and municipal operations.
              </p>

              {/* Credentials Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="bg-neutral-100 border border-neutral-200/60 text-neutral-500 text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 rounded">
                  Local Govt Operator
                </span>
                <span className="bg-neutral-100 border border-neutral-200/60 text-neutral-500 text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 rounded">
                  MBA Public Management
                </span>
                <span className="bg-neutral-100 border border-neutral-200/60 text-neutral-500 text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 rounded">
                  Bilingual EN/FR
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
