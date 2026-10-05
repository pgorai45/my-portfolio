import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { HomeHeroVisual } from "./HomeHeroVisual";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { portfolioApi } from "../../services/api";
import type { PortfolioProfile, Resume } from "../../types/admin";

export const HomeHero: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [profile, setProfile] = useState<PortfolioProfile>({
    name: "Prasanta Gorai",
    title: "FULL STACK DEVELOPER",
    bio: "I build modern, scalable and interactive web applications with clean code and great user experiences.",
    available_for_work: true,
    location: "West Bengal, India",
  });

  const [activeResume, setActiveResume] = useState<Resume | null>(null);

  useEffect(() => {
    // Fetch live profile from PostgreSQL
    portfolioApi.getProfile().then((res) => {
      if (res.success && res.data) {
        setProfile((prev) => ({ ...prev, ...res.data }));
      }
    });

    // Fetch active resume from PostgreSQL
    portfolioApi.getResume().then((res) => {
      if (res.success && res.data) {
        setActiveResume(res.data);
      }
    });
  }, []);

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

  const handleDownloadResume = () => {
    if (activeResume?.file_path) {
      const backendOrigin =
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_API_URL ||
        "https://my-portfolio-production-98ef.up.railway.app";

      const resumeUrl = activeResume.file_path.startsWith("http")
        ? activeResume.file_path
        : `${backendOrigin.replace(/\/$/, "")}${activeResume.file_path}`;

      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = activeResume.file_name || "Prasanta_Gorai_Resume.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      handleScrollTo("resume");
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
      className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-16 overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute inset-0 pointer-events-none bg-[#020617]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Personal Intro */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            {/* Small Label */}
            <motion.div {...fadeInUp(0.1)} className="mb-3.5 sm:mb-4">
              <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-indigo-300/90 bg-indigo-950/40 border border-indigo-500/30 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                {profile.title || "FULL STACK DEVELOPER"}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              {...fadeInUp(0.25)}
              className="text-3xl min-[360px]:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.08] text-white mb-4 sm:mb-5"
            >
              Hi, I&apos;m
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 glow-text-purple">
                {profile.name || "Prasanta Gorai"}
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              {...fadeInUp(0.4)}
              className="text-sm sm:text-base md:text-lg text-slate-300/90 max-w-lg leading-relaxed mb-6 sm:mb-8 font-normal"
            >
              {profile.bio ||
                "I build modern, scalable and interactive web applications with clean code and great user experiences."}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              {...fadeInUp(0.55)}
              className="flex flex-col min-[420px]:flex-row flex-wrap items-stretch min-[420px]:items-center gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto mb-6 sm:mb-8"
            >
              {/* Primary: View My Work */}
              <button
                type="button"
                onClick={() => handleScrollTo("projects")}
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-5 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-400 shadow-[0_0_30px_rgba(147,51,234,0.45)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] border border-purple-400/30 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 w-full min-[420px]:w-auto"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Secondary: Download Resume */}
              <button
                type="button"
                onClick={handleDownloadResume}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800/80 border border-white/10 hover:border-purple-400/40 backdrop-blur-md transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shadow-md shadow-black/30 w-full min-[420px]:w-auto"
              >
                <Download className="w-4 h-4 text-purple-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
                <span>Download Resume</span>
              </button>
            </motion.div>

            {/* Quick Metrics / Availability Strip */}
            <motion.div
              {...fadeInUp(0.7)}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 border-t border-white/[0.08] text-xs text-slate-400 w-full"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      profile.available_for_work
                        ? "bg-emerald-400 opacity-75"
                        : "bg-slate-400 opacity-40"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      profile.available_for_work
                        ? "bg-emerald-500"
                        : "bg-slate-500"
                    }`}
                  />
                </span>
                <span className="text-slate-300 font-medium">
                  {profile.available_for_work
                    ? "Available for work"
                    : "Currently occupied"}
                </span>
              </div>
              <span className="text-slate-600 hidden min-[380px]:inline">•</span>
              <span>
                Based in{" "}
                {profile.location ? profile.location.split(",")[0] : "India"}
              </span>
              <span className="text-slate-600 hidden min-[380px]:inline">•</span>
              <span>Remote &amp; Worldwide</span>
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

export default HomeHero;
