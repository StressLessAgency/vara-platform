"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion-config";

// BrechkaJourney renders protocol tags as a vertical path, not a bag of pills.
// Where you started → where you are → what is next. The pitch viewer reads
// time and direction, not labels.
//
// In production these come from a residents.protocols join. For the pitch they
// are seeded so the moment lands the same every time.
type Tier = {
  label: string;
  detail: string;
  state: "past" | "current" | "next";
  meta?: string;
};

const DEFAULT_TIERS: Tier[] = [
  { label: "Onboarding panel", detail: "Brechka full-spectrum draw and resident interview.", state: "past", meta: "March 2026" },
  { label: "Sleep optimization, Tier 1", detail: "Glycine before bed, blackout shades, early dinner.", state: "past", meta: "March → April" },
  { label: "Sleep optimization, Tier 2", detail: "Magnesium L-threonate. Cliff breathwork three mornings a week. Saunas Sunday.", state: "current", meta: "April → today" },
  { label: "Metabolic reset", detail: "Phase one of the 12-week reset. Begins after the next biomarker draw.", state: "next", meta: "Beginning June" },
];

export function BrechkaJourney({ tiers = DEFAULT_TIERS }: { tiers?: Tier[] }) {
  return (
    <section aria-labelledby="journey-eyebrow">
      <div className="flex items-baseline justify-between mb-8">
        <span id="journey-eyebrow" className="text-[0.65rem] tracking-[0.22em] uppercase font-medium text-[var(--tod-accent,var(--color-accent))]">
          Your journey
        </span>
        <span className="text-[0.7rem] text-[var(--color-ink-faint)] tabular oldstyle">
          Brechka protocol
        </span>
      </div>

      <ol className="relative">
        {/* spine */}
        <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-hairline-strong)]" />

        {tiers.map((t, i) => (
          <motion.li
            key={t.label}
            className="relative pl-9 pb-8 last:pb-0"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: duration.slow, ease: ease.out, delay: i * 0.07 }}
          >
            <Marker state={t.state} />
            <div className="flex items-baseline justify-between gap-3">
              <h3
                className={`font-serif text-[1rem] sm:text-[1.05rem] leading-tight ${t.state === "next" ? "text-[var(--color-ink-faint)]" : "text-[var(--color-ink)]"}`}
                style={{ fontVariationSettings: '"opsz" 20, "SOFT" 50' }}
              >
                {t.label}
              </h3>
              {t.meta && (
                <span className="text-[0.65rem] text-[var(--color-ink-faint)] tabular oldstyle whitespace-nowrap">
                  {t.meta}
                </span>
              )}
            </div>
            <p className={`mt-1.5 text-[0.86rem] leading-relaxed ${t.state === "next" ? "text-[var(--color-ink-faint)]" : "text-[var(--color-ink-soft)]"}`}>
              {t.detail}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function Marker({ state }: { state: Tier["state"] }) {
  if (state === "current") {
    return (
      <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-30 animate-ping" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--color-accent)] ring-2 ring-white" />
      </span>
    );
  }
  if (state === "past") {
    return (
      <span className="absolute left-0 top-2 inline-flex h-4 w-4 items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-[var(--color-ocean-deep)]" />
      </span>
    );
  }
  return (
    <span className="absolute left-0 top-2 inline-flex h-4 w-4 items-center justify-center">
      <span className="h-2 w-2 rounded-full border border-dashed border-[var(--color-ink-faint)]" />
    </span>
  );
}
