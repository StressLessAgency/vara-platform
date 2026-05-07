"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useInView } from "motion/react";
import type { Biomarker } from "@/lib/types";
import { duration, ease } from "@/lib/motion-config";
import { NumberFlow } from "@/components/motion/NumberFlow";

// Biomarker card. Stacked vertical layout — name + value on top row,
// then the optimal-range bar on its own line, then the low/high labels.
// Prevents the value from crowding the bar on narrow columns.
export function BiomarkerRow({ b, first, last }: { b: Biomarker; first: boolean; last: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const range = b.optimalHigh - b.optimalLow;
  const lowerVisible = b.optimalLow - range * 0.4;
  const upperVisible = b.optimalHigh + range * 0.4;
  const span = upperVisible - lowerVisible;
  const optStart = ((b.optimalLow - lowerVisible) / span) * 100;
  const optEnd = ((b.optimalHigh - lowerVisible) / span) * 100;
  const valuePct = Math.max(2, Math.min(98, ((b.value - lowerVisible) / span) * 100));
  const inOptimal = b.value >= b.optimalLow && b.value <= b.optimalHigh;
  const dotColor = inOptimal ? "var(--color-ocean-deep)" : "var(--color-gold)";

  return (
    <li
      ref={ref}
      className={`py-5 ${first ? "" : "border-t border-[var(--color-hairline)]"}`}
    >
      {/* Top row: marker name + value */}
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <span className="font-serif text-[1rem] sm:text-[1.0625rem] opsz-text text-[var(--color-ink)] truncate">
          {b.marker}
        </span>
        <span className="font-serif text-[1rem] sm:text-[1.0625rem] text-[var(--color-ocean-deep)] tabular whitespace-nowrap flex-shrink-0">
          <NumberFlow to={b.value} decimals={b.value % 1 === 0 ? 0 : 1} />
          <span className="text-[0.7rem] text-[var(--color-ink-mute)] not-italic ml-1 font-sans">
            {b.unit}
          </span>
        </span>
      </div>

      {/* Bar row */}
      <div className="relative h-3">
        {/* baseline rule */}
        <motion.div
          className="absolute top-1/2 left-0 h-px bg-[var(--color-hairline-strong)]"
          initial={reduced || !inView ? { width: "100%" } : { width: 0 }}
          animate={inView ? { width: "100%" } : undefined}
          transition={{ duration: duration.slow, ease: ease.out }}
        />
        {/* optimal range band */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-[var(--color-stone)] rounded-full"
          style={{ left: `${optStart}%`, width: `${optEnd - optStart}%`, transformOrigin: "left" }}
          initial={reduced || !inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : undefined}
          transition={{ duration: duration.normal, ease: ease.out, delay: 0.25 }}
          aria-label="optimal range"
        />
        {/* value indicator */}
        <motion.div
          className="absolute top-1/2 w-3 h-3 rounded-full ring-2 ring-white"
          style={{ left: `calc(${valuePct}% - 6px)`, translateY: "-50%", background: dotColor }}
          initial={reduced || !inView ? { left: `calc(${valuePct}% - 6px)`, scale: 1 } : { left: `calc(${optStart}% - 6px)`, scale: 0 }}
          animate={inView ? { left: `calc(${valuePct}% - 6px)`, scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9, delay: 0.45 }}
          aria-label={`value ${b.value}`}
        />
      </div>

      {/* Range labels */}
      <div className="flex justify-between text-[0.625rem] text-[var(--color-ink-mute)] tabular mt-2">
        <span>{b.optimalLow}</span>
        <span>{b.optimalHigh}</span>
      </div>
    </li>
  );
}
