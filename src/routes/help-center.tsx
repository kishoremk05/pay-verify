import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, HelpCircle, FileText, Settings, ShieldAlert, MessageSquare } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/help-center")({
  head: () => ({
    meta: [
      { title: "Help Center & Support Portal — Todellaa" },
      { name: "description", content: "Access FAQs, documentation, guides, and contact information for the Todellaa payment reconciliation team." }
    ],
  }),
  component: HelpCenterPage,
});

function HelpCenterPage() {
  const categories = [
    {
      icon: FileText,
      title: "Getting Started",
      desc: "Setting up your first workspace, uploading payment proofs, and exporting verified ledgers."
    },
    {
      icon: Settings,
      title: "Integrations & APIs",
      desc: "Hooking up Paystack, mapping Excel columns, and setting up SWIFT MT940 statement templates."
    },
    {
      icon: ShieldAlert,
      title: "Security & isolation",
      desc: "Row-Level Security configurations, user role management, and audit logs."
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
              // SUPPORT DESK
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
              Help Center
            </h1>
            <p className="mt-5 text-slate-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
              Find answers to core features, security parameters, and payment channel setup questions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm mb-4">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 font-sans">{cat.title}</h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed mb-4">{cat.desc}</p>
                  </div>
                  <a href="#" className="text-xs font-bold text-slate-900 hover:underline inline-flex items-center gap-1">
                    Browse articles <HelpCircle className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Support Direct CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-[32px] border border-slate-200/60 bg-slate-50 p-8 md:p-12 shadow-sm text-center"
          >
            <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 mx-auto mb-6 shadow-3xs">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight font-sans">
              Still need assistance?
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto font-light leading-relaxed">
              Our integration engineers can walk you through complex bank statement uploads or custom API webhook configuration.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

