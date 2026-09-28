import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass" | "outline" | "nav";
  size?: "sm" | "md" | "lg";
  to?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  className,
  onClick,
  icon,
  iconPosition = "right",
  ariaLabel,
  type = "button",
  disabled = false,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-400 text-white shadow-[0_0_25px_rgba(147,51,234,0.45)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] border border-purple-400/30",
    secondary:
      "bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white border border-white/10 hover:border-purple-400/30 backdrop-blur-md",
    glass:
      "bg-slate-950/40 hover:bg-purple-950/30 text-slate-300 hover:text-white border border-white/10 hover:border-purple-500/40 backdrop-blur-lg shadow-lg",
    outline:
      "bg-transparent hover:bg-purple-950/20 text-purple-300 hover:text-purple-200 border border-purple-500/40 hover:border-purple-400",
    nav:
      "bg-slate-900/60 hover:bg-purple-900/40 text-slate-200 hover:text-white border border-white/10 hover:border-purple-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(147,51,234,0.2)] hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] text-xs px-4 py-2",
  };

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
    </>
  );

  const motionProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.025, transition: { duration: 0.15 } },
        whileTap: { scale: 0.975 },
      };

  const combinedClasses = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={combinedClasses} aria-label={ariaLabel}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <a
          href={href}
          className={combinedClasses}
          aria-label={ariaLabel}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};
