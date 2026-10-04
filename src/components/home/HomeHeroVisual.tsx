import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { portfolioApi } from "../../services/api";

const FALLBACK_HERO_IMAGE = "/assets/images/prasanta-hero.png";

export const HomeHeroVisual: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [heroImage, setHeroImage] = useState<string>(FALLBACK_HERO_IMAGE);

  useEffect(() => {
    let isMounted = true;

    portfolioApi
      .getProfile()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data?.profile_image) {
          const rawImage = res.data.profile_image.trim();
          if (rawImage) {
            if (
              rawImage.startsWith("http://") ||
              rawImage.startsWith("https://") ||
              rawImage.startsWith("data:")
            ) {
              setHeroImage(rawImage);
            } else if (rawImage.startsWith("/")) {
              const backendOrigin =
                import.meta.env.VITE_BACKEND_URL ||
                import.meta.env.VITE_API_URL ||
                "http://localhost:5000";
              setHeroImage(`${backendOrigin.replace(/\/+$/, "")}${rawImage}`);
            } else {
              setHeroImage(rawImage);
            }
          }
        }
      })
      .catch(() => {
        // Fallback to static hero image if API fails
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    <div className="relative w-full max-w-[460px] lg:max-w-[500px] xl:max-w-[540px] flex items-center justify-center select-none py-2">
      
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
          className="
            relative
            w-full
            max-w-[250px]
            sm:max-w-[290px]
            md:max-w-[330px]
            lg:max-w-[360px]
            xl:max-w-[380px]
            aspect-[4/5]
            mx-auto
            overflow-hidden
            rounded-2xl
            sm:rounded-3xl
            border
            border-white/[0.08]
            bg-slate-950/40
            shadow-[0_0_40px_-8px_rgba(147,51,234,0.18)]
          "
          style={{
            maskImage:
              "linear-gradient(to bottom, black 82%, transparent 100%), radial-gradient(ellipse 98% 98% at 50% 50%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 82%, transparent 100%), radial-gradient(ellipse 98% 98% at 50% 50%, black 85%, transparent 100%)",
          }}
        >
          <img
            src={heroImage}
            alt="Prasanta Gorai - Full Stack Developer"
            className="
              w-full
              h-full
              object-cover
              object-center
              select-none
              transition-transform
              duration-700
              hover:scale-[1.02]
            "
            loading="eager"
            draggable={false}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith(FALLBACK_HERO_IMAGE)) {
                target.src = FALLBACK_HERO_IMAGE;
              }
            }}
          />
          {/* Subtle bottom fade overlay ensuring seamless integration with the dark background */}
          <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};

export default HomeHeroVisual;