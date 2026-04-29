"use client";

import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from "motion/react";
import { useRef } from "react";
import type { Resident } from "@/lib/types";

// 3D parallax tilt resident card with glassmorphic styling.
// Avatar uses warm tropical gradients. Spring-damped, capped at small angles.
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
      className="relative bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-7 flex flex-col gap-4 group cursor-default list-none hover:shadow-[0_4px_32px_rgba(26,41,53,0.1)] transition-shadow h-full"
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", transformPerspective: 800 }}
      data-magnetic="true"
    >
      <div className="flex items-start gap-4" style={{ transform: "translateZ(20px)" }}>
        <Avatar seed={r.avatarSeed} />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[1.25rem] leading-tight opsz-text text-[#1A2935]">{r.name}</h3>
          <p className="text-[0.8rem] text-[#6B7A85] mt-1">
            {r.villa} <span className="text-[#4A90A8]">&middot;</span> {r.villaCollection}
          </p>
        </div>
      </div>

      <p
        className="text-[0.95rem] text-[#6B7A85] leading-relaxed line-clamp-2 lg:line-clamp-none"
        style={{ transform: "translateZ(10px)" }}
      >
        {r.bio}
      </p>

      <div
        className="flex flex-wrap gap-1.5 mt-auto"
        style={{ transform: "translateZ(15px)" }}
      >
        {r.interests.slice(0, 3).map((i) => (
          <span key={i} className="text-[0.65rem] tracking-[0.04em] text-[#4A90A8] border border-[rgba(74,144,168,0.2)] rounded-full px-2.5 py-0.5 uppercase font-medium">
            {i}
          </span>
        ))}
      </div>

      <button
        className="text-left font-serif italic text-[0.9rem] text-[#4A90A8] hover:text-[#1A2935] transition-colors mt-2"
        style={{ transform: "translateZ(20px)" }}
      >
        {preOpening ? "Send a note before you both arrive" : "Start a conversation"}
      </button>

      {/* hover accent line */}
      <span className="absolute bottom-0 left-8 right-8 h-px bg-[#4A90A8] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out rounded-full" />
    </motion.li>
  );
}

function Avatar({ seed }: { seed: string }) {
  const reduced = useReducedMotion();
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  // Warm tropical palette: sunset oranges, ocean teals, sand golds
  const hue = (hash % 40) + 15; // Warm range: 15-55 (gold/amber/orange)
  const initials = seed.slice(0, 1).toUpperCase();
  return (
    <motion.div
      className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-serif text-[1.25rem] text-white relative overflow-hidden"
      animate={reduced ? undefined : { rotate: [0, 360] }}
      transition={reduced ? undefined : { duration: 50, ease: "linear", repeat: Infinity }}
      style={{ transformStyle: "preserve-3d" }}
      aria-hidden
    >
      <span
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from 0deg, hsl(${hue}, 55%, 50%), hsl(${hue + 30}, 45%, 40%), #4A90A8, hsl(${hue + 15}, 50%, 55%), hsl(${hue}, 55%, 50%))`,
        }}
      />
      <span className="relative font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
        {initials}
      </span>
    </motion.div>
  );
}
