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
        >
          <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">Received</span>
          <motion.h3
            className="font-serif text-[1.5rem] text-[#1A2935] mt-2 leading-tight opsz-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: duration.normal, ease: ease.out }}
          >
            {triage.suggestedLead}
          </motion.h3>
          <p className="body-serif mt-4 text-[#6B7A85] border-l-2 border-[#4A90A8] pl-4 leading-relaxed">
            <WordReveal text={triage.replyOpener} delay={0.36} />
          </p>
          <button
            onClick={() => { setTriage(null); setDescription(""); setNeedBy(""); }}
            className="mt-6 font-serif italic text-[0.95rem] text-[#4A90A8] hover:text-[#1A2935] transition-colors"
          >
            Make another request
          </button>
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
          <div>
            <label className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] block mb-3">
              Category
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((c) => (
                <Magnetic
                  key={c.value}
                  as="button"
                  strength={6}
                  onClick={() => setCategory(c.value)}
                  className={`font-serif italic text-[0.9rem] px-4 py-2 rounded-full border transition-all ${
                    category === c.value
                      ? "bg-gradient-to-r from-[#1A2935] to-[#4A90A8] text-white border-transparent shadow-[0_2px_12px_rgba(74,144,168,0.25)]"
                      : "border-[rgba(74,144,168,0.2)] text-[#1A2935] hover:border-[#4A90A8] bg-white/60"
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
              className="w-full bg-transparent py-2 font-serif italic text-[1.0625rem] text-[#1A2935] placeholder:text-[#6B7A85]/50 focus:outline-none resize-none lg:min-h-[140px]"
            />
          </FocusField>

          <FocusField label="Need by" htmlFor="needBy">
            <input
              id="needBy"
              type="datetime-local"
              value={needBy}
              onChange={(e) => setNeedBy(e.target.value)}
              className="bg-transparent py-2 font-sans text-[0.95rem] text-[#1A2935] tabular focus:outline-none"
            />
          </FocusField>

          {error && (
            <p className="text-[0.85rem] text-amber-600 font-serif italic">{error}</p>
          )}

          <Magnetic
            as="button"
            type="submit"
            strength={10}
            disabled={pending}
            className="font-serif italic text-[1rem] rounded-full bg-gradient-to-r from-[#1A2935] to-[#4A90A8] text-white px-8 py-3 shadow-[0_4px_16px_rgba(26,41,53,0.2)] hover:shadow-[0_6px_24px_rgba(26,41,53,0.3)] transition-shadow disabled:opacity-50"
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

// Field with hairline focus animation.
function FocusField({
  label, htmlFor, children,
}: { label: string; htmlFor: string; children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return (
    <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} tabIndex={-1}>
      <label className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8] block mb-2" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="relative">
        {children}
        <span className="absolute left-0 right-0 bottom-0 h-px bg-[rgba(74,144,168,0.12)]" />
        <motion.span
          aria-hidden
          className="absolute left-0 bottom-0 h-px bg-[#4A90A8]"
          initial={{ width: 0 }}
          animate={{ width: focused ? "100%" : 0 }}
          transition={{ duration: duration.normal, ease: ease.out }}
        />
      </div>
    </div>
  );
}
