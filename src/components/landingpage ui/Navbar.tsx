import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
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
      // Navigate to homepage with section hash
      navigate({ to: "/", hash: targetId }).then(() => {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });
    } else {
      // Already on homepage, smooth scroll directly
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
    { label: "How It Works", target: "how-it-works" },
    { label: "Solutions", target: "solutions" },
    { label: "Pricing", target: "pricing" },
    { label: "Resources", target: "resources" },
    { label: "FAQ", target: "faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-[4px] border-black shadow-[0_1px_4px_rgba(0,0,0,0.04)] w-full">
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 max-w-7xl mx-auto w-full">
        {/* Logo left */}
        <Link to="/" className="flex items-center gap-2 select-none font-brand shrink-0">
          <img src={logo} alt="TODELLAA Logo" className="h-7 sm:h-8 w-auto object-contain" />
          <span className="text-lg sm:text-xl font-black tracking-tight text-[#000000] font-brand">TODELLAA</span>
        </Link>

        {/* Nav links middle */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans">
          {navItems.map((item) => (
            <a
              key={item.target}
              href={`/#${item.target}`}
              onClick={(e) => handleNavClick(e, item.target)}
              className="text-sm font-medium text-[#18181b] hover:text-black transition-colors cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Auth CTA right */}
        <div className="hidden md:flex items-center gap-4 font-sans">
          <Link
            to="/login"
            className="text-sm font-medium text-[#18181b] hover:text-black transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-[#3675ff] hover:bg-[#2563eb] text-white font-medium text-sm py-2.5 px-5 rounded-[8px] transition-colors shadow-2xs"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center bg-neutral-100 border border-neutral-300 rounded-lg text-black hover:bg-neutral-200 transition-all cursor-pointer shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full bg-[#f7f6f1]/95 border-b border-neutral-200 backdrop-blur-xl px-6 py-6 flex flex-col gap-4 shadow-lg z-50 md:hidden font-sans">
          {navItems.map((item) => (
            <a
              key={item.target}
              href={`/#${item.target}`}
              onClick={(e) => handleNavClick(e, item.target)}
              className="text-sm font-medium text-neutral-800 hover:text-black py-2 border-b border-neutral-200/40 cursor-pointer"
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-center py-2 text-neutral-800 border border-neutral-300 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-center py-2.5 bg-[#3675ff] text-white rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
