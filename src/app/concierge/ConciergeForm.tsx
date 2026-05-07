"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Magnetic } from "@/components/motion/Magnetic";
import { duration, ease } from "@/lib/motion-config";
import { SmartSuggestions, type Suggestion } from "./SmartSuggestions";
import { LiveThread } from "./LiveThread";
import { VoiceNoteButton } from "./VoiceNoteButton";

const CATEGORIES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "transport", label: "Transport" },
  { value: "in_villa", label: "In-villa service" },
  { value: "retreat_customization", label: "Retreat customization" },
  { value: "off_property", label: "Off-property" },
] as const;

type Category = typeof CATEGORIES[number]["value"];
type Triage = { categoryConfirmed: string; suggestedLead: string; replyOpener: string };

export function ConciergeForm() {
  const [category, setCategory] = useState<Category>("restaurant");
  const [description, setDescription] = useState("");
  const [needBy, setNeedBy] = useState("");
  const [triage, setTriage] = useState<Triage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function applySuggestion(s: Suggestion) {
    setCategory(s.category as Category);
    setDescription(s.description);
    if (s.needBy) setNeedBy(s.needBy);
    setError(null);
  }

  function reset() {
    setTriage(null);
    setDescription("");
    setNeedBy("");
    setError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (description.trim().length < 6) {
      setError("Add a few words on what you need.");
      return;
    }
    start(async () => {
      try {
        const res = await fetch("/api/concierge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ category, description, needBy: needBy || new Date().toISOString() }),
        });
        if (!res.ok) throw new Error("server");
        const data = (await res.json()) as Triage;
        setTriage(data);
      } catch {
        setError("Could not reach the concierge. Try again.");
      }
    });
  }

  return (
    <AnimatePresence mode="wait">
      {triage ? (
        <motion.div
          key="thread"
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: duration.slow, ease: ease.out }}
        >
          <LiveThread triage={triage} onReset={reset} />
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.normal, ease: ease.out }}
          className="space-y-8 sm:space-y-10"
          onSubmit={submit}
        >
          <SmartSuggestions onSelect={applySuggestion} />

          <div>
            <label className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--tod-accent,var(--color-accent))] block mb-3">
              Category
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((c) => (
                <Magnetic
                  key={c.value}
                  as="button"
                  strength={6}
                  onClick={() => setCategory(c.value)}
                  className={`font-serif italic text-[0.9rem] px-4 py-2.5 min-h-[44px] rounded-full border transition-all active:scale-[0.95] ${
                    category === c.value
                      ? "bg-gradient-to-r from-[var(--color-ocean-deep)] to-[var(--color-accent)] text-white border-transparent shadow-[0_2px_12px_rgba(74,144,168,0.25)]"
                      : "border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:border-[var(--color-accent)] bg-white/60"
                  }`}
                >
                  {c.label}
                </Magnetic>
              ))}
            </div>
          </div>

          <FocusField label="What do you need" htmlFor="description">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Sunset table for two, Saturday, window if possible."
              className="w-full bg-transparent py-2 font-serif italic text-[1rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none resize-none lg:min-h-[140px]"
            />
          </FocusField>

          <FocusField label="Need by" htmlFor="needBy">
            <input
              id="needBy"
              type="datetime-local"
              value={needBy}
              onChange={(e) => setNeedBy(e.target.value)}
              className="bg-transparent py-2 font-sans text-[1rem] text-[var(--color-ink)] tabular focus:outline-none min-h-[44px] appearance-none"
            />
          </FocusField>

          {error && (
            <p className="text-[0.85rem] text-amber-600 font-serif italic">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <Magnetic
              as="button"
              type="submit"
              strength={10}
              disabled={pending}
              className="font-serif italic text-[1rem] rounded-full bg-gradient-to-r from-[var(--color-ocean-deep)] to-[var(--color-accent)] text-white w-full sm:w-auto px-8 py-3.5 min-h-[48px] shadow-[0_4px_16px_rgba(26,41,53,0.2)] hover:shadow-[0_6px_24px_rgba(26,41,53,0.3)] transition-all disabled:opacity-50 active:scale-[0.97]"
            >
              {pending ? "Sending…" : "Send to concierge"}
            </Magnetic>
            <span className="text-[0.7rem] text-[var(--color-ink-faint)]">or</span>
            <VoiceNoteButton onComplete={(seconds) => setDescription((d) => d || `Voice note, ${seconds} seconds.`)} />
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function FocusField({
  label, htmlFor, children,
}: { label: string; htmlFor: string; children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return (
    <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} tabIndex={-1}>
      <label className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--tod-accent,var(--color-accent))] block mb-2" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="relative">
        {children}
        <span className="absolute left-0 right-0 bottom-0 h-px bg-[var(--color-hairline)]" />
        <motion.span
          aria-hidden
          className="absolute left-0 bottom-0 h-px bg-[var(--color-accent)]"
          initial={{ width: 0 }}
          animate={{ width: focused ? "100%" : 0 }}
          transition={{ duration: duration.normal, ease: ease.out }}
        />
      </div>
    </div>
  );
}
