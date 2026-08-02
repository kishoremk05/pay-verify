import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CreditCard,
  Sparkles,
  BarChart3,
  RotateCcw,
  Bot,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  Zap,
  Lock,
  ArrowUpRight
} from "lucide-react";

export default function Capabilities() {
  const features = [
    {
      icon: Users,
      title: "Manage Customers",
      desc: "Store customer details, contacts, groups and payment history in a unified CRM view.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2.5 space-y-2 mt-4 font-sans text-xs">
          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#f0eee6]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#e8562a]/20 text-[#e8562a] font-bold text-[10px] flex items-center justify-center">JD</div>
              <span className="font-bold text-[#010101] text-[11px]">John Doe</span>
            </div>
            <span className="bg-[#fef3eb] text-[#e8562a] text-[9px] font-bold px-1.5 py-0.5 rounded">SME</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#737373] px-1">
            <span>3 Active Invoices</span>
            <span className="font-bold text-[#16a34a]">€ 4,500 Paid</span>
          </div>
        </div>
      ),
    },
    {
      icon: FileText,
      title: "Create Invoices",
      desc: "Generate professional PDF & online invoices with instant payment links in seconds.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2.5 space-y-1.5 mt-4 font-sans text-xs">
          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#f0eee6]">
            <div>
              <span className="font-bold text-[#010101] text-[11px] block">#INV-2041</span>
              <span className="text-[9px] text-[#737373]">Due May 30</span>
            </div>
            <span className="bg-[#dcfce7] text-[#16a34a] text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> PAID
            </span>
          </div>
        </div>
      ),
    },
    {
      icon: CreditCard,
      title: "Accept Payments",
      desc: "Collect payments via Paystack, direct bank transfers, and Mobile Money.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2.5 mt-4 font-sans text-xs">
          <div className="flex items-center justify-between gap-1">
            <span className="bg-white border border-[#f0eee6] px-2 py-1 rounded text-[10px] font-bold text-[#010101]">Paystack</span>
            <span className="bg-white border border-[#f0eee6] px-2 py-1 rounded text-[10px] font-bold text-[#010101]">MoMo</span>
            <span className="bg-white border border-[#f0eee6] px-2 py-1 rounded text-[10px] font-bold text-[#010101]">Bank</span>
          </div>
        </div>
      ),
    },
    {
      icon: Sparkles,
      title: "Auto Reconciliation",
      desc: "Automatically match payments to invoices with high AI accuracy and zero manual errors.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2.5 mt-4 font-sans text-xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#010101] mb-1">
            <span>Match Accuracy</span>
            <span className="text-[#16a34a]">99.4%</span>
          </div>
          <div className="w-full h-2 bg-[#e6e4dc] rounded-full overflow-hidden">
            <div className="h-full bg-[#16a34a] w-[99.4%]" />
          </div>
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: "Track Balances",
      desc: "Monitor outstanding balances and overdue invoices in real-time operational views.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2.5 mt-4 font-sans text-xs">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#737373]">Outstanding</span>
            <span className="font-bold text-[#dc2626]">-5.1% YoY</span>
          </div>
          <div className="flex items-end gap-1 h-6 mt-1">
            <div className="w-full bg-[#e8562a]/40 h-[80%] rounded-t-xs" />
            <div className="w-full bg-[#e8562a]/60 h-[60%] rounded-t-xs" />
            <div className="w-full bg-[#e8562a] h-[40%] rounded-t-xs" />
          </div>
        </div>
      ),
    },
    {
      icon: RotateCcw,
      title: "Refunds & Adjustments",
      desc: "Process refunds and fee adjustments easily with full approval auditing.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2 mt-4 font-sans text-xs">
          <div className="flex items-center justify-between text-[10px] bg-white p-1.5 rounded border border-[#f0eee6]">
            <span className="text-[#737373]">REF-8841</span>
            <span className="bg-[#eff6ff] text-[#2563eb] font-bold px-1.5 py-0.5 rounded text-[9px]">Approved</span>
          </div>
        </div>
      ),
    },
    {
      icon: Bot,
      title: "AI Insights & Reports",
      desc: "Get smart insights, payment trends, and financial summaries powered by AI.",
      widget: (
        <div className="bg-[#fef3eb] border border-[#fcdcc5] rounded-xl p-2 mt-4 font-sans text-[10px] text-[#7c2d12]">
          <span className="font-bold block">💡 AI Tip:</span>
          <span>85% of MoMo payments cleared on Fridays.</span>
        </div>
      ),
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      desc: "Bank-grade security, role permissions, 256-bit SSL encryption, and daily data backup.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2 mt-4 font-sans text-xs flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#010101] flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#16a34a]" /> 256-bit SSL
          </span>
          <span className="bg-[#dcfce7] text-[#16a34a] text-[9px] font-bold px-1.5 py-0.5 rounded">SOC-2</span>
        </div>
      ),
    },
    {
      icon: Building2,
      title: "Multi-Branch Support",
      desc: "Manage multiple branches, campuses, or regional divisions in one platform.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2 mt-4 font-sans text-[10px] flex items-center justify-between">
          <span className="bg-white border border-[#f0eee6] px-1.5 py-0.5 rounded font-bold text-[#010101]">Accra</span>
          <span className="bg-white border border-[#f0eee6] px-1.5 py-0.5 rounded font-bold text-[#010101]">Kumasi</span>
          <span className="bg-white border border-[#f0eee6] px-1.5 py-0.5 rounded font-bold text-[#010101]">Takoradi</span>
        </div>
      ),
    },
    {
      icon: FileCheck,
      title: "Audit Logs",
      desc: "Track every payment modification and user action with immutable audit trails.",
      widget: (
        <div className="bg-[#faf9f5] border border-[#ecebe4] rounded-xl p-2 mt-4 font-sans text-[9px] text-[#737373]">
          <span className="font-mono font-bold text-[#010101] block">LOG #4082</span>
          <span>Matched #INV-1024 by System</span>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#f7f6f1] text-[#010101] font-sans border-t border-[#e6e4dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#fcdcc5] bg-[#fef3eb] select-none mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#e8562a]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#e8562a]">Platform Capabilities</span>
          </div>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[44px] tracking-tight text-[#010101] leading-tight mb-4">
            Everything you need to manage payments
          </h2>
          <p className="text-[#525252] text-base sm:text-lg font-normal">
            From invoices to reconciliation, TODELLAA brings it all together.
          </p>
        </div>

        {/* 10 Feature Cards Grid (5 cols on lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-[#e6e4dc] rounded-2xl p-5 hover:border-[#e8562a]/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#fef3eb] border border-[#fcdcc5] text-[#e8562a] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#010101] tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#737373] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Render Custom Mini-UI Widget */}
                {item.widget}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
