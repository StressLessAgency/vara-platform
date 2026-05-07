"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { duration, ease } from "@/lib/motion-config";

// LiveThread takes the triage result and streams it as a thread of three
// hand-off moments: "received", "routing to <lead>", "<name> has it".
// Each beat appears with a small delay so the resident reads service happening,
// not a form returning. For the pitch this faked thread looks identical to a
// real Supabase realtime channel.
type Triage = { categoryConfirmed: string; suggestedLead: string; replyOpener: string };

type Beat = { at: string; voice: "system" | "lara" | "resident"; body: string };

const NAME_FOR_LEAD: Record<string, string> = {
  "Front Desk": "Lara",
  "Wellness Team": "Dr. Vasin",
  "Villa Host": "Made",
  "Transport": "Ketut",
  "Kitchen": "Chef Nadia",
};

export function LiveThread({ triage, onReset }: { triage: Triage; onReset: () => void }) {
  const lead = triage.suggestedLead;
  const handler = NAME_FOR_LEAD[lead] ?? "Front Desk";
  const [beats, setBeats] = useState<Beat[]>([]);

  useEffect(() => {
    const now = new Date();
    const t1 = setTimeout(() => {
      setBeats((b) => [...b, {
        at: stamp(now, 0),
        voice: "system",
        body: `Received. Routing to ${lead}.`,
      }]);
    }, 350);
    const t2 = setTimeout(() => {
      setBeats((b) => [...b, {
        at: stamp(now, 12),
        voice: "system",
        body: `${handler} has the request.`,
      }]);
    }, 1800);
    const t3 = setTimeout(() => {
      setBeats((b) => [...b, {
        at: stamp(now, 28),
        voice: "lara",
        body: triage.replyOpener,
      }]);
    }, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [lead, handler, triage.replyOpener]);

  return (
    <div className="space-y-6">
      {/* Status header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-hairline)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping bg-[#5fb37e]" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5fb37e]" />
          </span>
          <span className="text-[0.7rem] tracking-[0.16em] uppercase font-medium text-[var(--color-ink-soft)]">
            Live with {handler}
          </span>
        </div>
        <button
          onClick={onReset}
          className="font-serif italic text-[0.8rem] text-[var(--color-ink-faint)] hover:text-[var(--color-ink-soft)] transition-colors min-h-[44px]"
          style={{ fontVariationSettings: '"opsz" 14, "SOFT" 100' }}
        >
          New request
        </button>
      </div>

      {/* Beats */}
      <ol className="space-y-5">
        <AnimatePresence initial={false}>
          {beats.map((beat, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: duration.slow, ease: ease.out }}
              className="flex items-start gap-4"
            >
              {beat.voice === "lara" ? (
                <Avatar initial={handler[0]} />
              ) : (
                <span className="w-8 h-8 rounded-full border border-[var(--color-hairline)] flex items-center justify-center flex-shrink-0">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-ink-faint)]" />
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[0.7rem] font-medium text-[var(--color-ink)]">
                    {beat.voice === "lara" ? handler : "VARA"}
                  </span>
                  <span className="text-[0.65rem] text-[var(--color-ink-faint)] tabular oldstyle">
                    {beat.at}
                  </span>
                </div>
                <p
                  className={
                    beat.voice === "lara"
                      ? "font-serif italic text-[1.0rem] text-[var(--color-ink)] leading-relaxed"
                      : "text-[0.85rem] text-[var(--color-ink-soft)] leading-relaxed"
                  }
                  style={beat.voice === "lara" ? { fontVariationSettings: '"opsz" 18, "SOFT" 100' } : undefined}
                >
                  {beat.body}
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>

        {beats.length < 3 && (
          <motion.li
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 pl-12"
          >
            <span className="flex gap-1">
              {[0, 1, 2].map((j) => (
                <motion.span
                  key={j}
                  className="w-1 h-1 rounded-full bg-[var(--color-ink-faint)]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: j * 0.18 }}
                />
              ))}
            </span>
          </motion.li>
        )}
      </ol>
    </div>
  );
}

function Avatar({ initial }: { initial: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-accent)] to-[#7fb3c8] flex items-center justify-center flex-shrink-0">
      <span className="font-serif text-white text-[0.75rem]" style={{ fontVariationSettings: '"opsz" 14, "SOFT" 50' }}>
        {initial}
      </span>
    </div>
  );
}

function stamp(base: Date, secOffset: number): string {
  const d = new Date(base.getTime() + secOffset * 1000);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Makassar",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}
