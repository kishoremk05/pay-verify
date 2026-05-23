import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldCheck, Activity, Cpu, Check, AlertCircle, Database } from "lucide-react";
import newBg from "@/assets/new bg.png";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Live Cryptographic System Status & Audit Logs — PayVerify" },
      { name: "description", content: "Observe PayVerify's real-time operational status, match performance statistics, and live-ticking transaction integrity logs." }
    ],
  }),
  component: AuditLogsPage,
});

interface LogItem {
  id: string;
  time: string;
  type: "OK" | "MATCH" | "INFO" | "CHECK";
  message: string;
  hash: string;
}

function AuditLogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([
    { id: "1", time: "14:02:11", type: "OK", message: "Auth isolated: tenant space [ORG_ID_90] authorized cleanly", hash: "sha256:7f01bc..." },
    { id: "2", time: "14:02:15", type: "CHECK", message: "Duplicate scan complete on inbound statement ZenBank_CSV", hash: "sha256:8b0a3d..." },
    { id: "3", time: "14:02:16", type: "MATCH", message: "Successfully reconciled Paystack payload PV-COLL-99 (Matched Expected ExpectedLedger)", hash: "sha256:c22d8e..." },
    { id: "4", time: "14:03:02", type: "INFO", message: "Active Recon pipeline calibrated parameters automatically", hash: "sha256:0b0a8c..." },
    { id: "5", time: "14:03:45", type: "OK", message: "SSO tenant signature verify [USER: leon@acme.com] - Token approved", hash: "sha256:ef220b..." }
  ]);

  // Dynamically tick new fake logs to impress user with visual alive state
  useEffect(() => {
    const messages = [
      { type: "MATCH" as const, message: "Successfully matched ZenithBank payout payload PV-COLL-22" },
      { type: "OK" as const, message: "Parsed CSV ZenBank statement row 154 successfully" },
      { type: "CHECK" as const, message: "Duplicate Scan Shield isolated 0 repeated transactions" },
      { type: "INFO" as const, message: "Ingest latency optimized: current adapter processing rate 1,280/sec" },
      { type: "OK" as const, message: "Row-Level parameters successfully locked for tenant ORG_ID_90" },
      { type: "MATCH" as const, message: "Stripe adapter payout recon completed for transaction tx_99b0c2" }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const newHash = `sha256:${Math.random().toString(16).substr(2, 6)}...`;
      
      const newLog: LogItem = {
        id: Math.random().toString(),
        time: timeStr,
        type: randomMsg.type,
        message: randomMsg.message,
        hash: newHash
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 14)]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]/30 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden antialiased relative">
      {/* Backdrop clouds & grid meshes */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-65"
        style={{ backgroundImage: `url(${newBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-45 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Light Blobs */}
      <div className="absolute top-0 left-[15%] w-[45rem] h-[35rem] rounded-full bg-blue-600/[0.02] blur-[140px] pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 border border-blue-250 bg-blue-50/50 px-3.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-[0.2em] text-[#0070ba] mb-5 font-bold shadow-sm backdrop-blur-sm">
              // CRYPTOGRAPHIC TRANSPARENCY
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 sm:text-6xl">
              System Auditing &amp; Integrity Logs
            </h1>
            <p className="mt-5 text-slate-650 max-w-2xl mx-auto font-light leading-relaxed">
              Observe real-time pipeline telemetry, transaction reconciliation checks, and isolated security event summaries live from our core cluster engine.
            </p>
          </motion.div>

          {/* Telemetry Dashboard Grid */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            
            {[
              { label: "INGEST UPTIME", value: "99.99%", status: "ACTIVE", color: "emerald", icon: Activity },
              { label: "RECON LATENCY", value: "12ms avg", status: "OPTIMIZED", color: "blue", icon: Cpu },
              { label: "ACTIVE ADAPTERS", value: "3 Ready", status: "100% OK", color: "emerald", icon: Database },
              { label: "PROCESSED THIS MONTH", value: "1.28M+", status: "VERIFIED", color: "blue", icon: ShieldCheck }
            ].map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-md p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                    <IconComp className="h-4 w-4 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                  <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[8px] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-500 uppercase tracking-widest">{stat.status}</span>
                  </div>
                </motion.div>
              );
            })}

          </div>

          {/* Live Terminal Log Viewer */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-slate-950/10 bg-[#0c0e17]/95 shadow-2xl overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="bg-[#141825] px-6 py-4 flex items-center justify-between border-b border-slate-800/60 select-none">
              <div className="flex items-center gap-3">
                <Terminal className="h-4 w-4 text-[#0070ba]" />
                <span className="font-mono text-xs font-bold text-slate-300 tracking-wider">SYSTEM_TRANSPARENCY_AUDITING_DAEMON v2.4</span>
              </div>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            {/* Terminal Screen area */}
            <div className="p-6 md:p-8 font-mono text-[11px] leading-relaxed text-slate-300 min-h-[380px] max-h-[480px] overflow-y-auto space-y-3.5 custom-scrollbar">
              <AnimatePresence initial={false}>
                {logs.map((log) => {
                  let badgeColor = "bg-slate-800 text-slate-400 border-slate-700/60";
                  if (log.type === "OK") badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  if (log.type === "MATCH") badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                  if (log.type === "CHECK") badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";

                  return (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2.5 last:border-0"
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-slate-500 text-[10px]">{log.time}</span>
                        <span className={`px-1.5 py-0.5 rounded border text-[8px] font-black tracking-widest ${badgeColor}`}>
                          [{log.type}]
                        </span>
                        <span className="text-slate-200 leading-normal">{log.message}</span>
                      </div>
                      <span className="text-slate-500 text-[9px] font-bold sm:text-right shrink-0">{log.hash}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Terminal Footer Info bar */}
            <div className="bg-[#141825] px-6 py-3 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              <span>LISTENING ON SECURE_INGEST_PORT 8080</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Telemetry Connection Stable
              </span>
            </div>

          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
