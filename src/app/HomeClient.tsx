"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { IntentionReveal } from "./IntentionReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { NumberFlow } from "@/components/motion/NumberFlow";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { MorphHeading } from "@/components/motion/MorphHeading";
import { EventSheet } from "@/components/EventSheet";
import { BaliPulse } from "@/components/BaliPulse";
import { AnticipationStrip } from "@/components/AnticipationStrip";
import { TodayOneThing } from "@/components/TodayOneThing";
import { greetingForHour } from "@/lib/utils";
import Image from "next/image";
import type { Resident, EventItem, Checkin, EventType } from "@/lib/types";

type Props = {
  resident: Resident;
  events: EventItem[];
  intention: string;
  intentionSource?: "live" | "fallback" | "pitch-cache";
  latestCheckin: Checkin;
};

const EVENT_PHOTOS: Record<EventType, string> = {
  "Health Session": "/vara/photos/vara-event-health.jpg",
  "Master Class": "/vara/photos/vara-event-masterclass.jpg",
  "Signature Retreat": "/vara/photos/vara-event-retreat.jpg",
  "Community Event": "/vara/photos/vara-event-community.jpg",
};

function bukitHour(): number {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    hour12: false,
  });
  const parts = f.formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour")?.value ?? 12);
}

function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Makassar",
  });
}

function formatEventDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Makassar",
  });
}

export function HomeClient({ resident, events, intention, latestCheckin }: Props) {
  // intentionSource intentionally unused in this client; reserved for ?live=1 debug overlay.
  const [hour, setHour] = useState(bukitHour);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const id = setInterval(() => setHour(bukitHour()), 60_000);
    return () => clearInterval(id);
  }, []);

  const greeting = greetingForHour(hour);
  const closeSheet = useCallback(() => setSelectedEvent(null), []);
  const featured = events[0];
  const restEvents = events.slice(1);

  // Anticipation chips. Today these are seeded — production derives them from
  // villa state, next-up RSVPs, and the wellness model. The intelligence is
  // never named to the resident; it lands as service.
  const anticipationChips = [
    {
      label: "Your villa",
      body: `${resident.villa} prepared by 3pm.`,
      meta: "Ade is in this morning.",
    },
    {
      label: "Next up",
      body: featured ? featured.title : "Quiet morning.",
      meta: featured ? `${featured.location}, ${featured.rsvpCount} going` : "Nothing on the calendar.",
    },
    {
      label: "Your body",
      body: `Recovery trended +${Math.max(1, latestCheckin.recovery - 2)} last week.`,
      meta: "Dr. Vasin notes Monday.",
    },
  ];

  return (
    <div className="space-y-14 lg:space-y-20">
      {/* ---- Full-bleed hero with parallax photo ---- */}
      <section className="bleed -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="relative h-[56vh] md:h-[58vh] lg:h-[62vh] xl:h-[68vh] min-h-[380px]">
          <ParallaxImage
            src="/vara/photos/vara-today-hero.jpg"
            alt="Bukit Peninsula pool ledge at first light"
            className="absolute inset-0 h-full w-full"
            priority
            speed={0.14}
            objectPosition="center 40%"
          />
          {/* Multi-layer gradient for cinematic depth + contrast guarantee */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F2C] via-[#1A2935]/70 to-[#1A2935]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2935]/55 via-[#1A2935]/15 to-transparent" />
          {/* Bottom-anchored scrim — guarantees greeting text contrast against any photo */}
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#0F1F2C]/95 via-[#1A2935]/65 to-transparent pointer-events-none" />

          {/* Greeting overlaid on hero */}
          <div className="absolute inset-x-0 bottom-0 layout-frame pb-24 sm:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <span className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.22em] uppercase font-medium text-white/50">
                {resident.villa} &middot; {resident.villaCollection}
              </span>
            </motion.div>

            {/* Variable font morph greeting */}
            <MorphHeading
              text={`${greeting}, ${resident.name}`}
              italicTokens={[resident.name]}
              italicColor="#FFE4B8"
              className="display-1 text-white mt-3 max-w-[18ch] [text-shadow:0_2px_28px_rgba(0,0,0,0.75),0_1px_6px_rgba(0,0,0,0.6),0_0_2px_rgba(0,0,0,0.4)]"
              startDelay={0.35}
            />

            {/* Subtle location + time indicator */}
            <motion.div
              className="flex items-center gap-3 mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90A8] animate-pulse" />
              <span className="text-[0.6rem] tracking-[0.12em] uppercase text-white/40 font-medium">
                Bukit Peninsula, Bali
              </span>
            </motion.div>
          </div>
        </div>

        {/* AI intention in a glass card floating below the hero */}
        <div className="relative layout-frame -mt-14 sm:-mt-16">
          <motion.div
            className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.span
                className="w-1 h-1 rounded-full bg-[#4A90A8]"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[0.6rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
                Today&apos;s intention
              </span>
            </div>
            <IntentionReveal text={intention} />

            {/* Bali environment strip */}
            <div className="mt-6 pt-5 border-t border-[rgba(74,144,168,0.08)]">
              <BaliPulse />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Anticipation strip: the property knows you ---- */}
      <section className="layout-frame-flush">
        <AnticipationStrip chips={anticipationChips} />
      </section>

      {/* ---- Wellness pulse ---- */}
      <div className="layout-frame-flush">
        <Reveal>
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
                Your Week
              </span>
              <Link href="/wellness" className="text-[0.75rem] text-[#4A90A8] hover:text-[#1A2935] transition-colors font-medium min-h-[44px] inline-flex items-center active:scale-[0.97]">
                Full report
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {([
                { label: "Sleep", value: latestCheckin.sleep, suffix: "/5" },
                { label: "Energy", value: latestCheckin.energy, suffix: "/5" },
                { label: "Stress", value: latestCheckin.stress, suffix: "/5", invert: true },
                { label: "Recovery", value: latestCheckin.recovery, suffix: "/5" },
              ] as const).map((m) => (
                <RevealItem key={m.label}>
                  <div className="relative bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5 sm:p-6 overflow-hidden">
                    {m.value >= 4 && !("invert" in m && m.invert) && (
                      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-[rgba(74,144,168,0.06)] blur-xl pointer-events-none" />
                    )}
                    <span className="text-[0.6rem] tracking-[0.16em] uppercase font-medium text-[#6B7A85]">
                      {m.label}
                    </span>
                    <p className="display-3 mt-2 text-[#4A90A8]">
                      <NumberFlow to={m.value} />
                      <span className="text-[#6B7A85] text-[0.5em] ml-0.5">{m.suffix}</span>
                    </p>
                  </div>
                </RevealItem>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      {/* ---- Today's One Thing — the day's single recommendation ---- */}
      {featured && (
        <section className="layout-frame-flush">
          <TodayOneThing
            event={featured}
            reason="Fits this morning's stillness. Walking distance from your villa."
            onOpen={setSelectedEvent}
          />
        </section>
      )}

      {/* ---- Coming up after that ---- */}
      <Reveal delay={0.1}>
        <section className="layout-frame-flush">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--tod-accent,var(--color-accent))]">
              And after that
            </span>
            <Link href="/calendar" className="text-[0.75rem] text-[var(--color-accent)] hover:text-[var(--color-ink)] transition-colors font-medium min-h-[44px] inline-flex items-center active:scale-[0.97]">
              Full calendar
            </Link>
          </div>

          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 xl:gap-5 lg:space-y-0">
            {restEvents.map((evt) => (
              <RevealItem key={evt.id}>
                <Magnetic strength={4}>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(evt)}
                    className="group flex items-start gap-3 sm:gap-5 p-4 sm:p-6 bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] hover:shadow-[0_4px_32px_rgba(26,41,53,0.1)] transition-all cursor-pointer h-full w-full text-left active:scale-[0.97]"
                  >
                    <div className="flex-shrink-0 w-14 text-center bg-[#FAFAF8] rounded-2xl py-2.5">
                      <span className="text-[0.6rem] text-[#6B7A85] uppercase tracking-wider block">
                        {formatEventDay(evt.startsAt).split(" ")[0]}
                      </span>
                      <span className="display-3 text-[#1A2935] block leading-tight mt-0.5">
                        {new Date(evt.startsAt).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[0.6rem] text-[#4A90A8] tracking-[0.12em] uppercase font-medium">
                          {evt.type}
                        </span>
                        <span className="text-[0.6rem] text-[#6B7A85]">
                          {formatEventTime(evt.startsAt)}
                        </span>
                      </div>
                      <h3 className="font-serif text-[1.05rem] text-[#1A2935] leading-snug group-hover:text-[#4A90A8] transition-colors"
                        style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                        {evt.title}
                      </h3>
                      <p className="text-[0.8rem] text-[#6B7A85] mt-1 hidden sm:block">
                        {evt.location} &middot; {evt.host}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right hidden sm:block">
                      <span className="tabular text-[0.75rem] text-[#6B7A85]">
                        {evt.rsvpCount}/{evt.capacity}
                      </span>
                    </div>

                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden">
                      <Image
                        src={EVENT_PHOTOS[evt.type]}
                        alt=""
                        width={80}
                        height={80}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </button>
                </Magnetic>
              </RevealItem>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---- Quick action cards ---- */}
      <Reveal delay={0.15}>
        <section className="layout-frame-flush grid grid-cols-2 gap-3 sm:gap-4">
          <Magnetic as="a" href="/concierge" strength={6}
            className="shimmer-overlay relative overflow-hidden flex items-center gap-3 sm:gap-4 p-5 sm:p-6 xl:p-8 xl:py-10 rounded-3xl bg-gradient-to-br from-[#1A2935] to-[#4A90A8] text-white cursor-pointer group shadow-[0_4px_24px_rgba(26,41,53,0.2)] active:scale-[0.97] transition-transform">
            <span className="text-[1.5rem]" aria-hidden>&#9742;</span>
            <div>
              <span className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.16em] uppercase opacity-60 block">Concierge</span>
              <span className="font-serif text-[0.9rem] sm:text-[1rem] mt-0.5 block" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                Make a request
              </span>
            </div>
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />
          </Magnetic>
          <Magnetic as="a" href="/community" strength={6}
            className="relative overflow-hidden flex items-center gap-3 sm:gap-4 p-5 sm:p-6 xl:p-8 xl:py-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] shadow-[0_2px_24px_rgba(26,41,53,0.06)] cursor-pointer group hover:shadow-[0_4px_32px_rgba(26,41,53,0.1)] transition-all active:scale-[0.97]">
            <span className="text-[1.5rem]" aria-hidden>&#9825;</span>
            <div>
              <span className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.16em] uppercase font-medium text-[#4A90A8] block">Community</span>
              <span className="font-serif text-[0.9rem] sm:text-[1rem] text-[#1A2935] mt-0.5 block" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                Meet residents
              </span>
            </div>
          </Magnetic>
        </section>
      </Reveal>

      {/* Event detail sheet */}
      <EventSheet event={selectedEvent} onClose={closeSheet} />
    </div>
  );
}
