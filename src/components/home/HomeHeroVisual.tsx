import React from "react";
import { motion } from "motion/react";
import prasantaPhoto from "../../assets/images/prasanta-hero.png";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export const HomeHeroVisual: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Subtle floating animation
  const floatAnim = prefersReducedMotion
    ? {}
    : {
        animate: {
          y: [-5, 5, -5],
        },
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <div className="relative w-full max-w-[580px] lg:max-w-[640px] xl:max-w-[680px] flex items-center justify-center select-none py-2">
      
      {/* =========================================
          SUBTLE TECH PARTICLES
          No large background glow
      ========================================= */}

      {/* Cyan particle */}
      <div
        className="
          absolute
          top-[16%]
          left-[6%]
          w-1.5
          h-1.5
          rounded-full
          bg-cyan-400
          blur-[0.5px]
          shadow-[0_0_8px_#22d3ee]
          animate-pulse
          pointer-events-none
        "
      />

      {/* Purple particle */}
      <div
        className="
          absolute
          bottom-[22%]
          right-[6%]
          w-2
          h-2
          rounded-full
          bg-purple-400
          blur-[0.5px]
          shadow-[0_0_10px_#c084fc]
          animate-pulse
          pointer-events-none
        "
      />

      {/* Indigo particle */}
      <div
        className="
          absolute
          top-[38%]
          right-[2%]
          w-1.5
          h-1.5
          rounded-full
          bg-indigo-300
          blur-[0.5px]
          shadow-[0_0_8px_#818cf8]
          pointer-events-none
        "
      />

      {/* Blue particle */}
      <div
        className="
          absolute
          bottom-[28%]
          left-[4%]
          w-2
          h-2
          rounded-full
          bg-blue-400
          blur-[0.5px]
          shadow-[0_0_8px_#60a5fa]
          animate-pulse
          pointer-events-none
        "
      />

      {/* =========================================
          MAIN PORTRAIT
      ========================================= */}

      <motion.div
        {...floatAnim}
        className="
          relative
          z-10
          w-full
          flex
          items-center
          justify-center
        "
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 80%, transparent 100%), radial-gradient(ellipse 95% 95% at 50% 50%, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 80%, transparent 100%), radial-gradient(ellipse 95% 95% at 50% 50%, black 80%, transparent 100%)",
          }}
        >
          <img
            src={prasantaPhoto}
            alt="Prasanta Gorai - Full Stack Developer"
            className="
              w-full
              h-auto
              object-contain
              select-none
              transition-transform
              duration-700
              hover:scale-[1.015]
            "
            loading="eager"
            draggable={false}
          />
          {/* Subtle bottom fade overlay ensuring 0 visible hard edges */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};

export default HomeHeroVisual;