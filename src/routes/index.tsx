import { createFileRoute, Link } from "@tanstack/react-router";
import demoDashboard from "../assets/demo dashboard ui.png";
import demoApp from "../assets/image.png";
import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Zap,
  Database,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Menu,
  X,
  Lock,
  Play,
  Building2,
  CreditCard,
  Check,
  RefreshCw,
  Send,
  ChevronDown,
  Twitter,
  Youtube
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PayVerify — Automated Payment Reconciliation Platform" },
      { name: "description", content: "Verify every payout flow with absolute hairline precision. Connect bank statements, cash channels, and payment gateways into one unified automated matching engine." },
      { property: "og:title", content: "PayVerify — Automated Payment Reconciliation Platform" },
      { property: "og:description", content: "Verify every payout flow with absolute hairline precision. Eliminate leaks instantly." },
    ],
  }),
  component: LandingPage,
});

// Custom AnimatedText component splitting text into individual words
// Each word animates with fadeUp, staggered delay of 0.1s, triggered on viewport entry via IntersectionObserver
function AnimatedText({
  text,
  className = "",
  delayOffset = 0
}: {
  text: string;
  className?: string;
  delayOffset?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const words = text.split(" ");

  const hasJustify = className.includes("justify-");
  const justifyClass = hasJustify ? "" : "justify-center";

  return (
    <span ref={elementRef} className={`inline-flex flex-wrap w-full ${justifyClass} ${className}`}>
      {words.map((word, idx) => (
        <span
          key={idx}
          className="inline-block mr-[0.25em] opacity-0"
          style={{
            animationName: isVisible ? "fadeUp" : "none",
            animationDuration: isVisible ? "0.6s" : "0s",
            animationTimingFunction: isVisible ? "ease-out" : "ease",
            animationFillMode: isVisible ? "forwards" : "none",
            animationDelay: isVisible ? `${(idx * 0.08) + delayOffset}s` : "0s",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a2221] text-white font-sans overflow-x-hidden antialiased pt-[72px]">
      <Navbar />
      <Hero />
      <VideoShowcase />
      <Features />
      <Workflow />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}

/* ---------- SECTION 1 — NAVIGATION BAR ---------- */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-100 h-[72px] flex items-center px-6 sm:px-12 lg:px-20 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col select-none">
          <span className="text-2xl font-semibold text-slate-900 tracking-tight leading-none font-display">
            PAYVERIFY
          </span>
          <span className="text-[9px] tracking-[0.2em] text-slate-500 font-semibold font-mono mt-0.5 uppercase">
            RECON.SYSTEM
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "FEATURES", href: "#features" },
            { label: "LEDGER DEMO", href: "#demo" },
            { label: "WORKFLOW", href: "#workflow" },
            { label: "PRICING", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[11px] font-bold tracking-widest text-slate-600 hover:text-slate-900 transition-colors uppercase"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/login"
            className="text-[11px] font-bold tracking-widest text-slate-600 hover:text-slate-900 transition-colors uppercase"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold tracking-widest px-5 py-2.5 rounded-lg transition-colors uppercase"
          >
            GET STARTED
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-slate-700 hover:text-slate-900"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-slate-150 shadow-lg px-6 py-8 flex flex-col gap-6 md:hidden z-50">
          <nav className="flex flex-col gap-4">
            {[
              { label: "FEATURES", href: "#features" },
              { label: "LEDGER DEMO", href: "#demo" },
              { label: "WORKFLOW", href: "#workflow" },
              { label: "PRICING", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold tracking-widest text-slate-600 hover:text-slate-900 uppercase"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="h-[1px] bg-slate-100" />
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold tracking-widest text-slate-600 text-center uppercase py-2"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold tracking-widest text-center py-3 rounded-lg uppercase"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- SECTION 2 — HERO ---------- */
function Hero() {
  return (
    <section id="demo" className="relative min-h-[calc(100vh-72px)] flex items-center bg-[#0d1614] overflow-hidden">
      {/* ── Clean dark gradient background (no video) ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1612] via-[#0d1614] to-[#101e1a]" />
      {/* Subtle emerald radial glow top-left */}
      <div className="absolute top-0 left-0 w-[700px] h-[500px] bg-emerald-950/60 blur-[130px] rounded-full pointer-events-none" />
      {/* Teal glow bottom-right */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-teal-950/40 blur-[100px] rounded-full pointer-events-none" />
      {/* Bottom fade into video section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0f0e] to-transparent pointer-events-none" />

      {/* ── Main content: LEFT = dashboard image card, RIGHT = copy ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* LEFT: Showcase (Status Badge, Card, Stats below) */}
        <div className="flex flex-col items-center lg:items-start order-2 lg:order-1 gap-6 w-full lg:-translate-y-4">
          {/* Status badge moved here */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm self-start">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-300 tracking-widest uppercase">Live Reconciliation Engine</span>
          </div>

          {/* Screenshot card container */}
          <div className="relative w-full max-w-[540px]">
            {/* Outer ambient glow */}
            <div className="absolute inset-[-16px] rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-2xl pointer-events-none" />

            {/* Screenshot card */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.75)] group">
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />

              <img
                src={demoDashboard}
                alt="PayVerify Dashboard — Payment Reconciliation Overview"
                className="w-full h-auto object-cover object-top block group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                draggable={false}
                suppressHydrationWarning={true}
              />

              {/* Bottom gradient on image */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>

            {/* Floating metric chip — bottom right of card */}
            <div className="absolute -bottom-4 -right-4 lg:right-[-16px] bg-[#2B3534]/95 backdrop-blur-md border border-white/10 rounded-xl px-5 py-4 shadow-2xl z-20 flex flex-col items-start gap-1">
              <span className="text-xl sm:text-2xl font-display font-bold text-white leading-none">73.8%</span>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-0.5">Collection Rate</span>
              <span className="text-[10px] text-emerald-400 font-mono mt-0.5">↑ 8.4% vs last month</span>
            </div>
          </div>

          {/* Stats row moved here */}
          <div className="flex items-center gap-6 border-t border-white/10 pt-6 w-full max-w-[540px] mt-2">
            {[
              { value: "99.7%", label: "Match Accuracy" },
              { value: "2.8M+", label: "Txns Reconciled" },
              { value: "<0.1s", label: "Latency" },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col ${i > 0 ? "border-l border-white/10 pl-6" : ""}`}>
                <span className="text-xl sm:text-2xl font-display font-bold text-white leading-none">{stat.value}</span>
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Trust indicators moved here */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>SOC2 Type II</span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Compact headline + CTAs */}
        <div className="flex flex-col items-start text-left order-1 lg:order-2">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-display font-bold text-white leading-[1.05] mb-5">
            <AnimatedText text="Verify every payout with hairline precision." className="justify-start" />
          </h1>

          {/* Sub-copy */}
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-md mb-8">
            <AnimatedText
              text="Connect bank statements, cash channels, and payment gateways into one automated matching engine. Zero manual work."
              delayOffset={0.7}
              className="justify-start"
            />
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/signup"
              className="group flex items-center gap-2 bg-white text-slate-900 hover:bg-gray-100 font-bold text-sm tracking-wide px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-black/20"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 border border-white/20 hover:border-white/35 text-white/90 hover:text-white font-semibold text-sm tracking-wide px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/5"
            >
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ---------- SECTION 2.5 — VIDEO SHOWCASE ---------- */
function VideoShowcase() {
  return (
    <section className="relative w-full bg-[#0a0f0e] overflow-hidden">

      {/* Label row */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-14 pb-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-emerald-500/60" />
          <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-[0.25em] uppercase">Platform Demo</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">Live App Preview</span>
        </div>
      </div>

      {/* Browser chrome frame + screenshot */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]">
          {/* Browser titlebar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#111b18] border-b border-white/8">
            <span className="h-3 w-3 rounded-full bg-rose-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-2 bg-white/5 rounded-md px-3 py-1 max-w-[280px]">
                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="text-[11px] font-mono text-gray-400 truncate">app.payverify.io/dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          {/* App screenshot — fully visible, no dark overlay */}
          <div className="relative overflow-hidden">
            <img
              src={demoApp}
              alt="PayVerify App — Financial Ledger Dashboard"
              className="w-full h-auto block object-cover object-top"
              draggable={false}
              suppressHydrationWarning={true}
            />
            {/* Subtle edge vignette only */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.25)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats row — below the card */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-10 pb-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-white/8 rounded-2xl overflow-hidden">
          {[
            { value: "99.7%", label: "Match Accuracy", sub: "Across all payment channels", color: "text-emerald-400" },
            { value: "2.8M+", label: "Txns Reconciled", sub: "Processed this quarter", color: "text-sky-400" },
            { value: "<0.1s", label: "Match Latency", sub: "Real-time processing", color: "text-amber-400" },
            { value: "100%", label: "Audit Ready", sub: "SOC2 Type II certified", color: "text-violet-400" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1.5 px-6 py-5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors ${
                i > 0 ? "border-l border-white/8" : ""
              } ${i >= 2 ? "border-t border-white/8 sm:border-t-0" : ""}`}
            >
              <span className={`text-2xl sm:text-3xl font-display font-bold leading-none ${stat.color}`}>{stat.value}</span>
              <span className="text-white text-[13px] font-semibold mt-0.5">{stat.label}</span>
              <span className="text-gray-500 text-[11px] font-mono leading-snug">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom connector — fade into Features (#2B3534) */}
      <div className="h-20 bg-gradient-to-b from-[#0a0f0e] to-[#2B3534] mt-10" />
    </section>
  );
}

/* ---------- SECTION 3 — FEATURES ---------- */
function Features() {
  return (
    <section id="features" className="relative bg-[#2B3534] py-24 px-6 sm:px-12 lg:px-20 overflow-hidden z-10">
      {/* Atmospheric Accent Overlay: Faint Cool Blue Tint */}
      <div className="absolute inset-0 bg-[rgba(30,50,80,0.18)] pointer-events-none z-0" />

      {/* Content wrapper with correct z-index layering */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header Intro Row */}
        <div className="grid md:grid-cols-2 gap-8 items-end border-b border-white/10 pb-10">
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-emerald-400 font-bold uppercase">// PRODUCT CORE INFRASTRUCTURE</span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight mt-3">
              <AnimatedText text="Clean, structured, absolute ledger defense." className="justify-start text-left" />
            </h2>
          </div>
          <div className="md:text-right md:ml-auto max-w-sm">
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              <AnimatedText text="Every pipeline tool is integrated to work seamlessly with raw-level transaction structures. No artificial layers — just raw fintech reliability." className="justify-start md:justify-end text-left md:text-right" />
            </p>
          </div>
        </div>

        {/* 2x2 Card Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Precise Automated matching pipeline */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-white/15 transition-colors duration-300">
            <div>
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">// ML PATTERN ENGINE</span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight mt-2">
                Precise Automated matching pipeline
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mt-2.5">
                Our reconciliation algorithms map inbound cash register feeds, payment processor APIs, and banking CSV spreadsheets instantly. If an entry aligns, its status scales dynamically.
              </p>
            </div>

            {/* Terminal mock panel */}
            <div className="mt-6 bg-[#1a2221] border border-white/5 rounded-xl p-4 font-mono text-[10px] text-gray-300 shadow-inner">
              <div className="flex justify-between items-center text-gray-500 text-[8px] uppercase tracking-wider mb-2.5 pb-1 border-b border-white/5">
                <span>INBOUND_PIPE_FEED v2.0</span>
                <span>STATUS: RUNNING</span>
              </div>
              <div className="space-y-1.5 text-gray-400">
                <div className="flex justify-between">
                  <span>[MATCH] ID: PV-902-A</span>
                  <span className="text-emerald-400">ZENITH ₦4.5M</span>
                </div>
                <div className="flex justify-between">
                  <span>[MATCH] ID: PV-902-B</span>
                  <span className="text-emerald-400">STRIPE $12.3K</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1 text-[9px]">
                  <span className="text-amber-400 font-bold border border-amber-400/30 rounded px-1.5 py-0.5">
                    THRESHOLD: FITTED
                  </span>
                  <span className="text-emerald-400 font-bold border border-emerald-400/30 rounded px-1.5 py-0.5">
                    RECONCILED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Flexible sources */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-white/15 transition-colors duration-300">
            <div>
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">// ML PLATFORM ADDITIONS</span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight mt-2">
                Flexible sources
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mt-2.5">
                Connect API payout streams directly or upload raw statements and cash register logs with identical matching outputs.
              </p>
            </div>

            {/* Source items */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between bg-[#1a2221] border border-white/5 rounded-xl p-3 font-mono text-xs">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  PAYSTACK API
                </span>
                <span className="text-emerald-400 text-[8px] font-bold tracking-widest border border-emerald-400/30 px-2 py-0.5 rounded-full uppercase">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#1a2221] border border-white/5 rounded-xl p-3 font-mono text-xs">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  RAW CSV IMPORT
                </span>
                <span className="text-blue-400 text-[8px] font-bold tracking-widest border border-blue-400/30 px-2 py-0.5 rounded-full uppercase">
                  SYNCT
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Duplicate scan shield */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-white/15 transition-colors duration-300">
            <div>
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">// ML FOUL & SHIELD</span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight mt-2">
                Duplicate scan shield
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mt-2.5">
                Isolate identical bank IDs and repeated payout references instantly before reports compile. Secure your ledger margins from leakages.
              </p>
            </div>

            {/* Alert banner */}
            <div className="mt-6 bg-[#2d1414] border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <div className="font-mono text-[10px] text-red-400">
                <span className="font-black block uppercase tracking-wider">DUPLICATE DETECTED</span>
                <span>₦82,400 | REF: #09874</span>
              </div>
            </div>
          </div>

          {/* Card 4: Secure & Isolated Client Management */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-white/15 transition-colors duration-300">
            <div>
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">// ML MULTI-TENANT ISOLATION</span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight mt-2">
                Secure & Isolated Client Management
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mt-2.5">
                Manage distinct company accounts with rigid row-level access parameters. Customer profiles, expected payments ledger, and dashboards remain strictly encapsulated.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {/* Access log */}
              <div className="bg-[#1a2221] border border-white/5 rounded-xl p-3 font-mono text-[10px] text-gray-400 shadow-inner space-y-1">
                <div>[AUTH] ORG_ID: PV-TENANT-902</div>
                <div>[POLICY] Row-Level Isolation verified</div>
                <div>[LOG] Secure db tags sync completed</div>
              </div>
              {/* Check row */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Check className="h-4 w-4 shrink-0" />
                <span className="font-light">Row-Level Security: Isolated 24 database tags.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 120px height bottom gradient transition fading into Workflow bg (#1a2221) */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#1a2221] to-transparent pointer-events-none z-10" />
    </section>
  );
}

/* ---------- SECTION 4 — WORKFLOW ---------- */
function Workflow() {
  return (
    <section
      id="workflow"
      className="relative bg-[#1a2221] pb-24 px-6 sm:px-12 lg:px-20 overflow-visible z-20 -mt-[80px] rounded-t-[32px]"
    >
      {/* Atmospheric Accent Overlay: Faint Warm Slate Tint */}
      <div className="absolute inset-0 bg-[rgba(40,35,50,0.20)] pointer-events-none rounded-t-[32px] z-0" />

      {/* Content wrapper with correct z-index layering */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-16 pt-24">
        {/* Header text */}
        <div className="text-center w-full max-w-xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.25em] text-gray-500 font-bold uppercase">// APPLY AUTOMATED ENGINE</span>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight mt-3">
            <AnimatedText text="Systematic 4-step pipeline." />
          </h2>
          <p className="text-sm sm:text-base text-gray-400 font-light mt-3 leading-relaxed">
            <AnimatedText text="We isolate manual checks to a single streamlined visual system." />
          </p>
        </div>

        {/* 4 cards in a row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01. INGEST",
              title: "Add expectations",
              body: "List client names, billing rules, and expected transaction references in your database.",
              num: "01"
            },
            {
              step: "02. COMMIT",
              title: "Ingest actual inputs",
              body: "Drop statements, process imports, or link raw gateways directly.",
              num: "02"
            },
            {
              step: "03. RECON",
              title: "Diagnostics scan",
              body: "Our engine maps details, tracks amount parameters, and logs matches.",
              num: "03"
            },
            {
              step: "04. AUDIT",
              title: "Isolate discrepancies",
              body: "Verify ledger logs, isolate underpayments, and export compiled assets.",
              num: "04"
            }
          ].map((item) => (
            <div
              key={item.num}
              className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden group hover:border-white/15 transition-colors duration-300"
            >
              <div>
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest block mb-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-display font-semibold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 font-light mt-2 leading-relaxed">
                  {item.body}
                </p>
              </div>

              {/* Enormous decorative step number */}
              <span className="absolute bottom-1 right-2 font-display text-[70px] font-bold text-white/5 select-none pointer-events-none leading-none">
                {item.num}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 120px height bottom gradient transition fading into Pricing bg (#2B3534) */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#2B3534] to-transparent pointer-events-none z-10" />
    </section>
  );
}

/* ---------- SECTION 5 — PRICING ---------- */
function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const starterPrice = "Free";
  const growthPrice = billingPeriod === "monthly" ? "₦15,000" : "₦10,500";
  const enterprisePrice = "Custom";

  return (
    <section id="pricing" className="relative bg-[#2B3534] py-24 px-6 sm:px-12 lg:px-20 overflow-hidden z-10">
      {/* Grounded Pricing: keep closest to pure dark green background, no extra tint overlay */}

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center w-full max-w-xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.25em] text-gray-500 font-bold uppercase">// FULLY TRANSPARENT PRICING</span>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight mt-3">
            <AnimatedText text="Predictable architectural pricing." />
          </h2>
          <p className="text-sm sm:text-base text-gray-400 font-light mt-3 leading-relaxed">
            <AnimatedText text="Deploy free, scale as transaction volumes expand." />
          </p>

          {/* Toggle pill */}
          <div className="mt-8 flex justify-center">
            <div className="border border-white/10 rounded-full p-1 bg-white/5 inline-flex relative shadow-inner">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`py-1.5 px-5 rounded-full text-[10px] font-bold tracking-widest font-mono transition-colors uppercase relative z-10 ${
                  billingPeriod === "monthly" ? "text-slate-900 bg-white" : "text-gray-400 hover:text-white"
                }`}
              >
                MONTHLY
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`py-1.5 px-5 rounded-full text-[10px] font-bold tracking-widest font-mono transition-colors uppercase relative z-10 ${
                  billingPeriod === "yearly" ? "text-slate-900 bg-white" : "text-gray-400 hover:text-white"
                }`}
              >
                YEARLY (30% OFF)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 items-stretch mt-8">
          {/* Card 1: Starter Bundle */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-between relative hover:border-white/15 transition-colors duration-300">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 font-mono uppercase block mb-3">
                STARTER BUNDLE
              </span>
              <div className="flex items-baseline text-white">
                <span className="text-4xl sm:text-5xl font-display font-bold">{starterPrice}</span>
              </div>
              <p className="text-xs text-gray-400 font-light leading-relaxed mt-3">
                Perfect to test matching verification parameters.
              </p>

              <ul className="mt-8 space-y-3.5 border-t border-white/5 pt-6 text-xs text-gray-300 font-light">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>50 invoice clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Standard CSV ledger files check</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Manual diagnostics updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Standard email responses</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="block text-center w-full border border-white/20 hover:bg-white/10 text-white rounded-lg py-3 text-xs font-bold tracking-widest transition-colors uppercase"
              >
                ACTIVATE BUNDLE
              </Link>
            </div>
          </div>

          {/* Card 2: Growth Engine */}
          <div className="bg-white/[0.06] border border-white/30 rounded-2xl p-8 flex flex-col justify-between relative hover:border-white/40 transition-colors duration-300 shadow-2xl">
            {/* Float Recommended Pill */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[8px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow">
              RECOMMENDED
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-widest text-gray-300 font-mono uppercase block mb-3">
                GROWTH ENGINE
              </span>
              <div className="flex items-baseline text-white">
                <span className="text-4xl sm:text-5xl font-display font-bold">{growthPrice}</span>
                <span className="text-xs font-mono text-gray-400 ml-1.5">/mo</span>
              </div>
              {billingPeriod === "yearly" && (
                <div className="text-[10px] text-emerald-450 font-bold font-mono mt-1">
                  ₦126,000 billed annually (Save ₦54,000 / yr)
                </div>
              )}
              <p className="text-xs text-gray-400 font-light leading-relaxed mt-3">
                For growing teams seeking high transaction coverage.
              </p>

              <ul className="mt-8 space-y-3.5 border-t border-white/5 pt-6 text-xs text-gray-300 font-light">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-white shrink-0" />
                  <span>Unlimited invoice customers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-white shrink-0" />
                  <span>Automated duplicate stack logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-white shrink-0" />
                  <span>High-fidelity analytics exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-white shrink-0" />
                  <span>Priority technical log bot</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-white shrink-0" />
                  <span>Multi-account company divisions</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="block text-center w-full bg-white hover:bg-gray-100 text-slate-900 rounded-lg py-3 text-xs font-bold tracking-widest transition-colors uppercase"
              >
                DEPLOY ENGINE
              </Link>
            </div>
          </div>

          {/* Card 3: Enterprise System */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-between relative hover:border-white/15 transition-colors duration-300">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 font-mono uppercase block mb-3">
                ENTERPRISE SYSTEM
              </span>
              <div className="flex items-baseline text-white">
                <span className="text-4xl sm:text-5xl font-display font-bold">{enterprisePrice}</span>
              </div>
              <p className="text-xs text-gray-400 font-light leading-relaxed mt-3">
                Bespoke database nodes and support integrations.
              </p>

              <ul className="mt-8 space-y-3.5 border-t border-white/5 pt-6 text-xs text-gray-300 font-light">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Distinct custom database integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Bespoke ledger adapters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Individual account managers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>24/7 dedicated telephone support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="block text-center w-full border border-white/20 hover:bg-white/10 text-white rounded-lg py-3 text-xs font-bold tracking-widest transition-colors uppercase"
              >
                TALK TO SALES
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 120px height bottom gradient transition fading into FAQ bg (#1a2221) */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#1a2221] to-transparent pointer-events-none z-10" />
    </section>
  );
}

/* ---------- SECTION 6 — FAQ ---------- */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs = [
    {
      q: "What format statements can the matching engine ingest?",
      a: "PayVerify supports standard Paystack dashboard payouts CSV statements, Nigerian banking API statements (Zenith, Access, GTB CSV sheets), and custom spreadsheets. Enterprise accounts support customized schemas."
    },
    {
      q: "How is transaction duplication handled?",
      a: "The algorithms check raw banking IDs, payload variables, expected references, and financial numbers simultaneously. Any duplicated parameter triggers an instant mismatch flag."
    },
    {
      q: "Is tenant client ledger space strictly isolated?",
      a: "Yes. System designs apply isolated scoping bounds per administrative organization, fully compliant with row-level Supabase security features."
    },
    {
      q: "Can we invite additional accountants and financial leads?",
      a: "Administrative user configuration is built directly inside the dashboard workspace environment for Growth and Enterprise profile accounts."
    },
    {
      q: "What setup support is available for custom bank formats?",
      a: "Enterprise integrations support custom ledger mapping structures, direct pipeline assistance, and personal Slack help."
    }
  ];

  return (
    <section id="faq" className="relative bg-[#1a2221] py-24 px-6 sm:px-12 lg:px-20 overflow-hidden z-10">
      {/* Atmospheric Accent Overlay: Faint Cool Grey Tint */}
      <div className="absolute inset-0 bg-[rgba(20,28,35,0.25)] pointer-events-none z-0" />

      {/* Content wrapper with correct z-index layering */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid gap-12 lg:grid-cols-[300px_1fr] items-start">
        {/* Left Column */}
        <div className="flex flex-col">
          <span className="font-mono text-[10px] tracking-[0.25em] text-gray-500 font-bold uppercase">
            // FREQUENT BASE QUERIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-3">
            Common diagnostic queries.
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-3 leading-relaxed">
            Frequently requested operational details about PayVerify's ledger checking parameters, bank format supports, and security parameters.
          </p>
        </div>

        {/* Right Column Custom Accordion */}
        <div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-8">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b border-white/10 last:border-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between py-4 text-sm font-medium text-white hover:text-gray-300 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transform transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[160px] opacity-100 pb-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 120px height bottom gradient transition fading into CTA bg (#2B3534) */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#2B3534] to-transparent pointer-events-none z-10" />
    </section>
  );
}

/* ---------- SECTION 7 — CTA BANNER ---------- */
function CTABanner() {
  return (
    <section className="relative bg-[#2B3534] py-24 px-6 sm:px-12 lg:px-20 overflow-hidden z-10 text-center">
      {/* CTA Banner: pure #2B3534 background, no extra tint overlay */}

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight leading-[1.1]">
          <AnimatedText text="Ready to secure your payment reconciliation?" />
        </h2>
        <p className="text-sm sm:text-base text-gray-300 font-light mt-5 leading-relaxed max-w-lg">
          <AnimatedText text="Deploy PayVerify diagnostic pipeline tools instantly and experience absolute automated verification security." />
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="bg-white hover:bg-gray-100 text-slate-900 text-xs font-bold tracking-widest px-8 py-4 rounded-lg transition-colors uppercase shadow"
          >
            DEPLOY SYSTEM FREE
          </Link>
          <Link
            to="/contact"
            className="border border-white/20 hover:bg-white/10 text-white text-xs font-bold tracking-widest px-8 py-4 rounded-lg transition-colors uppercase"
          >
            SCHEDULE CONSULT
          </Link>
        </div>
      </div>

      {/* 120px height bottom gradient transition fading into Footer bg (#1a2221) */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#1a2221] to-transparent pointer-events-none z-10" />
    </section>
  );
}

/* ---------- SECTION 8 — FOOTER ---------- */
export function Footer() {
  return (
    <footer className="relative bg-[#1a2221] border-t border-white/10 z-10 py-16 px-6 sm:px-12 lg:px-20">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-12">
        {/* 3-Column Grid */}
        <div className="grid gap-12 md:grid-cols-4 items-start">
          {/* Column 1 */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col select-none">
              <span className="text-2xl font-semibold text-white tracking-tight leading-none font-display">
                PAYVERIFY
              </span>
              <span className="text-[9px] tracking-[0.2em] text-slate-500 font-semibold font-mono mt-0.5 uppercase">
                RECON.SYSTEM
              </span>
            </div>
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-[200px]">
              Your favourite automated payment verification software. Built for modern finance teams and high-growth fintech operations.
            </p>
            {/* Social Buttons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="border border-white/10 rounded-full w-8 h-8 flex items-center justify-center hover:border-white/30 text-gray-400 hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="border border-white/10 rounded-full w-8 h-8 flex items-center justify-center hover:border-white/30 text-gray-400 hover:text-white transition-all duration-300"
                aria-label="Youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">
              // PAGES
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-400 font-light">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">
                  Ledger Demo
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white transition-colors">
                  Workflow
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">
              // INFORMATION
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-400 font-light">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of use
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/audit-logs" className="hover:text-white transition-colors">
                  Audit Logs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500">
          <span>© 2026 PayVerify.</span>
          <span className="font-mono tracking-wider text-[9px] uppercase">
            RECON_DB_PACKETED → SYSTEM ACTION: ENG. 18
          </span>
        </div>
      </div>
    </footer>
  );
}
