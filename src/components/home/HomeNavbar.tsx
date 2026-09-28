import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight, ArrowLeft } from "lucide-react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { cn } from "../../utils/cn";

interface HomeNavItem {
  name: string;
  href: string;
}

const HOME_NAV_ITEMS: HomeNavItem[] = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Resume", href: "#resume" },
  { name: "Contact", href: "#contact" },
];

export const HomeNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const { isScrolled } = useScrollProgress();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scrollspy to highlight active section in navbar
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180;
      const sections = ["hero", ...HOME_NAV_ITEMS.map((item) => item.href.replace("#", ""))];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3.5 md:py-5 transition-all duration-300 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "pointer-events-auto w-full max-w-6xl rounded-full px-5 py-2.5 md:py-3",
          "flex items-center justify-between",
          "transition-all duration-300",
          isScrolled
            ? "bg-[#080d21]/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.8)]"
            : "bg-[#050818]/65 backdrop-blur-md border border-white/[0.07] shadow-lg shadow-black/20"
        )}
        aria-label="Portfolio Navigation"
      >
        {/* Left: Brand Logo & Back to Landing Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 group rounded-lg px-1.5 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            title="Return to Landing Page"
            aria-label="Back to Landing Page"
          >
            <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-purple-300 transition-colors">
              PG<span className="text-purple-400 inline-block group-hover:scale-125 transition-transform duration-300">.</span>
            </span>
          </Link>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-purple-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] rounded-full px-2.5 py-1 transition-all"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-3 h-3 text-purple-400" />
            <span>Landing</span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
          {HOME_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <li key={item.name} className="relative">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={cn(
                    "relative px-3 py-1.5 text-xs xl:text-sm font-medium transition-colors rounded-full",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {item.name}

                  {/* Active Indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="homeNavDot"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right: Contact CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#contact");
            }}
            className={cn(
              "group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white",
              "bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-indigo-500/80 hover:from-indigo-600 hover:to-purple-600",
              "border border-purple-400/30 hover:border-purple-300/50 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]",
              "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            )}
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 lg:hidden rounded-2xl bg-[#090d24]/95 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl shadow-black/80"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Portfolio Menu
              </span>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Landing</span>
              </Link>
            </div>

            <ul className="flex flex-col space-y-1.5 mb-4">
              {HOME_NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={cn(
                      "block px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                      activeSection === item.href.replace("#", "")
                        ? "bg-purple-950/50 text-white border border-purple-500/30"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contact");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
