import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  GraduationCap,
  Code2,
  Layers,
  Rocket,
  Target,
  Sparkles,
  ArrowDown,
  Calendar,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { portfolioApi } from "../../services/api";

// ─── Journey Milestones Data ────────────────────────────────────────────────
interface Milestone {
  period: string;
  badge: string;
  title: string;
  description: string;
  skills: string[];
  icon: React.FC<{ className?: string }>;
  accentColor: "purple" | "cyan" | "indigo" | "emerald";
  isCurrent?: boolean;
}

const MILESTONES: Milestone[] = [
  {
    period: "2024",
    badge: "B.Tech CSE Journey",
    title: "Started My B.Tech CSE Journey",
    description:
      "Started my Computer Science & Engineering journey and built a foundation in programming, problem solving and computer science fundamentals.",
    skills: ["C", "Python", "Programming Fundamentals"],
    icon: GraduationCap,
    accentColor: "purple",
  },
  {
    period: "2025",
    badge: "Web Development",
    title: "Started Web Development",
    description:
      "Started building modern websites and interactive web applications while learning frontend development and JavaScript.",
    skills: ["HTML5", "CSS3", "JavaScript", "React"],
    icon: Code2,
    accentColor: "cyan",
  },
  {
    period: "2025–2026",
    badge: "Full Stack Development",
    title: "Moving Into Full Stack Development",
    description:
      "Expanded my development skills into backend development, databases, APIs and authentication while building complete applications.",
    skills: [
      "React",
      "Python",
      "Flask",
      "Node.js",
      "SQL",
      "MySQL",
      "REST API",
    ],
    icon: Layers,
    accentColor: "indigo",
  },
  {
    period: "2026",
    badge: "Advanced Projects",
    title: "Building Real-World Projects",
    description:
      "Focused on creating production-style projects, improving code quality, UI/UX, Git workflows and full-stack development practices.",
    skills: [
      "Full Stack Development",
      "Git",
      "GitHub",
      "DSA",
      "DBMS",
      "OOP",
    ],
    icon: Rocket,
    accentColor: "purple",
  },
  {
    period: "Current",
    badge: "Continuous Learning",
    title: "Learning & Preparing for the Next Step",
    description:
      "Continuously improving my technical skills, strengthening core computer science concepts and preparing for internships and full-stack development opportunities.",
    skills: [
      "DSA",
      "Operating Systems",
      "Computer Networks",
      "System Design",
    ],
    icon: Target,
    accentColor: "emerald",
    isCurrent: true,
  },
];

// Color theme styles
const COLOR_CONFIG = {
  purple: {
    nodeBg: "bg-purple-950/80",
    nodeBorder: "border-purple-500/50",
    nodeGlow: "shadow-[0_0_16px_rgba(168,85,247,0.4)]",
    iconColor: "text-purple-400",
    badgeBg: "bg-purple-950/40 text-purple-300 border-purple-500/30",
    hoverBorder: "hover:border-purple-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(168,85,247,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(168,85,247,0.12) 0%, transparent 70%)",
  },
  cyan: {
    nodeBg: "bg-cyan-950/80",
    nodeBorder: "border-cyan-500/50",
    nodeGlow: "shadow-[0_0_16px_rgba(6,182,212,0.4)]",
    iconColor: "text-cyan-400",
    badgeBg: "bg-cyan-950/40 text-cyan-300 border-cyan-500/30",
    hoverBorder: "hover:border-cyan-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(6,182,212,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 70%)",
  },
  indigo: {
    nodeBg: "bg-indigo-950/80",
    nodeBorder: "border-indigo-500/50",
    nodeGlow: "shadow-[0_0_16px_rgba(99,102,241,0.4)]",
    iconColor: "text-indigo-400",
    badgeBg: "bg-indigo-950/40 text-indigo-300 border-indigo-500/30",
    hoverBorder: "hover:border-indigo-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(99,102,241,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
  },
  emerald: {
    nodeBg: "bg-emerald-950/80",
    nodeBorder: "border-emerald-500/50",
    nodeGlow: "shadow-[0_0_16px_rgba(16,185,129,0.4)]",
    iconColor: "text-emerald-400",
    badgeBg: "bg-emerald-950/40 text-emerald-300 border-emerald-500/30",
    hoverBorder: "hover:border-emerald-400/40",
    hoverShadow: "hover:shadow-[0_12px_35px_-8px_rgba(16,185,129,0.25)]",
    radialGlow: "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 70%)",
  },
};

export const HomeExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);

  useEffect(() => {
    portfolioApi.getExperience().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const iconMap: Record<string, React.FC<{ className?: string }>> = {
          graduationcap: GraduationCap,
          code2: Code2,
          layers: Layers,
          rocket: Rocket,
          target: Target,
          sparkles: Sparkles,
        };
        const defaultIcons = [GraduationCap, Code2, Layers, Rocket, Target];

        const mapped: Milestone[] = res.data.map((item: any, idx: number) => {
          let parsedTech: string[] = [];
          if (Array.isArray(item.technologies)) {
            parsedTech = item.technologies;
          } else if (typeof item.technologies === "string") {
            try {
              parsedTech = JSON.parse(item.technologies);
            } catch {
              parsedTech = item.technologies.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
          }

          let period = item.start_date || "";
          if (item.currently_working) {
            period = item.start_date ? `${item.start_date}–Present` : "Current";
          } else if (item.end_date && item.end_date !== item.start_date) {
            period = `${item.start_date}–${item.end_date}`;
          }

          const iconKey = (item.icon_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const IconComponent = iconMap[iconKey] || defaultIcons[idx % defaultIcons.length] || Layers;

          return {
            period: period || "Recent",
            badge: item.badge || item.company,
            title: item.position,
            description: item.description,
            skills: parsedTech,
            icon: IconComponent,
            accentColor: (item.accent_color as any) || (idx % 2 === 0 ? "purple" : "cyan"),
            isCurrent: item.currently_working,
          };
        });
        setMilestones(mapped);
      }
    });
  }, []);

  // Scroll progress for drawing the vertical timeline line progressively
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 65%"],
  });

  const progressScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const headerVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="experience"
      className="relative w-full py-24 px-6 md:px-10 lg:px-16 overflow-hidden select-none bg-[#020617] scroll-mt-20"
    >
      {/* 1. Minimal Ambient Background Grid with Radial Vignette */}
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
        className="absolute top-1/4 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-purple-700/8 blur-[140px] pointer-events-none"
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
        className="absolute bottom-1/4 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-indigo-600/8 blur-[130px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -30, 0],
                y: [0, 30, 0],
              }
        }
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headerVariants}
          className="text-center mb-16 md:mb-24"
        >
          {/* Section Badge */}
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-purple-300/90 bg-purple-950/40 border border-purple-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              JOURNEY & EXPERIENCE
            </span>
          </div>

          {/* Heading with Animated Gradient Text */}
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            My Journey in{" "}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 via-cyan-300 to-purple-400 bg-[length:200%_auto] glow-text-purple inline-block"
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
              Software Development
            </motion.span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed font-normal">
            From learning computer science fundamentals to building modern full-stack applications.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative">
          {/* Static Background Timeline Rail */}
          <div className="absolute top-6 bottom-6 left-6 md:left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-purple-500/20 via-indigo-500/30 to-purple-500/20 rounded-full pointer-events-none" />

          {/* Dynamic Scroll-Animated Progressive Timeline Line */}
          {!prefersReducedMotion ? (
            <motion.div
              style={{ scaleY: progressScaleY, transformOrigin: "top" }}
              className="absolute top-6 bottom-6 left-6 md:left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-purple-400 via-indigo-400 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(168,85,247,0.7)] rounded-full pointer-events-none"
            />
          ) : (
            <div className="absolute top-6 bottom-6 left-6 md:left-1/2 -translate-x-1/2 w-[2px] bg-purple-500/40 rounded-full pointer-events-none" />
          )}

          {/* Milestones List */}
          <div className="space-y-12 md:space-y-16">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const IconComp = item.icon;
              const config = COLOR_CONFIG[item.accentColor];

              // Card motion variants: alternate sliding in from left and right on desktop
              const cardVariants = {
                hidden: {
                  opacity: 0,
                  x: prefersReducedMotion ? 0 : isEven ? -40 : 40,
                  y: prefersReducedMotion ? 20 : 0,
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: {
                    duration: 0.65,
                    delay: prefersReducedMotion ? 0 : 0.08,
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                },
              };

              return (
                <div
                  key={item.title}
                  className="relative flex flex-col md:flex-row items-center"
                >
                  {/* Left Column (Desktop) */}
                  <div
                    className={cn(
                      "w-full md:w-1/2",
                      isEven ? "md:pr-12 md:text-left" : "hidden md:block"
                    )}
                  >
                    {isEven && (
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                        whileHover={
                          prefersReducedMotion
                            ? {}
                            : {
                                y: -5,
                                scale: 1.015,
                                transition: { duration: 0.25, ease: "easeOut" },
                              }
                        }
                        className={cn(
                          "group relative ml-14 md:ml-0 rounded-2xl p-6 md:p-7 overflow-hidden cursor-default",
                          "bg-slate-900/60 backdrop-blur-xl border border-white/[0.08]",
                          "transition-all duration-300 shadow-xl shadow-black/40",
                          config.hoverBorder,
                          config.hoverShadow
                        )}
                      >
                        {/* Top Specular Shine Line */}
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                        {/* Internal Ambient Bloom on Hover */}
                        <div
                          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{ background: config.radialGlow }}
                        />

                        {/* Card Header: Year/Period Badge + Milestone Name */}
                        <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-mono border",
                              config.badgeBg
                            )}
                          >
                            <span>{item.period}</span>
                            <span>•</span>
                            <span>{item.badge}</span>
                          </span>

                          {item.isCurrent && (
                            <span className="relative flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                              </span>
                              In Progress
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="relative z-10 text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-purple-200 transition-colors">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="relative z-10 text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal mb-5">
                          {item.description}
                        </p>

                        {/* Skills / Tech Tags */}
                        <div className="relative z-10 flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-950/70 border border-white/[0.08] text-slate-300 group-hover:border-purple-500/20 hover:!border-purple-400/50 hover:!text-white hover:!bg-purple-950/40 transition-all duration-200 cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Center Timeline Node Marker */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: prefersReducedMotion ? 1 : 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Active Node Outer Glowing Pulse */}
                      {item.isCurrent && (
                        <span className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-sm animate-pulse pointer-events-none" />
                      )}

                      <div
                        className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border z-10 transition-transform duration-300 shadow-md",
                          config.nodeBg,
                          config.nodeBorder,
                          config.nodeGlow
                        )}
                      >
                        <IconComp className={cn("w-4 h-4 md:w-5 md:h-5", config.iconColor)} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column (Desktop) */}
                  <div
                    className={cn(
                      "w-full md:w-1/2",
                      !isEven ? "md:pl-12 md:text-left" : "hidden md:block"
                    )}
                  >
                    {!isEven && (
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                        whileHover={
                          prefersReducedMotion
                            ? {}
                            : {
                                y: -5,
                                scale: 1.015,
                                transition: { duration: 0.25, ease: "easeOut" },
                              }
                        }
                        className={cn(
                          "group relative ml-14 md:ml-0 rounded-2xl p-6 md:p-7 overflow-hidden cursor-default",
                          "bg-slate-900/60 backdrop-blur-xl border border-white/[0.08]",
                          "transition-all duration-300 shadow-xl shadow-black/40",
                          config.hoverBorder,
                          config.hoverShadow
                        )}
                      >
                        {/* Top Specular Shine Line */}
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                        {/* Internal Ambient Bloom on Hover */}
                        <div
                          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{ background: config.radialGlow }}
                        />

                        {/* Card Header: Year/Period Badge + Milestone Name */}
                        <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-mono border",
                              config.badgeBg
                            )}
                          >
                            <span>{item.period}</span>
                            <span>•</span>
                            <span>{item.badge}</span>
                          </span>

                          {item.isCurrent && (
                            <span className="relative flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                              </span>
                              In Progress
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="relative z-10 text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-purple-200 transition-colors">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="relative z-10 text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal mb-5">
                          {item.description}
                        </p>

                        {/* Skills / Tech Tags */}
                        <div className="relative z-10 flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-950/70 border border-white/[0.08] text-slate-300 group-hover:border-purple-500/20 hover:!border-purple-400/50 hover:!text-white hover:!bg-purple-950/40 transition-all duration-200 cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Concluding Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-20 md:mt-24 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.2)] mb-3">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-sm sm:text-base font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">
              Still learning. Still building. Still improving.
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4 font-normal">
            Dedicated to continuous evolution, clean craftsmanship, and shipping meaningful software.
          </p>

          {/* Subtle animated arrow / scroll indicator */}
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-slate-500"
          >
            <ArrowDown className="w-4 h-4 text-purple-400/80" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeExperience;
