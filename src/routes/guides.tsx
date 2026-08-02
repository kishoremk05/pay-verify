import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Compass, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "User Guides & Tutorials — Todellaa" },
      { name: "description", content: "Learn how to use Todellaa to parse bank statements, reconcile invoices, audit transactions, and match spreadsheet records." }
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  const guides = [
    {
      title: "Reconciling Bank Statements in 3 Steps",
      desc: "A quickstart tutorial covering MT940 file upload, automatic column mapping, and fuzzy transaction resolution.",
      difficulty: "Beginner"
    },
    {
      title: "Configuring Paystack API Webhooks",
      desc: "Connect your active Paystack gateway and ensure real-time card and mobile money balances register directly into your ledger.",
      difficulty: "Intermediate"
    },
    {
      title: "Row-Level Ledger Isolation Rules",
      desc: "An administrator's guide to enforcing strict multi-tenant partitions and granting auditor roles in Todellaa.",
      difficulty: "Advanced"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden antialiased relative">
      {/* Background Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] bg-size-[24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem]" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.2em] text-slate-800 mb-5 font-bold shadow-sm">
              // TUTORIALS PLATFORM
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
              Operational Guides
            </h1>
            <p className="mt-5 text-slate-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
              Step-by-step guides detailing how to accelerate payment verification workflows.
            </p>
          </motion.div>

          <div className="space-y-6 mb-16">
            {guides.map((guide, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl border border-slate-200/60 bg-white p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full mb-3">
                    {guide.difficulty}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">{guide.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed font-sans">{guide.desc}</p>
                </div>
                <a href="#" className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 shrink-0 transition-all self-start md:self-auto">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

