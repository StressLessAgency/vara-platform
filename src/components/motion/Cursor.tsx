"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { spring } from "@/lib/motion-config";

// Custom cursor. Spring follows. Snaps onto magnetic actionables.
// Hidden on touch devices and when reduced motion is on.
export function Cursor() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, spring.cursor);
  const sy = useSpring(y, spring.cursor);
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || touch || reduced) return;
    function move(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest("[data-magnetic], a, button, input, textarea, [role='button']");
      setHovering(interactive);
    }
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y, touch, reduced, mounted]);

  // Avoid SSR/CSR mismatch — render only after mount.
  if (!mounted || touch || reduced) return null;

  return (
    <>
      {/* outer ring */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[60] pointer-events-none rounded-full mix-blend-multiply"
        style={{
          x: sx, y: sy,
          translateX: "-50%", translateY: "-50%",
          width: 28, height: 28,
          border: "1px solid var(--color-ocean-deep)",
          opacity: hovering ? 1 : 0.45,
          scale: hovering ? 1.6 : 1,
          transition: "opacity 220ms, scale 280ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
      />
      {/* inner dot */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[61] pointer-events-none rounded-full"
        style={{
          x: sx, y: sy,
          translateX: "-50%", translateY: "-50%",
          width: 4, height: 4,
          background: "var(--color-ocean-deep)",
          opacity: hovering ? 0 : 1,
          transition: "opacity 220ms",
        }}
      />
    </>
  );
}
