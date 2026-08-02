import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Bot, Terminal } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/reconciliation")({
  head: () => ({
    meta: [
      { title: "Reconciliation Engine — Todellaa" },
      { name: "description", content: "Learn how Todellaa utilizes AI-driven ledger synthesis, matching prompts, and neural mapping engines to automate transaction verification." }
    ],
  }),
  component: ReconciliationPage,
});

function ReconciliationPage() {
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
              // INTELLIGENT LEDGER ENGINE
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
              Reconciliation Engine
            </h1>
            <p className="mt-5 text-slate-550 max-w-xl mx-auto font-sans font-light leading-relaxed">
              Synthesize mismatched records, resolve fuzzy payment narration texts, and run custom natural-language prompts against your transaction sheets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm mb-6">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">Fuzzy Narration Mapping</h3>
              <p className="text-sm text-slate-550 font-light leading-relaxed">
                Matches statement narrations with invoice references even when customer names are misspelled or transaction references are truncated.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm mb-6">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">AI Reconciliation Assistant</h3>
              <p className="text-sm text-slate-550 font-light leading-relaxed">
                Interact with your upload worksheets using plain language. Ask "find all matches above GHS 1,000 paid via GCB" or "identify mismatch dates".
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-[32px] border border-slate-200/60 bg-white p-8 md:p-12 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-5 h-5 text-slate-700" />
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                Neural Inference Interface
              </h3>
            </div>
            
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 font-mono text-xs space-y-4">
              <div className="text-slate-400 border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>reconciliation_engine.sh</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-indigo-400">$ todellaa-reconciliation analyze --file payment_upload_template.xlsx</p>
                <p className="text-slate-400">Loading neural inference model v2.4.1...</p>
                <p className="text-slate-400">Running semantic matching pipelines over 1,540 ledger rows...</p>
                <p className="text-emerald-400 font-bold">✓ Analysis complete: 1,532 direct matches resolved. 8 fuzzy mismatches identified.</p>
                <p className="text-slate-300">Run "show mismatches" to open reconciliation sidebar.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
