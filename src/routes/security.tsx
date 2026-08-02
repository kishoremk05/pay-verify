import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Server, Key, Eye } from "lucide-react";
import { Navbar, Footer } from "./index";

// Dedicated security route
export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security Standards & Data Isolation — Todellaa" },
      { name: "description", content: "Learn about Todellaa's bank-grade security, PostgreSQL Row-Level Security (RLS) data isolation, HSM token encryption, and immutable audit logs." }
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  const complianceCards = [
    {
      icon: Lock,
      title: "Bank-Grade Encryption",
      desc: "All client credentials, integration tokens, and bank API streams are encrypted in transit using TLS 1.3 and at rest with AES-256."
    },
    {
      icon: Server,
      title: "Ledger Database Isolation",
      desc: "PostgreSQL Row-Level Security (RLS) ensures that multi-tenant billing logs remain strictly isolated. Cross-tenant queries are impossible at the database engine layer."
    },
    {
      icon: Key,
      title: "Cryptographic Keys & Token Storage",
      desc: "API credentials used for Mobile Money wallets and Paystack gateway webhooks are stored in hardware security modules (HSM) with restricted plaintext exposure."
    },
    {
      icon: Eye,
      title: "Immutable Auditing Logs",
      desc: "Every manual mismatch verification state, CSV file export, and admin authorization generates static cryptographic logs for external audits."
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
              // TRUST & SAFETY
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
              Security Standards
            </h1>
            <p className="mt-5 text-slate-550 max-w-xl mx-auto font-sans font-light leading-relaxed">
              We design payment verification infrastructure under strict isolation models to guarantee transaction data safety and ledger compliance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[32px] border border-slate-200/60 bg-white p-8 md:p-12 shadow-sm mb-12 flex items-start gap-6"
          >
            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight font-sans">Row-Level Security & Compliance</h2>
              <p className="text-sm text-slate-550 leading-relaxed font-light mb-4">
                Todellaa enforces isolation at the database layer. PostgreSQL Row-Level Security (RLS) binds every transactional operation to specific tenant identifiers. This means your school fees logs, invoice statements, and payment reconciliation screens are fully insulated.
              </p>
              <p className="text-sm text-slate-550 leading-relaxed font-light">
                Additionally, statement caches for uploaded files (Excel, CSV, and MT940 sheets) are stored in-memory during reconciliation cycles and are automatically destroyed from system disks within 24 hours of matching.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {complianceCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm mb-6 group-hover:scale-105 transition-transform">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 font-sans">{card.title}</h3>
                    <p className="text-xs text-slate-550 font-light leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
