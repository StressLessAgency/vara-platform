"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Magnetic } from "@/components/motion/Magnetic";
import { duration, ease, stagger } from "@/lib/motion-config";

const CATEGORIES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "transport", label: "Transport" },
  { value: "in_villa", label: "In-villa service" },
  { value: "retreat_customization", label: "Retreat customization" },
  { value: "off_property", label: "Off-property" },
] as const;

type Triage = { categoryConfirmed: string; suggestedLead: string; replyOpener: string };

export function ConciergeForm() {
  const [category, setCategory] = useState<typeof CATEGORIES[number]["value"]>("restaurant");
  const [description, setDescription] = useState("");
  const [needBy, setNeedBy] = useState("");
  const [triage, setTriage] = useState<Triage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

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
          key="triage"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
          transition={{ duration: duration.slow, ease: ease.out }}
          className="mt-8 p-6 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-hairline-strong)]"
        >
          <span className="eyebrow text-[var(--color-gold)]">Received</span>
          <motion.h3
            className="font-serif text-[1.5rem] mt-2 leading-tight opsz-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: duration.normal, ease: ease.out }}
          >
            {triage.suggestedLead}
          </motion.h3>
          <p className="body-serif mt-4 text-[var(--color-ink-soft)] border-l-2 border-[var(--color-gold)] pl-4 leading-relaxed">
            <WordReveal text={triage.replyOpener} delay={0.36} />
          </p>
          <button
            onClick={() => { setTriage(null); setDescription(""); setNeedBy(""); }}
            className="mt-6 font-serif italic text-[0.95rem] text-[var(--color-ocean-deep)] hover:text-[var(--color-gold)] transition-colors"
          >
            Make another request →
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.normal, ease: ease.out }}
          className="mt-8 space-y-8"
          onSubmit={submit}
        >
          <div>
            <label className="eyebrow block mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Magnetic
                  key={c.value}
                  as="button"
                  strength={6}
                  onClick={() => setCategory(c.value)}
                  className={`font-serif italic text-[0.9rem] px-3 py-1.5 border transition-colors ${
                    category === c.value
                      ? "bg-[var(--color-ocean-deep)] text-[var(--color-bg)] border-[var(--color-ocean-deep)]"
                      : "border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:border-[var(--color-ocean-deep)]"
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
              className="w-full bg-transparent py-2 font-serif italic text-[1.0625rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none resize-none"
            />
          </FocusField>

          <FocusField label="Need by" htmlFor="needBy">
            <input
              id="needBy"
              type="datetime-local"
              value={needBy}
              onChange={(e) => setNeedBy(e.target.value)}
              className="bg-transparent py-2 font-sans text-[0.95rem] tabular focus:outline-none"
            />
          </FocusField>

          {error && (
            <p className="text-[0.85rem] text-[var(--color-gold-dim)] font-serif italic">{error}</p>
          )}

          <Magnetic
            as="button"
            type="submit"
            strength={10}
            disabled={pending}
            className="font-serif italic text-[1rem] border border-[var(--color-ocean-deep)] px-6 py-3 hover:bg-[var(--color-ocean-deep)] hover:text-[var(--color-bg)] transition-colors disabled:opacity-50"
          >
            {pending ? "Sending..." : "Send to concierge"}
          </Magnetic>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + i * stagger.word,
            duration: duration.normal,
            ease: ease.out,
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

// Field with hairline focus animation. Underline draws from left on focus.
function FocusField({
  label, htmlFor, children,
}: { label: string; htmlFor: string; children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return (
    <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} tabIndex={-1}>
      <label className="eyebrow block mb-2" htmlFor={htmlFor}>{label}</label>
      <div className="relative">
        {children}
        <span className="absolute left-0 right-0 bottom-0 h-px bg-[var(--color-hairline)]" />
        <motion.span
          aria-hidden
          className="absolute left-0 bottom-0 h-px bg-[var(--color-ocean-deep)]"
          initial={{ width: 0 }}
          animate={{ width: focused ? "100%" : 0 }}
          transition={{ duration: duration.normal, ease: ease.out }}
        />
      </div>
    </div>
  );
}
