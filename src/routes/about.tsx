import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Compass, Users, CheckCircle2 } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us & Our Core Mission — Todellaa" },
      { name: "description", content: "Learn about the mission, values, and story behind Todellaa, the leading payment reconciliation suite in Ghana." }
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden antialiased relative">
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
              // COMPANY PROFILE
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
              About Todellaa
            </h1>
            <p className="mt-5 text-slate-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
              We build payment matching infrastructure designed to save accounting teams thousands of manual hours and eliminate balance leakage.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[32px] border border-slate-200/60 bg-white p-8 md:p-12 shadow-sm mb-12 space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Our Mission</h2>
            <p className="text-sm text-slate-550 leading-relaxed font-light">
              Todellaa started with a simple realization: matching mobile money SMS alerts, bank transfers, and processor webhooks manually with billing invoices is highly prone to human error and creates massive accounting delays.
            </p>
            <p className="text-sm text-slate-550 leading-relaxed font-light">
              We set out to build an isolated, real-time matching system that parses statements dynamically, isolates tenant databases cryptographically, and utilizes smart matching algorithms to resolve incomplete records. Today, businesses across West Africa rely on Todellaa for core payment operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Absolute Integrity</h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                We treat transaction data with the highest security guidelines, keeping your financial trails isolated and secure.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Customer First</h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Whether you are a retail distributor or an educational institution, we optimize matching metrics to suit your workflow.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

