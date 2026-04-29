"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SurfaceHeader } from "@/components/SurfaceHeader";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import { Magnetic } from "@/components/motion/Magnetic";
import type { EventItem, EventType } from "@/lib/types";

const FILTERS: Array<{ label: string; value: EventType | "All" }> = [
  { label: "All", value: "All" },
  { label: "Health", value: "Health Session" },
  { label: "Master Class", value: "Master Class" },
  { label: "Retreats", value: "Signature Retreat" },
  { label: "Community", value: "Community Event" },
];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Makassar",
  });
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Makassar",
  });
}

// Group events by date string for the timeline layout.
function groupByDate(items: EventItem[]): Map<string, EventItem[]> {
  const map = new Map<string, EventItem[]>();
  for (const e of items) {
    const key = formatFullDate(e.startsAt);
    const arr = map.get(key) ?? [];
    arr.push(e);
    map.set(key, arr);
  }
  return map;
}

export function CalendarClient({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState<EventType | "All">("All");
  const filtered = filter === "All" ? events : events.filter((e) => e.type === filter);
  const grouped = groupByDate(filtered);

  return (
    <div>
      <SurfaceHeader
        eyebrow="Calendar"
        title="What's ahead"
        subtitle="Events, retreats, and sessions across the property."
        meta={`${events.length} upcoming`}
      />

      {/* Filter chips */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {FILTERS.map(({ label, value }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`relative px-4 py-1.5 rounded-full text-[0.75rem] font-medium tracking-wide whitespace-nowrap transition-colors ${
                active
                  ? "text-[var(--color-bg)]"
                  : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-hairline)]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="calendar-filter"
                  className="absolute inset-0 rounded-full bg-[var(--color-ocean-deep)]"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              {label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-12">
          {Array.from(grouped.entries()).map(([date, dayEvents], gi) => (
            <Reveal key={date} delay={gi * 0.06}>
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <span className="eyebrow flex-shrink-0">{date}</span>
                  <HairlineDraw className="flex-1" delay={0.1} />
                </div>

                <div className="space-y-3 pl-0 sm:pl-4">
                  {dayEvents.map((evt) => (
                    <RevealItem key={evt.id}>
                      <Magnetic strength={3}>
                        <div className="group p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-colors cursor-pointer">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[0.6rem] text-[var(--color-gold)] tracking-[0.12em] uppercase font-medium">
                                  {evt.type}
                                </span>
                                <span className="text-[0.6rem] text-[var(--color-ink-faint)]">
                                  {formatTime(evt.startsAt)} &middot; {evt.durationMinutes}min
                                </span>
                              </div>
                              <h3 className="font-serif text-[1.1rem] text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-ocean-deep)] transition-colors"
                                style={{ fontVariationSettings: '"opsz" 20, "SOFT" 50' }}>
                                {evt.title}
                              </h3>
                              <p className="text-[0.8rem] text-[var(--color-ink-mute)] mt-1.5 line-clamp-2">
                                {evt.description}
                              </p>
                              <p className="text-[0.75rem] text-[var(--color-ink-soft)] mt-2">
                                {evt.location} &middot; {evt.host}
                              </p>
                            </div>

                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                              <span className="tabular text-[0.7rem] text-[var(--color-ink-mute)]">
                                {evt.rsvpCount}/{evt.capacity}
                              </span>
                              {evt.priceUsd && (
                                <span className="text-[0.7rem] text-[var(--color-gold)] font-medium">
                                  ${evt.priceUsd}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Magnetic>
                    </RevealItem>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="body-serif text-[var(--color-ink-soft)] text-lg">
            No events match this filter.
          </p>
        </div>
      )}
    </div>
  );
}
