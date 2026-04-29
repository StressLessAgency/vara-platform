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
          <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] flex-shrink-0">
            Previous Requests
          </span>
          <HairlineDraw className="flex-1" />
        </div>

        <div className="space-y-3">
          {requests.map((req) => (
            <RevealItem key={req.id}>
              <div className="p-5 sm:p-6 bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)]">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[0.6rem] text-[#4A90A8] tracking-[0.12em] uppercase font-medium">
                    {req.category.replace(/_/g, " ")}
                  </span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="font-serif text-[0.95rem] text-[#1A2935] leading-relaxed"
                  style={{ fontVariationSettings: '"opsz" 16, "SOFT" 50' }}>
                  {req.description}
                </p>
                {req.triage && (
                  <p className="text-[0.8rem] text-[#6B7A85] mt-2 italic">
                    {req.triage.replyOpener}
                  </p>
                )}
                <div className="mt-3 space-y-1">
                  {req.history.map((h, i) => (
                    <p key={i} className="text-[0.7rem] text-[#6B7A85]/60">
                      {new Date(h.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} -- {h.note}
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
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    in_progress: "text-[#4A90A8] bg-[rgba(74,144,168,0.08)] border-[rgba(74,144,168,0.2)]",
    resolved: "text-[#6B7A85] bg-[#FAFAF8] border-[rgba(74,144,168,0.12)]",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[0.55rem] font-medium tracking-wide uppercase border ${styles[status] ?? styles.pending}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
