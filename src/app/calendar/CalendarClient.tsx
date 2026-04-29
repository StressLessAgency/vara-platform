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
        heroImage="/vara/photos/p07-img02-1740x899.jpeg"
      />

      {/* Glass filter chips */}
      <div className="flex gap-2 lg:gap-3 mb-12 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {FILTERS.map(({ label, value }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`relative px-5 py-2 rounded-full text-[0.7rem] lg:text-[0.75rem] font-medium tracking-[0.08em] uppercase whitespace-nowrap transition-all ${
                active
                  ? "text-white"
                  : "text-[#6B7A85] hover:text-[#1A2935] bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] shadow-[0_2px_24px_rgba(26,41,53,0.06)]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="calendar-filter"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1A2935] to-[#4A90A8]"
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
        <div className="space-y-14">
          {Array.from(grouped.entries()).map(([date, dayEvents], gi) => (
            <Reveal key={date} delay={gi * 0.06}>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] flex-shrink-0">
                    {date}
                  </span>
                  <HairlineDraw className="flex-1" delay={0.1} />
                </div>

                <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 pl-0 sm:pl-4">
                  {dayEvents.map((evt) => (
                    <RevealItem key={evt.id}>
                      <Magnetic strength={3}>
                        <div className="group p-5 sm:p-6 bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] hover:shadow-[0_4px_32px_rgba(26,41,53,0.1)] transition-shadow cursor-pointer h-full">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 mb-2">
                                <span className="px-2.5 py-0.5 rounded-full border border-[rgba(74,144,168,0.2)] text-[0.6rem] text-[#4A90A8] tracking-[0.1em] uppercase font-medium">
                                  {evt.type}
                                </span>
                                <span className="text-[0.65rem] text-[#6B7A85]">
                                  {formatTime(evt.startsAt)} &middot; {evt.durationMinutes}min
                                </span>
                              </div>
                              <h3 className="font-serif text-[1.1rem] text-[#1A2935] leading-snug group-hover:text-[#4A90A8] transition-colors"
                                style={{ fontVariationSettings: '"opsz" 20, "SOFT" 50' }}>
                                {evt.title}
                              </h3>
                              <p className="text-[0.8rem] text-[#6B7A85] mt-2 line-clamp-1 lg:line-clamp-2 leading-relaxed">
                                {evt.description}
                              </p>
                              <p className="text-[0.75rem] text-[#6B7A85]/70 mt-2.5">
                                {evt.location} &middot; {evt.host}
                              </p>
                            </div>

                            <div className="flex-shrink-0 flex flex-col items-end gap-2.5 pt-1">
                              <span className="tabular text-[0.7rem] text-[#6B7A85]">
                                {evt.rsvpCount}/{evt.capacity}
                              </span>
                              {evt.priceUsd && (
                                <span className="text-[0.7rem] text-[#4A90A8] font-medium">
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
        <div className="text-center py-24">
          <p className="body-serif text-[#6B7A85] text-lg">
            No events match this filter.
          </p>
        </div>
      )}
    </div>
  );
}
