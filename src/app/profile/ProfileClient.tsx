"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { MorphHeading } from "@/components/motion/MorphHeading";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { NumberFlow } from "@/components/motion/NumberFlow";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import type { Resident, Checkin, EventItem, StaffMember } from "@/lib/types";

type Props = {
  resident: Resident;
  checkins: Checkin[];
  events: EventItem[];
  myTeam: StaffMember[];
};

const SHIFT_LABEL: Record<StaffMember["shift"], string> = {
  on: "On shift",
  off: "Off today",
  responding: "Responding",
};
const SHIFT_DOT: Record<StaffMember["shift"], string> = {
  on: "bg-[#4FA88A]",
  off: "bg-[var(--color-ink-faint)]",
  responding: "bg-[var(--color-accent)]",
};

function Sparkline({ values, accent = "#4A90A8" }: { values: number[]; accent?: string }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const w = 88;
  const h = 28;
  const step = w / (values.length - 1 || 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return `${x},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none" aria-hidden>
      <path
        d={`M ${points.join(" L ")}`}
        fill="none"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileClient({ resident, checkins, events, myTeam }: Props) {
  const recent = [...checkins].reverse(); // oldest → newest for sparkline
  const tenureMonths = Math.max(
    1,
    Math.round(
      (Date.now() - new Date(resident.joinedAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
  );

  // Year on one line — past + scheduled events
  const allEvents = [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  // Mock circle (residents Olivia has met)
  const circle = [
    { initial: "K", name: "Kenji", meta: "Villa Surya 09" },
    { initial: "M", name: "Mira", meta: "Pavilion 04" },
    { initial: "T", name: "Theo", meta: "Villa Surya 14" },
    { initial: "P", name: "Priya", meta: "Pavilion 02" },
  ];

  // Recent thread — last few mentor messages
  const thread = [
    { from: "Dr. Vasin", text: "Bloodwork is back. Ferritin trended up. Talk Monday.", at: "2h ago" },
    { from: "Maya · Concierge", text: "Locavore Sat 8pm — chef counter. Confirmed?", at: "Yesterday" },
    { from: "Wayan", text: "Dawn breath circle Friday. Two of your floor are in.", at: "2 days ago" },
  ];

  return (
    <div className="space-y-14 lg:space-y-20">
      {/* ---- Hero with portrait + intention ---- */}
      <section className="bleed -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="relative h-[44vh] md:h-[46vh] lg:h-[52vh] xl:h-[58vh] min-h-[340px]">
          <ParallaxImage
            src="/vara/photos/p05-img02-1740x899.jpeg"
            alt=""
            className="absolute inset-0 h-full w-full"
            priority
            speed={0.12}
            objectPosition="center 35%"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F2C] via-[#1A2935]/65 to-[#1A2935]/15" />
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#0F1F2C]/95 via-[#1A2935]/55 to-transparent pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 layout-frame pb-16 sm:pb-20">
            <div className="flex items-end gap-5">
              {/* Portrait avatar */}
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-ocean-deep)] flex items-center justify-center flex-shrink-0 ring-2 ring-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <span className="font-serif text-[2rem] sm:text-[2.4rem] text-white" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 80' }}>
                  {resident.name.charAt(0)}
                </span>
              </motion.div>

              <div className="min-w-0">
                <motion.span
                  className="block text-[0.6rem] sm:text-[0.65rem] tracking-[0.22em] uppercase font-medium text-white/55"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                >
                  Resident · Year 1 · {resident.villaCollection}
                </motion.span>
                <MorphHeading
                  text={resident.name}
                  italicTokens={[resident.name]}
                  italicColor="#FFE4B8"
                  className="display-1 text-white mt-2 [text-shadow:0_2px_28px_rgba(0,0,0,0.7),0_1px_4px_rgba(0,0,0,0.5)]"
                  startDelay={0.25}
                />
                <motion.p
                  className="text-[0.75rem] sm:text-[0.8rem] text-white/65 mt-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                >
                  {resident.villa} · {tenureMonths} months in residence
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating intention card */}
        <div className="relative layout-frame -mt-12 sm:-mt-14">
          <motion.div
            className="bg-white/85 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.5 }}
          >
            <span className="text-[0.6rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
              Your intention this season
            </span>
            <p
              className="font-serif italic text-[1.15rem] sm:text-[1.35rem] mt-3 text-[var(--color-ink)] leading-snug max-w-[36ch]"
              style={{ fontVariationSettings: '"opsz" 36, "wght" 300, "SOFT" 80' }}
            >
              {resident.bio}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {resident.interests.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.65rem] tracking-[0.06em] px-3 py-1.5 rounded-full bg-[var(--color-accent-wash)] text-[var(--color-accent)] border border-[var(--color-accent-soft)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Vitals strip ---- */}
      <Reveal>
        <section className="layout-frame-flush">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">Quiet signals</span>
            <Link href="/wellness" className="text-[0.75rem] text-[#4A90A8] hover:text-[var(--color-ink)] transition-colors font-medium">
              Full report
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {([
              { label: "Sleep", values: recent.map((c) => c.sleep), latest: checkins[0].sleep },
              { label: "Energy", values: recent.map((c) => c.energy), latest: checkins[0].energy },
              { label: "Recovery", values: recent.map((c) => c.recovery), latest: checkins[0].recovery },
              { label: "Stress", values: recent.map((c) => c.stress), latest: checkins[0].stress, invert: true },
            ] as const).map((m) => (
              <RevealItem key={m.label}>
                <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5">
                  <span className="text-[0.6rem] tracking-[0.16em] uppercase font-medium text-[#6B7A85]">{m.label}</span>
                  <p className="display-3 mt-2 text-[#4A90A8]">
                    <NumberFlow to={m.latest} />
                    <span className="text-[#6B7A85] text-[0.5em] ml-0.5">/5</span>
                  </p>
                  <div className="mt-3 -mb-1">
                    <Sparkline values={m.values} accent={"invert" in m && m.invert ? "#C77B5C" : "#4A90A8"} />
                  </div>
                </div>
              </RevealItem>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---- The year on one line ---- */}
      <Reveal delay={0.05}>
        <section className="layout-frame-flush">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">The year on one line</span>
            <Link href="/calendar" className="text-[0.75rem] text-[#4A90A8] hover:text-[var(--color-ink)] transition-colors font-medium">
              Full calendar
            </Link>
          </div>
          <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5 sm:p-7">
            <div className="relative pt-2 pb-6">
              <div className="absolute left-0 right-0 top-[1.4rem] h-px bg-[var(--color-hairline)]" />
              <div className="relative grid grid-cols-3 sm:grid-cols-6 gap-2">
                {allEvents.slice(0, 6).map((e) => (
                  <div key={e.id} className="flex flex-col items-center text-center">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mb-3 ring-4 ring-white" />
                    <span className="text-[0.55rem] tracking-[0.14em] uppercase text-[#6B7A85]">
                      {new Date(e.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Makassar" })}
                    </span>
                    <span className="text-[0.7rem] font-medium text-[var(--color-ink)] leading-tight mt-1 line-clamp-2 max-w-[12ch]">
                      {e.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ---- My team + My circle ---- */}
      <section className="layout-frame-flush grid lg:grid-cols-2 gap-6 lg:gap-8">
        <Reveal delay={0.1}>
          <div>
            <div className="flex items-baseline justify-between mb-5">
              <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">My team</span>
              <Link href="/team" className="text-[0.75rem] text-[#4A90A8] hover:text-[var(--color-ink)] transition-colors font-medium">
                Meet the staff →
              </Link>
            </div>
            <div className="space-y-2.5">
              {myTeam.map((p) => (
                <RevealItem key={p.id}>
                  <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-2xl shadow-[0_2px_16px_rgba(26,41,53,0.04)]">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-ocean-deep)]/30 flex items-center justify-center flex-shrink-0">
                      <span className="font-serif text-[0.85rem] text-[var(--color-ink)]">{p.firstName.charAt(0)}{p.lastName.charAt(0)}</span>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${SHIFT_DOT[p.shift]}`} aria-label={SHIFT_LABEL[p.shift]} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[0.85rem] font-medium text-[var(--color-ink)] truncate">{p.firstName} · {p.role}</span>
                      <span className="block text-[0.65rem] text-[var(--color-ink-faint)] truncate">{SHIFT_LABEL[p.shift]} · {p.tenureYears}y</span>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div>
            <div className="flex items-baseline justify-between mb-5">
              <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">My circle</span>
              <Link href="/community" className="text-[0.75rem] text-[#4A90A8] hover:text-[var(--color-ink)] transition-colors font-medium">
                Community →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {circle.map((c) => (
                <RevealItem key={c.name}>
                  <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent-wash)] to-[var(--color-accent-soft)] flex items-center justify-center flex-shrink-0">
                      <span className="font-serif text-[0.8rem] text-[var(--color-ink)]">{c.initial}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[0.85rem] font-medium text-[var(--color-ink)] truncate">{c.name}</span>
                      <span className="block text-[0.6rem] text-[var(--color-ink-faint)] truncate">{c.meta}</span>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- Thread ---- */}
      <Reveal delay={0.18}>
        <section className="layout-frame-flush">
          <div className="flex items-baseline justify-between mb-5">
            <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">The thread</span>
            <Link href="/concierge" className="text-[0.75rem] text-[#4A90A8] hover:text-[var(--color-ink)] transition-colors font-medium">
              Open in concierge →
            </Link>
          </div>
          <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] divide-y divide-[var(--color-hairline)]">
            {thread.map((m, i) => (
              <div key={i} className="p-5 sm:p-6 flex items-baseline gap-4">
                <span className="text-[0.7rem] font-medium text-[var(--color-accent)] flex-shrink-0 w-32 truncate">{m.from}</span>
                <span className="font-serif text-[0.95rem] text-[var(--color-ink)] flex-1 leading-relaxed" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                  {m.text}
                </span>
                <span className="text-[0.6rem] text-[var(--color-ink-faint)] tabular flex-shrink-0">{m.at}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---- Preferences ---- */}
      <Reveal delay={0.22}>
        <section className="layout-frame-flush">
          <div className="flex items-baseline justify-between mb-5">
            <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">Quietly learned</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { k: "Mornings", v: "Stillness before motion. Coffee black, after the first stretch." },
              { k: "Diet", v: "Low-glycemic. No fish on Mondays. Always one fermented dish." },
              { k: "Service", v: "Door knock once. English first, Bahasa welcome." },
              { k: "Quiet hours", v: "After 9pm. Phone off the night table." },
            ].map((p) => (
              <RevealItem key={p.k}>
                <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-2xl p-5">
                  <span className="text-[0.6rem] tracking-[0.18em] uppercase font-medium text-[var(--color-accent)]">{p.k}</span>
                  <p className="font-serif italic text-[0.9rem] mt-2 text-[var(--color-ink)] leading-relaxed" style={{ fontVariationSettings: '"opsz" 18, "wght" 300, "SOFT" 80' }}>
                    {p.v}
                  </p>
                </div>
              </RevealItem>
            ))}
          </div>
          <HairlineDraw className="mt-10" />
        </section>
      </Reveal>
    </div>
  );
}
