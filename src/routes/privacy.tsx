import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Database, Key, Eye } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Ledger Security — Todellaa" },
      { name: "description", content: "Understand how Todellaa enforces rigid row-level ledger isolation, multi-tenant databases, and cryptographic statement shielding." }
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const sections = [
    {
      icon: ShieldCheck,
      title: "1. Data Enclosure & Row-Level Security",
      content: "All inbound transactional logs, Paystack API streams, and ZenBank spreadsheet entries are strictly partitioned via Postgres Row-Level Security (RLS). Cross-tenant matching is systematically isolated at the core database engine layer. Your verification workspace data remains entirely enclosed."
    },
    {
      icon: Database,
      title: "2. Statement Ingest Cache Lifetime",
      content: "Raw ZenBank CSV statements and bank spreadsheets ingested into our matching pipelines are parsed instantly in-memory. Expected ledger files are cached solely for the matching pipeline execution window and are purged thoroughly within 24 hours of matching session resolution."
    },
    {
      icon: Key,
      title: "3. Cryptographic Token Protections",
      content: "Client integration credentials utilized for payment processor webhooks (such as Stripe or Paystack API tokens) are enveloped using high-strength hardware security modules (HSM). Todellaa developers and administrators have zero plaintext exposure to these integration parameters."
    },
    {
      icon: Eye,
      title: "4. Compliance & Audit Tracking Logs",
      content: "Every manual mismatch verification state toggle, file export action, or RLS token request registers a permanent cryptographic audit token, accessible from your compliance status panel. These logs are stored in static ledger spaces to ensure absolute auditing integrity."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden antialiased relative">
      {/* Background Dot Grid Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] bg-size-[24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      
      {/* Floating Ambient Glowing Blobs */}
      <div className="absolute top-0 left-[10%] w-[50rem] h-[35rem] rounded-full bg-indigo-950/[0.01] blur-[140px] pointer-events-none z-0 animate-float" />

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
              // DATA GOVERNANCE
            </div>
            <h1 className="text-4xl font-display font-medium tracking-tight text-[#0a1b33] sm:text-6xl">
              Privacy Policy &amp; Security Standards
            </h1>
            <p className="mt-5 text-slate-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
              Transparent parameters outlining how we shield customer transactional logs and preserve tenant space integrity.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[32px] border border-slate-200/60 bg-white p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 space-y-10"
          >
            <div className="border-b border-slate-100 pb-8">
              <span className="text-xs font-mono text-slate-450 uppercase tracking-widest block font-bold mb-2">// SPECIFICATION STATUS</span>
              <p className="text-sm text-slate-500 leading-relaxed font-sans font-light">
                This specification document was last updated on <span className="font-semibold text-slate-800">May 23, 2026</span>. By connecting your active client ledgers and processor APIs to Todellaa, you agree to these operational security constraints.
              </p>
            </div>

            <div className="space-y-12">
              {sections.map((sec, idx) => {
                const IconComp = sec.icon;
                return (
                  <div key={idx} className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0a1b33] shadow-sm shrink-0">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-semibold text-[#0a1b33] tracking-tight">{sec.title}</h2>
                      <p className="mt-3 text-sm text-slate-550 leading-relaxed font-sans font-light">
                        {sec.content}
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

