"use client";

import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import type { ConciergeRequest } from "@/lib/types";

export function ConciergeHistory({ requests }: { requests: ConciergeRequest[] }) {
  if (requests.length === 0) return null;

  return (
    <Reveal delay={0.1}>
      <section className="mt-16">
        <div className="flex items-center gap-4 mb-6">
          <span className="eyebrow flex-shrink-0">Previous Requests</span>
          <HairlineDraw className="flex-1" />
        </div>

        <div className="space-y-3">
          {requests.map((req) => (
            <RevealItem key={req.id}>
              <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-hairline)]">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[0.6rem] text-[var(--color-gold)] tracking-[0.12em] uppercase font-medium">
                    {req.category.replace(/_/g, " ")}
                  </span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="font-serif text-[0.95rem] text-[var(--color-ink)] leading-relaxed"
                  style={{ fontVariationSettings: '"opsz" 16, "SOFT" 50' }}>
                  {req.description}
                </p>
                {req.triage && (
                  <p className="text-[0.8rem] text-[var(--color-ink-soft)] mt-2 italic">
                    {req.triage.replyOpener}
                  </p>
                )}
                <div className="mt-3 space-y-1">
                  {req.history.map((h, i) => (
                    <p key={i} className="text-[0.7rem] text-[var(--color-ink-faint)]">
                      {new Date(h.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} &mdash; {h.note}
                    </p>
                  ))}
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "text-[var(--color-gold)] bg-[var(--color-gold)]/10",
    in_progress: "text-[var(--color-ocean-deep)] bg-[var(--color-ocean-deep)]/10",
    resolved: "text-[var(--color-ink-soft)] bg-[var(--color-stone)]",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[0.55rem] font-medium tracking-wide uppercase ${styles[status] ?? styles.pending}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
