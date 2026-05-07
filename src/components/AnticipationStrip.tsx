"use client";

import { motion } from "motion/react";
import { ease, duration } from "@/lib/motion-config";

type Chip = {
  label: string;
  body: string;
  meta?: string;
};

// The "the property already knows me" surface. Three quiet chips sitting under
// the intention card. Each chip is operational intelligence rendered as service.
// Sells the operator side of the pitch without naming algorithms.
export function AnticipationStrip({ chips }: { chips: Chip[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: ease.out, delay: 1.0 }}
    >
      {chips.map((chip, i) => (
        <motion.div
          key={chip.label}
          className="relative px-5 py-4 rounded-2xl border border-[var(--color-hairline)] bg-white/55 backdrop-blur-md overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.normal, ease: ease.out, delay: 1.1 + i * 0.08 }}
        >
          <span className="block text-[0.55rem] tracking-[0.2em] uppercase text-[var(--tod-accent,var(--color-accent))] font-medium mb-1.5">
            {chip.label}
          </span>
          <p className="font-serif text-[0.92rem] text-[var(--color-ink)] leading-snug" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
            {chip.body}
          </p>
          {chip.meta && (
            <span className="block mt-2 text-[0.65rem] text-[var(--color-ink-faint)] tabular">
              {chip.meta}
            </span>
          )}
          {/* faint tinted edge that breathes with time-of-day */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "var(--tod-accent-soft, transparent)" }} />
        </motion.div>
      ))}
    </motion.div>
  );
}
