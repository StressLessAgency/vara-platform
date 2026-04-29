"use client";

import { motion, useReducedMotion } from "motion/react";

export function CheckinDots({
  label, value, invert, delay = 0,
}: { label: string; value: number; invert?: boolean; delay?: number }) {
  const reduced = useReducedMotion();
  const dots = [1, 2, 3, 4, 5];
  return (
    <div>
      <span className="eyebrow">{label}</span>
      <div className="mt-2 flex gap-1">
        {dots.map((d, i) => {
          const filled = invert ? d <= 6 - value : d <= value;
          return (
            <motion.span
              key={d}
              className="w-3 h-3 rounded-full"
              initial={reduced ? { scale: 1 } : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 240, damping: 18, delay: delay + i * 0.04 }}
              style={{ background: filled ? "var(--color-ocean-deep)" : "var(--color-hairline)" }}
            />
          );
        })}
      </div>
    </div>
  );
}
