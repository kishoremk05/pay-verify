import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, FileText, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Core Features — Todellaa" },
      { name: "description", content: "Explore the core features of Todellaa, including automated ledger matching, multi-format spreadsheet imports, and instant transaction validation." }
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Zap,
      title: "Instant Reconciliation Pipeline",
      desc: "Upload spreadsheets and watch matches happen in real-time. Our core pipeline pairs transaction proofs with ledger records in milliseconds."
    },
    {
      icon: Sparkles,
      title: "Smart Resolution Engine",
      desc: "Resolve fuzzy matches, mismatch dates, and custom narration notes automatically with our automated verification engine."
    },
    {
      icon: FileText,
      title: "Universal Format Support",
      desc: "Ingest standard MT940 bank statements, Excel files, CSV spreadsheets, and payment gateway logs without custom mapping configurations."
    },
    {
      icon: ShieldCheck,
      title: "Audit & Compliance Logging",
      desc: "Every reconciliation decision is recorded with a permanent cryptographic audit token, perfect for statutory controls and accounting reviews."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden antialiased relative">
      {/* Background Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] bg-size-[24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem]" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.2em] text-slate-800 mb-5 font-bold shadow-sm">
              // OPERATIONS SUITE
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
              Platform Features
            </h1>
            <p className="mt-5 text-slate-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
              Automated reconciliation tooling built to deliver absolute ledger accuracy and eradicate manual bookkeeping tasks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {coreFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm shrink-0 mb-6 group-hover:scale-105 transition-transform">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3 font-sans">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light font-sans">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Widget Demonstration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-[32px] border border-slate-200/60 bg-white p-8 md:p-12 shadow-sm"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight font-sans">
              Interactive Matching Pipeline
            </h3>
            <p className="text-sm text-slate-550 mb-8 font-light max-w-2xl leading-relaxed">
              Todellaa maps customer deposits, Mobile Money (MoMo) alerts, and bank receipts with billing invoices automatically. Here is a live simulation of a successful match sequence.
            </p>

            <div className="border border-slate-200/60 rounded-2xl overflow-hidden bg-slate-50 font-sans text-xs">
              <div className="bg-white border-b border-slate-200/60 px-4 py-3 flex items-center justify-between font-bold text-slate-800">
                <span>Verification Stream Pipeline</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-extrabold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="p-4 space-y-3 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100 shadow-3xs">
                  <span>1. Spreadsheet Upload Received</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ingested</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100 shadow-3xs">
                  <span>2. Row-Level Ledger Validation</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Isolated</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100 shadow-3xs">
                  <span>3. Narration Matching</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Cleared</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

