"use client";

import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from "motion/react";
import { useRef } from "react";
import type { Resident } from "@/lib/types";

// 3D parallax tilt resident card. Avatar is a slowly-rotating conic gradient
// orb. Spring-damped, capped at small angles so it never reads as gimmicky.
export function ResidentCard({ r, preOpening }: { r: Resident; preOpening?: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLLIElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [3, -3]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-3, 3]), { stiffness: 220, damping: 22 });

  function onMove(e: React.MouseEvent) {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width * 2 - 1);
    my.set((e.clientY - rect.top) / rect.height * 2 - 1);
  }
  function onLeave() { mx.set(0); my.set(0); }

  return (
    <motion.li
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative bg-[var(--color-bg)] p-6 flex flex-col gap-4 group cursor-default"
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", transformPerspective: 800 }}
      data-magnetic="true"
    >
      <div className="flex items-start gap-4" style={{ transform: "translateZ(20px)" }}>
        <Avatar seed={r.avatarSeed} />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[1.25rem] leading-tight opsz-text">{r.name}</h3>
          <p className="text-[0.8rem] text-[var(--color-ink-mute)] mt-1">
            Villa {r.villa} <span className="text-[var(--color-gold)]">·</span> {r.villaCollection}
          </p>
        </div>
      </div>

      <p
        className="text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed"
        style={{ transform: "translateZ(10px)" }}
      >
        {r.bio}
      </p>

      <div
        className="flex flex-wrap gap-1.5 mt-auto"
        style={{ transform: "translateZ(15px)" }}
      >
        {r.interests.slice(0, 3).map((i) => (
          <span key={i} className="text-[0.7rem] tracking-[0.04em] text-[var(--color-ink-mute)] border border-[var(--color-hairline)] px-2 py-1">
            {i}
          </span>
        ))}
      </div>

      <button
        className="text-left font-serif italic text-[0.9rem] text-[var(--color-ocean-deep)] hover:text-[var(--color-gold)] transition-colors mt-2"
        style={{ transform: "translateZ(20px)" }}
      >
        {preOpening ? "Send a note before you both arrive →" : "Start a conversation →"}
      </button>

      {/* hover hairline accent */}
      <span className="absolute bottom-0 left-6 right-6 h-px bg-[var(--color-gold)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
    </motion.li>
  );
}

function Avatar({ seed }: { seed: string }) {
  const reduced = useReducedMotion();
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 60 + 180;
  const initials = seed.slice(0, 1).toUpperCase();
  return (
    <motion.div
      className="w-14 h-14 shrink-0 flex items-center justify-center font-serif text-[1.25rem] text-[var(--color-bg)] relative overflow-hidden"
      animate={reduced ? undefined : { rotate: [0, 360] }}
      transition={reduced ? undefined : { duration: 50, ease: "linear", repeat: Infinity }}
      style={{ transformStyle: "preserve-3d" }}
      aria-hidden
    >
      <span
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg, hsl(${hue}, 32%, 22%), hsl(${(hue + 40) % 360}, 36%, 50%), hsl(${(hue + 80) % 360}, 28%, 35%), var(--color-gold), hsl(${hue}, 32%, 22%))`,
        }}
      />
      <span className="relative" style={{ animation: reduced ? undefined : undefined }}>
        {initials}
      </span>
    </motion.div>
  );
}
