"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { spring } from "@/lib/motion-config";

type Props = {
  children: ReactNode;
  strength?: number;   // px of pull at edge
  className?: string;
  as?: "div" | "button" | "a";
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

// Magnetic snap toward cursor on hover. Spring physics. Disabled on touch
// and reduced-motion. Wraps any actionable.
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

  function onMove(e: React.MouseEvent) {
    if (reduced || disabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }
  function onLeave() {
    x.set(0); y.set(0);
  }

  // Common props at runtime — keep the JSX minimal.
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
