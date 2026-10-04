import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  FolderCode,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { GithubIcon } from "../common/SocialIcons";
import { FEATURED_PROJECTS, type ProjectItem } from "../../data/projects";
import { portfolioApi } from "../../services/api";

// ─── Color Themes Per Project ───────────────────────────────────────────────
const ACCENT_STYLES = {
  amber: {
    badgeBg: "bg-amber-950/50 text-amber-300 border-amber-500/30",
    numberColor: "text-amber-400/80 group-hover:text-amber-300",
    hoverBorder: "hover:border-amber-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(245,158,11,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.14) 0%, transparent 70%)",
    previewBorder: "border-amber-500/20",
    previewBg: "from-amber-950/30 via-slate-900/60 to-slate-950/80",
    tagHover: "hover:border-amber-400/40 hover:text-amber-200 hover:bg-amber-950/30",
    btnGrad: "from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500",
  },
  purple: {
    badgeBg: "bg-purple-950/50 text-purple-300 border-purple-500/30",
    numberColor: "text-purple-400/80 group-hover:text-purple-300",
    hoverBorder: "hover:border-purple-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(168,85,247,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(168,85,247,0.14) 0%, transparent 70%)",
    previewBorder: "border-purple-500/20",
    previewBg: "from-purple-950/30 via-slate-900/60 to-slate-950/80",
    tagHover: "hover:border-purple-400/40 hover:text-purple-200 hover:bg-purple-950/30",
    btnGrad: "from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500",
  },
  cyan: {
    badgeBg: "bg-cyan-950/50 text-cyan-300 border-cyan-500/30",
    numberColor: "text-cyan-400/80 group-hover:text-cyan-300",
    hoverBorder: "hover:border-cyan-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(6,182,212,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(6,182,212,0.14) 0%, transparent 70%)",
    previewBorder: "border-cyan-500/20",
    previewBg: "from-cyan-950/30 via-slate-900/60 to-slate-950/80",
    tagHover: "hover:border-cyan-400/40 hover:text-cyan-200 hover:bg-cyan-950/30",
    btnGrad: "from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500",
  },
  emerald: {
    badgeBg: "bg-emerald-950/50 text-emerald-300 border-emerald-500/30",
    numberColor: "text-emerald-400/80 group-hover:text-emerald-300",
    hoverBorder: "hover:border-emerald-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(16,185,129,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.14) 0%, transparent 70%)",
    previewBorder: "border-emerald-500/20",
    previewBg: "from-emerald-950/30 via-slate-900/60 to-slate-950/80",
    tagHover: "hover:border-emerald-400/40 hover:text-emerald-200 hover:bg-emerald-950/30",
    btnGrad: "from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500",
  },
  indigo: {
    badgeBg: "bg-indigo-950/50 text-indigo-300 border-indigo-500/30",
    numberColor: "text-indigo-400/80 group-hover:text-indigo-300",
    hoverBorder: "hover:border-indigo-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(99,102,241,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)",
    previewBorder: "border-indigo-500/20",
    previewBg: "from-indigo-950/30 via-slate-900/60 to-slate-950/80",
    tagHover: "hover:border-indigo-400/40 hover:text-indigo-200 hover:bg-indigo-950/30",
    btnGrad: "from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500",
  },
};

// ─── Custom Domain Abstract Wireframe Previews ─────────────────────────────
const ProjectPreviewVisual: React.FC<{ type: ProjectItem["previewType"] }> = ({
  type,
}) => {
  switch (type) {
    case "furniture":
      return (
        <svg
          className="w-full h-full p-4 select-none"
          viewBox="0 0 320 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Bar Mockup */}
          <rect x="20" y="16" width="280" height="20" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <circle cx="34" cy="26" r="3" fill="#ef4444" opacity="0.8" />
          <circle cx="44" cy="26" r="3" fill="#f59e0b" opacity="0.8" />
          <circle cx="54" cy="26" r="3" fill="#10b981" opacity="0.8" />
          <rect x="74" y="22" width="120" height="8" rx="4" fill="#1e293b" />
          <rect x="250" y="21" width="38" height="10" rx="5" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="0.8" />

          {/* Wireframe Modern Armchair & Table Silhouette */}
          <path
            d="M80 130L120 100L160 130H80Z"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
          <path
            d="M100 80C100 70 140 70 140 80V105H100V80Z"
            fill="#d97706"
            fillOpacity="0.15"
            stroke="#f59e0b"
            strokeWidth="1.75"
          />
          <rect x="85" y="100" width="70" height="12" rx="4" fill="#b45309" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="95" y1="112" x2="90" y2="135" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="145" y1="112" x2="150" y2="135" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

          {/* Product Info Card Mockup */}
          <rect x="180" y="55" width="120" height="95" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4" />
          <rect x="192" y="68" width="60" height="8" rx="4" fill="#f59e0b" fillOpacity="0.8" />
          <rect x="192" y="82" width="96" height="5" rx="2.5" fill="#475569" />
          <rect x="192" y="92" width="80" height="5" rx="2.5" fill="#334155" />
          <rect x="192" y="106" width="38" height="8" rx="4" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="0.8" />
          <rect x="192" y="122" width="96" height="18" rx="6" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1" />
        </svg>
      );

    case "resume":
      return (
        <svg
          className="w-full h-full p-4 select-none"
          viewBox="0 0 320 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document Sheet Silhouette */}
          <rect x="35" y="20" width="130" height="140" rx="8" fill="#0f172a" stroke="#a855f7" strokeWidth="1.2" strokeOpacity="0.5" />
          <circle cx="65" cy="48" r="14" fill="#a855f7" fillOpacity="0.2" stroke="#c084fc" strokeWidth="1.2" />
          <rect x="88" y="40" width="60" height="7" rx="3.5" fill="#e2e8f0" />
          <rect x="88" y="52" width="45" height="5" rx="2.5" fill="#a855f7" fillOpacity="0.7" />

          {/* Simulated Resume Text Lines */}
          <rect x="48" y="74" width="104" height="4" rx="2" fill="#475569" />
          <rect x="48" y="83" width="95" height="4" rx="2" fill="#334155" />
          <rect x="48" y="92" width="100" height="4" rx="2" fill="#334155" />
          <rect x="48" y="105" width="88" height="4" rx="2" fill="#475569" />
          <rect x="48" y="114" width="75" height="4" rx="2" fill="#334155" />
          <rect x="48" y="123" width="92" height="4" rx="2" fill="#334155" />

          {/* AI Scanner Beam Animation */}
          <line x1="30" y1="85" x2="170" y2="85" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="32" y1="85" x2="168" y2="85" stroke="#a855f7" strokeWidth="6" opacity="0.2" />

          {/* AI Match Gauge & Analytics Card */}
          <rect x="180" y="30" width="115" height="120" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="237" cy="65" r="24" stroke="#334155" strokeWidth="4" />
          <circle
            cx="237"
            cy="65"
            r="24"
            stroke="#a855f7"
            strokeWidth="4"
            strokeDasharray="135 15"
            strokeLinecap="round"
          />
          <text x="237" y="70" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="13" fontWeight="bold">
            94%
          </text>
          <text x="237" y="102" textAnchor="middle" fill="#c084fc" fontFamily="sans-serif" fontSize="10" fontWeight="bold">
            SKILL MATCH
          </text>
          <rect x="195" y="116" width="85" height="6" rx="3" fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="0.8" />
          <rect x="195" y="128" width="65" height="6" rx="3" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="0.8" />
        </svg>
      );

    case "assistant":
      return (
        <svg
          className="w-full h-full p-4 select-none"
          viewBox="0 0 320 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Chat Window Frame */}
          <rect x="25" y="16" width="270" height="148" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.4" />

          {/* User Prompt Message Bubble */}
          <rect x="90" y="30" width="190" height="28" rx="8" fill="#083344" stroke="#06b6d4" strokeWidth="0.8" strokeOpacity="0.6" />
          <text x="105" y="48" fill="#e0f2fe" fontFamily="sans-serif" fontSize="10" fontWeight="500">
            Explain Binary Search Trees...
          </text>

          {/* Assistant AI Response Block */}
          <rect x="40" y="68" width="240" height="82" rx="8" fill="#031f2b" stroke="#0891b2" strokeWidth="0.8" strokeOpacity="0.5" />
          <circle cx="56" cy="85" r="7" fill="#06b6d4" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="1" />
          <rect x="70" y="81" width="80" height="7" rx="3.5" fill="#38bdf8" />

          {/* Code Snippet inside Assistant Response */}
          <rect x="52" y="98" width="216" height="42" rx="5" fill="#02131b" stroke="#0e7490" strokeWidth="0.8" />
          <text x="62" y="112" fill="#a5f3fc" fontFamily="monospace" fontSize="9">
            struct Node &#123; int val; Node *left; &#125;;
          </text>
          <text x="62" y="126" fill="#38bdf8" fontFamily="monospace" fontSize="9">
            // Time Complexity: O(log n)
          </text>
          <circle cx="258" cy="126" r="3" fill="#22d3ee" className="animate-pulse" />
        </svg>
      );

    case "flood":
      return (
        <svg
          className="w-full h-full p-4 select-none"
          viewBox="0 0 320 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Telemetry Dashboard Frame */}
          <rect x="25" y="16" width="270" height="148" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />

          {/* Status Header */}
          <circle cx="45" cy="34" r="4" fill="#10b981" className="animate-ping" />
          <circle cx="45" cy="34" r="4" fill="#10b981" />
          <text x="56" y="38" fill="#6ee7b7" fontFamily="monospace" fontSize="10" fontWeight="bold">
            HYDRO-TELEMETRY: SENSOR ACTIVE
          </text>
          <rect x="220" y="27" width="60" height="14" rx="7" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" />
          <text x="250" y="37" textAnchor="middle" fill="#a7f3d0" fontFamily="sans-serif" fontSize="9" fontWeight="600">
            LOW RISK
          </text>

          {/* Waveform Telemetry Chart Lines */}
          <line x1="45" y1="52" x2="275" y2="52" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="45" y1="85" x2="275" y2="85" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="45" y1="120" x2="275" y2="120" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

          {/* Rainfall / Flood Wave Curve */}
          <path
            d="M45 130 C75 125, 95 90, 125 95 C155 100, 175 60, 205 75 C235 90, 255 110, 275 80"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M45 130 C75 125, 95 90, 125 95 C155 100, 175 60, 205 75 C235 90, 255 110, 275 80 V140 H45 Z"
            fill="url(#floodGrad)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="floodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Telemetry Sensor Nodes */}
          <circle cx="125" cy="95" r="3" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
          <circle cx="205" cy="75" r="3" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
          <text x="205" y="65" textAnchor="middle" fill="#6ee7b7" fontFamily="monospace" fontSize="8">
            PEAK: 3.4m
          </text>
        </svg>
      );

    case "quiz":
      return (
        <svg
          className="w-full h-full p-4 select-none"
          viewBox="0 0 320 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Game Window Frame */}
          <rect x="25" y="16" width="270" height="148" rx="8" fill="#0f172a" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.4" />

          {/* Trivia Top Header Bar: Question No + Timer */}
          <rect x="40" y="27" width="90" height="16" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.8" />
          <text x="85" y="38" textAnchor="middle" fill="#c7d2fe" fontFamily="monospace" fontSize="9" fontWeight="bold">
            QUESTION 04/10
          </text>

          <circle cx="260" cy="35" r="11" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
          <text x="260" y="39" textAnchor="middle" fill="#38bdf8" fontFamily="monospace" fontSize="9" fontWeight="bold">
            15s
          </text>

          {/* Question Text Box */}
          <rect x="40" y="52" width="240" height="30" rx="6" fill="#1e1b4b" fillOpacity="0.5" stroke="#4f46e5" strokeWidth="0.8" />
          <text x="50" y="70" fill="#ffffff" fontFamily="sans-serif" fontSize="10" fontWeight="600">
            What is the time complexity of QuickSort?
          </text>

          {/* 4 Interactive Option Buttons */}
          <rect x="40" y="90" width="115" height="24" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="52" y="105" fill="#94a3b8" fontFamily="monospace" fontSize="9">
            A) O(n)
          </text>

          <rect x="165" y="90" width="115" height="24" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
          <text x="177" y="105" fill="#a7f3d0" fontFamily="monospace" fontSize="9" fontWeight="bold">
            B) O(n log n) ✓
          </text>

          <rect x="40" y="122" width="115" height="24" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="52" y="137" fill="#94a3b8" fontFamily="monospace" fontSize="9">
            C) O(n²)
          </text>

          <rect x="165" y="122" width="115" height="24" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="177" y="137" fill="#94a3b8" fontFamily="monospace" fontSize="9">
            D) O(1)
          </text>
        </svg>
      );
  }
};

// ─── Main HomeProjects Component ────────────────────────────────────────────
export const HomeProjects: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [projectsList, setProjectsList] = useState<(ProjectItem & { imageUrl?: string; liveDemoUrl?: string })[]>(FEATURED_PROJECTS as any);

  useEffect(() => {
    portfolioApi.getProjects().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const validAccents = ["amber", "purple", "cyan", "emerald", "indigo"] as const;
        const validPreviews = ["furniture", "resume", "crypto", "telemetry", "quiz"] as const;

        const mapped = res.data.map((p: any, idx: number) => {
          let tags: string[] = [];
          if (Array.isArray(p.technologies)) {
            tags = p.technologies;
          } else if (typeof p.technologies === "string") {
            try {
              tags = JSON.parse(p.technologies);
            } catch {
              tags = p.technologies.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
          }

          const accent = validAccents.includes(p.accent_color)
            ? p.accent_color
            : validAccents[idx % validAccents.length];

          const previewType = validPreviews.includes(p.preview_type)
            ? p.preview_type
            : validPreviews[idx % validPreviews.length];

          return {
            id: String(p.id),
            number: String(idx + 1).padStart(2, "0"),
            title: p.title,
            category: p.category || "Full Stack",
            description: p.short_description || p.full_description || "",
            tags,
            githubUrl: p.github_url || "",
            liveDemoUrl: p.live_demo_url || p.github_url || "",
            accent,
            previewType,
            imageUrl: p.image_url,
          };
        });
        setProjectsList(mapped);
      }
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      id="projects"
      className="relative w-full py-24 px-6 md:px-10 lg:px-16 overflow-hidden select-none bg-[#020617] scroll-mt-20"
    >
      {/* 1. Subtle Background Grid with Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 65% 50% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 50% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      {/* 2. Soft Ambient Drift Orbs */}
      <motion.div
        className="absolute -top-20 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-purple-700/8 blur-[140px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 25, 0],
                y: [0, -25, 0],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 -right-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-cyan-600/8 blur-[130px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -30, 0],
                y: [0, 25, 0],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          className="text-center mb-14 md:mb-18"
        >
          {/* Section Badge */}
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-emerald-300/90 bg-emerald-950/40 border border-emerald-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md">
              <FolderCode className="w-3.5 h-3.5 text-emerald-400" />
              PORTFOLIO & WORK
            </span>
          </div>

          {/* Heading with Animated Gradient Text */}
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Featured{" "}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 via-purple-400 to-emerald-400 bg-[length:200%_auto] glow-text-purple inline-block"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      backgroundPosition: ["0% center", "200% center"],
                    }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Projects
            </motion.span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed font-normal">
            Things I&apos;ve built, experimented with, and learned from.
          </p>
        </motion.div>

        {/* Projects 3-Column Responsive Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch"
        >
          {projectsList.map((project) => {
            const config = ACCENT_STYLES[project.accent] || ACCENT_STYLES.purple;

            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: -6,
                        scale: 1.015,
                        transition: { duration: 0.25, ease: "easeOut" },
                      }
                }
                className={cn(
                  "group relative rounded-3xl p-5 sm:p-6 overflow-hidden flex flex-col justify-between h-full",
                  "bg-slate-900/60 backdrop-blur-xl border border-white/[0.08]",
                  "transition-all duration-300 shadow-xl shadow-black/40",
                  config.hoverBorder,
                  config.hoverShadow
                )}
              >
                {/* Top Specular Shine Line */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {/* Internal Ambient Bloom on Hover */}
                <div
                  className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: config.radialGlow }}
                />

                <div className="relative z-10 flex flex-col">
                  {/* Top Preview/Thumbnail Wireframe Box */}
                  <div
                    className={cn(
                      "relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 border bg-gradient-to-b transition-transform duration-500 group-hover:scale-[1.02]",
                      config.previewBorder,
                      config.previewBg
                    )}
                  >
                    {/* Visual Mockup or Uploaded Image */}
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <ProjectPreviewVisual type={project.previewType} />
                    )}

                    {/* Floating Project Number Tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-mono font-bold tracking-wider">
                      <span className={config.numberColor}>{project.number}</span>
                    </div>

                    {/* Floating Category Badge */}
                    <div className="absolute top-3 right-3 max-w-[65%]">
                      <span
                        className={cn(
                          "inline-block truncate text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm",
                          config.badgeBg
                        )}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-purple-200 transition-colors tracking-tight">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-sm text-slate-300/90 leading-relaxed font-normal mb-5 flex-1">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-950/70 border border-white/[0.08] text-slate-300 transition-all duration-200 cursor-default",
                          config.tagHover
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons (Bottom Bar) */}
                <div className="relative z-10 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  {/* Primary: View Project */}
                  <a
                    href={project.liveDemoUrl || project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 group/btn",
                      config.btnGrad
                    )}
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>

                  {/* Secondary: GitHub Repo Button */}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View ${project.title} on GitHub`}
                    aria-label={`View ${project.title} on GitHub`}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-purple-400/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Projects Button (Bottom CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-14 md:mt-18 text-center flex flex-col items-center"
        >
          <a
            href="https://github.com/pgorai45?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full text-sm sm:text-base font-semibold text-white bg-slate-900/80 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_25px_rgba(147,51,234,0.2)] hover:shadow-[0_0_35px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all duration-300"
          >
            <GithubIcon className="w-4 h-4 text-purple-400" />
            <span>View All Projects on GitHub</span>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </a>

          <p className="text-xs text-slate-500 mt-3 font-normal">
            Explore open-source repositories, experiments, and ongoing systems.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeProjects;
