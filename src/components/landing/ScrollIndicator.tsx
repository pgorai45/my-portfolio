import React from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export const ScrollIndicator: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScrollDown = () => {
    const exploreSection = document.getElementById("explore");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4">
      <button
        onClick={handleScrollDown}
        className="group flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl p-2 cursor-pointer"
        aria-label="Scroll down to explore section"
      >
        {/* Mouse Container */}
        <div className="w-5 h-8 rounded-full border border-slate-500/70 group-hover:border-purple-400 flex items-start justify-center p-1 transition-colors duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          {/* Animated Scroll Wheel Dot */}
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [0, 8, 0],
                    opacity: [1, 0.3, 1],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-1.5 bg-slate-300 group-hover:bg-purple-300 rounded-full"
          />
        </div>

        {/* Downward Chevron */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, 3, 0],
                }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
        </motion.div>
      </button>
    </div>
  );
};
