import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { HomeHeroVisual } from "./HomeHeroVisual";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export const HomeHero: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  const fadeInUp = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 25 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: "easeOut" as const },
        };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 md:pt-36 pb-16 overflow-hidden"
    >
      {/* Background Soft Glows */}
      {/* Clean Hero Background */}
      <div className="absolute inset-0 pointer-events-none bg-[#020617]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Personal Intro */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            {/* Small Label */}
            <motion.div {...fadeInUp(0.1)} className="mb-4">
              <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-indigo-300/90 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                FULL STACK DEVELOPER
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              {...fadeInUp(0.25)}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] text-white mb-5"
            >
              Hi, I&apos;m
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 glow-text-purple">
                Prasanta Gorai
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              {...fadeInUp(0.4)}
              className="text-base sm:text-lg text-slate-300/90 max-w-lg leading-relaxed mb-8 font-normal"
            >
              I build modern, scalable and interactive web applications with
              clean code and great user experiences.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              {...fadeInUp(0.55)}
              className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto mb-8"
            >
              {/* Primary: View My Work */}
              <button
                onClick={() => handleScrollTo("projects")}
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-6 sm:px-7 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-400 shadow-[0_0_30px_rgba(147,51,234,0.45)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] border border-purple-400/30 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Secondary: Download Resume */}
              <button
                onClick={() => handleScrollTo("resume")}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm sm:text-base font-medium text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800/80 border border-white/10 hover:border-purple-400/40 backdrop-blur-md transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shadow-md shadow-black/30"
              >
                <Download className="w-4 h-4 text-purple-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
                <span>Download Resume</span>
              </button>
            </motion.div>

            {/* Quick Metrics / Availability Strip */}
            <motion.div
              {...fadeInUp(0.7)}
              className="flex items-center gap-4 pt-4 border-t border-white/[0.08] text-xs text-slate-400"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-slate-300 font-medium">
                  Available for work
                </span>
              </div>
              <span className="text-slate-600">•</span>
              <span>Based in India</span>
              <span className="text-slate-600">•</span>
              <span>Remote & Worldwide</span>
            </motion.div>
          </div>

          {/* Right Column: Visual Showcase */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center items-center relative"
          >
            <HomeHeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
