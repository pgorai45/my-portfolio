import React from "react";
import { motion } from "motion/react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowColor = "hover:border-purple-500/40",
  hoverEffect = true,
  onClick,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const motionProps = hoverEffect && !prefersReducedMotion
    ? {
        whileHover: { y: -6, transition: { duration: 0.25, ease: "easeOut" as const } },
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl p-4 sm:p-6 overflow-hidden",
        "bg-[#0a0f24]/60 backdrop-blur-xl border border-white/[0.08]",
        "transition-all duration-300 group shadow-lg shadow-black/40",
        hoverEffect && glowColor,
        className
      )}
    >
      {/* Top subtle shine highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Internal ambient glow on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
