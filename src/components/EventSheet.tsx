"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { EventItem, EventType } from "@/lib/types";
import { duration, ease } from "@/lib/motion-config";

const EVENT_PHOTOS: Record<EventType, string> = {
  "Health Session": "/vara/photos/vara-event-health.jpg",
  "Master Class": "/vara/photos/vara-event-masterclass.jpg",
  "Signature Retreat": "/vara/photos/vara-event-retreat.jpg",
  "Community Event": "/vara/photos/vara-event-community.jpg",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Makassar",
  });
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Makassar",
  });
}

export function EventSheet({
  event,
  onClose,
}: {
  event: EventItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sheet-backdrop"
            className="fixed inset-0 z-50 bg-[#1A2935]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet-content"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] md:inset-x-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-[calc(100%-2rem)] md:rounded-3xl overflow-hidden"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-t-3xl md:rounded-3xl border border-[rgba(74,144,168,0.12)] shadow-[0_-8px_40px_rgba(26,41,53,0.15)] overflow-y-auto max-h-[85vh]">
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <span className="w-10 h-1 rounded-full bg-[rgba(74,144,168,0.2)]" />
              </div>

              {/* Hero photo */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src={EVENT_PHOTOS[event.type]}
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl flex items-center justify-center text-[#1A2935] hover:bg-white transition-colors shadow-sm"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 pb-8 -mt-8 relative">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: duration.normal, ease: ease.out }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#1A2935] to-[#4A90A8] text-white text-[0.6rem] tracking-[0.12em] uppercase font-medium">
                      {event.type}
                    </span>
                    {event.priceUsd && (
                      <span className="text-[0.8rem] text-[#4A90A8] font-medium">
                        ${event.priceUsd}
                      </span>
                    )}
                  </div>

                  <h2
                    className="font-serif text-[1.5rem] sm:text-[1.75rem] text-[#1A2935] leading-tight"
                    style={{ fontVariationSettings: '"opsz" 36, "SOFT" 50' }}
                  >
                    {event.title}
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: duration.normal, ease: ease.out }}
                  className="mt-5 space-y-4"
                >
                  {/* Host portrait row — named, not anonymized */}
                  <div className="flex items-center gap-3 pb-4 border-b border-[rgba(74,144,168,0.12)]">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A2935] via-[#4A90A8] to-[#7fb3c8] flex items-center justify-center text-white font-serif text-[0.8rem] flex-shrink-0" style={{ fontVariationSettings: '"opsz" 14, "SOFT" 50' }}>
                      {event.host.replace(/^(Dr|Chef|Coach|Ana|Mr|Mrs)\.?\s+/i, "").split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[0.55rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
                        Led by
                      </span>
                      <span className="block font-serif text-[0.95rem] text-[#1A2935] truncate" style={{ fontVariationSettings: '"opsz" 18, "SOFT" 50' }}>
                        {event.host}
                      </span>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="grid grid-cols-2 gap-4">
                    <MetaBlock label="When" value={`${formatFullDate(event.startsAt)}, ${formatTime(event.startsAt)}`} />
                    <MetaBlock label="Duration" value={`${event.durationMinutes} minutes`} />
                    <MetaBlock label="Where" value={event.location} />
                    <MetaBlock label="Capacity" value={`${event.rsvpCount} of ${event.capacity} reserved`} />
                  </div>

                  {/* Description */}
                  <p className="body-serif text-[1rem] text-[#6B7A85] leading-relaxed mt-4">
                    {event.description}
                  </p>

                  {/* Capacity bar */}
                  <div className="mt-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[0.6rem] tracking-[0.16em] uppercase font-medium text-[#4A90A8]">
                        Availability
                      </span>
                      <span className="text-[0.75rem] tabular text-[#6B7A85]">
                        {event.rsvpCount} of {event.capacity} reserved
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(74,144,168,0.1)] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#4A90A8] to-[#1A2935]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(event.rsvpCount / event.capacity) * 100}%` }}
                        transition={{ duration: 0.8, ease: ease.out, delay: 0.4 }}
                      />
                    </div>
                  </div>

                  {/* RSVP button */}
                  <motion.button
                    className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-[#1A2935] to-[#4A90A8] text-white font-serif italic text-[1rem] shadow-[0_4px_20px_rgba(26,41,53,0.25)] active:scale-[0.97] transition-transform"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: duration.normal, ease: ease.out }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Reserve your place
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[0.55rem] tracking-[0.16em] uppercase font-medium text-[#4A90A8] block mb-0.5">
        {label}
      </span>
      <span className="text-[0.85rem] text-[#1A2935]">{value}</span>
    </div>
  );
}
