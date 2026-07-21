import React from "react";
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="relative bg-[#121214] text-white py-16 sm:py-20 px-6 sm:px-12 lg:px-20 z-10 border-t border-neutral-800 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-14 border-b border-neutral-800/80 text-left">
          
          {/* Col 1: Logo & Subtitle (md:col-span-5) */}
          <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-6">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img src={logo} alt="TODELLAA Logo" className="h-9 w-auto object-contain" />
              <span className="text-xl font-bold tracking-tight text-white">TODELLAA</span>
            </Link>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal mt-6 max-w-sm font-sans">
              TODELLAA enables faster, smarter, and more accurate financial reconciliation from invoice generation to payment verification.
            </p>
          </div>

          {/* Col 2: SYSTEM (md:col-span-2) */}
          <div className="md:col-span-2 flex flex-col items-start">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-5 block">
              PLATFORM
            </span>
            <ul className="space-y-3 text-sm text-neutral-300 font-sans">
              <li>
                <a href="#system" className="hover:text-white transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#who-we-serve" className="hover:text-white transition-colors">
                  Who We Serve
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: OPERATIONS (md:col-span-2) */}
          <div className="md:col-span-2 flex flex-col items-start">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-5 block">
              OPERATIONS
            </span>
            <ul className="space-y-3 text-sm text-neutral-300 font-sans">
              <li>
                <a href="#engagement" className="hover:text-white transition-colors">
                  Onboarding
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: CONTACT (md:col-span-3) */}
          <div className="md:col-span-3 flex flex-col items-start space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2 block">
              CONTACT
            </span>

            <span className="text-sm font-semibold text-white block font-sans">
              Dr Noskim Atidigah
            </span>

            <span className="text-xs text-neutral-400 block font-sans">
              Accra, Ghana
            </span>

            <div className="space-y-1.5 pt-1 text-xs text-neutral-300 font-sans">
              <div>Mobile: <a href="tel:+233264445383" className="text-white hover:text-[#3675ff] font-medium">+233-26 444 53 83</a></div>
              <div>WhatsApp: <a href="https://wa.me/233508069168" target="_blank" rel="noreferrer" className="text-white hover:text-[#3675ff] font-medium">+233-50 806 9168</a></div>
              <div>Skype: <span className="text-white font-medium">noskim1</span></div>
            </div>

            <div className="pt-2 space-y-1.5 text-xs">
              <a
                href="mailto:noskim.atidigah@gmail.com"
                className="inline-flex items-center gap-2 text-white hover:text-[#3675ff] transition-colors font-sans group"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#3675ff]" />
                <span className="underline decoration-neutral-600 underline-offset-4 group-hover:decoration-[#3675ff]">
                  noskim.atidigah@gmail.com
                </span>
              </a>
              <a
                href="mailto:noskim@bulaiza.com"
                className="inline-flex items-center gap-2 text-white hover:text-[#3675ff] transition-colors font-sans group block"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#3675ff]" />
                <span className="underline decoration-neutral-600 underline-offset-4 group-hover:decoration-[#3675ff]">
                  noskim@bulaiza.com
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs font-sans text-neutral-500 tracking-normal">
          © 2026 TODELLAA Financial Operations Platform
        </div>

      </div>
    </footer>
  );
}
