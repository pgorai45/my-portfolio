import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Download,
  X,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import resumePdf from "../../assets/resume/Prasanta_Gorai_Resume.pdf";


export const HomeResume: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Escape key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const itemFadeUp = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 24,
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
      id="resume"
      className="relative w-full py-28 md:py-36 px-6 md:px-10 lg:px-16 overflow-hidden bg-[#020617] scroll-mt-20"
    >
      {/* 1. Subtle Background Grid */}
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[38rem] h-[20rem] sm:h-[26rem] rounded-full bg-purple-700/10 blur-[150px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.08, 1],
                opacity: [0.1, 0.16, 0.1],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. Centered Content Container */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="flex flex-col items-center"
        >
          {/* Centered Heading */}
          <motion.h2
            variants={itemFadeUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Resume &amp;{" "}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 via-cyan-300 to-purple-400 bg-[length:200%_auto] inline-block"
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
              Qualifications
            </motion.span>
          </motion.h2>

          {/* Short Professional Description */}
          <motion.p
            variants={itemFadeUp}
            className="mt-6 max-w-2xl text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed font-normal"
          >
            Explore my education, technical skills, projects, and development journey through my resume.
          </motion.p>

          {/* ONE Primary Button: "View Resume →" */}
          <motion.div variants={itemFadeUp} className="mt-10">
            <motion.button
              type="button"
              onClick={() => setIsModalOpen(true)}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 1.04,
                      boxShadow: "0 0 35px rgba(168, 85, 247, 0.5), 0 0 70px rgba(99, 102, 241, 0.25)",
                    }
              }
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-right shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all duration-300 cursor-pointer border border-purple-400/30"
            >
              {/* Subtle button specular shine line */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

              <span>View Resume</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Dedicated Clean Resume Modal Viewer ─────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 16 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 16 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-5xl h-[88vh] flex flex-col rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl shadow-purple-950/70 overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-slate-950/95">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base sm:text-lg">
                      Prasanta Gorai — Resume
                    </h3>
                    <p className="text-xs text-slate-400 hidden sm:block">
                      Full Stack Developer • B.Tech CSE (8.7 CGPA)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Download Resume Button inside Viewer */}
                  <a
                    href={resumePdf}
                    download="Prasanta_Gorai_Resume.pdf"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all duration-200 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </a>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close resume viewer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Responsive PDF Embed Frame */}
              <div className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
                <iframe
                  src={`${resumePdf}#toolbar=0`}
                  title="Prasanta Gorai Resume"
                  className="w-full h-full border-none"
                />

                {/* Mobile Fallback Action Strip */}
                <div className="sm:hidden absolute bottom-3 inset-x-4 p-2.5 rounded-xl bg-slate-900/95 border border-white/10 text-center backdrop-blur-sm">
                  <a
                    href={resumePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-300 font-semibold inline-flex items-center gap-1.5"
                  >
                    Open PDF in Full Screen
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomeResume;
