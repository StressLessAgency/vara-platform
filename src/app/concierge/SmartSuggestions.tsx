"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion-config";

// "The usual" — three chips that pre-fill the form based on prior accepted requests.
// In production the chips are derived per resident from their concierge_requests
// history. For the pitch they're seeded so the moment lands the same every time.
type Suggestion = { label: string; description: string; needBy?: string; category: string };

const SUGGESTIONS: Suggestion[] = [
  {
    label: "The usual at Locavore",
    description: "Table for two at Locavore on Saturday. Window seat if available.",
    category: "restaurant",
  },
  {
    label: "Driver to Bingin",
    description: "Driver to Bingin Beach this afternoon, returning before 6.",
    category: "transport",
  },
  {
    label: "Late breakfast tray",
    description: "Late breakfast on the villa terrace tomorrow. The usual setup.",
    category: "in_villa",
  },
];

type Props = {
  onSelect: (s: Suggestion) => void;
};

export function SmartSuggestions({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.slow, ease: ease.out, delay: 0.2 }}
      className="mb-8"
    >
      <span className="block text-[0.6rem] tracking-[0.22em] uppercase font-medium text-[var(--color-ink-faint)] mb-3">
        Or pick something familiar
      </span>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.label}
            type="button"
            onClick={() => onSelect(s)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, ease: ease.out, delay: 0.3 + i * 0.06 }}
            className="group relative px-4 py-2.5 min-h-[44px] rounded-full border border-[var(--color-hairline)] bg-white/55 backdrop-blur-md text-left transition-all hover:border-[var(--color-accent)] hover:bg-white/80 active:scale-[0.97]"
          >
            <span className="font-serif italic text-[0.85rem] text-[var(--color-ink)]" style={{ fontVariationSettings: '"opsz" 14, "SOFT" 100' }}>
              {s.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export type { Suggestion };
