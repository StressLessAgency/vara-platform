"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ease, duration as d } from "@/lib/motion-config";

const LETTERS = ["V", "A", "R", "A"];

export function OpeningCeremony() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("vara-intro")) return;
      sessionStorage.setItem("vara-intro", "1");
    } catch {
      return;
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="ceremony"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-ocean-deep)] select-none pointer-events-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: ease.out }}
        >
          <motion.div
            className="absolute h-px bg-[var(--color-bg)]/20"
            style={{ top: "calc(50% - 5rem)", left: 56, right: 56, transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: d.slow, ease: ease.out, delay: 0.06 }}
          />

          <div className="flex items-baseline gap-[0.26em]" aria-label="VARA">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                className="font-serif text-[var(--color-bg)]"
                style={{ fontSize: "clamp(3rem, 9vw, 7rem)", lineHeight: 1 }}
                initial={{ opacity: 0, y: "0.14em", fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 100' }}
                animate={{ opacity: 1, y: 0, fontVariationSettings: '"opsz" 96, "SOFT" 50, "wght" 200' }}
                transition={{ duration: d.hero, ease: ease.out, delay: 0.18 + i * 0.1 }}
              >
                {l}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="mt-5 font-sans text-[var(--color-bg)]/55 text-[0.65rem] tracking-[0.44em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: d.slow, ease: ease.out, delay: 0.88 }}
          >
            Longevity Resort &middot; Bukit, Bali
          </motion.p>

          <motion.div
            className="absolute h-px bg-[var(--color-bg)]/20"
            style={{ bottom: "calc(50% - 5rem)", left: 56, right: 56, transformOrigin: "right" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: d.slow, ease: ease.out, delay: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
