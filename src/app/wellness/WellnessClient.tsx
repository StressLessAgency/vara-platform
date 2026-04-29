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
      />

      {/* Current check-in */}
      <Reveal>
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <span className="eyebrow">Week of {formatWeek(latest.weekOf)}</span>
            <span className="text-[0.7rem] text-[var(--color-ink-faint)]">Latest check-in</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <RevealItem>
              <CheckinDots label="Sleep" value={latest.sleep} delay={0} />
            </RevealItem>
            <RevealItem>
              <CheckinDots label="Energy" value={latest.energy} delay={0.04} />
            </RevealItem>
            <RevealItem>
              <CheckinDots label="Stress" value={latest.stress} invert delay={0.08} />
            </RevealItem>
            <RevealItem>
              <CheckinDots label="Recovery" value={latest.recovery} delay={0.12} />
            </RevealItem>
          </div>
        </section>
      </Reveal>

      {/* Check-in history */}
      <Reveal delay={0.05}>
        <section className="mb-16">
          <span className="eyebrow block mb-6">Recent Weeks</span>
          <div className="space-y-3">
            {checkins.slice(1).map((c) => (
              <RevealItem key={c.id}>
                <div className="flex items-center gap-6 p-4 bg-[var(--color-surface)] border border-[var(--color-hairline)]">
                  <span className="text-[0.8rem] text-[var(--color-ink-soft)] w-24 flex-shrink-0 tabular">
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

      {/* Biomarkers -- use the editorial BiomarkerRow */}
      <Reveal delay={0.1}>
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-8">
            <span className="eyebrow">Biomarker Panel</span>
            <span className="text-[0.7rem] text-[var(--color-ink-faint)]">
              Drawn {new Date(biomarkers[0].takenAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>

          <ul>
            {biomarkers.map((b, i) => (
              <BiomarkerRow key={b.id} b={b} first={i === 0} last={i === biomarkers.length - 1} />
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Protocol tags */}
      <Reveal delay={0.15}>
        <section>
          <span className="eyebrow block mb-4">Active Protocols</span>
          <div className="flex flex-wrap gap-2">
            {protocolTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[0.7rem] font-medium tracking-wide text-[var(--color-ocean-deep)] bg-[var(--color-stone)] border border-[var(--color-hairline)]"
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
      <span className="text-[0.55rem] text-[var(--color-ink-faint)] uppercase w-6">{label}</span>
      <div className="flex gap-0.5">
        {dots.map((d) => {
          const filled = invert ? d <= 6 - value : d <= value;
          return (
            <span
              key={d}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: filled ? "var(--color-ocean-deep)" : "var(--color-hairline)" }}
            />
          );
        })}
      </div>
    </div>
  );
}
