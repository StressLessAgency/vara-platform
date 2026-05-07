"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SurfaceHeader } from "@/components/SurfaceHeader";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import type { StaffMember, StaffDepartment, StaffShiftStatus } from "@/lib/types";

type Props = { staff: StaffMember[] };

const ALL_DEPTS: ("All" | StaffDepartment)[] = [
  "All",
  "Wellness",
  "Kitchen",
  "Concierge",
  "Community",
  "Operations",
];

const SHIFT_LABEL: Record<StaffShiftStatus, string> = {
  on: "On shift",
  off: "Off today",
  responding: "Responding",
};
const SHIFT_DOT: Record<StaffShiftStatus, string> = {
  on: "bg-[#4FA88A]",
  off: "bg-[var(--color-ink-faint)]",
  responding: "bg-[var(--color-accent)]",
};

export function TeamClient({ staff }: Props) {
  const [filter, setFilter] = useState<"All" | StaffDepartment>("All");
  const [showOnShiftOnly, setShowOnShiftOnly] = useState(false);

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      if (filter !== "All" && s.department !== filter) return false;
      if (showOnShiftOnly && s.shift === "off") return false;
      return true;
    });
  }, [staff, filter, showOnShiftOnly]);

  const onShiftCount = staff.filter((s) => s.shift !== "off").length;

  return (
    <div className="space-y-12 lg:space-y-16">
      <SurfaceHeader
        eyebrow="Meet the team"
        title={
          <>
            The people behind <em className="text-[var(--color-accent)] italic font-normal" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 100' }}>your year</em>.
          </>
        }
        subtitle="Names, shifts, languages. The team you can call by name by month two."
        meta={`${onShiftCount} of ${staff.length} on shift now`}
        heroImage="/vara/photos/vara-community-hero.jpg"
      />

      {/* Filter row */}
      <Reveal>
        <section className="layout-frame-flush">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex flex-wrap gap-1.5">
              {ALL_DEPTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFilter(d)}
                  className={`text-[0.7rem] tracking-[0.06em] px-3.5 py-1.5 rounded-full border transition-all ${
                    filter === d
                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                      : "bg-white/70 text-[var(--color-ink-soft)] border-[var(--color-hairline)] hover:bg-[var(--color-accent-wash)]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <span className="hidden sm:block w-px h-5 bg-[var(--color-hairline)] mx-1" />
            <button
              type="button"
              onClick={() => setShowOnShiftOnly((v) => !v)}
              className={`flex items-center gap-2 text-[0.7rem] tracking-[0.06em] px-3.5 py-1.5 rounded-full border transition-all ${
                showOnShiftOnly
                  ? "bg-[#4FA88A]/10 text-[#2F7A60] border-[#4FA88A]/40"
                  : "bg-white/70 text-[var(--color-ink-soft)] border-[var(--color-hairline)] hover:bg-[var(--color-accent-wash)]"
              }`}
              aria-pressed={showOnShiftOnly}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${showOnShiftOnly ? "bg-[#4FA88A]" : "bg-[var(--color-ink-faint)]"}`} />
              On shift now
            </button>
          </div>
        </section>
      </Reveal>

      {/* Staff grid */}
      <Reveal delay={0.05}>
        <section className="layout-frame-flush">
          {filtered.length === 0 ? (
            <p className="text-[0.85rem] text-[var(--color-ink-faint)] italic font-serif">
              No one matches that filter right now.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {filtered.map((s) => (
                <RevealItem key={s.id}>
                  <motion.article
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-5 sm:p-6 flex flex-col gap-4 h-full"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/35 to-[var(--color-ocean-deep)]/35 flex items-center justify-center flex-shrink-0">
                          <span className="font-serif text-[1.05rem] text-[var(--color-ink)]" style={{ fontVariationSettings: '"opsz" 36, "SOFT" 50' }}>
                            {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                          </span>
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${SHIFT_DOT[s.shift]}`}
                          aria-label={SHIFT_LABEL[s.shift]}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-[1.05rem] text-[var(--color-ink)] leading-snug" style={{ fontVariationSettings: '"opsz" 24, "SOFT" 50' }}>
                          {s.firstName} {s.lastName}
                        </h3>
                        <p className="text-[0.75rem] text-[var(--color-accent)] mt-0.5">{s.role}</p>
                        <p className="text-[0.6rem] tracking-[0.12em] uppercase text-[var(--color-ink-faint)] mt-1">
                          {s.department} · {s.tenureYears}y · {SHIFT_LABEL[s.shift]}
                        </p>
                      </div>
                    </div>

                    <p className="font-serif italic text-[0.85rem] text-[var(--color-ink-soft)] leading-relaxed" style={{ fontVariationSettings: '"opsz" 18, "wght" 300, "SOFT" 80' }}>
                      {s.bioOneLine}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {s.languages.map((l) => (
                        <span
                          key={l}
                          className="text-[0.6rem] px-2 py-0.5 rounded-full bg-[var(--color-accent-wash)] text-[var(--color-accent)] border border-[var(--color-accent-soft)]"
                        >
                          {l}
                        </span>
                      ))}
                    </div>

                    <Link
                      href="/concierge"
                      className="text-[0.75rem] text-[var(--color-accent)] hover:text-[var(--color-ink)] transition-colors font-medium pt-2 border-t border-[var(--color-hairline)]"
                    >
                      Send a quiet message →
                    </Link>
                  </motion.article>
                </RevealItem>
              ))}
            </div>
          )}
        </section>
      </Reveal>
    </div>
  );
}
