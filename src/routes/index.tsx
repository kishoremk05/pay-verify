import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import newBg from "@/assets/new bg.png";
import demoDashboardUi from "@/assets/demo dashboard ui.png";
import {
  ShieldCheck, Zap, Database, Users, BarChart3,
  CheckCircle2, AlertTriangle, Copy, ArrowRight, Upload, Sparkles,
  Menu, X, Lock, TrendingUp, Play, Building2, CreditCard, Headphones, Target,
  Check, RefreshCw, AlertCircle, Terminal, HelpCircle, ArrowUpRight, Shield,
  Search, Sliders, Settings, Activity, FolderGit, LayoutDashboard, DatabaseZap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PayVerify — Premium Payment Verification & Auto-Reconciling" },
      { name: "description", content: "Ultra-fast automated payment matching and mismatch detection built for modern finance teams." },
      { property: "og:title", content: "PayVerify — Premium Payment Verification & Auto-Reconciling" },
      { property: "og:description", content: "Auto-reconcile Paystack, bank statement CSVs, and manual ledgers with hairline precision. Eliminate leaks instantly." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]/30 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden antialiased relative">
      {/* Premium Dreelio-style cloud backdrop backdrop */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-65"
        style={{ backgroundImage: `url(${newBg})` }}
      />
      {/* Architectural Fine Dot Grid and Line Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-45 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Elegant Dark Slate Blobs (Light Black Blob Effect) for depth */}
      <div className="absolute top-[-10%] left-[25%] w-[45rem] h-[25rem] rounded-full bg-slate-950/[0.03] blur-[130px] pointer-events-none z-0 animate-float" />
      <div className="absolute top-[15%] right-[15%] w-[35rem] h-[35rem] rounded-full bg-slate-900/[0.02] blur-[150px] pointer-events-none z-0 animate-float-reverse" />
      
      {/* Premium Royal Blue ambient drop behind Hero */}
      <div className="absolute top-0 left-[10%] w-[50rem] h-[35rem] rounded-full bg-blue-600/[0.02] blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[20%] w-[40rem] h-[40rem] rounded-full bg-indigo-500/[0.01] blur-[160px] pointer-events-none z-0" />

      <Navbar />
      <Hero />
      <LedgerSection />
      <BentoFeatures />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}

/* ---------- Navbar ---------- */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Features", href: "/#features" },
    { label: "Ledger Demo", href: "/#demo" },
    { label: "Workflow", href: "/#how" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-b border-slate-200/50 bg-white/75 backdrop-blur-xl py-3 shadow-sm" 
          : "border-b border-transparent bg-transparent py-5"
      }`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 select-none group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-700 to-[#0070ba] flex items-center justify-center shadow-md relative overflow-hidden">
            <ShieldCheck className="h-5.5 w-5.5 text-white relative z-10" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-black tracking-tight text-slate-900 leading-none">
              PAY<span className="text-[#0070ba]">VERIFY</span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-[#0070ba] uppercase mt-0.5 font-bold">
              RECON.SYSTEM
            </div>
          </div>
        </Link>

        {/* Dynamic sliding pill navigation */}
        <nav 
          className="hidden items-center gap-1 lg:flex bg-slate-200/30 p-1 rounded-full border border-slate-250/10"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {links.map((l, idx) => (
            <a 
              key={l.href} 
              href={l.href} 
              onMouseEnter={() => setHoveredIndex(idx)}
              className="text-xs font-mono tracking-wider uppercase text-slate-500 hover:text-slate-950 transition-colors relative py-1.5 px-4.5 z-10 rounded-full"
            >
              {l.label}
              {hoveredIndex === idx && (
                <motion.span
                  layoutId="navHover"
                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm border border-slate-200/50"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Get Started Button with Sliding Text Animation */}
        <div className="hidden items-center lg:flex">
          <Button 
            variant="default" 
            className="group px-6 h-10 font-mono text-xs bg-gradient-to-r from-blue-600 to-[#0070ba] hover:from-blue-700 hover:to-blue-600 text-white shadow-md border border-blue-500/20 rounded-full relative overflow-hidden"
            asChild
          >
            <Link to="/signup" className="flex items-center justify-center">
              <span className="text-slide-container relative w-full block">
                <span className="text-slide-inner">
                  <span className="text-slide-top">GET STARTED</span>
                  <span className="text-slide-bottom">GET STARTED</span>
                </span>
              </span>
            </Link>
          </Button>
        </div>

        <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            className="border-b border-slate-200 bg-white lg:hidden absolute top-[100%] left-0 w-full shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-1.5 px-4 py-6">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
              <div className="pt-5 border-t border-slate-200 mt-5">
                <Button variant="default" className="w-full font-mono text-xs py-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" asChild onClick={() => setOpen(false)}><Link to="/signup">GET STARTED</Link></Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const cardRotateX = useTransform(scrollYProgress, [0, 0.5], [18, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1.02]);
  const cardY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.15], [0.7, 1]);

  return (
    <section ref={containerRef} className="relative pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20 z-10 overflow-visible flex flex-col items-center">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* System Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="inline-flex items-center gap-2 border border-amber-250 bg-amber-50/50 px-3.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-[0.22em] text-amber-800 mb-6 font-bold shadow-sm backdrop-blur-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600 fill-amber-100 shrink-0" />
            AUTOMATED RECON ENGINE ACTIVE [V2.8.4]
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 25, scale: 0.98, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.05 }}
            className="text-4xl font-black leading-[1.08] tracking-tighter text-slate-900 sm:text-5xl lg:text-[4.2rem] max-w-3xl"
          >
            Verify every payout flow with absolute{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#0070ba]">hairline precision.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.15 }}
            className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed font-light max-w-2xl"
          >
            PayVerify connects your bank statements, cash channels, and payment gateways into a unified automated matching engine. Catch duplicates, flag missing refs, and lock leakages.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <Button size="lg" className="group font-mono text-xs tracking-wider px-6 bg-gradient-to-r from-blue-600 to-[#0070ba] text-white rounded-full hover:opacity-95 shadow-lg shadow-blue-500/10 flex items-center gap-2 transition-all cursor-pointer font-bold h-12 relative overflow-hidden" asChild>
              <Link to="/signup" className="flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 fill-current shrink-0 z-10" />
                <span className="text-slide-container relative w-64 block z-10">
                  <span className="text-slide-inner">
                    <span className="text-slide-top flex items-center justify-center gap-1.5">
                      DEPLOY SYSTEM NOW <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-slide-bottom flex items-center justify-center gap-1.5">
                      DEPLOY SYSTEM NOW <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </span>
              </Link>
            </Button>
            
            <Button size="lg" variant="ghost" className="group font-mono text-xs tracking-wider px-6 border border-slate-200 text-slate-700 hover:text-slate-950 rounded-full hover:border-slate-350 bg-white/70 hover:bg-slate-50 shadow-sm flex items-center gap-2 cursor-pointer font-bold h-12 relative overflow-hidden" asChild>
              <a href="#demo" className="flex items-center justify-center">
                <Play className="h-3.5 w-3.5 fill-blue-600 text-blue-600 shrink-0 z-10" />
                <span className="text-slide-container relative w-32 block z-10">
                  <span className="text-slide-inner">
                    <span className="text-slide-top">RUN SIMULATOR</span>
                    <span className="text-slide-bottom">RUN SIMULATOR</span>
                  </span>
                </span>
              </a>
            </Button>
          </motion.div>

          {/* Safety Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <div className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-450 border border-slate-200/80 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
              <Lock className="h-3 w-3 text-blue-600" /> 100% Secure
            </div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-450 border border-slate-200/80 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
              <ShieldCheck className="h-3 w-3 text-blue-600" /> Bank Grade Security
            </div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-450 border border-slate-200/80 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
              <Zap className="h-3 w-3 text-blue-600" /> Real-time Reconciliation
            </div>
          </motion.div>
        </div>

        {/* 3D Scroll-Driven Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 18, delay: 0.5 }}
          className="mt-16 w-full max-w-5xl mx-auto relative z-10"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            style={{
              rotateX: cardRotateX,
              scale: cardScale,
              y: cardY,
              opacity: cardOpacity,
            }}
            className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md p-2 sm:p-3 shadow-2xl overflow-hidden"
          >
            <img
              src={demoDashboardUi}
              alt="PayVerify Dashboard Interface"
              className="w-full h-auto rounded-xl"
            />
          </motion.div>
        </motion.div>

        {/* 5-Item Trust Stats Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.45 }}
          className="mt-16 w-full max-w-7xl mx-auto border border-slate-200 bg-white/90 rounded-3xl p-6 shadow-md relative z-20 grid grid-cols-2 md:grid-cols-5 gap-6 items-center text-center backdrop-blur-md"
        >
          <motion.div whileHover={{ scale: 1.03 }} className="flex flex-col md:flex-row items-center gap-3 text-left md:border-r border-slate-100 last:border-0 pr-4 cursor-pointer transition-transform">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50 shrink-0">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black text-slate-900">500+</div>
              <div className="text-[10px] text-slate-450 font-medium">Businesses trust PayVerify</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="flex flex-col md:flex-row items-center gap-3 text-left md:border-r border-slate-100 last:border-0 pr-4 cursor-pointer transition-transform">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50 shrink-0">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin-slow" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black text-slate-900">50K+</div>
              <div className="text-[10px] text-slate-450 font-medium">Transactions reconciled daily</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="flex flex-col md:flex-row items-center gap-3 text-left md:border-r border-slate-100 last:border-0 pr-4 cursor-pointer transition-transform">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50 shrink-0">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black text-slate-900">99.9%</div>
              <div className="text-[10px] text-slate-450 font-medium">Accuracy rate you can rely on</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="flex flex-col md:flex-row items-center gap-3 text-left md:border-r border-slate-100 last:border-0 pr-4 cursor-pointer transition-transform">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50 shrink-0">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black text-slate-900">24/7</div>
              <div className="text-[10px] text-slate-450 font-medium">Monitoring always on guard</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="flex flex-col md:flex-row items-center gap-3 text-left cursor-pointer transition-transform">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50 shrink-0">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-black text-slate-900">Actionable Reports</div>
              <div className="text-[10px] text-slate-450 font-medium">Clear insights. Better decisions.</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Infinite Partner Logo Marquee Scroller */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 w-full overflow-hidden relative py-6 border-y border-slate-200/40 bg-white/35 backdrop-blur-sm"
        >
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          
          <div className="animate-ticker flex gap-20 items-center">
            {Array(3).fill([
              { name: "Paystack API", icon: ShieldCheck },
              { name: "Zenith Bank", icon: Database },
              { name: "Flutterwave", icon: Zap },
              { name: "Monnify Inbound", icon: Sparkles },
              { name: "GTBank Ledger", icon: Activity },
              { name: "Interswitch", icon: CreditCard }
            ]).flat().map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 select-none grayscale opacity-45 hover:grayscale-0 hover:opacity-85 transition-all duration-300">
                <p.icon className="h-5 w-5 text-slate-700" />
                <span className="font-sans font-bold text-slate-700 tracking-tight text-xs uppercase">{p.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ---------- Live Dual-Panel Ledger Sandbox ---------- */
function LedgerSection() {
  const [isMatching, setIsMatching] = useState(false);
  const [reconciled, setReconciled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const databaseLedger = [
    { id: "TX-902", ref: "PV-COLL-09", client: "Acme Corp Ltd", amount: "â‚¦4,500,000", status: "PENDING" },
    { id: "TX-903", ref: "PV-COLL-10", client: "Zara & Sons", amount: "â‚¦1,200,000", status: "PENDING" },
    { id: "TX-904", ref: "PV-COLL-11", client: "TechNovus SA", amount: "â‚¦8,500,000", status: "PENDING" },
    { id: "TX-905", ref: "PV-COLL-12", client: "Global-X Inc", amount: "â‚¦3,150,000", status: "PENDING" },
  ];

  const importedBankFeeds = [
    { id: "BK-101", ref: "PV-COLL-09", rawAmount: "â‚¦4,500,000", match: true },
    { id: "BK-102", ref: "PV-COLL-99", rawAmount: "â‚¦1,200,000", match: false },
    { id: "BK-103", ref: "PV-COLL-11", rawAmount: "â‚¦8,500,000", match: true },
    { id: "BK-104", ref: "PV-COLL-12", rawAmount: "â‚¦3,150,000", match: true },
  ];

  const startReconciliation = () => {
    if (isMatching || reconciled) return;
    setIsMatching(true);
    setProgress(0);
    setLogs([]);

    const steps = [
      "Connecting secure bank database pipeline...",
      "Extracting 4 pending invoice references...",
      "Mapping Zenith Bank statement logs against references...",
      "Isolating exact reference match codes...",
      "CRITICAL ALERT: Reference mismatch found in Row 2!",
      "Reconciliation compile completed."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        setProgress(Math.round(((idx + 1) / steps.length) * 100));
        
        if (idx === steps.length - 1) {
          setIsMatching(false);
          setReconciled(true);
        }
      }, (idx + 1) * 600);
    });
  };

  const resetSimulator = () => {
    setIsMatching(false);
    setReconciled(false);
    setProgress(0);
    setLogs([]);
  };

  return (
    <section id="demo" className="py-24 border-t border-slate-200/50 relative z-10 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <div className="inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-3 py-1 rounded-md font-mono text-[9px] tracking-widest text-amber-700 uppercase mb-5 font-bold">
              // INTERACTIVE MATCHING SIMULATION
            </div>
            
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
              Compare expectations against reality in real time.
            </h2>
            <p className="mt-6 text-slate-600 leading-relaxed font-light">
              See exactly how PayVerify pulls transactions from your bank statements or payment API, maps matching transaction codes, and automatically reconciles entries. If a payment doesn't align or contains duplicate variables, it gets isolated immediately.
            </p>

            <div className="mt-8 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-3 text-slate-600">
                <Check className="text-[#0070ba] h-4.5 w-4.5 shrink-0" />
                <span>Auto-checks amount & reference alignments</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Check className="text-[#0070ba] h-4.5 w-4.5 shrink-0" />
                <span>Spots and flags duplicate payout references</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Check className="text-[#0070ba] h-4.5 w-4.5 shrink-0" />
                <span>Maintains isolated ledgers per sub-organization</span>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              {!reconciled && !isMatching ? (
                <Button 
                  onClick={startReconciliation} 
                  className="font-mono text-xs px-6 py-5 bg-[#ffc439] hover:bg-[#f2b522] text-[#003087] font-bold tracking-wider rounded-lg active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  START LEDGER MATCH ENGINE
                </Button>
              ) : (
                <Button 
                  onClick={resetSimulator} 
                  disabled={isMatching}
                  variant="outline" 
                  className="font-mono text-xs px-6 py-5 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg active:scale-95 transition-all bg-white hover:bg-slate-50 cursor-pointer"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> RESET SIMULATION
                </Button>
              )}
            </div>
          </motion.div>

          {/* Dynamic Dual Panel Screen - Clean Slate theme */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 shadow-xl relative overflow-hidden cursor-pointer"
          >
            {/* Visual Header Wireframe */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span>TERMINAL_RECON: LOCAL_PORT_8080</span>
              </div>
              <div className="flex gap-2">
                <span>PROGRESS:</span>
                <span className="text-[#0070ba] font-bold">{progress}%</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              {/* Database Panel */}
              <div className="border border-slate-200 bg-white rounded-xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <span className="font-mono text-[9px] tracking-wider text-slate-400 uppercase">// INTERNAL DATABASE</span>
                  <span className="text-[9px] font-mono text-[#0070ba] font-bold">EXPECTED</span>
                </div>
                
                <div className="space-y-2">
                  {databaseLedger.map((row, idx) => (
                    <div 
                      key={row.id} 
                      className={`p-2 rounded-lg border text-[11px] font-mono transition-all duration-300 ${
                        reconciled 
                          ? idx === 1 
                            ? "border-amber-205 bg-amber-50 text-amber-800 animate-pulse"
                            : "border-emerald-250 bg-emerald-50 text-emerald-800"
                          : "border-slate-150 bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{row.client}</span>
                        <span>{row.amount}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                        <span>{row.ref}</span>
                        <span className={`font-bold ${
                          reconciled 
                            ? idx === 1 ? "text-amber-600 font-extrabold" : "text-emerald-600"
                            : "text-slate-400"
                        }`}>
                          {reconciled ? idx === 1 ? "MISMATCH" : "VERIFIED" : row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Imported Bank Panel */}
              <div className="border border-slate-200 bg-white rounded-xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <span className="font-mono text-[9px] tracking-wider text-slate-400 uppercase">// BANK CSV FEED</span>
                  <span className="text-[9px] font-mono text-amber-600 font-bold">RAW PAYMENTS</span>
                </div>
                
                <div className="space-y-2">
                  {importedBankFeeds.map((feed, idx) => (
                    <div 
                      key={feed.id} 
                      className={`p-2 rounded-lg border text-[11px] font-mono transition-all duration-300 ${
                        reconciled 
                          ? feed.match 
                            ? "border-emerald-250 bg-emerald-50 text-emerald-850"
                            : "border-rose-205 bg-rose-50 text-rose-800 animate-pulse"
                          : "border-slate-150 bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>Import: {feed.id}</span>
                        <span>{feed.rawAmount}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                        <span>REF: {feed.ref}</span>
                        <span className={`font-bold ${
                          reconciled 
                            ? feed.match ? "text-emerald-600" : "text-rose-600 font-extrabold"
                            : "text-slate-400"
                        }`}>
                          {reconciled ? feed.match ? "MATCHED" : "UNRESOLVED" : "RAW"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Dark Console Log - Dark widget adds premium developer feel */}
            <div className="mt-4 border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-[9px] text-slate-400 font-bold">// EXECUTION CONSOLE</span>
                {isMatching && <span className="h-1.5 w-1.5 rounded-full bg-[#0070ba] animate-ping" />}
              </div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 h-28 font-mono text-[10px] text-slate-350 space-y-1 overflow-y-auto scrollbar-none shadow-inner">
                {logs.length === 0 ? (
                  <span className="text-slate-500 block italic">// Click "Start Ledger Match Engine" to monitor diagnostic streams...</span>
                ) : (
                  logs.map((log, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-start gap-1.5 ${
                        log.startsWith("CRITICAL") 
                          ? "text-rose-400 font-bold" 
                          : log.startsWith("Reconciliation")
                            ? "text-emerald-400 font-bold"
                            : "text-slate-350"
                      }`}
                    >
                      <span>{log.startsWith("CRITICAL") ? "!" : "Â»"}</span>
                      <span>{log}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Bento Grid Features ---------- */
function BentoFeatures() {
  return (
    <section id="features" className="py-24 border-t border-slate-200/50 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-blue-250 bg-blue-50/50 px-3.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-[0.2em] text-[#0070ba] mb-5 font-bold shadow-sm backdrop-blur-sm">
            // PRODUCT CORE INFRASTRUCTURE
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-5xl">
            Clean, structured, absolute ledger defense.
          </h2>
          <p className="mt-5 text-slate-600 font-light leading-relaxed">
            Every pipeline tool is integrated to work seamlessly with row-level transaction structures. No artificial layers—just raw fintech reliability.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Bento 1: Large Engine Column - Beautiful Royal Blue highlighted card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 85, damping: 18 }}
            whileHover={{ y: -6, scale: 1.005, transition: { type: "spring", stiffness: 200, damping: 15 } }}
            className="md:col-span-2 rounded-3xl border border-transparent bg-gradient-to-br from-blue-700 to-[#0070ba] p-8 flex flex-col justify-between overflow-hidden relative group text-white shadow-xl cursor-pointer"
          >
            <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="max-w-xl">
              <span className="font-mono text-[9px] text-blue-200 uppercase tracking-widest block font-bold mb-2">// 01. ACTIVE RECON ENGINE</span>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Precise Automated matching pipeline</h3>
              <p className="mt-3 text-sm text-blue-100 leading-relaxed font-light">
                Our reconciliation algorithms map inbound cash register feeds, payment processor APIs, and banking CSV spreadsheets instantly. If an entry aligns, its status scales dynamically.
              </p>
            </div>

            {/* Visual Vector Node Mockup inside blue card */}
            <div className="mt-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 aspect-[2.5/1] relative overflow-hidden flex items-center justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.8px,transparent_0.8px)] [background-size:16px_16px] opacity-10" />
              
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 relative z-10 backdrop-blur-md shadow-sm">
                <div className="h-2 w-2 rounded-full bg-blue-300 animate-pulse" />
                <span className="font-mono text-[10px] tracking-wider uppercase text-blue-100">Inbound Feed</span>
              </div>
              
              <div className="flex-1 px-4 relative flex items-center justify-center">
                <svg className="w-full h-8" viewBox="0 0 100 20">
                  <path d="M 0 10 L 100 10" className="stroke-white/20 stroke-[1.5]" />
                  <path d="M 0 10 L 100 10" className="stroke-blue-200 stroke-[1.5]" strokeDasharray="8 6" strokeDashoffset="0">
                    <animate attributeName="stroke-dashoffset" values="100;0" dur="4s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>

              <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-400/20 relative z-10 backdrop-blur-md shadow-sm">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 relative">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
                <span className="font-mono text-[10px] tracking-wider uppercase text-emerald-300">Reconciled</span>
              </div>
            </div>
          </motion.div>

          {/* Bento 2: Mini Block Multi-Source */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 85, damping: 18, delay: 0.05 }}
            whileHover={{ y: -6, scale: 1.01, transition: { type: "spring", stiffness: 200, damping: 15 } }}
            className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 flex flex-col justify-between overflow-hidden relative shadow-md hover:shadow-xl cursor-pointer hover:border-blue-500/20 transition-all duration-300"
          >
            <div>
              <span className="font-mono text-[9px] text-[#0070ba] uppercase tracking-widest block font-bold mb-2">// 02. PLATFORM ADAPTERS</span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Flexible sources</h3>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed font-light">
                Connect API payout streams directly or upload raw ZenBank statements and Cash register logs with identical matching outputs.
              </p>
            </div>

            <div className="mt-6 space-y-2.5 font-mono text-[10px]">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-slate-100 text-slate-700 shadow-sm relative overflow-hidden group/item">
                <span className="font-bold flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-blue-500 shrink-0" /> PAYSTACK API</span>
                <span className="text-[#0070ba] font-black text-[9px] tracking-widest flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                  <span className="h-1 w-1 rounded-full bg-blue-500" /> ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-slate-100 text-slate-700 shadow-sm relative overflow-hidden group/item">
                <span className="font-bold flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> RAW CSV INGEST</span>
                <span className="text-emerald-700 font-black text-[9px] tracking-widest flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" /> READY
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-slate-150/50 text-slate-400 shadow-sm relative overflow-hidden group/item">
                <span className="flex items-center gap-1.5"><Sliders className="h-3.5 w-3.5 text-slate-400 shrink-0" /> PETTY CASH SHEET</span>
                <span className="text-slate-400 font-bold text-[9px] tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">STANDBY</span>
              </div>
            </div>
          </motion.div>

          {/* Bento 3: Mini Block Duplicate scan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 85, damping: 18, delay: 0.1 }}
            whileHover={{ y: -6, scale: 1.01, transition: { type: "spring", stiffness: 200, damping: 15 } }}
            className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 flex flex-col justify-between overflow-hidden relative shadow-md hover:shadow-xl cursor-pointer hover:border-rose-500/20 transition-all duration-300"
          >
            <div>
              <span className="font-mono text-[9px] text-rose-600 uppercase tracking-widest block font-bold mb-2">// 03. FRAUD & ANOMALY</span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Duplicate scan shield</h3>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed font-light">
                Isolate identical bank IDs and repeated payload references instantly before reports compile. Secure your ledger margins from leakages.
              </p>
            </div>

            <div className="mt-6 border border-rose-100 bg-rose-50/50 rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden shadow-sm">
              <div className="absolute right-[-10px] top-[-10px] opacity-15">
                <AlertCircle className="h-16 w-16 text-rose-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 text-rose-700 font-mono text-[10px] font-bold mb-1.5 relative z-10">
                <span className="h-2 w-2 rounded-full bg-rose-500 relative shrink-0">
                  <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
                </span>
                <span>DUPLICATE DETECTED</span>
              </div>
              <span className="font-mono text-[9px] text-rose-600 font-medium relative z-10">// REF: PV-COLL-99 (2 MATCHES)</span>
            </div>
          </motion.div>

          {/* Bento 4: Large Ledger Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 85, damping: 18, delay: 0.15 }}
            whileHover={{ y: -6, scale: 1.005, transition: { type: "spring", stiffness: 200, damping: 15 } }}
            className="md:col-span-2 rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-8 flex flex-col justify-between overflow-hidden relative group shadow-md hover:shadow-xl cursor-pointer hover:border-emerald-500/20 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="max-w-xl">
              <span className="font-mono text-[9px] text-emerald-600 uppercase tracking-widest block font-bold mb-2">// 04. MULTI-TENANT ISOLATION</span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">Secure &amp; Isolated Client Management</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-light">
                Manage distinct company accounts with rigid row-level access parameters. Customer profiles, expected payments ledger, and analytical dashboards remain strictly encapsulated.
              </p>
            </div>

            {/* Micro visual audit log */}
            <div className="mt-8 border border-slate-200/50 bg-white/80 rounded-2xl p-5 font-mono text-[10px] space-y-2.5 shadow-inner">
              <div className="text-slate-450 flex justify-between border-b border-slate-100 pb-2">
                <span>[AUDIT_LOG V2.4] USER ACCESS LOG</span>
                <span>TIME: NOW</span>
              </div>
              <div className="text-emerald-650 flex items-center gap-2">
                <span className="font-black bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[8px]">[OK]</span>
                <span>Auth initialized: tenant space [ORG_ID_90] verified</span>
              </div>
              <div className="text-slate-650 flex items-center gap-2">
                <span className="font-black bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[8px]">[OK]</span>
                <span>Row Level Security: isolated 24 database logs cleanly</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
function HowItWorks() {
  const steps = [
    { n: 1, label: "01. INGEST", title: "Add expectations", desc: "List client names, billing rates, and expected transaction references in your database." },
    { n: 2, label: "02. CONNECT", title: "Ingest actual inputs", desc: "Drop zenith statements, paystack exports, or link raw gateways directly." },
    { n: 3, label: "03. RECON", title: "Diagnostics scan", desc: "Our engine maps details, tracks amount parameters, and logs matches." },
    { n: 4, label: "04. AUDIT", title: "Isolate discrepancies", desc: "Verify ledger logs, isolate underpayments, and export compiled assets." },
  ];

  return (
    <section id="how" className="py-24 relative z-10 border-t border-slate-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-1 rounded-md font-mono text-[9px] tracking-widest text-[#0070ba] uppercase mb-5 font-bold">
            // SIMPLE WORKFLOW ENGINE
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">Systematic 4-step pipeline</h2>
          <p className="mt-4 text-slate-600 font-light">
            We isolate manual checks to a single streamlined visual system.
          </p>
        </div>

        {/* Crisp grid layout separated by thin line borders */}
        <div className="grid gap-0 md:grid-cols-4 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          {steps.map((s, idx) => (
            <div 
              key={s.n} 
              className={`p-8 flex flex-col justify-between min-h-[220px] transition-colors duration-300 hover:bg-slate-50/50 ${
                idx < steps.length - 1 ? "border-b md:border-b-0 md:border-r border-slate-200" : ""
              }`}
            >
              <div>
                <span className="font-mono text-[10px] text-blue-600 font-bold block mb-4">{s.label}</span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{s.title}</h3>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed font-light">{s.desc}</p>
              </div>
              <span className="font-mono text-[22px] font-black text-slate-200 leading-none mt-6 block select-none">
                0{s.n}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const tiers = [
    { 
      name: "Starter Bundle", 
      price: "Free", 
      desc: "Perfect to test matching verification parameters.", 
      features: ["50 invoice clients", "General CSV ledger files check", "Manual diagnostic updates", "General email responses"], 
      cta: "ACTIVATE BUNDLE", 
      featured: false 
    },
    { 
      name: "Growth Engine", 
      price: billingPeriod === "monthly" ? "â‚¦15,000" : "â‚¦12,000", 
      suffix: "/mo", 
      desc: "For growing teams seeking high transaction coverage.", 
      features: ["Unlimited invoice customers", "Automated duplicate shield logs", "High-fidelity analytics exports", "Priority technical help SLA", "Multi-tenant company divisions"], 
      cta: "DEPLOY ENGINE", 
      featured: true 
    },
    { 
      name: "Enterprise System", 
      price: "Custom", 
      desc: "Bespoke database nodes and support integrations.", 
      features: ["Direct custom database integrations", "Bespoke ledger adapters", "Individual account managers", "24/7 dedicated telephone support"], 
      cta: "TALK TO SALES", 
      featured: false 
    },
  ];

  return (
    <section id="pricing" className="py-24 border-t border-slate-200/50 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-1 rounded-md font-mono text-[9px] tracking-widest text-[#0070ba] uppercase mb-5 font-bold">
            // SIMPLE TRANSPARENT PRICING
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">Predictable architectural pricing</h2>
          <p className="mt-4 text-slate-600 font-light">Deploy free, scale as transaction volumes expand.</p>

          {/* Toggle Switch */}
          <div className="mt-8 flex justify-center">
            <div className="bg-slate-100 border border-slate-200 p-1 rounded-lg relative flex shadow-inner">
              <button 
                onClick={() => setBillingPeriod("monthly")}
                className={`py-2 px-5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase transition-all relative z-10 cursor-pointer ${
                  billingPeriod === "monthly" ? "text-slate-900" : "text-slate-400"
                }`}
              >
                MONTHLY
              </button>
              <button 
                onClick={() => setBillingPeriod("yearly")}
                className={`py-2 px-5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase transition-all relative z-10 cursor-pointer ${
                  billingPeriod === "yearly" ? "text-slate-900" : "text-slate-400"
                }`}
              >
                YEARLY (20% OFF)
              </button>
              
              <motion.div 
                className="absolute top-1 bottom-1 bg-white border border-slate-250 rounded-md shadow"
                layout
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                style={{
                  left: billingPeriod === "monthly" ? 4 : "50%",
                  width: "calc(50% - 6px)"
                }}
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards - Premium White grids and custom blue accents */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3 items-stretch">
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 85, damping: 20 }}
              whileHover={{ y: -6, scale: 1.01, transition: { type: "spring", stiffness: 200, damping: 15 } }}
              className={`rounded-2xl border p-8 flex flex-col justify-between bg-white relative cursor-pointer ${
                t.featured 
                  ? "border-transparent radial-popular-glow shadow-xl" 
                  : "border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded px-3 py-0.5 text-[9px] font-mono font-black uppercase tracking-widest text-[#003087] bg-amber-400 z-20">
                  RECOMMENDED
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-[#0070ba] font-mono uppercase tracking-wider">{t.name}</h3>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.price}</span>
                  {t.suffix && <span className="text-xs font-mono text-slate-500">{t.suffix}</span>}
                </div>
                {billingPeriod === "yearly" && t.featured && (
                  <div className="text-[10px] font-mono text-emerald-600 mt-1 font-bold">Billed yearly (Save â‚¦36,000 / yr)</div>
                )}
                <p className="mt-3.5 text-xs text-slate-600 leading-relaxed font-light">{t.desc}</p>
                
                <ul className="mt-8 space-y-3.5 border-t border-slate-100 pt-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs">
                      <div className="h-4.5 w-4.5 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-slate-600 font-light">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button 
                  className={`w-full py-5 font-mono text-xs font-bold tracking-wider rounded-lg cursor-pointer transition-all ${
                    t.featured 
                      ? "bg-gradient-to-r from-blue-600 to-[#0070ba] text-white" 
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`} 
                  variant={t.featured ? "default" : "outline"}
                >
                  {t.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const faqs = [
    { q: "What format statements can the matching engine ingest?", a: "PayVerify supports standard Paystack dashboard payouts CSV statements, Nigerian banking API statements (Zenith, Access, GTB CSV sheets), and custom spreadsheets. Enterprise accounts support customized schemas." },
    { q: "How is transaction duplication handled?", a: "The algorithms check raw banking IDs, payload variables, expected references, and financial numbers simultaneously. Any duplicated parameter triggers an instant mismatch flag." },
    { q: "Is tenant client ledger space strictly isolated?", a: "Yes. System designs apply isolated scoping bounds per administrative organization, fully compliant with row-level Supabase security features." },
    { q: "Can we invite additional accountants and financial leads?", a: "Administrative user configuration is built directly inside the dashboard workspace environment for Growth and Enterprise profile accounts." },
    { q: "What setup support is available for custom bank formats?", a: "Enterprise integrations support custom ledger mapping structures, direct pipeline assistance, and personal Slack help." },
  ];

  return (
    <section id="faq" className="py-24 relative z-10 border-t border-slate-200/50 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] items-start">
          
          <div>
            <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-1 rounded-md font-mono text-[9px] tracking-widest text-[#0070ba] uppercase mb-5 font-bold">
              // FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
              Common diagnostic queries
            </h2>
            <p className="mt-4 text-slate-600 font-light leading-relaxed">
              Frequently requested operational details about PayVerify's ledger checking parameters, bank format supports, and security parameters.
            </p>
          </div>

          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-slate-200/60 py-1">
                  <AccordionTrigger className="text-left text-sm font-bold text-slate-800 hover:no-underline hover:text-blue-600 py-4 transition-colors font-mono tracking-tight">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-500 leading-relaxed pb-4 font-light">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTASection() {
  return (
    <section className="py-24 relative z-10 border-t border-slate-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-16 shadow-xl">
          
          {/* Subtle interior blue lighting glows */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full blur-[100px] opacity-10 bg-blue-500/20" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full blur-[100px] opacity-5 bg-amber-500/10" />
          
          <h2 className="relative text-3xl font-black tracking-tighter text-slate-900 sm:text-5xl max-w-2xl mx-auto">
            Ready to secure your payment reconciliation?
          </h2>
          <p className="relative mx-auto mt-6 max-w-lg text-sm text-slate-650 font-light leading-relaxed">
            Deploy PayVerify diagnostic pipeline tools instantly and experience absolute automated verification security.
          </p>
          
          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="font-mono text-xs tracking-wider px-8 py-6 bg-gradient-to-r from-blue-600 to-[#0070ba] text-white font-bold rounded-lg shadow-md hover:bg-blue-700" asChild>
              <Link to="/signup">DEPLOY SYSTEM FREE</Link>
            </Button>
            <Button size="lg" variant="ghost" className="font-mono text-xs tracking-wider px-8 py-6 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg hover:border-slate-300 bg-slate-50/50 backdrop-blur-sm">
              SCHEDULE CONSULT
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="relative z-10 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200/50 bg-[#eef5fc]/60 backdrop-blur-xl p-8 md:p-12 shadow-xl">
        <div className="grid gap-12 md:grid-cols-4 items-start">
          
          {/* Logo and Tagline Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 select-none group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-700 to-[#0070ba] flex items-center justify-center shadow-md relative overflow-hidden">
                <ShieldCheck className="h-4.5 w-4.5 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-base font-black text-slate-900 leading-none tracking-tight">
                PAY<span className="text-[#0070ba]">VERIFY</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-650 font-light max-w-sm">
              Your favourite automated payment verification software. Built for modern finance teams and high-growth fintech operations.
            </p>
            
            {/* Dark Social Pill Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a 
                href="#" 
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full bg-[#0c0e16] hover:bg-[#0070ba] text-white flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-105"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="Twitter X"
                className="h-9 w-9 rounded-full bg-[#0c0e16] hover:bg-[#0070ba] text-white flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-105"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Navigation Column 1 */}
          <div>
            <h4 className="text-xs font-black text-slate-900 font-mono uppercase tracking-wider">// PAGES</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-650">
              {[
                { label: "Features", href: "/#features" },
                { label: "Ledger Demo", href: "/#demo" },
                { label: "Workflow", href: "/#how" },
                { label: "Pricing", href: "/#pricing" },
                { label: "FAQ", href: "/#faq" }
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Navigation Column 2 */}
          <div>
            <h4 className="text-xs font-black text-slate-900 font-mono uppercase tracking-wider">// INFORMATION</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-650">
              {[
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of use", href: "/terms" },
                { label: "Audit Logs", href: "/audit-logs" }
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
        
        {/* Footer Bottom Row */}
        <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} PayVerify. Created by <span className="font-semibold text-slate-800">Leon Chike</span></p>
          <div className="flex items-center gap-4 font-mono text-[10px] tracking-wide">
            <span>SECURE.DB_ENCRYPTED</span>
            <span>•</span>
            <span className="text-slate-600 font-bold flex items-center gap-1 border border-slate-250 bg-white/70 px-2 py-0.5 rounded shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ACTIVE: 100% OK
            </span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
