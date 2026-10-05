import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Play, X, Sparkles, Code2, Rocket } from "lucide-react";
import { TechOrbit } from "./TechOrbit";
import { ScrollIndicator } from "./ScrollIndicator";
import { TypewriterRole } from "./TypewriterRole";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export const LandingHero: React.FC = () => {
  const [introModalOpen, setIntroModalOpen] = useState(false);
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnterPortfolio = () => {
    navigate("/home");
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
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-28 md:pt-32 pb-4 overflow-hidden"
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/6 left-1/10 w-96 h-96 bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Hero Two-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            {/* Small Label */}
            <motion.div {...fadeInUp(0.1)} className="mb-3.5 sm:mb-4">
              <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-indigo-300/80 bg-indigo-950/30 border border-indigo-500/20 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                WELCOME TO MY PORTFOLIO
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              {...fadeInUp(0.25)}
              className="text-3xl min-[360px]:text-4xl min-[420px]:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.98] sm:leading-[0.95] text-white mb-3 sm:mb-4"
            >
              PRASANTA
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 glow-text-purple">
                GORAI
              </span>
            </motion.h1>

            {/* Role Tag */}
            <motion.div {...fadeInUp(0.4)} className="mb-4 sm:mb-5">
              <TypewriterRole />
            </motion.div>

            {/* Description */}
            <motion.p
              {...fadeInUp(0.55)}
              className="text-sm sm:text-base md:text-lg text-slate-400 max-w-lg leading-relaxed mb-6 sm:mb-8"
            >
              I build modern, scalable and interactive web applications with clean code and
              great user experiences.
            </motion.p>

            {/* Buttons */}
            <motion.div
              {...fadeInUp(0.7)}
              className="flex flex-col min-[420px]:flex-row flex-wrap items-stretch min-[420px]:items-center gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto"
            >
              {/* Primary CTA */}
              <button
                onClick={handleEnterPortfolio}
                className="group relative inline-flex items-center justify-center gap-3 rounded-full px-6 sm:px-7 py-3 sm:py-3.5 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-400 shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] border border-purple-400/30 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 w-full min-[420px]:w-auto"
              >
                <span>Enter Portfolio</span>
                <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              {/* Secondary CTA: Watch Intro */}
              <button
                onClick={() => setIntroModalOpen(true)}
                className="group inline-flex items-center justify-center gap-3 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm md:text-base font-medium text-slate-200 hover:text-white hover:bg-slate-900/40 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 w-full min-[420px]:w-auto"
                aria-label="Watch Intro Video or Presentation"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/90 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:border-purple-400 shadow-[0_0_12px_rgba(147,51,234,0.3)] group-hover:scale-105 transition-all">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 fill-current" />
                </div>
                <span>Watch Intro</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: Futuristic Tech Visual */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center items-center relative"
          >
            <TechOrbit />
          </motion.div>
        </div>
      </div>

      {/* Bottom Center: Scroll Indicator */}
      <div className="w-full">
        <ScrollIndicator />
      </div>

      {/* Interactive Watch Intro Modal */}
      <AnimatePresence>
        {introModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIntroModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-xl rounded-3xl bg-[#0b1026] border border-purple-500/30 p-5 sm:p-8 shadow-[0_25px_60px_-15px_rgba(147,51,234,0.3)] z-10 overflow-hidden max-h-[92dvh] overflow-y-auto custom-scrollbar"
              role="dialog"
              aria-modal="true"
              aria-labelledby="intro-title"
            >
              {/* Close Button */}
              <button
                onClick={() => setIntroModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                aria-label="Close intro dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="intro-title" className="text-xl font-bold text-white">
                    Hi, I&apos;m Prasanta Gorai
                  </h3>
                  <p className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
                    Full Stack Developer
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed mb-6">
                <p>
                  Welcome to my portfolio! I specialize in engineering responsive, high-performance web applications using modern technologies like React, TypeScript, Node.js, and modern cloud architectures.
                </p>
                <p>
                  Whether it&apos;s crafting pixel-perfect interfaces, architecting resilient backend APIs, or optimizing full-stack workflows, I focus on clean code and delightful user journeys.
                </p>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="block text-xs text-slate-400">Core Expertise</span>
                    <span className="text-sm font-semibold text-indigo-300">Frontend & Backend</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="block text-xs text-slate-400">Architecture</span>
                    <span className="text-sm font-semibold text-purple-300">Modern & Scalable</span>
                  </div>
                </div>
              </div>

              {/* Modal CTA */}
              <div className="flex flex-col-reverse min-[420px]:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setIntroModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors text-center"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIntroModalOpen(false);
                    navigate("/home");
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Enter Full Portfolio</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
