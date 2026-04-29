"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { IntentionReveal } from "./IntentionReveal";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { NumberFlow } from "@/components/motion/NumberFlow";
import { Magnetic } from "@/components/motion/Magnetic";
import { greetingForHour } from "@/lib/utils";
import type { Resident, EventItem, Checkin } from "@/lib/types";

type Props = {
  resident: Resident;
  events: EventItem[];
  intention: string;
  latestCheckin: Checkin;
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
  const [hour, setHour] = useState(bukitHour);
  useEffect(() => {
    const id = setInterval(() => setHour(bukitHour()), 60_000);
    return () => clearInterval(id);
  }, []);

  const greeting = greetingForHour(hour);

  return (
    <div className="space-y-16 lg:space-y-20">
      {/* Hero greeting */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="eyebrow">{resident.villa}</span>
        </motion.div>

        <motion.h1
          className="display-1 text-[var(--color-ink)] mt-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.4 }}
        >
          {greeting}, {resident.name}
        </motion.h1>

        <IntentionReveal text={intention} />

        <HairlineDraw className="mt-12" delay={1.2} />
      </section>

      {/* Weekly pulse (mini wellness snapshot) */}
      <Reveal>
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <span className="eyebrow">Your Week</span>
            <Link href="/wellness" className="text-[0.75rem] text-[var(--color-gold)] hover:text-[var(--color-gold-dim)] transition-colors">
              Full report
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {([
              { label: "Sleep", value: latestCheckin.sleep, suffix: "/5" },
              { label: "Energy", value: latestCheckin.energy, suffix: "/5" },
              { label: "Stress", value: latestCheckin.stress, suffix: "/5", invert: true },
              { label: "Recovery", value: latestCheckin.recovery, suffix: "/5" },
            ] as const).map((m) => (
              <RevealItem key={m.label}>
                <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-hairline)]">
                  <span className="eyebrow">{m.label}</span>
                  <p className="display-3 mt-2 text-[var(--color-ocean-deep)]">
                    <NumberFlow to={m.value} />
                    <span className="text-[var(--color-ink-faint)] text-[0.5em] ml-0.5">{m.suffix}</span>
                  </p>
                </div>
              </RevealItem>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Upcoming events */}
      <Reveal delay={0.1}>
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <span className="eyebrow">Coming Up</span>
            <Link href="/calendar" className="text-[0.75rem] text-[var(--color-gold)] hover:text-[var(--color-gold-dim)] transition-colors">
              Full calendar
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((evt, i) => (
              <RevealItem key={evt.id}>
                <Magnetic strength={4}>
                  <div className="group flex items-start gap-5 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-colors cursor-pointer">
                    {/* Date block */}
                    <div className="flex-shrink-0 w-12 text-center">
                      <span className="text-[0.65rem] text-[var(--color-ink-mute)] uppercase tracking-wider block">
                        {formatEventDay(evt.startsAt).split(" ")[0]}
                      </span>
                      <span className="display-3 text-[var(--color-ocean-deep)] block leading-tight mt-0.5">
                        {new Date(evt.startsAt).getDate()}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[0.6rem] text-[var(--color-gold)] tracking-[0.12em] uppercase font-medium">
                          {evt.type}
                        </span>
                        <span className="text-[0.6rem] text-[var(--color-ink-faint)]">
                          {formatEventTime(evt.startsAt)}
                        </span>
                      </div>
                      <h3 className="font-serif text-[1.05rem] text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-ocean-deep)] transition-colors"
                        style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                        {evt.title}
                      </h3>
                      <p className="text-[0.8rem] text-[var(--color-ink-mute)] mt-1">
                        {evt.location} &middot; {evt.host}
                      </p>
                    </div>

                    {/* RSVP count */}
                    <div className="flex-shrink-0 text-right">
                      <span className="tabular text-[0.75rem] text-[var(--color-ink-soft)]">
                        {evt.rsvpCount}/{evt.capacity}
                      </span>
                    </div>
                  </div>
                </Magnetic>
              </RevealItem>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Quick actions */}
      <Reveal delay={0.15}>
        <section className="grid grid-cols-2 gap-3">
          <Magnetic as="a" href="/concierge" strength={6}
            className="flex items-center gap-3 p-5 rounded-2xl bg-[var(--color-ocean-deep)] text-[var(--color-bg)] cursor-pointer group">
            <span className="text-[1.4rem]" aria-hidden>&#9742;</span>
            <div>
              <span className="text-[0.6rem] tracking-[0.16em] uppercase opacity-60 block">Concierge</span>
              <span className="font-serif text-[1rem] mt-0.5 block" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                Make a request
              </span>
            </div>
          </Magnetic>
          <Magnetic as="a" href="/community" strength={6}
            className="flex items-center gap-3 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-hairline)] cursor-pointer group hover:border-[var(--color-hairline-strong)] transition-colors">
            <span className="text-[1.4rem]" aria-hidden>&#9825;</span>
            <div>
              <span className="eyebrow block">Community</span>
              <span className="font-serif text-[1rem] text-[var(--color-ink)] mt-0.5 block" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                Meet residents
              </span>
            </div>
          </Magnetic>
        </section>
      </Reveal>
    </div>
  );
}
