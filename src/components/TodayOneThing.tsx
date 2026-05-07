"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Magnetic } from "@/components/motion/Magnetic";
import { duration, ease } from "@/lib/motion-config";
import type { EventItem, EventType } from "@/lib/types";

const EVENT_PHOTOS: Record<EventType, string> = {
  "Health Session": "/vara/photos/vara-event-health.jpg",
  "Master Class": "/vara/photos/vara-event-masterclass.jpg",
  "Signature Retreat": "/vara/photos/vara-event-retreat.jpg",
  "Community Event": "/vara/photos/vara-event-community.jpg",
};

// One Thing. The day's single recommendation, promoted from the events list.
// Larger, richer, written like a host suggesting where to be at sunset.
// The other events of the day live in the existing "Coming Up" list below.
export function TodayOneThing({
  event,
  reason,
  onOpen,
}: {
  event: EventItem;
  reason: string;
  onOpen: (e: EventItem) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: ease.out, delay: 0.9 }}
      aria-labelledby="today-onething-eyebrow"
    >
      <div className="flex items-baseline justify-between mb-5">
        <span id="today-onething-eyebrow" className="text-[0.6rem] tracking-[0.22em] uppercase font-medium text-[var(--tod-accent,var(--color-accent))]">
          One thing today
        </span>
        <span className="text-[0.65rem] text-[var(--color-ink-faint)] tabular oldstyle">
          {formatTime(event.startsAt)}
        </span>
      </div>

      <Magnetic strength={3} as="button" onClick={() => onOpen(event)} className="block w-full text-left">
        <article className="relative grid grid-cols-1 md:grid-cols-[1.2fr_1fr] overflow-hidden rounded-3xl border border-[var(--color-hairline)] bg-white/70 backdrop-blur-xl shadow-[0_4px_32px_rgba(26,41,53,0.08)] hover:shadow-[0_8px_48px_rgba(26,41,53,0.12)] transition-shadow duration-500">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px] overflow-hidden">
            <Image
              src={EVENT_PHOTOS[event.type]}
              alt=""
              fill
              priority
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A2935]/35 via-transparent to-transparent md:from-transparent md:to-[#1A2935]/15" />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-[rgba(74,144,168,0.18)] text-[0.55rem] text-[var(--color-accent)] tracking-[0.14em] uppercase font-medium">
              {event.type}
            </span>
          </div>

          <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div>
              <h2
                className="font-serif text-[1.5rem] md:text-[1.8rem] leading-[1.05] text-[var(--color-ink)]"
                style={{ fontVariationSettings: '"opsz" 36, "SOFT" 50' }}
              >
                {event.title}
              </h2>
              <p className="mt-3 text-[0.92rem] text-[var(--color-ink-soft)] leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-ocean-deep)] to-[var(--color-accent)] flex items-center justify-center text-white font-serif text-[0.85rem] flex-shrink-0">
                  {initials(event.host)}
                </span>
                <div className="min-w-0">
                  <span className="block text-[0.7rem] tracking-[0.16em] uppercase text-[var(--color-ink-faint)] font-medium">
                    Host
                  </span>
                  <span className="block font-serif text-[0.95rem] text-[var(--color-ink)] truncate" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                    {event.host}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-hairline)]">
                <p className="font-serif italic text-[0.88rem] text-[var(--color-ink-soft)] leading-snug" style={{ fontVariationSettings: '"opsz" 16, "SOFT" 100' }}>
                  {reason}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[0.7rem] text-[var(--color-ink-faint)]">
                  {event.location}
                </span>
                <span className="text-[0.7rem] text-[var(--color-ink-soft)] tabular oldstyle">
                  {event.rsvpCount}/{event.capacity}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Magnetic>
    </motion.section>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Makassar",
  });
}

function initials(name: string): string {
  return name
    .replace(/^(Dr|Chef|Coach|Ana|Mr|Mrs)\.?\s+/i, "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
