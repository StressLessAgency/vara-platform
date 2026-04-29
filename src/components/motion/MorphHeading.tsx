"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, ease, stagger } from "@/lib/motion-config";

type Props = {
  text: string;
  italicTokens?: string[];           // tokens to render in italic + ocean color
  className?: string;
  startDelay?: number;
};

// Fraunces variable axes (opsz, SOFT, wght) animate per-letter as the heading
// enters. Letters bloom from a "soft" state to "settled."
// Letters that match italicTokens render with italic + ocean accent.
export function MorphHeading({ text, italicTokens = [], className = "", startDelay = 0 }: Props) {
  const reduced = useReducedMotion();
  const tokens = text.split(/(\s+)/); // preserve whitespace as own tokens
  let letterIndex = 0;

  return (
    <h1 className={className} aria-label={text}>
      {tokens.map((tok, ti) => {
        if (/^\s+$/.test(tok)) return <span key={`sp-${ti}`}> </span>;
        const isItalic = italicTokens.includes(tok.replace(/[.,!?]$/, ""));
        return (
          <span
            key={`tok-${ti}`}
            className={`inline-block whitespace-nowrap ${isItalic ? "font-serif" : ""}`}
            style={isItalic ? { fontStyle: "italic", color: "var(--color-ocean-deep)" } : undefined}
          >
            {[...tok].map((ch) => {
              const idx = letterIndex++;
              return reduced ? (
                <span key={`l-${idx}`} aria-hidden style={{ display: "inline-block" }}>
                  {ch}
                </span>
              ) : (
                <motion.span
                  key={`l-${idx}`}
                  aria-hidden
                  className="inline-block will-change-transform"
                  initial={{
                    opacity: 0, y: "0.18em",
                    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 200',
                  }}
                  animate={{
                    opacity: 1, y: 0,
                    fontVariationSettings: '"opsz" 96, "SOFT" 50, "wght" 300',
                  }}
                  transition={{
                    duration: duration.hero,
                    ease: ease.out,
                    delay: startDelay + idx * stagger.letter,
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
