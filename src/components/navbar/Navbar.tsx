import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { NAV_ITEMS } from "../../data/navigation";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { cn } from "../../utils/cn";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const { isScrolled } = useScrollProgress();
  const prefersReducedMotion = usePrefersReducedMotion();
  const navigate = useNavigate();

  const handleNavClick = (name: string, href: string) => {
    setActiveItem(name);
    setMobileMenuOpen(false);

    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    }
  };

  const handleEnterPortfolio = () => {
    setMobileMenuOpen(false);
    navigate("/home");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 md:py-6 transition-all duration-300 pointer-events-none">
      {/* Floating Glassmorphism Pill Container */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "pointer-events-auto w-full max-w-5xl rounded-full px-5 py-2.5 md:py-3",
          "flex items-center justify-between",
          "transition-all duration-300",
          isScrolled
            ? "bg-[#0b1126]/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.7)]"
            : "bg-[#080d21]/60 backdrop-blur-md border border-white/[0.07] shadow-lg shadow-black/20"
        )}
        aria-label="Main Navigation"
      >
        {/* Left: Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg px-1.5 py-0.5"
          aria-label="Prasanta Gorai Portfolio Home"
        >
          <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-purple-300 transition-colors">
            PG<span className="text-purple-400 inline-block group-hover:scale-125 transition-transform duration-300">.</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item.name;
            return (
              <li key={item.name} className="relative">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.name, item.href);
                  }}
                  className={cn(
                    "relative px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-colors rounded-full",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {item.name}

                  {/* Active Indicator: dot & subtle glow */}
                  {isActive && (
                    <motion.div
                      layoutId="navActiveDot"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right: Enter Portfolio CTA Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleEnterPortfolio}
            className={cn(
              "group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white",
              "bg-gradient-to-r from-indigo-950/70 to-purple-950/70 hover:from-indigo-900/90 hover:to-purple-900/90",
              "border border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_15px_rgba(147,51,234,0.25)] hover:shadow-[0_0_20px_rgba(168,85,247,0.45)]",
              "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            )}
            aria-label="Enter Portfolio"
          >
            <span>Enter Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile Glass Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 md:hidden rounded-2xl bg-[#0a0f24]/95 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl shadow-black/80"
          >
            <ul className="flex flex-col space-y-2 mb-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.name, item.href);
                    }}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      activeItem === item.name
                        ? "bg-purple-950/50 text-white border border-purple-500/30"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            <button
              onClick={handleEnterPortfolio}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            >
              <span>Enter Portfolio</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
