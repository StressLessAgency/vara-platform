"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { IntentionReveal } from "./IntentionReveal";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { NumberFlow } from "@/components/motion/NumberFlow";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
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
    <div className="space-y-14 lg:space-y-20">
      {/* ---- Full-bleed hero with parallax photo ---- */}
      <section className="-mx-5 sm:-mx-8 lg:-mx-12 -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="relative h-[50vh] md:h-[55vh] lg:h-[60vh] xl:h-[65vh] min-h-[340px]">
          <ParallaxImage
            src="/vara/photos/p05-img02-1740x899.jpeg"
            alt="Infinity pool at sunset"
            className="absolute inset-0 h-full w-full"
            priority
            speed={0.14}
            objectPosition="center 40%"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2935]/80 via-[#1A2935]/30 to-transparent" />

          {/* Greeting overlaid on hero */}
          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-8 lg:px-12 pb-24 sm:pb-28">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-white/60">
                {resident.villa}
              </span>
            </motion.div>

            <motion.h1
              className="display-1 text-white mt-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.4 }}
            >
              {greeting}, {resident.name}
            </motion.h1>
          </div>
        </div>

        {/* AI intention in a glass card floating below the hero */}
        <div className="relative px-5 sm:px-8 lg:px-12 -mt-14 sm:-mt-16">
          <motion.div
            className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.6 }}
          >
            <span className="text-[0.6rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] block mb-2">
              Today's intention
            </span>
            <IntentionReveal text={intention} />
          </motion.div>
        </div>
      </section>

      {/* ---- xl+ 2-column: intention + wellness ---- */}
      <div className="xl:grid xl:grid-cols-2 xl:gap-12 xl:items-start space-y-14 xl:space-y-0">
        {/* Left: greeting + intention (hidden on xl+ since it's in the hero) */}
        {/* On xl+ this column is just the intention card standalone */}
        <div className="hidden xl:block">
          <motion.div
            className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.7 }}
          >
            <span className="text-[0.6rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] block mb-2">
              Today's intention
            </span>
            <IntentionReveal text={intention} />
          </motion.div>
        </div>

        {/* Right: wellness pulse */}
        <Reveal>
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
                Your Week
              </span>
              <Link href="/wellness" className="text-[0.75rem] text-[#4A90A8] hover:text-[#1A2935] transition-colors font-medium">
                Full report
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
              {([
                { label: "Sleep", value: latestCheckin.sleep, suffix: "/5" },
                { label: "Energy", value: latestCheckin.energy, suffix: "/5" },
                { label: "Stress", value: latestCheckin.stress, suffix: "/5", invert: true },
                { label: "Recovery", value: latestCheckin.recovery, suffix: "/5" },
              ] as const).map((m) => (
                <RevealItem key={m.label}>
                  <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5 sm:p-6">
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

      {/* ---- Upcoming events in glass cards ---- */}
      <Reveal delay={0.1}>
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
              Coming Up
            </span>
            <Link href="/calendar" className="text-[0.75rem] text-[#4A90A8] hover:text-[#1A2935] transition-colors font-medium">
              Full calendar
            </Link>
          </div>

          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {events.map((evt) => (
              <RevealItem key={evt.id}>
                <Magnetic strength={4}>
                  <div className="group flex items-start gap-5 p-5 sm:p-6 bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] hover:shadow-[0_4px_32px_rgba(26,41,53,0.1)] transition-shadow cursor-pointer h-full">
                    {/* Date block */}
                    <div className="flex-shrink-0 w-14 text-center bg-[#FAFAF8] rounded-2xl py-2.5">
                      <span className="text-[0.6rem] text-[#6B7A85] uppercase tracking-wider block">
                        {formatEventDay(evt.startsAt).split(" ")[0]}
                      </span>
                      <span className="display-3 text-[#1A2935] block leading-tight mt-0.5">
                        {new Date(evt.startsAt).getDate()}
                      </span>
                    </div>

                    {/* Details */}
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
                      <p className="text-[0.8rem] text-[#6B7A85] mt-1">
                        {evt.location} &middot; {evt.host}
                      </p>
                    </div>

                    {/* RSVP count */}
                    <div className="flex-shrink-0 text-right">
                      <span className="tabular text-[0.75rem] text-[#6B7A85]">
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

      {/* ---- Quick action cards with gradients ---- */}
      <Reveal delay={0.15}>
        <section className="grid grid-cols-2 gap-4">
          <Magnetic as="a" href="/concierge" strength={6}
            className="relative overflow-hidden flex items-center gap-4 p-6 xl:p-8 xl:py-10 rounded-3xl bg-gradient-to-br from-[#1A2935] to-[#4A90A8] text-white cursor-pointer group shadow-[0_4px_24px_rgba(26,41,53,0.2)]">
            <span className="text-[1.5rem]" aria-hidden>&#9742;</span>
            <div>
              <span className="text-[0.6rem] tracking-[0.16em] uppercase opacity-60 block">Concierge</span>
              <span className="font-serif text-[1rem] mt-0.5 block" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                Make a request
              </span>
            </div>
            {/* Subtle shimmer on hover */}
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />
          </Magnetic>
          <Magnetic as="a" href="/community" strength={6}
            className="relative overflow-hidden flex items-center gap-4 p-6 xl:p-8 xl:py-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] shadow-[0_2px_24px_rgba(26,41,53,0.06)] cursor-pointer group hover:shadow-[0_4px_32px_rgba(26,41,53,0.1)] transition-shadow">
            <span className="text-[1.5rem]" aria-hidden>&#9825;</span>
            <div>
              <span className="text-[0.6rem] tracking-[0.16em] uppercase font-medium text-[#4A90A8] block">Community</span>
              <span className="font-serif text-[1rem] text-[#1A2935] mt-0.5 block" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                Meet residents
              </span>
            </div>
          </Magnetic>
        </section>
      </Reveal>
    </div>
  );
}
