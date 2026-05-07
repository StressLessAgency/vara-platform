"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { SurfaceHeader } from "@/components/SurfaceHeader";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import { Magnetic } from "@/components/motion/Magnetic";
import { EventSheet } from "@/components/EventSheet";
import type { EventItem, EventType } from "@/lib/types";

const FILTERS: Array<{ label: string; value: EventType | "All" }> = [
  { label: "All", value: "All" },
  { label: "Health", value: "Health Session" },
  { label: "Master Class", value: "Master Class" },
  { label: "Retreats", value: "Signature Retreat" },
  { label: "Community", value: "Community Event" },
];

const EVENT_PHOTOS: Record<EventType, string> = {
  "Health Session": "/vara/photos/vara-event-health.jpg",
  "Master Class": "/vara/photos/vara-event-masterclass.jpg",
  "Signature Retreat": "/vara/photos/vara-event-retreat.jpg",
  "Community Event": "/vara/photos/vara-event-community.jpg",
};

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
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const closeSheet = useCallback(() => setSelectedEvent(null), []);
  const filtered = filter === "All" ? events : events.filter((e) => e.type === filter);
  const grouped = groupByDate(filtered);

  return (
    <div>
      <SurfaceHeader
        eyebrow="Calendar"
        title="What's ahead"
        subtitle="Events, retreats, and sessions across the property."
        meta={`${events.length} upcoming`}
        heroImage="/vara/photos/vara-calendar-hero.jpg"
      />

      {/* Filter chips -- centered on desktop, scrollable on mobile */}
      <div className="layout-frame-flush flex flex-wrap justify-start lg:justify-center gap-2 lg:gap-3 mb-12 overflow-x-auto pb-1 scrollbar-hide scroll-touch">
        {FILTERS.map(({ label, value }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`relative px-5 py-2.5 min-h-[44px] rounded-full text-[0.7rem] lg:text-[0.75rem] font-medium tracking-[0.08em] uppercase whitespace-nowrap transition-all active:scale-[0.95] ${
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
        <div className="layout-frame-flush space-y-14">
          {Array.from(grouped.entries()).map(([date, dayEvents], gi) => (
            <Reveal key={date} delay={gi * 0.06}>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] flex-shrink-0">
                    {date}
                  </span>
                  <HairlineDraw className="flex-1" delay={0.1} />
                </div>

                <div
                  className={
                    dayEvents.length === 1
                      ? "grid grid-cols-1 max-w-2xl mx-auto"
                      : dayEvents.length === 2
                        ? "grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5 max-w-5xl mx-auto"
                        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5"
                  }
                >
                  {dayEvents.map((evt) => (
                    <RevealItem key={evt.id}>
                      <Magnetic strength={3}>
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(evt)}
                          className="group bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] hover:shadow-[0_4px_32px_rgba(26,41,53,0.1)] transition-all cursor-pointer h-full w-full text-left active:scale-[0.97] overflow-hidden"
                        >
                          {/* Photo strip */}
                          <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden">
                            <Image
                              src={EVENT_PHOTOS[evt.type]}
                              alt=""
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                            {/* Type badge overlaid on photo */}
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(74,144,168,0.15)] text-[0.55rem] text-[#4A90A8] tracking-[0.1em] uppercase font-medium">
                              {evt.type}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="p-5 sm:p-6 -mt-4 relative">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[0.65rem] text-[#6B7A85] tabular">
                                {formatTime(evt.startsAt)} &middot; {evt.durationMinutes}min
                              </span>
                              {evt.priceUsd && (
                                <span className="text-[0.65rem] text-[#4A90A8] font-medium ml-auto">
                                  ${evt.priceUsd}
                                </span>
                              )}
                            </div>
                            <h3
                              className="font-serif text-[1.1rem] text-[#1A2935] leading-snug group-hover:text-[#4A90A8] transition-colors"
                              style={{ fontVariationSettings: '"opsz" 20, "SOFT" 50' }}
                            >
                              {evt.title}
                            </h3>
                            <p className="text-[0.8rem] text-[#6B7A85] mt-2 line-clamp-2 leading-relaxed">
                              {evt.description}
                            </p>

                            {/* Footer: location + capacity */}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(74,144,168,0.08)]">
                              <span className="text-[0.7rem] text-[#6B7A85]/70">
                                {evt.location} &middot; {evt.host}
                              </span>
                              <span className="tabular text-[0.7rem] text-[#6B7A85]">
                                {evt.rsvpCount}/{evt.capacity}
                              </span>
                            </div>
                          </div>
                        </button>
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

      <EventSheet event={selectedEvent} onClose={closeSheet} />
    </div>
  );
}
