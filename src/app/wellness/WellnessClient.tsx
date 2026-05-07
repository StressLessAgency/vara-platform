"use client";

import { SurfaceHeader } from "@/components/SurfaceHeader";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import { CheckinDots } from "./CheckinDots";
import { BiomarkerRow } from "./BiomarkerRow";
import { DrVasinCard } from "./DrVasinCard";
import { BrechkaJourney } from "./BrechkaJourney";
import type { Checkin, Biomarker } from "@/lib/types";

type Props = {
  checkins: Checkin[];
  biomarkers: Biomarker[];
};

export function WellnessClient({ checkins, biomarkers }: Props) {
  const latest = checkins[0];

  return (
    <div>
      <SurfaceHeader
        eyebrow="Wellness"
        title={<>How you are feeling</>}
        subtitle="Self-reported check-ins and lab biomarkers from your onboarding panel."
        heroImage="/vara/photos/vara-wellness-hero.jpg"
      />

      <div className="layout-frame-flush">
        <DrVasinCard
          dated="Monday morning"
          note={vasinNoteFor(latest)}
        />
      </div>

      {/* xl+ 2-column: check-ins left, biomarkers right */}
      <div className="layout-frame-flush lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-12 2xl:gap-16 lg:items-start">
        <div>
          {/* Current check-in -- glass cards */}
          <Reveal>
            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
                  Week of {formatWeek(latest.weekOf)}
                </span>
                <span className="text-[0.7rem] text-[#6B7A85]">Latest check-in</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 2xl:grid-cols-4 gap-4 lg:gap-5">
                <RevealItem>
                  <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5">
                    <CheckinDots label="Sleep" value={latest.sleep} delay={0} />
                  </div>
                </RevealItem>
                <RevealItem>
                  <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5">
                    <CheckinDots label="Energy" value={latest.energy} delay={0.04} />
                  </div>
                </RevealItem>
                <RevealItem>
                  <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5">
                    <CheckinDots label="Stress" value={latest.stress} invert delay={0.08} />
                  </div>
                </RevealItem>
                <RevealItem>
                  <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5">
                    <CheckinDots label="Recovery" value={latest.recovery} delay={0.12} />
                  </div>
                </RevealItem>
              </div>
            </section>
          </Reveal>

          {/* Check-in history -- glass cards */}
          <Reveal delay={0.05}>
            <section className="mb-16 lg:mb-0">
              <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] block mb-6">
                Recent Weeks
              </span>
              <div className="space-y-3">
                {checkins.slice(1).map((c) => (
                  <RevealItem key={c.id}>
                    <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)]">
                      <span className="text-[0.75rem] sm:text-[0.8rem] text-[#6B7A85] w-16 sm:w-20 flex-shrink-0 tabular">
                        {formatWeek(c.weekOf)}
                      </span>
                      <div className="grid grid-cols-2 sm:flex sm:flex-1 sm:justify-between gap-3 sm:gap-5 flex-1 min-w-0">
                        <MiniDots label="Slp" value={c.sleep} />
                        <MiniDots label="Eng" value={c.energy} />
                        <MiniDots label="Str" value={c.stress} invert />
                        <MiniDots label="Rec" value={c.recovery} />
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </div>
            </section>
          </Reveal>
        </div>

        <div>
          <HairlineDraw className="mb-16 lg:hidden" />

          {/* Biomarkers -- glass card container */}
          <Reveal delay={0.1}>
            <section className="mb-16 lg:mb-0">
              <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8">
                <div className="flex items-baseline justify-between mb-8">
                  <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
                    Biomarker Panel
                  </span>
                  <span className="text-[0.7rem] text-[#6B7A85]">
                    Drawn {new Date(biomarkers[0].takenAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1 2xl:grid-cols-2 2xl:gap-x-10">
                  {biomarkers.map((b, i) => (
                    <BiomarkerRow key={b.id} b={b} first={i === 0} last={i === biomarkers.length - 1} />
                  ))}
                </ul>
              </div>
            </section>
          </Reveal>
        </div>
      </div>

      {/* Brechka protocol journey */}
      <Reveal delay={0.15}>
        <section className="layout-frame-flush mt-4">
          <BrechkaJourney />
        </section>
      </Reveal>
    </div>
  );
}

// Note generator. Reads the latest check-in and surfaces a quietly observed
// remark from the wellness lead. In production this comes from the wellness
// team app; for the pitch the heuristic produces a plausible note given any
// seeded check-in.
function vasinNoteFor(c: Checkin): string {
  if (c.recovery >= 4 && c.sleep >= 4) {
    return "Recovery is climbing. Hold the rhythm one more week before we change anything. The cliff breathwork is doing its work.";
  }
  if (c.stress >= 4) {
    return "The week was heavier than the body wanted. Skip the cold plunge this week, sit with the warm sauna instead. We will look at evening glycine again.";
  }
  if (c.energy <= 2) {
    return "Energy ran low. We tried two changes at once. Pull the second one back, give the first another week, and write to me Friday.";
  }
  return "Quiet week, by the look of it. That is the practice. Keep the morning ritual unchanged. We will draw blood again at the end of the month.";
}

function formatWeek(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MiniDots({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const dots = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.55rem] tracking-[0.06em] text-[#6B7A85] uppercase w-7 flex-shrink-0">{label}</span>
      <div className="flex gap-0.5">
        {dots.map((d) => {
          const filled = invert ? d <= 6 - value : d <= value;
          return (
            <span
              key={d}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: filled ? "#4A90A8" : "rgba(74,144,168,0.15)" }}
            />
          );
        })}
      </div>
      <span className="text-[0.65rem] text-[#6B7A85] tabular ml-1 flex-shrink-0">
        {value}
      </span>
    </div>
  );
}
