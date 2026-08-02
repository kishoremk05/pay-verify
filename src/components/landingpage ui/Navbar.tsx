import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Menu, X, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const isHomePage = location.pathname === "/" || location.pathname === "";

    if (!isHomePage) {
      navigate({ to: "/", hash: targetId }).then(() => {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = targetId;
      }
    }
  };

  const navItems = [
    { label: "Features", target: "features" },
    { label: "Integrations", target: "integrations" },
    { label: "AI Tools", target: "ai-tools" },
    { label: "Pricing", target: "pricing" },
    { label: "Resources", target: "resources", hasDropdown: true },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full font-sans">
      {/* Announcement Bar */}
      <div className="bg-white border-b border-[#e6e4dc] py-2 px-4 text-center text-xs sm:text-sm font-medium text-[#404040] flex items-center justify-center gap-2 select-none">
        <Sparkles className="w-3.5 h-3.5 text-[#e8562a] shrink-0" />
        <span>
          <strong className="font-semibold text-[#1c1917]">New:</strong> AI Reconciliation Assistant is here!
        </span>
        <a
          href="#ai-tools"
          onClick={(e) => handleNavClick(e, "ai-tools")}
          className="text-[#e8562a] font-semibold hover:underline inline-flex items-center gap-1 ml-1"
        >
          Explore now <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Header Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#e6e4dc] transition-all">
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3.5 max-w-7xl mx-auto w-full">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 select-none shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-[#010101] text-white font-black text-sm flex items-center justify-center shadow-xs">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-[#010101]">TODELLAA</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 font-sans">
            {navItems.map((item) => (
              <a
                key={item.target}
                href={`/#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target)}
                className="text-[14px] font-medium text-[#404040] hover:text-[#010101] transition-colors flex items-center gap-1 cursor-pointer"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />}
              </a>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-5 font-sans">
            <Link
              to="/login"
              className="text-[14px] font-medium text-[#404040] hover:text-[#010101] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#e8562a] hover:bg-[#d44820] text-white font-semibold text-[14px] py-2.5 px-5 rounded-lg transition-all shadow-xs"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#e6e4dc] rounded-lg text-[#010101] hover:bg-neutral-100 transition-all cursor-pointer shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-[#e6e4dc] backdrop-blur-xl px-6 py-6 flex flex-col gap-4 shadow-xl z-50 md:hidden font-sans">
            {navItems.map((item) => (
              <a
                key={item.target}
                href={`/#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target)}
                className="text-sm font-medium text-[#404040] hover:text-[#010101] py-2 border-b border-[#e6e4dc]/60 cursor-pointer flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDown className="w-4 h-4 text-[#737373]" />}
              </a>
            ))}
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-center py-2.5 text-[#010101] border border-[#e6e4dc] bg-white rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-center py-2.5 bg-[#e8562a] text-white rounded-lg shadow-xs"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

