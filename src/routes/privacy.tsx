import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Database, Key, Eye } from "lucide-react";
import newBg from "@/assets/new bg.png";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Ledger Security — PayVerify" },
      { name: "description", content: "Understand how PayVerify enforces rigid row-level ledger isolation, multi-tenant databases, and cryptographic statement shielding." }
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
      content: "Client integration keys and credentials utilized for payment processor webhooks (such as Stripe or Paystack API tokens) are enveloped using high-strength hardware security modules (HSM). PayVerify developers and administrators have zero plaintext exposure to these integration parameters."
    },
    {
      icon: Eye,
      title: "4. Compliance & Audit Tracking Logs",
      content: "Every manual mismatch verification state toggle, file export action, or RLS token request registers a permanent cryptographic audit token, accessible from your compliance status panel. These logs are stored in static ledger spaces to ensure absolute auditing integrity."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]/30 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden antialiased relative">
      {/* Background Image and Overlays */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-65"
        style={{ backgroundImage: `url(${newBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-45 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Elegance Blobs */}
      <div className="absolute top-0 left-[10%] w-[50rem] h-[35rem] rounded-full bg-blue-600/[0.02] blur-[140px] pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 border border-emerald-250 bg-emerald-50/50 px-3.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-600 mb-5 font-bold shadow-sm backdrop-blur-sm">
              // DATA GOVERNANCE
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 sm:text-6xl">
              Privacy Policy &amp; Security Standards
            </h1>
            <p className="mt-5 text-slate-650 max-w-xl mx-auto font-light leading-relaxed">
              Transparent parameters outlining how we shield customer transactional logs and preserve tenant space integrity.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-slate-200/50 bg-[#eef5fc]/60 backdrop-blur-xl p-8 md:p-12 shadow-xl space-y-10"
          >
            <div className="border-b border-slate-200/60 pb-8">
              <span className="text-xs font-mono text-slate-450 uppercase tracking-widest block font-bold mb-2">// SPECIFICATION STATUS</span>
              <p className="text-sm text-slate-650 leading-relaxed font-light">
                This specification document was last updated on <span className="font-semibold text-slate-800">May 23, 2026</span>. By connecting your active client ledgers and processor APIs to PayVerify, you agree to these operational security constraints.
              </p>
            </div>

            <div className="space-y-12">
              {sections.map((sec, idx) => {
                const IconComp = sec.icon;
                return (
                  <div key={idx} className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0070ba] shadow-sm shrink-0">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">{sec.title}</h2>
                      <p className="mt-3 text-sm text-slate-650 leading-relaxed font-light">
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
