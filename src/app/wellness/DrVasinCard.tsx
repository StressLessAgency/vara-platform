"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion-config";

// DrVasinCard — the wellness lead's note, sitting at the top of the wellness
// surface so the resident reads "person" before "numbers". The note is dated
// and signed. In production these come from the wellness team app; for the
// pitch they're seeded so the moment is reliable.
type Props = {
  note: string;
  dated: string;
};

export function DrVasinCard({ note, dated }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: ease.out }}
      className="mb-12"
      aria-label="A note from your wellness lead"
    >
      <div className="relative bg-white/65 backdrop-blur-xl border border-[var(--color-hairline)] rounded-3xl shadow-[0_4px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8 lg:p-10 overflow-hidden">
        {/* Soft tint that breathes with time of day */}
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "var(--tod-tint, transparent)" }} />

        <div className="relative flex items-start gap-5">
          <Portrait />

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[0.6rem] tracking-[0.22em] uppercase font-medium text-[var(--tod-accent,var(--color-accent))]">
                A note from
              </span>
              <span className="text-[0.6rem] text-[var(--color-ink-faint)] tabular oldstyle">
                {dated}
              </span>
            </div>

            <h2
              className="font-serif text-[1.5rem] sm:text-[1.7rem] text-[var(--color-ink)] mt-0.5 leading-tight"
              style={{ fontVariationSettings: '"opsz" 32, "SOFT" 50' }}
            >
              Dr. Vasin
              <span className="font-serif italic text-[0.85rem] text-[var(--color-ink-faint)] ml-2 align-baseline" style={{ fontVariationSettings: '"opsz" 14, "SOFT" 100' }}>
                Wellness lead
              </span>
            </h2>

            <p
              className="mt-4 font-serif italic text-[1.05rem] sm:text-[1.15rem] text-[var(--color-ink-soft)] leading-relaxed max-w-[58ch]"
              style={{ fontVariationSettings: '"opsz" 22, "SOFT" 100' }}
            >
              {note}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Portrait() {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3a5a40] via-[#588157] to-[#a3b18a] flex items-center justify-center shadow-[0_4px_18px_rgba(26,41,53,0.18)]">
        <span className="font-serif text-white text-[1.4rem] sm:text-[1.65rem]" style={{ fontVariationSettings: '"opsz" 36, "SOFT" 50' }}>
          V
        </span>
      </div>
      <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-white/40" />
    </div>
  );
}
