import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Globe,
  PieChart,
  Gauge,
  ArrowRight,
  Menu,
  X,
  Quote,
  Activity,
  Award,
  TrendingUp,
  FileCheck
} from "lucide-react";

// Import visual assets
import aetherfieldHeroSky from "../assets/aetherfield_hero_sky.png";
import aetherfieldTeamBlue from "../assets/aetherfield_team_blue.png";
import aetherfieldClairePortrait from "../assets/aetherfield_claire_portrait.png";
import aetherfieldJournalSky from "../assets/aetherfield_journal_sky.png";
import aetherfieldJournalMoss from "../assets/aetherfield_journal_moss.png";
import aetherfieldJournalTurbine from "../assets/aetherfield_journal_turbine.png";

export const Route = createFileRoute("/todella-home")({
  head: () => ({
    meta: [
      { title: "Aetherfield — Sustainability Insights, Built for Business" },
      { name: "description", content: "Financial & carbon accounting tools designed for security, auditability, and speed. Measure, model, and act on your ESG data." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans overflow-x-hidden antialiased bg-[#f9fafb]">
      <Hero />
      <FeatureTabs />
      <ClarityAndAction />
      <HalftoneSpreadsheets />
      <JournalSection />
      <TestimonialSection />
      <CTABanner />
      <Footer />
    </div>
  );
}

/* ---------- CUSTOM LOGO ---------- */
const CustomLogo = () => (
  <span className="text-xl font-bold tracking-tight font-display text-[#0e3e2e] select-none">
    Aetherfield
  </span>
);

/* ---------- SECTION 1 — NAVIGATION BAR ---------- */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm animate-fade-down w-full">
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4.5 max-w-7xl mx-auto">
        {/* Logo left */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <CustomLogo />
        </Link>

        {/* Nav links center */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[13px] font-semibold text-slate-650 hover:text-[#0e3e2e] transition-colors">
            Product
          </a>
          <a href="#workflow" className="text-[13px] font-semibold text-slate-650 hover:text-[#0e3e2e] transition-colors">
            About
          </a>
          <a href="#features" className="text-[13px] font-semibold text-slate-655 hover:text-[#0e3e2e] transition-colors">
            Model
          </a>
          <a href="#journal" className="text-[13px] font-semibold text-slate-655 hover:text-[#0e3e2e] transition-colors">
            Careers
          </a>
          <a href="#faq" className="text-[13px] font-semibold text-slate-655 hover:text-[#0e3e2e] transition-colors">
            Resources
          </a>
        </nav>

        {/* CTA + hamburger right */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-block text-[13px] font-semibold text-slate-600 hover:text-slate-900 mr-2"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-[#0e3e2e] text-white text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-[#07241a] transition-all shadow-sm"
          >
            Start for free
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="absolute left-4 right-4 top-full rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-xl px-5 py-4 animate-fade-up z-50 flex flex-col gap-3.5 shadow-xl">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-slate-900 pb-2 border-b border-slate-100"
            >
              Product
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-slate-900 pb-2 border-b border-slate-100"
            >
              About
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-slate-900 pb-2 border-b border-slate-100"
            >
              Model
            </a>
            <a
              href="#journal"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-slate-900 pb-2 border-b border-slate-100"
            >
              Careers
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-semibold text-slate-600 hover:text-slate-900"
            >
              Resources
            </a>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[14px] font-semibold text-slate-600 hover:text-slate-900"
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

/* ---------- SECTION 2 — HERO ---------- */
function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#f2f6f4] to-[#f9fafb] pt-32 pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10 relative">
        {/* Left Column: Headline details */}
        <div className="flex flex-col items-start text-left max-w-2xl">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-3 py-1.5 text-[10px] font-bold font-mono tracking-widest inline-flex items-center gap-1.5 mb-6 uppercase shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Aetherfield Engine</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[62px] tracking-tight leading-[1.08] text-[#0e3e2e]">
            Sustainability insights, built for business
          </h1>

          <p className="mt-6 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            Total financial & carbon accounting tools designed for security, auditability, and speed. Measure, model, and disclose compliant ESG metrics effortlessly.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto">
            <Link
              to="/signup"
              className="bg-[#0e3e2e] hover:bg-[#07241a] text-white text-xs font-bold tracking-wider px-8 py-4 rounded-full transition-all uppercase shadow-md flex-1 sm:flex-none text-center"
            >
              Start for free
            </Link>
            <Link
              to="/contact"
              className="border border-slate-250 hover:bg-slate-50 text-slate-700 bg-white text-xs font-bold tracking-wider px-8 py-4 rounded-full transition-colors uppercase shadow-sm flex-1 sm:flex-none text-center"
            >
              Talk to an expert
            </Link>
          </div>
        </div>

        {/* Right Column: Caroline Dashboard Widget */}
        <div className="w-full rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xl flex flex-col items-stretch text-left animate-float">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
            <div>
              <span className="text-slate-400 text-xs font-mono tracking-widest uppercase">Overview</span>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">Good morning Caroline</h3>
            </div>
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dashboard up to date</span>
            </div>
          </div>

          {/* Cards & Chart Grid */}
          <div className="grid sm:grid-cols-[220px_1fr] gap-6 mt-6 items-stretch">
            {/* Left Card: Footprint */}
            <div className="bg-[#fef08a]/60 border border-yellow-250 rounded-2xl p-6 flex flex-col justify-between relative shadow-sm overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-yellow-200/20 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-yellow-900 text-[10px] font-bold font-mono tracking-wider uppercase block">Carbon Footprint</span>
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 block mt-4">583.7 t</span>
                <span className="text-yellow-800 text-[11px] font-semibold mt-1 block">CO2e Emissions</span>
              </div>
              <div className="mt-8 border-t border-yellow-200/40 pt-4 flex items-center justify-between text-yellow-850 text-[10px] font-mono">
                <span>Scope 1, 2 & 3</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>

            {/* Right Card: Interactive Bar Chart */}
            <div className="border border-slate-100 bg-[#f9fafb] rounded-2xl p-5 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-slate-400 text-[10px] font-bold font-mono tracking-wider uppercase block">Emissions Trend (t CO2e)</span>
                <div className="flex items-end justify-between gap-2 h-36 mt-4 border-b border-slate-200/50 pb-2">
                  {[
                    { month: "Jan", val: 30 },
                    { month: "Feb", val: 45 },
                    { month: "Mar", val: 40 },
                    { month: "Apr", val: 55 },
                    { month: "May", val: 50 },
                    { month: "Jun", val: 65 },
                    { month: "Jul", val: 75, active: true },
                    { month: "Aug", val: 60 },
                    { month: "Sep", val: 55 },
                    { month: "Oct", val: 45 },
                    { month: "Nov", val: 40 },
                    { month: "Dec", val: 35 },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                      <div
                        style={{ height: `${bar.val}%` }}
                        className={`w-full rounded-t-sm transition-all duration-350 ${
                          bar.active ? "bg-emerald-500 shadow-md scale-x-[1.05]" : "bg-slate-200 hover:bg-slate-350"
                        }`}
                      />
                      <span className="text-[9px] font-mono text-slate-400 select-none">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 3 — FEATURE TABS ---------- */
function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<"measure" | "model" | "report" | "act">("measure");

  const tabContents = {
    measure: {
      title: "Carbon accounting with automated data extraction",
      metric: "583.7 t",
      metricLabel: "Carbon Footprint"
    },
    model: {
      title: "Scenario analytics for your supply chain",
      metric: "-18.4%",
      metricLabel: "Est. Carbon Drop"
    },
    report: {
      title: "CSRD & SEC compliant disclosures",
      metric: "100%",
      metricLabel: "Compliance Score"
    },
    act: {
      title: "Science-based targets and reduction roadmaps",
      metric: "Net Zero",
      metricLabel: "Milestone Target"
    }
  };

  return (
    <section className="relative bg-white py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header Title */}
        <div className="w-full max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#0e3e2e] tracking-tight leading-[1.12]">
            Everything you need to measure, model, and act on sustainability
          </h2>
        </div>

        {/* 2-Column Tabs Grid */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Tab Selectors */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              {[
                { id: "measure", label: "Track", desc: "Carbon accounting with automated data extraction" },
                { id: "model", label: "Model", desc: "Scenario analytics for your supply chain" },
                { id: "report", label: "Report", desc: "CSRD & SEC compliant disclosures" },
                { id: "act", label: "Act", desc: "Science-based targets and reduction roadmaps" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left py-4 px-5 rounded-2xl transition-all duration-300 flex items-start justify-between border ${
                    activeTab === tab.id
                      ? "bg-[#f2f6f4] border-emerald-100 shadow-sm"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[15px] text-slate-900">{tab.label}</span>
                    <span className="text-xs text-slate-500 font-light mt-0.5">{tab.desc}</span>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 text-slate-400 transition-all duration-300 mt-1 shrink-0 ${
                      activeTab === tab.id ? "translate-x-1 text-[#0e3e2e]" : ""
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Link
                to="/signup"
                className="bg-[#0e3e2e] hover:bg-[#07241a] text-white text-xs font-bold tracking-wider px-8 py-4 rounded-full transition-all uppercase inline-block shadow-md"
              >
                Explore Features
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center border border-slate-100 shadow-xl bg-slate-50">
            {/* Base graphic */}
            <img
              src={aetherfieldHeroSky}
              alt="Sky Blue Graphic with Silk Fabric"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            {/* Dynamic Card Overlay */}
            <div className="relative z-10 bg-white/90 border border-white/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl max-w-[280px] sm:max-w-[320px] transition-all duration-500 hover:scale-[1.02]">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#10b981] uppercase block">Aetherfield Engine</span>
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-[#0e3e2e] block mt-4 transition-all duration-350">
                {tabContents[activeTab].metric}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block mt-1">
                {tabContents[activeTab].metricLabel}
              </span>
              <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-mono text-slate-450 flex items-center justify-between">
                <span>Active Model</span>
                <span className="capitalize text-[#10b981] font-bold">{activeTab}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 4 — CLARITY & ACTION ---------- */
function ClarityAndAction() {
  return (
    <section id="features" className="relative bg-[#f2f6f4] py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#0e3e2e] tracking-tight leading-tight">
            Built for clarity.<br />Designed for action.
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Carbon accounting",
              desc: "Track scope 1, 2, and 3 emissions across your operations automatically. Full data integration with utility boards and invoices.",
              icon: PieChart,
            },
            {
              title: "Supply chain transparency",
              desc: "Gather ESG disclosures and activity data from your vendors. Automate data requests and keep supplier scorecards in one ledger.",
              icon: Globe,
            },
            {
              title: "Regulatory compliance",
              desc: "Export reports aligned with CSRD, SEC, and other global frameworks. Safe audit trails that accountants and verifiers trust.",
              icon: Gauge,
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-[#0e3e2e] shrink-0 mb-6 bg-slate-50">
                  <item.icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-light mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 5 — CASE STUDY HALFTONE ---------- */
function HalftoneSpreadsheets() {
  return (
    <section className="relative bg-white py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Team Graphic */}
        <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-lg bg-slate-105 aspect-square flex items-center justify-center max-w-md mx-auto">
          <img
            src={aetherfieldTeamBlue}
            alt="Colleagues talking Halftone Graphic"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Right Column: Case study metrics details */}
        <div className="flex flex-col items-start max-w-xl">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#10b981] font-bold uppercase">
            // CASE STUDY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#0e3e2e] tracking-tight mt-4 leading-snug">
            Why Acme Inc. chose Aetherfield for compliance
          </h2>

          {/* Metric Rows */}
          <div className="grid grid-cols-2 gap-6 w-full mt-8 border-y border-slate-100 py-6">
            <div>
              <span className="text-4xl sm:text-5xl font-display font-bold text-[#0e3e2e] block">34%</span>
              <span className="text-[11px] text-slate-500 font-light mt-1.5 block leading-normal">
                More reporting coverage compared to spreadsheet models
              </span>
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-display font-bold text-[#0e3e2e] block">2.4x</span>
              <span className="text-[11px] text-slate-500 font-light mt-1.5 block leading-normal">
                Faster validation during third-party audit periods
              </span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/contact"
              className="bg-[#0e3e2e] hover:bg-[#07241a] text-white text-xs font-bold tracking-wider px-8 py-4 rounded-full transition-all uppercase shadow-md"
            >
              Read case study
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 6 — JOURNAL ---------- */
function JournalSection() {
  return (
    <section id="journal" className="relative bg-[#f2f6f4] py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#10b981] font-bold uppercase">
              // FROM THE JOURNAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0e3e2e] tracking-tight mt-3">
              Read the latest ESG reports
            </h2>
          </div>
          <div>
            <Link
              to="/signup"
              className="bg-[#0e3e2e] hover:bg-[#07241a] text-white text-xs font-bold tracking-wider px-8 py-4 rounded-full transition-all uppercase shadow-md inline-block"
            >
              View all articles
            </Link>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid gap-6 md:grid-cols-3 mt-4">
          {[
            {
              img: aetherfieldJournalSky,
              cat: "Insights · 5 min read",
              title: "How to Model Scope 3 Supply Chain Risks",
            },
            {
              img: aetherfieldJournalMoss,
              cat: "Policy · 4 min read",
              title: "European Parliament Passes CSRD Updates: What You Need to Know",
            },
            {
              img: aetherfieldJournalTurbine,
              cat: "Technology · 8 min read",
              title: "Inside the Aetherfield Transition Model: How the Engine Works",
            }
          ].map((art, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full min-h-[360px]"
            >
              <div className="aspect-[16/10] overflow-hidden border-b border-slate-50 bg-slate-100 shrink-0">
                <img
                  src={art.img}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-350"
                  draggable={false}
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-semibold text-[#10b981] uppercase tracking-widest font-mono">{art.cat}</span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0e3e2e] leading-snug mt-2 transition-colors">
                    {art.title}
                  </h3>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 group-hover:text-[#0e3e2e] transition-colors">
                  <span>Read full story</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 7 — TESTIMONIAL ---------- */
function TestimonialSection() {
  return (
    <section className="relative bg-white py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-center">
        {/* Left Column: Portrait */}
        <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-lg bg-slate-50 aspect-square flex items-center justify-center max-w-xs mx-auto md:ml-0">
          <img
            src={aetherfieldClairePortrait}
            alt="Claire Williams Portrait Halftone"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Right Column: Quote */}
        <div className="flex flex-col items-start max-w-2xl">
          <Quote className="h-10 w-10 text-slate-200 stroke-[1.5] mb-6" />
          <p className="text-xl sm:text-2xl font-display font-bold text-[#0e3e2e] leading-normal">
            "We finally moved past spreadsheets and guesswork. Now we have real data to guide real decisions."
          </p>
          <div className="mt-6 flex flex-col gap-0.5">
            <span className="text-xs font-bold text-slate-900 font-mono">Claire Williams</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">Head of Sustainability, Fictional Co.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 8 — CTA BANNER ---------- */
function CTABanner() {
  return (
    <section className="relative bg-white pb-20 pt-8 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl mx-auto bg-[#0e3e2e] text-white rounded-3xl p-12 sm:p-16 shadow-xl text-center overflow-hidden flex flex-col items-center">
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-bold tracking-tight leading-tight max-w-2xl relative z-10">
          Ready to operationalize your sustainability goals?
        </h2>
        <div className="mt-8 relative z-10">
          <Link
            to="/signup"
            className="bg-white hover:bg-slate-100 text-[#0e3e2e] text-xs font-bold tracking-wider px-8 py-4 rounded-full transition-all uppercase shadow-md inline-block"
          >
            Request demo
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 9 — FOOTER ---------- */
export function Footer() {
  return (
    <footer className="relative bg-slate-50 py-16 px-6 sm:px-12 lg:px-20 border-t border-slate-100">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-10">
        {/* Content row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-slate-200/50 pb-10">
          {/* Logo left */}
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold tracking-tight font-display text-[#0e3e2e]">
              Aetherfield
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Sustainability insights, built for business.</span>
          </div>

          {/* Links right */}
          <ul className="flex flex-wrap items-center gap-6 sm:gap-10 text-[13px] font-semibold text-slate-500">
            <li>
              <a href="#features" className="hover:text-[#0e3e2e] transition-colors">
                Product
              </a>
            </li>
            <li>
              <a href="#journal" className="hover:text-[#0e3e2e] transition-colors">
                Journal
              </a>
            </li>
            <li>
              <a href="#workflow" className="hover:text-[#0e3e2e] transition-colors">
                About
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#0e3e2e] transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#0e3e2e] transition-colors">
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
          <span>© 2026 Aetherfield. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
