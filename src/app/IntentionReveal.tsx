"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { duration, ease, stagger } from "@/lib/motion-config";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: stagger.word, delayChildren: 0.6 },
  },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.25em", filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0)",
    transition: { duration: duration.normal, ease: ease.out },
  },
};

// Calm word-by-word reveal of the AI daily intention. Lands AFTER the
// hero greeting completes, giving the surface a clear order of operations:
// see the day, then read the intention.
export function IntentionReveal({ text }: { text: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <p className="body-serif text-[1.125rem] sm:text-[1.5rem] lg:text-[1.8rem] text-[var(--color-ink-soft)] max-w-[36ch] mt-6 leading-[1.25]">
        {text}
      </p>
    );
  }
  const words = text.split(/(\s+)/);
  return (
    <motion.p
      className="body-serif text-[1.125rem] sm:text-[1.5rem] lg:text-[1.8rem] text-[var(--color-ink-soft)] max-w-[36ch] mt-6 leading-[1.25]"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={`s-${i}`}>{w}</span>
        ) : (
          <motion.span
            key={`w-${i}`}
            variants={word}
            className="inline-block"
            style={{ willChange: "transform, opacity, filter" }}
          >
            {w}
          </motion.span>
        )
      )}
    </motion.p>
  );
}
