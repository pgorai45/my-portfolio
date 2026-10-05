import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnterPortfolio = () => {
    navigate("/home");
  };

  const fadeInUp = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative pt-16 sm:pt-24 pb-28 sm:pb-36 md:pb-44 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background Ambient Radial Glow */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-purple-700/25 via-indigo-900/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Futuristic Landscape Silhouette with Purple Glowing Ridges & Light Trails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Layer 1: Stars / Particles */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full shadow-[0_0_8px_#d8b4fe]" />
          <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-cyan-300 rounded-full" />
          <div className="absolute top-2/5 right-1/6 w-1 h-1 bg-indigo-300 rounded-full" />
        </div>

        {/* Layer 2: Cyber Perspective Ground Light Trails */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[240px] md:h-[320px] opacity-70"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="horizonGlow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="trailGrad1" x1="50%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="trailGrad2" x1="50%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>

            <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Vanishing Horizon Line & Glow */}
          <line x1="0" y1="120" x2="1440" y2="120" stroke="url(#horizonGlow)" strokeWidth="1.5" />
          <ellipse cx="720" cy="120" rx="350" ry="15" fill="#a855f7" fillOpacity="0.25" filter="url(#neonBlur)" />

          {/* Perspective Cyber Light Trails converging at (720, 120) */}
          <line x1="720" y1="120" x2="100" y2="320" stroke="url(#trailGrad1)" strokeWidth="1" opacity="0.3" />
          <line x1="720" y1="120" x2="350" y2="320" stroke="url(#trailGrad1)" strokeWidth="1.5" opacity="0.6" />
          <line x1="720" y1="120" x2="550" y2="320" stroke="url(#trailGrad1)" strokeWidth="2" opacity="0.8" />
          <line x1="720" y1="120" x2="670" y2="320" stroke="#c084fc" strokeWidth="2.5" opacity="0.9" filter="url(#neonBlur)" />
          <line x1="720" y1="120" x2="770" y2="320" stroke="#c084fc" strokeWidth="2.5" opacity="0.9" filter="url(#neonBlur)" />
          <line x1="720" y1="120" x2="890" y2="320" stroke="url(#trailGrad2)" strokeWidth="2" opacity="0.8" />
          <line x1="720" y1="120" x2="1090" y2="320" stroke="url(#trailGrad2)" strokeWidth="1.5" opacity="0.6" />
          <line x1="720" y1="120" x2="1340" y2="320" stroke="url(#trailGrad2)" strokeWidth="1" opacity="0.3" />

          {/* Horizontal Perspective Rung Lines */}
          <line x1="620" y1="140" x2="820" y2="140" stroke="#a855f7" strokeWidth="1" opacity="0.3" />
          <line x1="500" y1="170" x2="940" y2="170" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
          <line x1="360" y1="215" x2="1080" y2="215" stroke="#a855f7" strokeWidth="1" opacity="0.35" />
          <line x1="180" y1="275" x2="1260" y2="275" stroke="#a855f7" strokeWidth="1.5" opacity="0.4" />
        </svg>

        {/* Layer 3: Dark Mountain Silhouettes with Glowing Purple Ridge Highlights (Matching Reference Image) */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[220px] md:h-[300px]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="leftRidgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#9333ea" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="rightRidgeGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#9333ea" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.2" />
            </linearGradient>

            <filter id="ridgeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Mountain Body & Glowing Ridge Line */}
          <path
            d="M-50 300 L-50 140 Q 60 70, 160 130 T 360 80 T 520 180 T 660 260 L 660 300 Z"
            fill="#050818"
            fillOpacity="0.95"
          />
          {/* Glowing Crest Edge */}
          <path
            d="M-50 140 Q 60 70, 160 130 T 360 80 T 520 180 T 660 260"
            stroke="url(#leftRidgeGrad)"
            strokeWidth="3"
            filter="url(#ridgeGlow)"
          />
          <path
            d="M-50 140 Q 60 70, 160 130 T 360 80 T 520 180 T 660 260"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.75"
          />

          {/* Right Mountain Body & Glowing Ridge Line */}
          <path
            d="M1490 300 L1490 120 Q 1380 60, 1260 110 T 1080 75 T 900 170 T 780 260 L 780 300 Z"
            fill="#050818"
            fillOpacity="0.95"
          />
          {/* Glowing Crest Edge */}
          <path
            d="M1490 120 Q 1380 60, 1260 110 T 1080 75 T 900 170 T 780 260"
            stroke="url(#rightRidgeGrad)"
            strokeWidth="3"
            filter="url(#ridgeGlow)"
          />
          <path
            d="M1490 120 Q 1380 60, 1260 110 T 1080 75 T 900 170 T 780 260"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.75"
          />
        </svg>

        {/* Ambient Dark Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#020617] to-transparent" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Label */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="text-[11px] md:text-xs font-semibold tracking-[0.25em] uppercase text-indigo-300/80">
            READY TO KNOW MORE?
          </span>
          <span className="w-8 h-[1px] bg-gradient-to-r from-purple-500/80 to-transparent" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 sm:mb-8"
        >
          Let&apos;s explore{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-400 glow-text-purple">
            my work
          </span>
        </motion.h2>

        {/* Enter Portfolio Button */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="w-full sm:w-auto flex justify-center"
        >
          <button
            onClick={handleEnterPortfolio}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full px-6 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-400 shadow-[0_0_35px_rgba(147,51,234,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.85)] border border-purple-400/40 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 w-full min-[420px]:w-auto"
            aria-label="Enter Portfolio Homepage"
          >
            <span>Enter Portfolio</span>
            <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
