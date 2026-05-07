"use client";

import { motion, useReducedMotion } from "motion/react";

// Animated check mark that draws itself. Used on concierge confirmation.
// SVG path draws on with spring physics, then a radial glow pulses once.
export function SuccessCheck({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(74,144,168,0.15), transparent 70%)" }}
        initial={reduced ? { scale: 1, opacity: 0.6 } : { scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.4, 1], opacity: [0, 0.6, 0.3] }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />

      {/* Circle */}
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="relative">
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="url(#check-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.1 }}
        />
        <motion.path
          d="M22 33l7 7 13-14"
          stroke="url(#check-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1], delay: 0.55 }}
        />
        <defs>
          <linearGradient id="check-gradient" x1="0" y1="0" x2="64" y2="64">
            <stop stopColor="#1A2935" />
            <stop offset="1" stopColor="#4A90A8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
