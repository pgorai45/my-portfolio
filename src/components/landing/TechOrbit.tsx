import React from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export const TechOrbit: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Floating animations
  const floatAnim = prefersReducedMotion
    ? {}
    : {
        animate: {
          y: [-8, 8, -8],
        },
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const orbitBadgeAnim = (delay = 0, yOffset = 6) =>
    prefersReducedMotion
      ? {}
      : {
          animate: {
            y: [-yOffset, yOffset, -yOffset],
            x: [yOffset * 0.5, -yOffset * 0.5, yOffset * 0.5],
          },
          transition: {
            duration: 4.5 + delay,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay,
          },
        };

  return (
    <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none">
      {/* Background Ambient Radial Glows */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-purple-600/25 via-indigo-600/20 to-cyan-500/15 blur-[80px] pointer-events-none" />
      <div className="absolute w-[220px] h-[220px] rounded-full bg-purple-500/20 blur-[50px] pointer-events-none" />

      {/* Floating Sparkle Particles */}
      <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[0.5px] shadow-[0_0_8px_#22d3ee] animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-purple-400 blur-[0.5px] shadow-[0_0_10px_#c084fc] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/5 w-1.5 h-1.5 rounded-full bg-indigo-300 blur-[0.5px] shadow-[0_0_8px_#818cf8]" />
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-blue-400 blur-[0.5px] shadow-[0_0_10px_#60a5fa] animate-pulse" />

      {/* Glowing Elliptical Orbit Rings (SVG for crisp resolution & neon gradient) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glowFilter1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit Ring 1 (Tilted ellipse) */}
        <ellipse
          cx="300"
          cy="300"
          rx="250"
          ry="110"
          transform="rotate(-28 300 300)"
          stroke="url(#orbitGrad1)"
          strokeWidth="1.75"
          filter="url(#glowFilter1)"
          strokeDasharray="450 15 200 15"
          opacity="0.85"
        />

        {/* Orbit Ring 2 (Counter tilted ellipse) */}
        <ellipse
          cx="300"
          cy="300"
          rx="230"
          ry="95"
          transform="rotate(35 300 300)"
          stroke="url(#orbitGrad2)"
          strokeWidth="1.5"
          filter="url(#glowFilter1)"
          strokeDasharray="300 20 150 20"
          opacity="0.65"
        />
      </svg>

      {/* Center 3D Isometric/Perspective Laptop Illustration */}
      <motion.div {...floatAnim} className="relative z-10 w-[84%] max-w-[440px]">
        <div className="relative transform perspective-[1200px] rotate-x-[16deg] rotate-y-[-14deg] rotate-z-[4deg] transition-transform duration-700 hover:rotate-x-[12deg] hover:rotate-y-[-10deg]">
          {/* Laptop Screen Body */}
          <div className="relative rounded-2xl p-[3px] bg-gradient-to-b from-slate-600 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(147,51,234,0.3)]">
            {/* Screen Bezel & Display */}
            <div className="relative rounded-[13px] bg-[#030712] p-3 overflow-hidden border border-slate-700/60">
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80 shadow-[0_0_5px_#ef4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80 shadow-[0_0_5px_#eab308]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80 shadow-[0_0_5px_#22c55e]" />
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
                  Portfolio.tsx
                </div>
                <div className="w-10 flex justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                </div>
              </div>

              {/* Realistic Code Lines Editor */}
              <div className="font-mono text-[9px] min-[380px]:text-[10px] sm:text-[11px] leading-4 sm:leading-5 space-y-0.5 text-left">
                <div className="flex gap-2 sm:gap-3">
                  <span className="text-slate-600 select-none text-[8px] sm:text-[10px] w-3.5 sm:w-4 text-right">1</span>
                  <span>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">developer</span> = &#123;
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-600 select-none text-[10px] w-4 text-right">2</span>
                  <span className="pl-3">
                    <span className="text-slate-400">name:</span>{" "}
                    <span className="text-emerald-400">&quot;Prasanta Gorai&quot;</span>,
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-600 select-none text-[10px] w-4 text-right">3</span>
                  <span className="pl-3">
                    <span className="text-slate-400">role:</span>{" "}
                    <span className="text-emerald-400">&quot;Full Stack Developer&quot;</span>,
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-600 select-none text-[10px] w-4 text-right">4</span>
                  <span className="pl-3">
                    <span className="text-slate-400">passion:</span>{" "}
                    <span className="text-cyan-300">&quot;Interactive Scalable Web&quot;</span>,
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-600 select-none text-[10px] w-4 text-right">5</span>
                  <span className="pl-3">
                    <span className="text-purple-400">stack:</span> [
                    <span className="text-amber-300">&quot;React&quot;</span>,{" "}
                    <span className="text-amber-300">&quot;Node&quot;</span>,{" "}
                    <span className="text-amber-300">&quot;TypeScript&quot;</span>]
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-600 select-none text-[10px] w-4 text-right">6</span>
                  <span>&#125;;</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-600 select-none text-[10px] w-4 text-right">7</span>
                  <span>
                    <span className="text-indigo-400">renderExperience</span>(developer);
                  </span>
                </div>
              </div>

              {/* Screen Ambient Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
            </div>
          </div>

          {/* Laptop Keyboard Base & Trackpad */}
          <div className="relative -mt-1 mx-auto w-[104%] -left-[2%] h-7 rounded-b-2xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border-t border-slate-600/80 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex items-center justify-center">
            {/* Front Notch */}
            <div className="w-16 h-1 rounded-full bg-slate-900 border border-slate-700" />
            {/* Glow under base reflection */}
            <div className="absolute -bottom-2 inset-x-8 h-4 bg-purple-500/30 blur-lg rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Floating Tech Badges (Matching the 4 badges in reference image) */}

      {/* 1. React Icon Badge (Top-Left) */}
      <motion.div
        {...orbitBadgeAnim(0, 7)}
        className="absolute top-[6%] left-[4%] sm:left-[6%] z-20"
        title="React"
      >
        <div className="p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-[#090f28]/85 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:border-cyan-400 transition-all">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" viewBox="-11.5 -10.23174 23 20.46348">
            <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
            <g stroke="#00d8ff" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* 2. JavaScript Badge (Right-Middle) */}
      <motion.div
        {...orbitBadgeAnim(1.2, 8)}
        className="absolute top-[28%] right-[2%] sm:-right-[2%] z-20"
        title="JavaScript"
      >
        <div className="p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-[#14151e]/85 backdrop-blur-md border border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.35)] hover:border-yellow-400 transition-all">
          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-[#f7df1e] rounded flex items-end justify-end p-0.5 shadow-sm">
            <span className="font-extrabold text-[#000000] text-[10px] sm:text-[11px] md:text-[12px] leading-tight pr-0.5">JS</span>
          </div>
        </div>
      </motion.div>

      {/* 3. Python Badge (Bottom-Left) */}
      <motion.div
        {...orbitBadgeAnim(0.6, 6)}
        className="absolute bottom-[14%] left-[6%] sm:left-[10%] z-20"
        title="Python"
      >
        <div className="p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-[#0a1226]/85 backdrop-blur-md border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:border-blue-400 transition-all">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" viewBox="0 0 128 128">
            <path
              fill="#387eb8"
              d="M63.5 6.7c-29.3 0-27.5 12.7-27.5 12.7l.1 13.2h28.1v4H25.4S6.2 34.4 6.2 64.2c0 29.8 16.8 28.7 16.8 28.7h10.1v-14.2s-.5-16.8 16.5-16.8h28.2v-4.2S79.6 42 79.6 30.1c0-11.8-16.1-23.4-16.1-23.4zm-14.7 9.8c2.9 0 5.2 2.3 5.2 5.2s-2.3 5.2-5.2 5.2-5.2-2.3-5.2-5.2 2.3-5.2 5.2-5.2z"
            />
            <path
              fill="#ffe873"
              d="M64.5 121.3c29.3 0 27.5-12.7 27.5-12.7l-.1-13.2H63.8v-4h38.8s19.2 2.2 19.2-27.6c0-29.8-16.8-28.7-16.8-28.7h-10.1v14.2s.5 16.8-16.5 16.8H50.2v4.2s-1.8 9.7-1.8 21.6c0 11.8 16.1 23.4 16.1 23.4zm14.7-9.8c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2z"
            />
          </svg>
        </div>
      </motion.div>

      {/* 4. Database Badge (Bottom-Right) */}
      <motion.div
        {...orbitBadgeAnim(1.8, 7)}
        className="absolute bottom-[18%] right-[5%] sm:right-[8%] z-20"
        title="Database & Cloud"
      >
        <div className="p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-[#140b28]/85 backdrop-blur-md border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:border-purple-400 transition-all">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
