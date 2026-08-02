import React from "react";
import { motion } from "framer-motion";

export default function Stats() {
  const logos = [
    { name: "Stanbic Bank", logo: "Stanbic Bank" },
    { name: "GCB", logo: "GCB" },
    { name: "MTN", logo: "MTN" },
    { name: "telecel", logo: "telecel" },
    { name: "airteltigo money", logo: "airteltigo money" },
    { name: "Paystack", logo: "Paystack" },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#f7f6f1] border-y border-[#e6e4dc] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#737373] mb-8">
          TRUSTED BY BUSINESSES & INSTITUTIONS
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-85 grayscale hover:grayscale-0 transition-all">
          
          {/* Stanbic Bank */}
          <div className="flex items-center gap-2 font-bold text-lg sm:text-xl text-[#010101] tracking-tight">
            <div className="w-7 h-7 rounded bg-[#0033a0] text-white flex items-center justify-center text-xs font-black">
              SB
            </div>
            <span>Stanbic Bank</span>
          </div>

          {/* GCB Bank */}
          <div className="flex items-center gap-2 font-black text-xl sm:text-2xl text-[#010101] tracking-tighter">
            <span className="bg-[#e53935] text-white px-2 py-0.5 rounded text-base font-extrabold">GCB</span>
          </div>

          {/* MTN */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-8 rounded-full border-2 border-[#010101] bg-[#ffcc00] font-black text-xs text-[#010101] flex items-center justify-center tracking-tight">
              MTN
            </div>
          </div>

          {/* telecel */}
          <div className="font-extrabold text-xl sm:text-2xl text-[#e53935] tracking-tight lowercase">
            telecel
          </div>

          {/* airteltigo money */}
          <div className="flex items-center gap-1 font-bold text-base sm:text-lg text-[#010101]">
            <span className="text-[#e53935] font-extrabold">airteltigo</span>
            <span className="text-xs font-semibold bg-[#e6e4dc] px-1.5 py-0.5 rounded text-[#404040]">money</span>
          </div>

          {/* Paystack */}
          <div className="flex items-center gap-2 font-bold text-xl text-[#010101] tracking-tight">
            <div className="w-6 h-6 rounded bg-[#0ba4db] text-white flex items-center justify-center text-xs font-black">
              P
            </div>
            <span>Paystack</span>
          </div>

        </div>
      </div>
    </section>
  );
}

