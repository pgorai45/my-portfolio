import React from "react";
import { motion } from "motion/react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export interface SectionHeadingProps {
  badgeText: string;
  titlePrefix?: string;
  gradientText?: string;
  titleSuffix?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badgeText,
  titlePrefix = "",
  gradientText = "",
  titleSuffix = "",
  description,
  align = "center",
  className,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const isCenter = align === "center";

  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn("flex flex-col", isCenter ? "items-center text-center" : "items-start text-left", className)}
    >
      {/* Top Label with subtle accent divider line */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[11px] md:text-xs font-semibold tracking-[0.25em] uppercase text-indigo-300/80">
          {badgeText}
        </span>
        <span className="w-8 h-[1px] bg-gradient-to-r from-purple-500/80 to-transparent" />
      </div>

      {/* Main Title */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
        {titlePrefix && <span>{titlePrefix} </span>}
        {gradientText && (
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-400 glow-text-purple">
            {gradientText}
          </span>
        )}
        {titleSuffix && <span> {titleSuffix}</span>}
      </h2>

      {/* Optional Description */}
      {description && (
        <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};
