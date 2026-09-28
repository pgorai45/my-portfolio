import React, { useState, useEffect } from "react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

const ROLES: readonly string[] = [
  "FULL STACK DEVELOPER",
  "FRONTEND DEVELOPER",
  "BACKEND DEVELOPER",
  "SOFTWARE DEVELOPER",
] as const;

const TYPING_SPEED = 70; // ms per char when typing
const DELETING_SPEED = 35; // ms per char when deleting (slightly faster than typing)
const HOLD_DURATION = 2000; // wait 2 seconds after full word is typed
const EMPTY_PAUSE = 250; // brief pause when completely empty before next word starts

export const TypewriterRole: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState(ROLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const currentRole = ROLES[roleIndex];

    if (!isDeleting) {
      // Typing phase
      if (currentText === currentRole) {
        // Full role is typed: wait 2 seconds before deletion begins
        const holdTimeout = setTimeout(() => {
          setIsDeleting(true);
        }, HOLD_DURATION);
        return () => clearTimeout(holdTimeout);
      }

      // Add one character at a time
      const typingTimeout = setTimeout(() => {
        setCurrentText(currentRole.slice(0, currentText.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(typingTimeout);
    } else {
      // Deletion phase
      if (currentText === "") {
        // Completely empty: brief pause, then advance to next role
        const emptyTimeout = setTimeout(() => {
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
          setIsDeleting(false);
        }, EMPTY_PAUSE);
        return () => clearTimeout(emptyTimeout);
      }

      // Remove letters one by one
      const deletingTimeout = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, DELETING_SPEED);
      return () => clearTimeout(deletingTimeout);
    }
  }, [currentText, isDeleting, roleIndex, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-[0.25em] uppercase text-slate-300">
        FULL STACK DEVELOPER
      </h2>
    );
  }

  return (
    <div className="h-6 sm:h-7 md:h-8 flex items-center select-none overflow-hidden">
      <h2
        className="text-sm sm:text-base md:text-lg font-bold tracking-[0.25em] uppercase text-slate-300 flex items-center"
        aria-live="polite"
        aria-atomic="true"
      >
        <span>{currentText}</span>
        {/* Subtle, non-intrusive blinking caret */}
        <span
          className="inline-block w-[2px] h-[1.1em] ml-1.5 bg-purple-400/90 rounded-full animate-pulse align-middle"
          aria-hidden="true"
        />
      </h2>
    </div>
  );
};
