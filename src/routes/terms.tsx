import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use & Service Guidelines — Todellaa" },
      { name: "description", content: "Review standard terms, operational limits, multi-tenant database fair-use guidelines, and ledger matching liabilities." }
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const clauses = [
    {
      icon: Scale,
      title: "1. Service Access & Multi-Tenant Fair Use",
      content: "Todellaa grants you a non-exclusive, non-transferable right to access the cloud-hosted payment matching pipelines. To guarantee ultra-low latencies for all active financial spaces, automated uploads are governed by transactional rate limits of 100,000 matches/hour per tenant."
    },
    {
      icon: CheckCircle2,
      title: "2. Precision & Matching Liabilities",
      content: "While our Active Recon Engine employs high-precision hashing algorithms to isolate mismatched payloads and duplicate identifiers, manual audit verification controls remain the ultimate ledger authority. Todellaa is an advisor tool and holds no direct liability for ledger balancing errors."
    },
    {
      icon: AlertTriangle,
      title: "3. Prohibited & Compromised Uses",
      content: "Users are strictly prohibited from submitting statement CSV spreadsheets containing raw security parameters, master decrypted passwords, or unauthorized credit card numbers. All inbound statements must respect standardized financial sanitization guidelines before ingest."
    },
    {
      icon: RefreshCw,
      title: "4. Subscription Billing & Auto-Renewals",
      content: "Enterprise and Team license fees are collected monthly or annually in advance. Subscription profiles automatically scale based on the transaction matching metrics of the prior billing cycle. Cancellation requests must be submitted 14 days before the subsequent cycle launch."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden antialiased relative">
      {/* Background Dot Grid Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] bg-size-[24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      
      {/* Floating Ambient Glowing Blobs */}
      <div className="absolute top-0 left-[15%] w-[45rem] h-[35rem] rounded-full bg-indigo-950/[0.01] blur-[140px] pointer-events-none z-0 animate-float" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.2em] text-[#0a1b33] mb-5 font-bold shadow-sm">
              // SERVICE GUIDELINES
            </div>
            <h1 className="text-4xl font-display font-medium tracking-tight text-[#0a1b33] sm:text-6xl">
              Terms of Use &amp; Service SLA
            </h1>
            <p className="mt-5 text-slate-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
              Standard operating legal guidelines for modern high-precision financial verification matching.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[32px] border border-slate-200/60 bg-white p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 space-y-10"
          >
            <div className="border-b border-slate-100 pb-8">
              <span className="text-xs font-mono text-slate-450 uppercase tracking-widest block font-bold mb-2">// LEGAL ENFORCEABILITY</span>
              <p className="text-sm text-slate-500 leading-relaxed font-sans font-light">
                By deploying the Todellaa diagnostic packages or utilizing the automated matching API pipelines, you signify consent to the following parameters. Please review these operational rules.
              </p>
            </div>

            <div className="space-y-12">
              {clauses.map((clause, idx) => {
                const IconComp = clause.icon;
                return (
                  <div key={idx} className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0a1b33] shadow-sm shrink-0">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-semibold text-[#0a1b33] tracking-tight">{clause.title}</h2>
                      <p className="mt-3 text-sm text-slate-550 leading-relaxed font-sans font-light">
                        {clause.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

