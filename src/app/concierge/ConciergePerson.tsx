"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion-config";

// The human on duty. Sits at the top of the concierge surface so the resident
// reads "person" before "form". The status line cycles softly every few seconds —
// not a fake animation, the kind of small change a real desk would have.
const STATUS_CYCLE = [
  { dot: "#5fb37e", text: "On the floor. Typical reply 4 minutes." },
  { dot: "#5fb37e", text: "Two ahead of you in the queue." },
  { dot: "#5fb37e", text: "Coffee just made. Ask if you want one." },
];

type Props = {
  name?: string;
  role?: string;
  villaShift?: string;
};

export function ConciergePerson({
  name = "Lara",
  role = "Front Desk",
  villaShift = "Vantara wing, today",
}: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % STATUS_CYCLE.length), 7200);
    return () => clearInterval(t);
  }, []);

  const status = STATUS_CYCLE[idx];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: ease.out }}
      className="mb-10 lg:mb-12"
      aria-label="Concierge on duty"
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <Avatar name={name} />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[0.6rem] tracking-[0.22em] uppercase font-medium text-[var(--tod-accent,var(--color-accent))]">
              On duty
            </span>
            <span className="text-[0.6rem] text-[var(--color-ink-faint)] tabular oldstyle">
              {villaShift}
            </span>
          </div>

          <h2
            className="font-serif text-[1.4rem] sm:text-[1.6rem] text-[var(--color-ink)] mt-1 leading-tight"
            style={{ fontVariationSettings: '"opsz" 32, "SOFT" 50' }}
          >
            {name}
            <span className="font-serif italic text-[0.85rem] text-[var(--color-ink-faint)] ml-2 align-baseline" style={{ fontVariationSettings: '"opsz" 14, "SOFT" 100' }}>
              {role}
            </span>
          </h2>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: status.dot }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: status.dot }} />
            </span>
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.normal, ease: ease.out }}
              className="text-[0.78rem] text-[var(--color-ink-soft)]"
            >
              {status.text}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="mt-5 h-px w-full bg-[var(--color-hairline)]" />
    </motion.section>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name[0]?.toUpperCase() ?? "L";
  return (
    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-accent)] to-[#7fb3c8] flex items-center justify-center shadow-[0_4px_18px_rgba(26,41,53,0.20)]">
        <span className="font-serif text-white text-[1.2rem] sm:text-[1.4rem]" style={{ fontVariationSettings: '"opsz" 36, "SOFT" 50' }}>
          {initial}
        </span>
      </div>
      <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-white/40" />
    </div>
  );
}
