import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  GraduationCap,
  Code2,
  Target,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { portfolioApi } from "../../services/api";
import type { PortfolioProfile } from "../../types/admin";

export const HomeAbout: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [profile, setProfile] = React.useState<PortfolioProfile>({
    name: "Prasanta Gorai",
    title: "Full Stack Developer",
    about_intro:
      "I'm Prasanta Gorai, a Computer Science student and aspiring Full Stack Developer who enjoys building modern and interactive web applications.",
    about_details:
      "I enjoy learning how modern web applications work from frontend interfaces to backend systems and databases. My goal is to continuously improve my development skills and build useful, scalable and user-friendly applications.\n\nI'm currently focusing on strengthening my skills in React, TypeScript, backend development, databases and modern software development practices.",
  });

  React.useEffect(() => {
    portfolioApi.getProfile().then((res) => {
      if (res.success && res.data) {
        setProfile((prev) => ({ ...prev, ...res.data }));
      }
    });
  }, []);


  // Motion variants for container scroll-reveal orchestration
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

  // Staggered slide-up + fade variants for children
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

  const cards = [
    {
      title: "Education",
      description: "B.Tech in Computer Science & Engineering",
      icon: GraduationCap,
      titleColor: "text-purple-400",
      iconColor: "text-purple-300",
      nodeBg: "bg-[#0f1123]",
      nodeBorder: "border-purple-500/50",
      nodeGlow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
      badgeStyle: "bg-purple-500/10 border-purple-500/30 text-purple-300",
      hoverBorder: "hover:border-purple-400/50",
      hoverShadow: "hover:shadow-[0_10px_35px_-8px_rgba(168,85,247,0.35),0_0_20px_rgba(168,85,247,0.15)]",
      hoverGradient: "from-purple-500/15 via-transparent to-transparent",
      floatDuration: 5.2,
      floatDelay: 0,
      floatY: [-3, 3, -3],
    },
    {
      title: "Focus",
      description: "Full Stack Web Development",
      icon: Code2,
      titleColor: "text-cyan-400",
      iconColor: "text-cyan-300",
      nodeBg: "bg-[#091524]",
      nodeBorder: "border-cyan-500/50",
      nodeGlow: "shadow-[0_0_15px_rgba(6,182,212,0.4)]",
      badgeStyle: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
      hoverBorder: "hover:border-cyan-400/50",
      hoverShadow: "hover:shadow-[0_10px_35px_-8px_rgba(6,182,212,0.35),0_0_20px_rgba(6,182,212,0.15)]",
      hoverGradient: "from-cyan-500/15 via-transparent to-transparent",
      floatDuration: 6.0,
      floatDelay: 0.5,
      floatY: [3, -3, 3],
    },
    {
      title: "Goal",
      description: "Build real-world applications",
      icon: Target,
      titleColor: "text-blue-400",
      iconColor: "text-blue-300",
      nodeBg: "bg-[#0a1228]",
      nodeBorder: "border-blue-500/50",
      nodeGlow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      badgeStyle: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      hoverBorder: "hover:border-blue-400/50",
      hoverShadow: "hover:shadow-[0_10px_35px_-8px_rgba(59,130,246,0.35),0_0_20px_rgba(59,130,246,0.15)]",
      hoverGradient: "from-blue-500/15 via-transparent to-transparent",
      floatDuration: 5.6,
      floatDelay: 1.0,
      floatY: [-2, 4, -2],
    },
  ];

  const particles = [
    { top: "12%", left: "10%", color: "bg-purple-400", glow: "shadow-[0_0_8px_#c084fc]", dur: 4.8, delay: 0 },
    { top: "28%", right: "8%", color: "bg-cyan-400", glow: "shadow-[0_0_8px_#22d3ee]", dur: 5.5, delay: 1.0 },
    { bottom: "20%", left: "15%", color: "bg-indigo-300", glow: "shadow-[0_0_8px_#a5b4fc]", dur: 4.2, delay: 0.6 },
    { bottom: "12%", right: "14%", color: "bg-purple-300", glow: "shadow-[0_0_8px_#d8b4fe]", dur: 6.0, delay: 1.5 },
  ];

  return (
    <section
      id="about"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-8 md:px-10 lg:px-16 overflow-hidden select-none scroll-mt-20"
    >
      {/* 1. Subtle Animated Background Minimal Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 25%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 25%, transparent 80%)",
        }}
      />

      {/* 2. Slow Glowing Accent Elements Moving in Background */}
      <motion.div
        className="absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-purple-700/12 blur-[120px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 30, 0],
                y: [0, -25, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-24 -right-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-indigo-600/12 blur-[130px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -35, 0],
                y: [0, 30, 0],
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-600/6 blur-[110px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [0.9, 1.15, 0.9],
                opacity: [0.3, 0.7, 0.3],
              }
        }
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. Subtle Animated Background Floating Particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className={`absolute w-1.5 h-1.5 rounded-full ${p.color} ${p.glow} pointer-events-none`}
          style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -14, 0],
                  opacity: [0.2, 0.75, 0.2],
                  scale: [0.8, 1.25, 0.8],
                }
          }
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Container with Viewport-Triggered Staggered Scroll-Reveal */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-7xl"
      >
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          {/* Animated Badge */}
          <motion.div variants={itemFadeUp} className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-purple-300/90 bg-purple-950/40 border border-purple-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              ABOUT ME
            </span>
          </motion.div>

          {/* Heading with Animated Gradient Text */}
          <motion.h2
            variants={itemFadeUp}
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            Building with purpose,
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 via-cyan-300 to-purple-400 bg-[length:200%_auto] glow-text-purple inline-block ml-2"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      backgroundPosition: ["0% center", "200% center"],
                    }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              learning with curiosity.
            </motion.span>
          </motion.h2>

          {/* Subtitle Paragraph */}
          <motion.p
            variants={itemFadeUp}
            className="mx-auto mt-6 max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed font-normal"
          >
            {profile.about_intro ||
              "I'm Prasanta Gorai, a Computer Science student and aspiring Full Stack Developer who enjoys building modern and interactive web applications."}
          </motion.p>
        </div>

        {/* About Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Side: Who I Am */}
          <motion.div variants={itemFadeUp} className="relative">
            <div className="relative rounded-3xl p-5 sm:p-7 md:p-9 bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] shadow-xl shadow-black/40 group overflow-hidden">
              {/* Top subtle specular highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />

              {/* Ambient purple corner glow */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-600/15 transition-colors duration-500" />

              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-3">
                <span>Who I Am</span>
                <span className="h-[1px] flex-1 max-w-[80px] bg-gradient-to-r from-purple-500/60 to-transparent" />
              </h3>

              <div className="space-y-4 sm:space-y-5 text-slate-300/90 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                {profile.about_details ? (
                  profile.about_details.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <>
                    <p>
                      I enjoy learning how modern web applications work from frontend
                      interfaces to backend systems and databases. My goal is to
                      continuously improve my development skills and build useful,
                      scalable and user-friendly applications.
                    </p>
                    <p>
                      I'm currently focusing on strengthening my skills in React,
                      TypeScript, backend development, databases and modern software
                      development practices.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Connected Information Cards */}
          <motion.div variants={itemFadeUp} className="relative">
            {/* The Connected Pipeline Track Container */}
            <div className="relative">
              {/* Vertical Gradient Connecting Line */}
              <div className="absolute left-[13px] sm:left-[17px] md:left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-purple-500/40 via-cyan-500/40 to-blue-500/40 rounded-full pointer-events-none" />

              {/* Animated Light Pulse traveling down the line */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute left-[12px] sm:left-[16px] md:left-[18px] w-[4px] h-20 rounded-full bg-gradient-to-b from-transparent via-purple-300 via-cyan-200 to-transparent blur-[0.5px] shadow-[0_0_12px_rgba(168,85,247,0.8)] pointer-events-none"
                  animate={{
                    top: ["5%", "85%"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Staggered Cards List */}
              <div className="space-y-4 sm:space-y-6">
                {cards.map((card) => (
                  <div
                    key={card.title}
                    className="relative flex items-center gap-3 sm:gap-4 md:gap-5"
                  >
                    {/* Glowing Node on the Vertical Line */}
                    <div className="relative z-20 shrink-0">
                      <div
                        className={cn(
                          "w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-md",
                          card.nodeBg,
                          card.nodeBorder,
                          card.nodeGlow
                        )}
                      >
                        <card.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5", card.iconColor)} />
                      </div>
                    </div>

                    {/* Information Card with Floating Animation + Hover Lift & Glow */}
                    <motion.div
                      animate={
                        prefersReducedMotion
                          ? {}
                          : {
                              y: card.floatY,
                            }
                      }
                      transition={{
                        duration: card.floatDuration,
                        delay: card.floatDelay,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
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
                        "group flex-1 relative rounded-2xl p-4 sm:p-5 md:p-6 overflow-hidden cursor-default",
                        "bg-slate-900/60 backdrop-blur-xl border border-white/[0.08]",
                        "transition-all duration-300 shadow-lg shadow-black/40",
                        card.hoverBorder,
                        card.hoverShadow
                      )}
                    >
                      {/* Top Specular Shine */}
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                      {/* Internal Ambient Bloom on Hover */}
                      <div
                        className={cn(
                          "absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                          card.hoverGradient
                        )}
                      />

                      <div className="relative z-10 flex items-start justify-between gap-3 sm:gap-4">
                        <div>
                          <h4 className={cn("font-semibold text-sm sm:text-base md:text-lg tracking-wide", card.titleColor)}>
                            {card.title}
                          </h4>

                          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-slate-300/90 leading-relaxed font-normal">
                            {card.description}
                          </p>
                        </div>

                        {/* Subtle Card Badge */}
                        <div
                          className={cn(
                            "p-1.5 sm:p-2 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110",
                            card.badgeStyle
                          )}
                        >
                          <card.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", card.iconColor)} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeAbout;