"use client";

import { motion, useScroll } from "motion/react";

// Scroll progress bar. Native CSS scroll-driven animation where the browser
// supports it (zero JS on every scroll frame); JS path tracks scrollYProgress
// directly with no spring so the bar locks to scroll position exactly.
//
// The earlier version damped scroll through a spring, which read as 150–300ms
// of perceived lag on long pages. The bar now leads, never trails.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* Native CSS path — used by browsers that support scroll-timeline. */}
      <div
        aria-hidden
        className="vara-scroll-progress-css"
      />
      {/* JS fallback — visible only when the native version is not supported.
          Both render the same element shape; CSS @supports gates which one
          shows. The JS one updates a single transform on each scroll frame. */}
      <motion.div
        aria-hidden
        className="vara-scroll-progress-js fixed top-0 left-0 right-0 z-50 h-[2px] origin-left pointer-events-none"
        style={{
          scaleX: scrollYProgress,
          background:
            "linear-gradient(90deg, var(--color-gold-dim), var(--color-gold), var(--color-accent))",
        }}
      />
    </>
  );
}
