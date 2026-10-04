import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  GraduationCap,
  School,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { portfolioApi } from "../../services/api";

interface EducationItem {
  id?: number;
  institution: string;
  degree: string;
  stream: string;
  start_year: string;
  end_year: string;
  grade: string;
  description: string;
  coursework?: string[] | string;
  display_order?: number;
  is_visible?: boolean;
}

export const HomeEducation: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [educationList, setEducationList] = useState<EducationItem[]>([]);

  useEffect(() => {
    portfolioApi.getEducation().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const sorted = [...res.data].sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
        const parsed = sorted.map((edu: any) => {
          let cw: string[] = [];
          if (Array.isArray(edu.coursework)) {
            cw = edu.coursework;
          } else if (typeof edu.coursework === "string") {
            try {
              cw = JSON.parse(edu.coursework);
            } catch {
              cw = edu.coursework.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
          }
          return { ...edu, coursework: cw };
        });
        setEducationList(parsed);
      }
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const itemFadeUp = {
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

  const defaultTimelineSteps = [
    {
      level: "Class 10 (Secondary)",
      school: "Hetia High School",
      score: "66%",
      status: "Completed",
      accent: "text-blue-400 border-blue-500/40 bg-blue-950/40",
    },
    {
      level: "Class 12 (Science)",
      school: "Hetia High School",
      score: "74%",
      status: "Completed",
      accent: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
    },
    {
      level: "B.Tech in CSE",
      school: "Brainware University",
      score: "8.7 CGPA",
      status: "2024 – Present",
      isCurrent: true,
      accent: "text-purple-400 border-purple-500/40 bg-purple-950/40",
    },
  ];

  const defaultCoursework = [
    "Data Structures & Algorithms",
    "Database Management Systems",
    "Object-Oriented Programming",
    "Operating Systems",
    "Computer Networks",
    "Full Stack Web Development",
  ];

  const activeTimelineSteps = educationList.length > 0
    ? [...educationList].reverse().map((edu, idx) => {
        const isCurrent = edu.end_year?.toLowerCase().includes("present") || !edu.end_year;
        const accents = [
          "text-blue-400 border-blue-500/40 bg-blue-950/40",
          "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
          "text-purple-400 border-purple-500/40 bg-purple-950/40",
          "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
        ];
        return {
          level: edu.degree || edu.stream,
          school: edu.institution,
          score: edu.grade || "Completed",
          status: isCurrent ? `${edu.start_year || ""} – Present` : `${edu.start_year || ""} – ${edu.end_year || ""}`,
          isCurrent,
          accent: accents[idx % accents.length],
        };
      })
    : defaultTimelineSteps;

  const mainEdu = educationList.length > 0 ? educationList[0] : null;
  const supportingEdu = educationList.length > 1 ? educationList.slice(1) : [];
  const btechCoursework = Array.isArray(mainEdu?.coursework) && mainEdu.coursework.length > 0
    ? (mainEdu.coursework as string[])
    : defaultCoursework;

  return (
    <section
      id="education"
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
        className="absolute -top-20 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-purple-700/8 blur-[140px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -25, 0],
                y: [0, 25, 0],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-indigo-600/8 blur-[130px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 30, 0],
                y: [0, -25, 0],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-7xl"
      >
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-18">
          {/* Section Badge */}
          <motion.div variants={itemFadeUp} className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-purple-300/90 bg-purple-950/40 border border-purple-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-md">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              ACADEMIC BACKGROUND
            </span>
          </motion.div>

          {/* Heading with Animated Gradient Text */}
          <motion.h2
            variants={itemFadeUp}
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            Education &{" "}
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
              Credentials
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemFadeUp}
            className="mx-auto mt-4 max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed font-normal"
          >
            Formal computer science education and academic foundations that drive my engineering journey.
          </motion.p>
        </div>

        {/* 3. Visual Academic Pathway Timeline Connecting All 3 Stages */}
        <motion.div
          variants={itemFadeUp}
          className="relative mb-12 max-w-4xl mx-auto"
        >
          {/* Connecting Gradient Line Track */}
          <div className="hidden sm:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-purple-500/50 pointer-events-none" />

          {/* Moving Pulse Beam along the timeline */}
          {!prefersReducedMotion && (
            <motion.div
              className="hidden sm:block absolute top-1/2 -translate-y-1/2 w-24 h-[3px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[0.5px] shadow-[0_0_12px_rgba(6,182,212,0.8)] pointer-events-none"
              animate={{
                left: ["0%", "85%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Timeline Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
            {activeTimelineSteps.map((step, idx) => (
              <div
                key={step.level}
                className={cn(
                  "flex items-center sm:flex-col sm:text-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all duration-300",
                  "bg-slate-900/60 backdrop-blur-md shadow-md shadow-black/30",
                  step.isCurrent
                    ? "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    : "border-white/[0.08]"
                )}
              >
                {/* Node Step Marker */}
                <div className="relative shrink-0 flex items-center justify-center">
                  {step.isCurrent && (
                    <span className="absolute -inset-1 rounded-full bg-purple-500/30 blur-sm animate-pulse" />
                  )}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border",
                      step.accent
                    )}
                  >
                    0{idx + 1}
                  </div>
                </div>

                {/* Node Text Content */}
                <div className="min-w-0">
                  <div className="flex items-center sm:justify-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-white truncate">
                      {step.level}
                    </span>
                    {step.isCurrent && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {step.school}
                  </p>
                  <span className="text-[11px] font-mono font-medium text-cyan-300">
                    {step.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 4. Education Cards Grid: Featured B.Tech (Large) + 2 Supporting Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Main Focus Card: B.Tech in CSE (Col 1 to 7 on desktop) */}
          <motion.div
            variants={itemFadeUp}
            whileHover={
              prefersReducedMotion
                ? {}
                : {
                    y: -6,
                    scale: 1.01,
                    transition: { duration: 0.25, ease: "easeOut" },
                  }
            }
            className="lg:col-span-7 group relative rounded-3xl p-7 sm:p-9 overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 shadow-2xl shadow-black/50 flex flex-col justify-between"
          >
            {/* Top Edge Specular Reflection */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent pointer-events-none" />

            {/* Internal Ambient Bloom on Hover */}
            <div
              className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 40% 0%, rgba(168,85,247,0.18) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              {/* Card Top Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-purple-950/80 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform duration-300">
                    <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-purple-300 font-semibold block">
                      {mainEdu?.stream ? mainEdu.stream.toUpperCase() : "UNDERGRADUATE DEGREE"}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                      {mainEdu?.degree || "B.Tech in Computer Science & Engineering"}
                    </h3>
                  </div>
                </div>

                {/* In Progress Status Pill */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  {mainEdu ? `${mainEdu.start_year || ""} – ${mainEdu.end_year || "Present"}` : "2024 – Present"}
                </span>
              </div>

              {/* Institution & Overview */}
              <div className="mb-6 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-base sm:text-lg mb-2">
                  <span>{mainEdu?.institution || "Brainware University"}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-normal text-sm">
                    {mainEdu?.stream || "West Bengal, India"}
                  </span>
                </div>
                <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed font-normal">
                  {mainEdu?.description || "Focused on building a rigorous computer science foundation, software engineering principles, modern web architecture, algorithmic thinking, and real-world system development."}
                </p>
              </div>

              {/* Academic Performance Metric Spotlight */}
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                      Academic Score
                    </span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                      Score: <span className="text-purple-300">{mainEdu?.grade || "8.7 CGPA"}</span>
                    </span>
                  </div>
                </div>

                {/* Progress bar visual for main CGPA */}
                <div className="w-full sm:w-48">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                    <span>Performance</span>
                    <span className="text-purple-300 font-semibold">
                      {mainEdu?.grade?.includes("%") ? mainEdu.grade : "87%"}
                    </span>
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: mainEdu?.grade?.includes("%") ? mainEdu.grade : "87%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 relative"
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coursework & Competency Tags */}
            <div className="relative z-10 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                Core Coursework & Competencies
              </span>
              <div className="flex flex-wrap gap-2">
                {btechCoursework.map((course) => (
                  <span
                    key={course}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-950/70 border border-white/[0.08] text-slate-300 hover:border-purple-400/50 hover:text-white hover:bg-purple-950/40 transition-all duration-200 cursor-default"
                  >
                    <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>{course}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Supporting Cards: Class 12 & Class 10 or Dynamic Supporting Entries (Col 8 to 12 on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {supportingEdu.length > 0 ? (
              supportingEdu.map((edu, idx) => {
                const isCyan = idx % 2 === 0;
                const IconComponent = isCyan ? BookOpen : School;
                const percent = edu.grade?.includes("%") ? edu.grade : "75%";
                return (
                  <motion.div
                    key={edu.id || edu.degree || idx}
                    variants={itemFadeUp}
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
                      "group flex-1 relative rounded-2xl p-6 sm:p-7 overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between",
                      isCyan ? "hover:border-cyan-400/50" : "hover:border-blue-400/50"
                    )}
                  >
                    {/* Top Specular Shine */}
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent pointer-events-none",
                        isCyan ? "via-cyan-400/30 to-transparent" : "via-blue-400/30 to-transparent"
                      )}
                    />

                    {/* Internal Ambient Bloom on Hover */}
                    <div
                      className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: isCyan
                          ? "radial-gradient(circle at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 70%)"
                          : "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-2.5 rounded-xl border group-hover:scale-105 transition-transform duration-300",
                              isCyan
                                ? "bg-cyan-950/70 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                : "bg-blue-950/70 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            )}
                          >
                            <IconComponent className={cn("w-5 h-5", isCyan ? "text-cyan-400" : "text-blue-400")} />
                          </div>
                          <div>
                            <span
                              className={cn(
                                "text-[10px] font-mono tracking-widest uppercase font-semibold block",
                                isCyan ? "text-cyan-300" : "text-blue-300"
                              )}
                            >
                              {edu.degree.toUpperCase()}
                            </span>
                            <h4
                              className={cn(
                                "text-base sm:text-lg font-bold text-white transition-colors",
                                isCyan ? "group-hover:text-cyan-200" : "group-hover:text-blue-200"
                              )}
                            >
                              {edu.stream || edu.degree}
                            </h4>
                          </div>
                        </div>

                        {/* Score Pill */}
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-mono font-bold border",
                            isCyan
                              ? "text-cyan-300 bg-cyan-950/60 border-cyan-500/30"
                              : "text-blue-300 bg-blue-950/60 border-blue-500/30"
                          )}
                        >
                          {edu.grade || "Completed"}
                        </span>
                      </div>

                      <div className="text-sm text-slate-300/90 font-medium mb-3">
                        {edu.institution}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-4">
                        {edu.description}
                      </p>
                    </div>

                    {/* Progress bar visual */}
                    <div className="relative z-10 pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                        <span>Evaluation / Score</span>
                        <span className={isCyan ? "text-cyan-300 font-semibold" : "text-blue-300 font-semibold"}>
                          {edu.grade || "Pass"}
                        </span>
                      </div>
                      <div className="relative w-full h-1.5 rounded-full bg-slate-950/80 overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: percent }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                          className={cn(
                            "h-full rounded-full",
                            isCyan ? "bg-gradient-to-r from-blue-500 to-cyan-400" : "bg-gradient-to-r from-indigo-500 to-blue-500"
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <>
                {/* Supporting Card 1: Higher Secondary — Class 12 */}
                <motion.div
                  variants={itemFadeUp}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          y: -5,
                          scale: 1.015,
                          transition: { duration: 0.25, ease: "easeOut" },
                        }
                  }
                  className="group flex-1 relative rounded-2xl p-6 sm:p-7 overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between"
                >
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />
                  <div
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-300">
                          <BookOpen className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-300 font-semibold block">
                            HIGHER SECONDARY (CLASS 12)
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                            Science Stream
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
                        74%
                      </span>
                    </div>
                    <div className="text-sm text-slate-300/90 font-medium mb-3">
                      Hetia High School
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-4">
                      Focused on Physics, Chemistry, and Mathematics (Science stream), establishing analytical,
                      calculus, and problem-solving foundations.
                    </p>
                  </div>
                  <div className="relative z-10 pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                      <span>Final Examination</span>
                      <span className="text-cyan-300 font-semibold">74%</span>
                    </div>
                    <div className="relative w-full h-1.5 rounded-full bg-slate-950/80 overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "74%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Supporting Card 2: Secondary — Class 10 */}
                <motion.div
                  variants={itemFadeUp}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          y: -5,
                          scale: 1.015,
                          transition: { duration: 0.25, ease: "easeOut" },
                        }
                  }
                  className="group flex-1 relative rounded-2xl p-6 sm:p-7 overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-blue-400/50 transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between"
                >
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent pointer-events-none" />
                  <div
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-950/70 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-300">
                          <School className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-300 font-semibold block">
                            SECONDARY EDUCATION (CLASS 10)
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                            Secondary Board Examination
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold text-blue-300 bg-blue-950/60 border border-blue-500/30">
                        66%
                      </span>
                    </div>
                    <div className="text-sm text-slate-300/90 font-medium mb-3">
                      Hetia High School
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-4">
                      Built early academic foundations in mathematics, physical and life sciences, and language
                      communication.
                    </p>
                  </div>
                  <div className="relative z-10 pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                      <span>Board Examination</span>
                      <span className="text-blue-300 font-semibold">66%</span>
                    </div>
                    <div className="relative w-full h-1.5 rounded-full bg-slate-950/80 overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "66%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeEducation;
