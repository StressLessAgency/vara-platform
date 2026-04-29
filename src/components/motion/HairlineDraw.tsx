"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "@/lib/motion-config";

type Props = {
  className?: string;
  delay?: number;
  strong?: boolean;
  vertical?: boolean;
};

// Hairline that draws on entry. The signature gesture of the deck —
// brought into the platform.
export function HairlineDraw({ className = "", delay = 0, strong, vertical }: Props) {
  const reduced = useReducedMotion();
  const color = strong ? "var(--color-ocean-deep)" : "var(--color-hairline)";
  if (vertical) {
    return (
      <motion.span
        aria-hidden
        className={`block w-px ${className}`}
        style={{ background: color, transformOrigin: "top" }}
        initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: duration.slow, ease: ease.out, delay }}
      />
    );
  }
  return (
    <motion.span
      aria-hidden
      className={`block h-px ${className}`}
      style={{ background: color, transformOrigin: "left" }}
      initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
    />
  );
}
