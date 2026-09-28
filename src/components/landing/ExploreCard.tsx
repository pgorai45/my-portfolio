import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ExploreCardItem } from "../../types/portfolio";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

interface ExploreCardProps {
  card: ExploreCardItem;
  index: number;
}

export const ExploreCard: React.FC<ExploreCardProps> = ({ card, index }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const Icon = card.icon;

  const cardVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: prefersReducedMotion ? 0 : index * 0.12,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              y: -8,
              transition: { duration: 0.25, ease: "easeOut" },
            }
      }
    >
      <Link
        to={`/home#${card.targetId}`}
        aria-label={`Explore ${card.title}`}
        className={cn(
          "group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl h-full",
          "bg-[#0a0f24]/75 backdrop-blur-xl border border-white/[0.08]",
          "transition-all duration-300 shadow-xl shadow-black/50 select-none block",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
          card.glowColor
        )}
      >
        {/* Top Border Sheen */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Ambient Gradient on Hover */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div>
          {/* Top Row: Icon Badge + Arrow */}
          <div className="flex items-center justify-between mb-6">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "border transition-all duration-300 group-hover:scale-105",
                card.badgeBg,
                card.badgeBorder,
                card.badgeTextColor
              )}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-purple-950/50 group-hover:border-purple-500/40 transition-all">
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card Title */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
            {card.title}
          </h3>

          {/* Card Description */}
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {card.description}
          </p>
        </div>

        {/* Subtle indicator bar on bottom */}
        <div className="w-8 h-0.5 rounded-full bg-slate-800 group-hover:bg-purple-400 group-hover:w-14 transition-all duration-300 mt-6" />
      </Link>
    </motion.div>
  );
};
