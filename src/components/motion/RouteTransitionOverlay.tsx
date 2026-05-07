"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const ROUTE_LABELS: Record<string, { eyebrow: string; title: string }> = {
  "/":           { eyebrow: "Today",      title: "Where you are" },
  "/calendar":   { eyebrow: "Calendar",   title: "What's ahead" },
  "/wellness":   { eyebrow: "Wellness",   title: "How you feel" },
  "/community":  { eyebrow: "Community",  title: "Your neighbors" },
  "/concierge":  { eyebrow: "Concierge",  title: "We handle it" },
  "/profile":    { eyebrow: "Resident",   title: "Olivia" },
  "/team":       { eyebrow: "The team",   title: "By name" },
};

// Total chapter-curtain duration. ~1100ms = luxury without dragging.
const SWEEP_IN  = 0.42;   // panel slides from right covering screen
const HOLD      = 0.32;   // hairlines draw + title fades in
const SWEEP_OUT = 0.50;   // panel slides off to the left, revealing new page
const TOTAL_MS  = (SWEEP_IN + HOLD + SWEEP_OUT) * 1000;

export function RouteTransitionOverlay() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const prevPath = useRef(pathname);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [label, setLabel] = useState<{ eyebrow: string; title: string }>(
    ROUTE_LABELS[pathname] ?? { eyebrow: "VARA", title: "" }
  );

  useEffect(() => {
    if (reduced) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    const next = ROUTE_LABELS[pathname] ?? { eyebrow: "VARA", title: "" };
    setLabel(next);
    setActiveKey(`${prevPath.current}->${pathname}-${Date.now()}`);
    prevPath.current = pathname;
    const t = window.setTimeout(() => setActiveKey(null), TOTAL_MS + 80);
    return () => window.clearTimeout(t);
  }, [pathname, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {activeKey && (
        <motion.div
          key={activeKey}
          aria-hidden
          className="fixed inset-0 z-[60] pointer-events-none overflow-hidden"
        >
          {/* === Sweeping curtain panel === */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, #0A1A26 0%, #0F2A3D 45%, #1A3A52 100%)",
              boxShadow: "inset 0 0 200px rgba(212, 184, 148, 0.06)",
            }}
            initial={{ x: "101%" }}
            animate={{ x: ["101%", "0%", "0%", "-101%"] }}
            transition={{
              duration: SWEEP_IN + HOLD + SWEEP_OUT,
              times: [0, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT), (SWEEP_IN + HOLD) / (SWEEP_IN + HOLD + SWEEP_OUT), 1],
              ease: [0.65, 0.04, 0.36, 1],
            }}
          />

          {/* === Soft warm-gold radial glow rides with the panel === */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(212, 184, 148, 0.18) 0%, rgba(212, 184, 148, 0.06) 35%, transparent 70%)",
              filter: "blur(40px)",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0, 0.9, 0.9, 0],
              scale: [0.7, 1.05, 1.05, 1.15],
            }}
            transition={{
              duration: SWEEP_IN + HOLD + SWEEP_OUT,
              times: [0, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT), (SWEEP_IN + HOLD) / (SWEEP_IN + HOLD + SWEEP_OUT), 1],
              ease: [0.22, 0.61, 0.36, 1],
            }}
          />

          {/* === Two gold hairlines, drawing left-to-right during hold === */}
          <motion.span
            className="absolute left-0 right-0 h-px origin-left"
            style={{
              top: "33%",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(212, 184, 148, 0.0) 5%, rgba(212, 184, 148, 0.55) 50%, rgba(212, 184, 148, 0.0) 95%, transparent 100%)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }}
            transition={{
              duration: SWEEP_IN + HOLD + SWEEP_OUT,
              times: [0, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT) - 0.05, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT) + 0.06, (SWEEP_IN + HOLD * 0.85) / (SWEEP_IN + HOLD + SWEEP_OUT), (SWEEP_IN + HOLD) / (SWEEP_IN + HOLD + SWEEP_OUT)],
              ease: [0.22, 0.61, 0.36, 1],
            }}
          />
          <motion.span
            className="absolute left-0 right-0 h-px origin-right"
            style={{
              top: "67%",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(212, 184, 148, 0.0) 5%, rgba(212, 184, 148, 0.55) 50%, rgba(212, 184, 148, 0.0) 95%, transparent 100%)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }}
            transition={{
              duration: SWEEP_IN + HOLD + SWEEP_OUT,
              times: [0, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT) - 0.02, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT) + 0.10, (SWEEP_IN + HOLD * 0.9) / (SWEEP_IN + HOLD + SWEEP_OUT), (SWEEP_IN + HOLD) / (SWEEP_IN + HOLD + SWEEP_OUT)],
              ease: [0.22, 0.61, 0.36, 1],
            }}
          />

          {/* === Chapter title — eyebrow + serif === */}
          <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
            <div className="px-6">
              <motion.span
                className="block text-[0.65rem] sm:text-[0.7rem] tracking-[0.32em] uppercase font-medium text-[#D4B894]"
                initial={{ opacity: 0, y: 8, letterSpacing: "0.5em" }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  y: [8, 8, 0, 0, -4],
                  letterSpacing: ["0.5em", "0.5em", "0.32em", "0.32em", "0.32em"],
                }}
                transition={{
                  duration: SWEEP_IN + HOLD + SWEEP_OUT,
                  times: [0, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT) - 0.04, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT) + 0.08, (SWEEP_IN + HOLD * 0.85) / (SWEEP_IN + HOLD + SWEEP_OUT), (SWEEP_IN + HOLD) / (SWEEP_IN + HOLD + SWEEP_OUT)],
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                {label.eyebrow}
              </motion.span>
              <motion.span
                className="block font-serif italic text-[2rem] sm:text-[2.6rem] md:text-[3rem] mt-3 text-white"
                style={{ fontVariationSettings: '"opsz" 144, "wght" 300, "SOFT" 100' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  y: [14, 14, 0, 0, -6],
                }}
                transition={{
                  duration: SWEEP_IN + HOLD + SWEEP_OUT,
                  times: [0, SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT), SWEEP_IN / (SWEEP_IN + HOLD + SWEEP_OUT) + 0.10, (SWEEP_IN + HOLD * 0.9) / (SWEEP_IN + HOLD + SWEEP_OUT), (SWEEP_IN + HOLD) / (SWEEP_IN + HOLD + SWEEP_OUT)],
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {label.title}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
