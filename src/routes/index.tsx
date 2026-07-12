import { createFileRoute, Link } from "@tanstack/react-router";
import demoDashboard from "../assets/demo dashboard ui.png";
import demoApp from "../assets/image.png";
import bgImage from "../assets/bg.png";
import logoImage from "../assets/logo.png";
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
  Youtube,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  RotateCw,
  Share,
  Plus,
  Copy,
  Monitor,
  Compass,
  Layers,
  ListTodo,
  Sparkles,
  ArrowUp,
  Brain,
  Cpu
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Todella — Automated Payment Reconciliation Platform" },
      { name: "description", content: "Verify every payout flow with absolute hairline precision. Connect bank statements, cash channels, and payment gateways into one unified automated matching engine." },
      { property: "og:title", content: "Todella — Automated Payment Reconciliation Platform" },
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
    <div
      className="min-h-screen text-slate-900 font-sans overflow-x-hidden antialiased bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
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

const CustomLogo = ({ className = "h-5 sm:h-6" }: { className?: string }) => (
  <img
    src={logoImage}
    alt="Todella Logo"
    className={`${className} object-contain`}
  />
);

/* ---------- SECTION 1 — NAVIGATION BAR ---------- */
export function Navbar({ className = "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-[0_2px_15px_rgba(0,0,0,0.02)] animate-fade-down" }: { className?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`${className} w-full`}>
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5">
        {/* Logo left */}
        <Link to="/" className="flex items-center gap-2 select-none text-gray-900">
          <CustomLogo className="w-5 h-5 sm:w-6 sm:h-6 text-[#0b132b]" />
          <span className="text-lg font-extrabold tracking-tight font-sans uppercase text-[#0b132b]">
            Todella
          </span>
        </Link>

        {/* Nav links center (hidden below md) */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[13px] font-semibold text-slate-600 hover:text-[#0b132b] transition-colors">
            Features
          </a>
          <a href="#workflow" className="text-[13px] font-semibold text-slate-600 hover:text-[#0b132b] transition-colors">
            How It Works
          </a>
          <div className="relative group">
            <button className="flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-[#0b132b] transition-colors cursor-pointer focus:outline-none">
              <span>Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
          <a href="#pricing" className="text-[13px] font-semibold text-slate-600 hover:text-[#0b132b] transition-colors">
            Pricing
          </a>
          <div className="relative group">
            <button className="flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-[#0b132b] transition-colors cursor-pointer focus:outline-none">
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
          <a href="#faq" className="text-[13px] font-semibold text-slate-600 hover:text-[#0b132b] transition-colors">
            FAQ
          </a>
        </nav>

        {/* CTA + hamburger right */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-block text-[13px] font-semibold text-slate-600 hover:text-[#0b132b] mr-2"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-[#0b132b] text-white text-[13px] font-bold px-4 sm:px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
          >
            Get Started
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900/10 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="absolute left-4 right-4 top-full rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 animate-fade-up z-50 flex flex-col gap-3.5 shadow-xl">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-[#0b132b] pb-2 border-b border-gray-100"
            >
              Features
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-[#0b132b] pb-2 border-b border-gray-100"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-[#0b132b] pb-2 border-b border-gray-100"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-[#0b132b]"
            >
              FAQ
            </a>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[14px] font-semibold text-slate-600 hover:text-[#0b132b]"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------- SCALED DASHBOARD COMPONENT ---------- */
function ScaledDashboard({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const handleResize = () => {
      const width = container.getBoundingClientRect().width;
      const newScale = Math.min(width / 896, 1);
      setScale(newScale);
      setHeight(inner.offsetHeight * newScale);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(container);
    resizeObserver.observe(inner);
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call
    
    const timer = setTimeout(handleResize, 100);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden relative" style={{ height: height ? `${height}px` : "auto" }}>
      <div
        ref={innerRef}
        className="origin-top-left absolute left-0 top-0"
        style={{
          width: "896px",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- SECTION 2 — HERO ---------- */
function Hero() {
  return (
    <section
      className="relative min-h-[100svh] flex flex-col pt-20 sm:pt-24"
    >
      <Navbar />

      {/* Spacer between navbar and content */}
      <div className="h-4 sm:h-6 lg:h-8 shrink-0" />

      {/* Hero content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 grid lg:grid-cols-[1.12fr_1fr] gap-12 lg:gap-16 items-start py-4 sm:py-6 lg:py-8">
        
        {/* Left Column */}
        <div className="flex flex-col items-start text-left max-w-xl">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-sky-200 bg-sky-50/50 text-[11px] font-semibold text-sky-700 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Payment Verification</span>
          </div>

          <h1 className="text-slate-900 font-normal leading-[1.1] tracking-tight text-4xl sm:text-5xl lg:text-6xl font-display">
            Reconcile payments.<br />
            Effortlessly.
          </h1>

          <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
            Automate payment verification, match transactions instantly, and get AI-powered insights to accelerate your reconciliation process and reduce manual work.
          </p>

          {/* Features list */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-6 w-full">
            {[
              { icon: ShieldCheck, text: "Automatic Matching" },
              { icon: Brain, text: "AI Reconciliation Assistant" },
              { icon: BarChart3, text: "Real-time Insights" },
              { icon: Lock, text: "Secure & Compliant" }
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0 border border-sky-100">
                  <feat.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 leading-snug">{feat.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="bg-[#0b132b] hover:bg-slate-800 text-white text-xs font-bold tracking-wider px-6 py-4 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 uppercase"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#pricing"
              className="text-slate-700 text-xs font-bold tracking-wider px-6 py-4 rounded-lg border border-slate-300 bg-white/80 hover:bg-slate-50 transition-colors uppercase"
            >
              Talk to Sales
            </a>
          </div>

          {/* Trust Checkmarks */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-sky-650" /> 14-day free trial</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-sky-6550" /> No credit card required</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-sky-6550" /> Cancel anytime</span>
          </div>

          {/* Customer Logo Strip */}
          <div className="mt-12 pt-6 border-t border-slate-200 w-full">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-3.5">
              Trusted by finance teams
            </span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-400 text-xs font-semibold">
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <Building2 className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Acme Corp</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <CreditCard className="w-4 h-4 shrink-0 text-slate-400" />
                <span>EduPay</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <BarChart3 className="w-4 h-4 shrink-0 text-slate-400" />
                <span>FinanceHub</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <Zap className="w-4 h-4 shrink-0 text-slate-400" />
                <span>SwiftLedger</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Light Dashboard Mockup) */}
        <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto z-10 flex flex-col">
          <ScaledDashboard>
            {/* Mockup Frame */}
            <div className="rounded-2xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col text-left">
              {/* App Header / Title Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                {/* Window controls */}
                <div className="flex items-center gap-3 text-slate-400">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
                {/* Center URL Bar */}
                <div className="bg-white border border-slate-200 rounded-md px-6 py-1 text-[11px] text-slate-500 flex items-center gap-1.5 justify-center min-w-[180px] max-w-[220px] mx-auto">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>app.todella.io</span>
                </div>
                {/* Right search/icon */}
                <div className="w-10" />
              </div>

              {/* App Body (Sidebar + Content) */}
              <div className="flex bg-slate-50 min-h-[520px]">
                {/* Sidebar */}
                <div className="w-[190px] border-r border-slate-200 bg-white px-4 py-5 flex flex-col gap-5 shrink-0 font-sans">
                  {/* Logo */}
                  <div className="flex items-center gap-2 px-1">
                    <CustomLogo className="w-4.5 h-4.5 text-sky-6550" />
                    <span className="text-xs font-black tracking-tight uppercase text-slate-800">Todella</span>
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-3 py-2 px-2.5 rounded-lg bg-sky-50 text-sky-700 text-[11px] font-bold">
                      <Compass className="w-4 h-4 text-sky-600" />
                      <span>Dashboard</span>
                    </div>
                    {[
                      { text: "Payments", icon: CreditCard },
                      { text: "Invoices", icon: Layers },
                      { text: "Customers", icon: ListTodo },
                      { text: "Reconciliation", icon: ShieldCheck },
                      { text: "Reports", icon: BarChart3 },
                      { icon: Sparkles, text: "AI Assistant" },
                      { text: "Settings", icon: Lock }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 px-2.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-semibold transition-colors cursor-pointer">
                        <item.icon className="w-4 h-4 text-slate-400" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex flex-col gap-5 font-sans bg-white">
                  {/* Top Welcome Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 leading-none">Dashboard</h2>
                      <span className="text-[11px] text-slate-400 block mt-1">Welcome back! Here's what's happening today.</span>
                    </div>
                    {/* Date filter pill */}
                    <div className="border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-600 flex items-center gap-1">
                      <span>Jun 1 - Jun 28, 2025</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-3 mt-1">
                    {[
                      { title: "Total Received", value: "GHS 152,430.00", change: "+18.6%", up: true },
                      { title: "Matched", value: "512", change: "+24.3%", up: true },
                      { title: "Under Review", value: "18", change: "-3.2%", up: false },
                      { title: "Unmatched", value: "10", change: "+1.8%", up: true }
                    ].map((stat, idx) => (
                      <div key={idx} className="border border-slate-200/80 rounded-xl bg-slate-50/50 p-3 flex flex-col justify-between shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
                        <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">{stat.title}</span>
                        <span className="text-[13px] font-black text-slate-800 mt-1 truncate">{stat.value}</span>
                        <span className={`text-[9px] font-bold mt-1 inline-flex items-center ${stat.up ? "text-emerald-600" : "text-amber-600"}`}>
                          {stat.change}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Row: Charts */}
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    {/* Payment Overview Chart Mockup */}
                    <div className="border border-slate-200 rounded-xl p-4 flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                        <span className="text-[11px] font-bold text-slate-800">Payment Overview</span>
                        <span className="text-[9px] text-slate-450 font-semibold">This Month</span>
                      </div>
                      {/* Fake Area Chart */}
                      <div className="h-24 w-full relative mt-1 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2"/>
                              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0"/>
                            </linearGradient>
                          </defs>
                          <path d="M0,35 Q15,30 30,22 T60,25 T90,15 L100,20 L100,40 L0,40 Z" fill="url(#chartGrad)" />
                          <path d="M0,35 Q15,30 30,22 T60,25 T90,15 L100,20" fill="none" stroke="#0284c7" strokeWidth="1.5" />
                        </svg>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-slate-400 font-mono pt-1">
                          <span>Jun 1</span>
                          <span>Jun 7</span>
                          <span>Jun 14</span>
                          <span>Jun 21</span>
                          <span>Jun 28</span>
                        </div>
                      </div>
                    </div>

                    {/* Match Status Donut Mockup */}
                    <div className="border border-slate-200 rounded-xl p-4 flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                        <span className="text-[11px] font-bold text-slate-800">Match Status</span>
                      </div>
                      <div className="flex items-center gap-4 justify-center h-24">
                        {/* Fake Donut Chart */}
                        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                            {/* Segment 1: Matched (92%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0ea5e9" strokeWidth="3.5" strokeDasharray="92 8" strokeDashoffset="0" />
                            {/* Segment 2: Under Review (6%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3.5" strokeDasharray="6 94" strokeDashoffset="-92" />
                            {/* Segment 3: Unmatched (2%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="2 98" strokeDashoffset="-98" />
                          </svg>
                        </div>
                        {/* Donut Legend */}
                        <div className="flex flex-col gap-1.5 text-[9px] font-semibold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            <span>Matched <span className="text-slate-400 font-normal">512 (92%)</span></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span>Under Review <span className="text-slate-400 font-normal">18 (6%)</span></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>Unmatched <span className="text-slate-400 font-normal">10 (2%)</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transactions Table Mockup */}
                  <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)] mt-1">
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-[9px] font-bold text-slate-800">
                      Recent Transactions
                    </div>
                    <table className="w-full text-left text-[9px] text-slate-600">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-450 font-bold uppercase tracking-wider">
                          <th className="px-4 py-2">ID</th>
                          <th className="px-4 py-2">Customer</th>
                          <th className="px-4 py-2">Amount</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { id: "#INV-4029", name: "John Doe", amount: "GHS 2,500.00", status: "Matched", date: "Jun 28, 2025" },
                          { id: "#INV-4028", name: "Mary Addo", amount: "GHS 1,200.00", status: "Under Review", date: "Jun 28, 2025" },
                          { id: "#INV-4027", name: "Kofi Mensah", amount: "GHS 3,000.00", status: "Matched", date: "Jun 28, 2025" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30">
                            <td className="px-4 py-2.5 text-sky-600 font-semibold">{row.id}</td>
                            <td className="px-4 py-2.5 text-slate-800 font-medium">{row.name}</td>
                            <td className="px-4 py-2.5 font-mono">{row.amount}</td>
                            <td className="px-4 py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                row.status === "Matched" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-400">{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </ScaledDashboard>

          {/* 3 Card Row below the dashboard mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full">
            {/* Card 1 */}
            <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm hover:scale-[1.02] hover:shadow-md transition-all text-left">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 mb-3 shadow-[0_2px_6px_rgba(14,165,233,0.08)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-[12px] font-bold text-slate-900 leading-tight">AI Reconciliation</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">18 transactions need review</p>
              <a href="#" className="inline-block text-[10px] font-bold text-sky-600 hover:text-sky-700 mt-3.5 transition-colors">
                Review Now →
              </a>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm hover:scale-[1.02] hover:shadow-md transition-all text-left">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 mb-3 shadow-[0_2px_6px_rgba(244,63,94,0.08)]">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-[12px] font-bold text-slate-900 leading-tight">Duplicates Detected</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">6 potential duplicates found</p>
              <a href="#" className="inline-block text-[10px] font-bold text-rose-500 hover:text-rose-700 mt-3.5 transition-colors">
                View Details →
              </a>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm hover:scale-[1.02] hover:shadow-md transition-all text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 mb-3 shadow-[0_2px_6px_rgba(79,70,229,0.08)]">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-[12px] font-bold text-slate-900 leading-tight">Insights Generated</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">AI summary is ready to view</p>
              <a href="#" className="inline-block text-[10px] font-bold text-indigo-600 hover:text-indigo-700 mt-3.5 transition-colors">
                View Insights →
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Spacer bottom */}
      <div className="flex-1 min-h-12 sm:min-h-16 lg:min-h-24 shrink-0" />
    </section>
  );
}

/* ---------- SECTION 2.5 — VIDEO SHOWCASE ---------- */
function VideoShowcase() {
  return (
    <section className="relative w-full bg-transparent overflow-hidden">

      {/* Label row */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-14 pb-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-emerald-500/60" />
          <span className="text-[11px] font-mono font-bold text-emerald-600 tracking-[0.25em] uppercase">Platform Demo</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-505 bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">Live App Preview</span>
        </div>
      </div>

      {/* Browser chrome frame + screenshot */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="rounded-2xl overflow-hidden border border-slate-250/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          {/* Browser titlebar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
            <span className="h-3 w-3 rounded-full bg-rose-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-2 bg-white border border-slate-200/60 rounded-md px-3 py-1 max-w-[280px]">
                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="text-[11px] font-mono text-slate-600 truncate">app.todella.io/dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          {/* App screenshot — fully visible, no dark overlay */}
          <div className="relative overflow-hidden">
            <img
              src={demoApp}
              alt="Todella App — Financial Ledger Dashboard"
              className="w-full h-auto block object-cover object-top"
              draggable={false}
              suppressHydrationWarning={true}
            />
            {/* Subtle edge vignette only */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.15)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats row — below the card */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-10 pb-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
          {[
            { value: "99.7%", label: "Match Accuracy", sub: "Across all payment channels", color: "text-emerald-600" },
            { value: "2.8M+", label: "Txns Reconciled", sub: "Processed this quarter", color: "text-sky-600" },
            { value: "<0.1s", label: "Match Latency", sub: "Real-time processing", color: "text-amber-600" },
            { value: "100%", label: "Audit Ready", sub: "SOC2 Type II certified", color: "text-violet-600" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1.5 px-6 py-5 bg-white hover:bg-slate-50/50 transition-colors ${
                i > 0 ? "border-l border-slate-200" : ""
              } ${i >= 2 ? "border-t border-slate-200 sm:border-t-0" : ""}`}
            >
              <span className={`text-2xl sm:text-3xl font-display font-bold leading-none ${stat.color}`}>{stat.value}</span>
              <span className="text-slate-900 text-[13px] font-semibold mt-0.5">{stat.label}</span>
              <span className="text-slate-500 text-[11px] font-mono leading-snug">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 3 — FEATURES ---------- */
function Features() {
  return (
    <section id="features" className="relative bg-transparent py-24 px-6 sm:px-12 lg:px-20 overflow-hidden z-10">

      {/* Content wrapper with correct z-index layering */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header Intro Row */}
        <div className="grid md:grid-cols-2 gap-8 items-end border-b border-slate-200/80 pb-10">
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-emerald-600 font-bold uppercase">// PRODUCT CORE INFRASTRUCTURE</span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-semibold text-slate-900 tracking-tight mt-3">
              <AnimatedText text="Clean, structured, absolute ledger defense." className="justify-start text-left" />
            </h2>
          </div>
          <div className="md:text-right md:ml-auto max-w-sm">
            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              <AnimatedText text="Every pipeline tool is integrated to work seamlessly with raw-level transaction structures. No artificial layers — just raw fintech reliability." className="justify-start md:justify-end text-left md:text-right" />
            </p>
          </div>
        </div>

        {/* 2x2 Card Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Precise Automated matching pipeline */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-slate-350 hover:shadow-sm transition-all duration-300">
            <div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">// ML PATTERN ENGINE</span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 tracking-tight mt-2">
                Precise Automated matching pipeline
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mt-2.5">
                Our reconciliation algorithms map inbound cash register feeds, payment processor APIs, and banking CSV spreadsheets instantly. If an entry aligns, its status scales dynamically.
              </p>
            </div>

            {/* Terminal mock panel */}
            <div className="mt-6 bg-slate-900 border border-slate-850 rounded-xl p-4 font-mono text-[10px] text-slate-300 shadow-inner">
              <div className="flex justify-between items-center text-slate-500 text-[8px] uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-800">
                <span>INBOUND_PIPE_FEED v2.0</span>
                <span>STATUS: RUNNING</span>
              </div>
              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>[MATCH] ID: PV-902-A</span>
                  <span className="text-emerald-400">ZENITH ₦4.5M</span>
                </div>
                <div className="flex justify-between">
                  <span>[MATCH] ID: PV-902-B</span>
                  <span className="text-emerald-400">STRIPE $12.3K</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1.5 mt-1 text-[9px]">
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
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-slate-350 hover:shadow-sm transition-all duration-300">
            <div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">// ML PLATFORM ADDITIONS</span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 tracking-tight mt-2">
                Flexible sources
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mt-2.5">
                Connect API payout streams directly or upload raw statements and cash register logs with identical matching outputs.
              </p>
            </div>

            {/* Source items */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 font-mono text-xs">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  PAYSTACK API
                </span>
                <span className="text-emerald-600 text-[8px] font-bold tracking-widest border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 font-mono text-xs">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  RAW CSV IMPORT
                </span>
                <span className="text-blue-600 text-[8px] font-bold tracking-widest border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                  SYNCT
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Duplicate scan shield */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-slate-350 hover:shadow-sm transition-all duration-300">
            <div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">// ML FOUL & SHIELD</span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 tracking-tight mt-2">
                Duplicate scan shield
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mt-2.5">
                Isolate identical bank IDs and repeated payout references instantly before reports compile. Secure your ledger margins from leakages.
              </p>
            </div>

            {/* Alert banner */}
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <div className="font-mono text-[10px] text-red-700">
                <span className="font-black block uppercase tracking-wider">DUPLICATE DETECTED</span>
                <span>₦82,400 | REF: #09874</span>
              </div>
            </div>
          </div>

          {/* Card 4: Secure & Isolated Client Management */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-slate-350 hover:shadow-sm transition-all duration-300">
            <div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">// ML MULTI-TENANT ISOLATION</span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 tracking-tight mt-2">
                Secure & Isolated Client Management
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mt-2.5">
                Manage distinct company accounts with rigid row-level access parameters. Customer profiles, expected payments ledger, and dashboards remain strictly encapsulated.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {/* Access log */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 font-mono text-[10px] text-slate-6550 shadow-inner space-y-1">
                <div>[AUTH] ORG_ID: PV-TENANT-902</div>
                <div>[POLICY] Row-Level Isolation verified</div>
                <div>[LOG] Secure db tags sync completed</div>
              </div>
              {/* Check row */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <Check className="h-4 w-4 shrink-0" />
                <span className="font-light">Row-Level Security: Isolated 24 database tags.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 4 — WORKFLOW ---------- */
function Workflow() {
  return (
    <section
      id="workflow"
      className="relative bg-transparent pb-24 px-6 sm:px-12 lg:px-20 overflow-visible z-20 -mt-[80px]"
    >

      {/* Content wrapper with correct z-index layering */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-16 pt-24">
        {/* Header text */}
        <div className="text-center w-full max-w-xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.25em] text-slate-500 font-bold uppercase">// APPLY AUTOMATED ENGINE</span>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-slate-900 tracking-tight mt-3">
            <AnimatedText text="Systematic 4-step pipeline." />
          </h2>
          <p className="text-sm sm:text-base text-slate-650 font-light mt-3 leading-relaxed">
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
              className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden group hover:border-slate-300 hover:shadow-sm transition-all duration-300"
            >
              <div>
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block mb-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-display font-semibold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 font-light mt-2 leading-relaxed">
                  {item.body}
                </p>
              </div>

              {/* Enormous decorative step number */}
              <span className="absolute bottom-1 right-2 font-display text-[70px] font-bold text-slate-100 select-none pointer-events-none leading-none">
                {item.num}
              </span>
            </div>
          ))}
        </div>
      </div>
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
    <section id="pricing" className="relative bg-transparent py-24 px-6 sm:px-12 lg:px-20 overflow-hidden z-10">
      {/* Grounded Pricing: keep closest to pure light background */}

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center w-full max-w-xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.25em] text-slate-500 font-bold uppercase">// FULLY TRANSPARENT PRICING</span>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-slate-900 tracking-tight mt-3">
            <AnimatedText text="Predictable architectural pricing." />
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light mt-3 leading-relaxed">
            <AnimatedText text="Deploy free, scale as transaction volumes expand." />
          </p>

          {/* Toggle pill */}
          <div className="mt-8 flex justify-center">
            <div className="border border-slate-200 rounded-full p-1 bg-slate-100/80 inline-flex relative shadow-inner">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`py-1.5 px-5 rounded-full text-[10px] font-bold tracking-widest font-mono transition-colors uppercase relative z-10 ${
                  billingPeriod === "monthly" ? "text-slate-900 bg-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                MONTHLY
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`py-1.5 px-5 rounded-full text-[10px] font-bold tracking-widest font-mono transition-colors uppercase relative z-10 ${
                  billingPeriod === "yearly" ? "text-slate-900 bg-white shadow-sm" : "text-slate-500 hover:text-slate-900"
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
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-8 flex flex-col justify-between relative hover:border-slate-350 hover:shadow-sm transition-all duration-300">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 font-mono uppercase block mb-3">
                STARTER BUNDLE
              </span>
              <div className="flex items-baseline text-slate-900">
                <span className="text-4xl sm:text-5xl font-display font-bold">{starterPrice}</span>
              </div>
              <p className="text-xs text-slate-500 font-light leading-relaxed mt-3">
                Perfect to test matching verification parameters.
              </p>

              <ul className="mt-8 space-y-3.5 border-t border-slate-200/60 pt-6 text-xs text-slate-700 font-light">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-450 shrink-0" />
                  <span>50 invoice clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-450 shrink-0" />
                  <span>Standard CSV ledger files check</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-450 shrink-0" />
                  <span>Manual diagnostics updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-450 shrink-0" />
                  <span>Standard email responses</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="block text-center w-full border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg py-3 text-xs font-bold tracking-widest transition-colors uppercase"
              >
                ACTIVATE BUNDLE
              </Link>
            </div>
          </div>

          {/* Card 2: Growth Engine */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-8 flex flex-col justify-between relative hover:border-slate-800 transition-colors duration-300 shadow-xl">
            {/* Float Recommended Pill */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow">
              RECOMMENDED
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-600 font-mono uppercase block mb-3">
                GROWTH ENGINE
              </span>
              <div className="flex items-baseline text-slate-900">
                <span className="text-4xl sm:text-5xl font-display font-bold">{growthPrice}</span>
                <span className="text-xs font-mono text-slate-500 ml-1.5">/mo</span>
              </div>
              {billingPeriod === "yearly" && (
                <div className="text-[10px] text-emerald-650 font-bold font-mono mt-1">
                  ₦126,000 billed annually (Save ₦54,000 / yr)
                </div>
              )}
              <p className="text-xs text-slate-600 font-light leading-relaxed mt-3">
                For growing teams seeking high transaction coverage.
              </p>

              <ul className="mt-8 space-y-3.5 border-t border-slate-200 pt-6 text-xs text-slate-800 font-light">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Unlimited invoice customers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Automated duplicate stack logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>High-fidelity analytics exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Priority technical log bot</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Multi-account company divisions</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-3 text-xs font-bold tracking-widest transition-colors uppercase"
              >
                DEPLOY ENGINE
              </Link>
            </div>
          </div>

          {/* Card 3: Enterprise System */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-8 flex flex-col justify-between relative hover:border-slate-350 hover:shadow-sm transition-all duration-300">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 font-mono uppercase block mb-3">
                ENTERPRISE SYSTEM
              </span>
              <div className="flex items-baseline text-slate-900">
                <span className="text-4xl sm:text-5xl font-display font-bold">{enterprisePrice}</span>
              </div>
              <p className="text-xs text-slate-500 font-light leading-relaxed mt-3">
                Bespoke database nodes and support integrations.
              </p>

              <ul className="mt-8 space-y-3.5 border-t border-slate-200/60 pt-6 text-xs text-slate-700 font-light">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-450 shrink-0" />
                  <span>Distinct custom database integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-450 shrink-0" />
                  <span>Bespoke ledger adapters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-450 shrink-0" />
                  <span>Individual account managers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-450 shrink-0" />
                  <span>24/7 dedicated support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="block text-center w-full border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg py-3 text-xs font-bold tracking-widest transition-colors uppercase"
              >
                TALK TO SALES
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 6 — FAQ ---------- */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs = [
    {
      q: "What format statements can the matching engine ingest?",
      a: "Todella supports standard Paystack dashboard payouts CSV statements, Nigerian banking API statements (Zenith, Access, GTB CSV sheets), and custom spreadsheets. Enterprise accounts support customized schemas."
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
    <section id="faq" className="relative bg-transparent py-24 px-6 sm:px-12 lg:px-20 overflow-hidden z-10">

      {/* Content wrapper with correct z-index layering */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid gap-12 lg:grid-cols-[300px_1fr] items-start">
        {/* Left Column */}
        <div className="flex flex-col">
          <span className="font-mono text-[10px] tracking-[0.25em] text-slate-500 font-bold uppercase">
            // FREQUENT BASE QUERIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight mt-3">
            Common diagnostic queries.
          </h2>
          <p className="text-xs sm:text-sm text-slate-650 font-light mt-3 leading-relaxed">
            Frequently requested operational details about Todella's ledger checking parameters, bank format supports, and security parameters.
          </p>
        </div>

        {/* Right Column Custom Accordion */}
        <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-8 shadow-sm">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between py-4 text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transform transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[160px] opacity-100 pb-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 7 — CTA BANNER ---------- */
function CTABanner() {
  return (
    <section className="relative bg-transparent py-24 px-6 sm:px-12 lg:px-20 overflow-hidden z-10 text-center">

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight leading-[1.1]">
          <AnimatedText text="Ready to secure your payment reconciliation?" />
        </h2>
        <p className="text-sm sm:text-base text-slate-650 font-light mt-5 leading-relaxed max-w-lg">
          <AnimatedText text="Deploy Todella diagnostic pipeline tools instantly and experience absolute automated verification security." />
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-widest px-8 py-4 rounded-lg transition-colors uppercase shadow"
          >
            DEPLOY SYSTEM FREE
          </Link>
          <Link
            to="/contact"
            className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold tracking-widest px-8 py-4 rounded-lg transition-colors uppercase"
          >
            SCHEDULE CONSULT
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 8 — FOOTER ---------- */
export function Footer() {
  return (
    <footer className="relative bg-white/20 backdrop-blur-md border-t border-slate-200/80 z-10 py-16 px-6 sm:px-12 lg:px-20">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-12">
        {/* 3-Column Grid */}
        <div className="grid gap-12 md:grid-cols-4 items-start">
          {/* Column 1 */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 select-none">
              <CustomLogo className="h-6 sm:h-7" />
              <span className="text-xl font-extrabold tracking-tight font-sans uppercase text-[#0b132b]">
                Todella
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light leading-relaxed max-w-[200px]">
              Your favourite automated payment verification software. Built for modern finance teams and high-growth fintech operations.
            </p>
            {/* Social Buttons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="border border-slate-200 rounded-full w-8 h-8 flex items-center justify-center hover:border-slate-450 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="border border-slate-200 rounded-full w-8 h-8 flex items-center justify-center hover:border-slate-450 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all duration-300"
                aria-label="Youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              // PAGES
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-500 font-light">
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-slate-900 transition-colors">
                  Ledger Demo
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-slate-900 transition-colors">
                  Workflow
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-slate-900 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-900 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              // INFORMATION
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-500 font-light">
              <li>
                <Link to="/contact" className="hover:text-slate-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-slate-900 transition-colors">
                  Terms of use
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-slate-900 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/audit-logs" className="hover:text-slate-900 transition-colors">
                  Audit Logs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400">
          <span>© 2026 Todella.</span>
          <span className="font-mono tracking-wider text-[9px] uppercase">
            RECON_DB_PACKETED → SYSTEM ACTION: ENG. 18
          </span>
        </div>
      </div>
    </footer>
  );
}
