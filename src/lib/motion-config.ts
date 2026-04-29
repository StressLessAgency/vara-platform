// Shared motion config. Tight, editorial, calm. No bouncing nonsense.
import type { Transition } from "motion/react";

export const ease = {
  // Cinematic exit. Used everywhere unless spring physics is required.
  default: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  // For elements that should feel anchored, settling.
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export const spring = {
  // For magnetic snap, biomarker indicators, number flow.
  soft: { type: "spring", stiffness: 110, damping: 22, mass: 0.8 } satisfies Transition,
  firm: { type: "spring", stiffness: 220, damping: 28, mass: 0.6 } satisfies Transition,
  // For the cursor follow.
  cursor: { type: "spring", stiffness: 500, damping: 40, mass: 0.4 } satisfies Transition,
};

export const duration = {
  fast: 0.32,
  normal: 0.56,
  slow: 0.92,
  hero: 1.4,
};

// stagger that respects pacing — never machine-gun
export const stagger = {
  hairline: 0.06,
  letter: 0.024,
  word: 0.08,
  row: 0.07,
};

// reduced motion check (called at module scope only)
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
