import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dashboardHero from "@/assets/dashboard-hero.webp";

export default function HeroImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position specifically when this element enters and moves up the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Scale smoothly from 0.82 (smaller) up to 1.0 (full size) as user scrolls down
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0.4, 1]);

  return (
    <section ref={containerRef} className="relative py-16 sm:py-24 bg-transparent overflow-hidden z-10">
      {/* Dark Black Fill Box in lower section */}
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[#121214] border-t border-neutral-800 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center relative z-10">
        <motion.div
          style={{ scale, opacity }}
          className="w-full max-w-5xl sm:max-w-6xl rounded-2xl border border-neutral-300/80 overflow-hidden shadow-[0_35px_90px_-15px_rgba(0,0,0,0.16)] bg-white"
        >
          <img
            src={dashboardHero}
            alt="TODELLAA Payment Reconciliation Operations Dashboard"
            className="w-full h-auto object-contain select-none pointer-events-none block"
            decoding="async"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
