"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { spring } from "@/lib/motion-config";

type Props = {
  children: ReactNode;
  strength?: number;
  className?: string;
  as?: "div" | "button" | "a";
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

// Magnetic snap toward cursor on hover. Spring physics. Disabled on touch
// and reduced-motion. Mouse handler is rAF-throttled and the bounding rect
// is read once per frame, not per event, so a page with twenty magnetic
// targets does not force layout thrash on every mouse pixel.
export function Magnetic({
  children, strength = 14, className, as = "div", href, onClick, ariaLabel,
  disabled, type,
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.cursor);
  const sy = useSpring(y, spring.cursor);
  const isTouchRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ cx: number; cy: number } | null>(null);

  useEffect(() => {
    isTouchRef.current = (typeof window !== "undefined") &&
      (("ontouchstart" in window) || (navigator.maxTouchPoints ?? 0) > 0);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function flush() {
    rafRef.current = null;
    const p = pendingRef.current;
    pendingRef.current = null;
    const el = ref.current;
    if (!el || !p) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (p.cx - cx) / (r.width / 2);
    const dy = (p.cy - cy) / (r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function onMove(e: React.MouseEvent) {
    if (reduced || disabled || isTouchRef.current) return;
    pendingRef.current = { cx: e.clientX, cy: e.clientY };
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(flush);
  }
  function onLeave() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingRef.current = null;
    x.set(0); y.set(0);
  }

  const commonProps = {
    ref: ref as React.MutableRefObject<HTMLElement>,
    className,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    style: { x: sx, y: sy } as unknown as React.CSSProperties,
    "data-magnetic": "true",
  } as const;

  if (as === "a") {
    return (
      <motion.a
        {...(commonProps as Record<string, unknown>)}
        href={href}
        aria-label={ariaLabel}
      >
        {children}
      </motion.a>
    );
  }
  if (as === "button") {
    return (
      <motion.button
        {...(commonProps as Record<string, unknown>)}
        type={type ?? "button"}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {children}
      </motion.button>
    );
  }
  return (
    <motion.div {...(commonProps as Record<string, unknown>)}>{children}</motion.div>
  );
}
