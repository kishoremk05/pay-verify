import React from "react";
import { motion } from "framer-motion";
import { 
  Cloud, 
  Pencil, 
  GitBranch, 
  FileText, 
  Building2, 
  Inbox, 
  Grid3X3, 
  TrendingUp 
} from "lucide-react";

export default function Capabilities() {
  return (
    <section id="features" className="relative py-20 sm:py-28 bg-[#121214] text-white z-10 scroll-mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-700/80 bg-neutral-800/80 text-neutral-300 backdrop-blur-xs shadow-2xs select-none mb-6">
            <Cloud className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-xs sm:text-sm font-normal tracking-tight">
              Capabilities
            </span>
          </div>

          <h2 className="font-sans font-bold text-3xl sm:text-5xl lg:text-[60px] tracking-[-0.035em] text-white leading-[1.08] text-center">
            <span className="block">Built For Reconciliation.</span>
            <span className="block">Operated For Transparency.</span>
          </h2>

          <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-[1.6] max-w-2xl mx-auto text-center font-normal font-sans">
            <span className="block sm:inline">The primitives below are the load-bearing surfaces</span>{" "}
            <span className="block sm:inline">every financial operations workflow relies on.</span>
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="space-y-6">
          
          {/* Row 1: 3 Equal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Intake classification */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-white text-neutral-900 rounded-2xl p-7 flex flex-col justify-between min-h-[380px] shadow-sm"
            >
              <div>
                <div className="w-8 h-8 rounded-lg border border-neutral-200/80 bg-neutral-50 flex items-center justify-center text-neutral-700 mb-5">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
                  Intake classification
                </h3>
                <p className="mt-3 text-neutral-500 text-sm leading-relaxed font-normal">
                  Ingest Paystack, direct bank transfers, mobile money, and manual deposit receipts into one unified stream.
                </p>
              </div>

              {/* Tag Rows Visual Mockup */}
              <div className="mt-8 space-y-2 bg-[#fcfbf9] border border-neutral-200/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] bg-white border border-neutral-200/70 rounded-lg p-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">PST</span>
                    <span className="text-neutral-700">Paystack · Student Tuition</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>

                <div className="flex items-center justify-between text-[11px] bg-white border border-neutral-200/70 rounded-lg p-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">TRF</span>
                    <span className="text-neutral-700">Bank Transfer · B2B Invoice</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>

                <div className="flex items-center justify-between text-[11px] bg-white border border-neutral-200/70 rounded-lg p-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">MOM</span>
                    <span className="text-neutral-700">Mobile Money · Vendor Payout</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Policy-aware routing */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white text-neutral-900 rounded-2xl p-7 flex flex-col justify-between min-h-[380px] shadow-sm"
            >
              <div>
                <div className="w-8 h-8 rounded-lg border border-neutral-200/80 bg-neutral-50 flex items-center justify-center text-neutral-700 mb-5">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
                  Rules-based AI matching
                </h3>
                <p className="mt-3 text-neutral-500 text-sm leading-relaxed font-normal">
                  Custom matching logic per organization. Reconciles exact matches, fuzzy references, and multi-line invoices.
                </p>
              </div>

              {/* AI Matching Visual Mockup */}
              <div className="mt-8 space-y-2 bg-[#fcfbf9] border border-neutral-200/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] bg-white border border-neutral-200/70 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-neutral-700 font-medium">INV-0042 · Exact Match</span>
                  </div>
                  <span className="text-emerald-600 font-semibold text-[10px]">VERIFIED</span>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-white border border-neutral-200/70 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-neutral-700 font-medium">INV-0091 · Fuzzy Ref</span>
                  </div>
                  <span className="text-amber-600 font-semibold text-[10px]">PARTIAL</span>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-white border border-neutral-200/70 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-neutral-700 font-medium">INV-0113 · Multi-line</span>
                  </div>
                  <span className="text-blue-600 font-semibold text-[10px]">MATCHED</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Records retention */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white text-neutral-900 rounded-2xl p-7 flex flex-col justify-between min-h-[380px] shadow-sm"
            >
              <div>
                <div className="w-8 h-8 rounded-lg border border-neutral-200/80 bg-neutral-50 flex items-center justify-center text-neutral-700 mb-5">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
                  Statutory audit schedules
                </h3>
                <p className="mt-3 text-neutral-500 text-sm leading-relaxed font-normal">
                  Retention policies applied at transaction creation. Audit exports and financial logs generated automatically.
                </p>
              </div>

              {/* Retention Timeline Visual Mockup */}
              <div className="mt-8 bg-[#fcfbf9] border border-neutral-200/80 rounded-xl p-4">
                <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden flex mb-3">
                  <div className="w-1/3 bg-blue-500 h-full" />
                  <div className="w-1/3 bg-teal-500 h-full" />
                  <div className="w-1/3 bg-neutral-200 h-full" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                  <span>Q1</span>
                  <span>Q2</span>
                  <span>Q3</span>
                  <span>Q4</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-200/60 text-[11px]">
                  <span className="text-neutral-400 font-mono">Ledger FY2026</span>
                  <span className="text-blue-600 font-semibold italic">100% Reconciled</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Row 2: 2 Asymmetric Cards (3 cols + 2 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Card 4: Cross-agency handoffs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-3 bg-white text-neutral-900 rounded-2xl p-7 flex flex-col justify-between min-h-[320px] shadow-sm"
            >
              <div>
                <div className="w-8 h-8 rounded-lg border border-neutral-200/80 bg-neutral-50 flex items-center justify-center text-neutral-700 mb-5">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
                  Cross-departmental handoffs
                </h3>
                <p className="mt-3 text-neutral-500 text-sm leading-relaxed font-normal max-w-lg">
                  Financial state is preserved across accounting, bursar, and executive dashboards without spreadsheet siloing.
                </p>
              </div>

              {/* Bar Chart & Stat Box */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#fcfbf9] border border-neutral-200/80 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                    RECONCILIATION · 7D
                  </span>
                  <div className="flex items-end gap-1.5 h-12 pt-2">
                    <div className="w-full bg-blue-500 rounded-t h-[60%]" />
                    <div className="w-full bg-blue-500 rounded-t h-[80%]" />
                    <div className="w-full bg-blue-500 rounded-t h-[50%]" />
                    <div className="w-full bg-amber-500 rounded-t h-[90%]" />
                    <div className="w-full bg-blue-600 rounded-t h-[100%]" />
                  </div>
                </div>

                <div className="bg-[#fcfbf9] border border-neutral-200/80 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    VERIFIED INVOICES
                  </span>
                  <div>
                    <div className="text-2xl font-bold text-neutral-900">48,290</div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-0.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>99.8% match rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 5: Auditable by default (DARK CARD) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-2 bg-[#050505] text-white border border-neutral-800 rounded-2xl p-7 flex flex-col justify-between min-h-[320px] shadow-md relative overflow-hidden"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-5">
                  <Inbox className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Auditable by default
                </h3>
                <p className="mt-3 text-neutral-300 text-sm leading-relaxed font-normal">
                  <span className="text-white font-medium">Every action is hash-chained.</span> Audit logs provide immutable evidence for finance teams.
                </p>
              </div>

              {/* Hash Chain Log Mockup */}
              <div className="mt-8 space-y-2 bg-[#0d111a] border border-neutral-800/80 rounded-xl p-3.5 text-xs font-mono">
                <div className="flex items-center justify-between text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>0x4a7f..e2c1 · invoice created</span>
                  </div>
                  <span className="text-neutral-500 text-[10px]">V1</span>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>0x9b3d..7f48 · Paystack deposit synced</span>
                  </div>
                  <span className="text-neutral-500 text-[10px]">V2</span>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>0x1e8c..a52f · AI matched & verified</span>
                  </div>
                  <span className="text-neutral-500 text-[10px]">V3</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Row 3: Full Width Card (Connector substrate) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white text-neutral-900 rounded-2xl p-7 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
          >
            <div className="max-w-xl">
              <div className="w-8 h-8 rounded-lg border border-neutral-200/80 bg-neutral-50 flex items-center justify-center text-neutral-700 mb-5">
                <Grid3X3 className="w-4 h-4" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
                Multi-provider connector substrate
              </h3>
              <p className="mt-3 text-neutral-500 text-sm leading-relaxed font-normal">
                Directly connects to Paystack, commercial bank APIs, ERPs, Quickbooks, and custom SQL databases with zero code overhead.
              </p>
            </div>

            {/* Protocol Buttons Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 w-full md:w-auto font-mono text-xs text-center">
              <div className="bg-[#050505] text-blue-400 py-3 px-4 rounded-xl font-bold">SQL</div>
              <div className="bg-[#fcfbf9] border border-neutral-200/80 text-neutral-700 py-3 px-4 rounded-xl">CSV</div>
              <div className="bg-[#fff7ed] text-orange-600 border border-orange-200/60 py-3 px-4 rounded-xl font-medium">REST</div>
              <div className="bg-[#fcfbf9] border border-neutral-200/80 text-neutral-700 py-3 px-4 rounded-xl">SFTP</div>
              <div className="bg-[#050505] text-blue-400 py-3 px-4 rounded-xl font-bold">SOAP</div>
              <div className="bg-[#ecfeff] text-cyan-700 border border-cyan-200/60 py-3 px-4 rounded-xl">XML</div>

              <div className="bg-[#fcfbf9] border border-neutral-200/80 text-neutral-700 py-3 px-4 rounded-xl">JSON</div>
              <div className="bg-[#fefce8] text-amber-700 border border-amber-200/60 py-3 px-4 rounded-xl">EDI</div>
              <div className="bg-[#050505] text-white py-3 px-4 rounded-xl font-bold">LDAP</div>
              <div className="bg-[#f5f3ff] text-purple-700 border border-purple-200/60 py-3 px-4 rounded-xl">SAML</div>
              <div className="bg-[#fcfbf9] border border-neutral-200/80 text-neutral-700 py-3 px-4 rounded-xl">OAuth</div>
              <div className="bg-[#ecfeff] text-cyan-700 border border-cyan-200/60 py-3 px-4 rounded-xl">SMTP</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
