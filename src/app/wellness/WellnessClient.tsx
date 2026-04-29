"use client";

import { SurfaceHeader } from "@/components/SurfaceHeader";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import { CheckinDots } from "./CheckinDots";
import { BiomarkerRow } from "./BiomarkerRow";
import type { Checkin, Biomarker } from "@/lib/types";

type Props = {
  checkins: Checkin[];
  biomarkers: Biomarker[];
  protocolTags: string[];
};

export function WellnessClient({ checkins, biomarkers, protocolTags }: Props) {
  const latest = checkins[0];

  return (
    <div>
      <SurfaceHeader
        eyebrow="Wellness"
        title={<>How you are feeling</>}
        subtitle="Self-reported check-ins and lab biomarkers from your onboarding panel."
        heroImage="/vara/photos/p10-img01-1740x899.jpeg"
      />

      {/* Current check-in -- glass cards */}
      <Reveal>
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
              Week of {formatWeek(latest.weekOf)}
            </span>
            <span className="text-[0.7rem] text-[#6B7A85]">Latest check-in</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
        <section className="mb-16">
          <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] block mb-6">
            Recent Weeks
          </span>
          <div className="space-y-3">
            {checkins.slice(1).map((c) => (
              <RevealItem key={c.id}>
                <div className="flex items-center gap-6 p-5 bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)]">
                  <span className="text-[0.8rem] text-[#6B7A85] w-24 flex-shrink-0 tabular">
                    {formatWeek(c.weekOf)}
                  </span>
                  <div className="flex gap-6 flex-1">
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

      <HairlineDraw className="mb-16" />

      {/* Biomarkers -- glass card container */}
      <Reveal delay={0.1}>
        <section className="mb-16">
          <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8">
            <div className="flex items-baseline justify-between mb-8">
              <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
                Biomarker Panel
              </span>
              <span className="text-[0.7rem] text-[#6B7A85]">
                Drawn {new Date(biomarkers[0].takenAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>

            <ul>
              {biomarkers.map((b, i) => (
                <BiomarkerRow key={b.id} b={b} first={i === 0} last={i === biomarkers.length - 1} />
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      {/* Protocol tags as pill badges */}
      <Reveal delay={0.15}>
        <section>
          <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] block mb-5">
            Active Protocols
          </span>
          <div className="flex flex-wrap gap-2.5">
            {protocolTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full text-[0.7rem] font-medium tracking-wide text-[#4A90A8] bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.2)] shadow-[0_1px_8px_rgba(26,41,53,0.04)] uppercase"
              >
                {tag.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}

function formatWeek(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MiniDots({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const dots = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[0.55rem] text-[#6B7A85] uppercase w-6">{label}</span>
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
    </div>
  );
}
