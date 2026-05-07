// Curated daily intentions. Used in pitch mode and as fallback when live AI fails.
// 16 entries split across 4 phases of day so the home surface always reads as
// "this was written this morning, by someone who has met you."
//
// All sentences are pre-cleared against the VARA voice filter.

export type DayPhase = "predawn" | "morning" | "midday" | "evening";

export const INTENTION_BANK: Record<DayPhase, string[]> = {
  predawn: [
    "Before the village wakes, the cliff holds the night a moment longer. Step into it.",
    "The first hour belongs to nobody. Spend it slowly.",
    "There is a rhythm here that begins before the light. Find it once this week.",
    "The ocean is closer at this hour. Listen before the day arrives.",
  ],
  morning: [
    "Today is for stillness before motion. Let the breathwork settle what yesterday stirred, then carry that calm forward.",
    "Do less than you planned. The climb you are on rewards patience.",
    "Make space for one long conversation today. The kind that finishes itself.",
    "Walk to breakfast the longer way. Notice three things you have not noticed before.",
  ],
  midday: [
    "Take the heat slowly. The afternoon is for shade, water, and one quiet hour.",
    "Eat what the garden offered this morning. Fewer choices, more attention.",
    "The day has its own pace. Match it.",
    "If the afternoon feels heavy, that is the practice. Sit with it.",
  ],
  evening: [
    "The light softens for a reason. Soften with it.",
    "Tonight, leave the phone in the villa for an hour. The cliff is better company.",
    "Eat early, walk after. Sleep arrives sooner that way.",
    "The day will close itself if you let it. Let it.",
  ],
};

export function dayPhaseForBukit(date: Date = new Date()): DayPhase {
  const hour = bukitHour(date);
  if (hour < 5) return "predawn";
  if (hour < 12) return "morning";
  if (hour < 17) return "midday";
  return "evening";
}

export function pickRotation(residentId: string, date: Date = new Date()): string {
  const phase = dayPhaseForBukit(date);
  const bank = INTENTION_BANK[phase];
  // Deterministic per resident + day so the same person sees the same intention all day.
  const key = `${residentId}|${dateKey(date)}`;
  const idx = hash(key) % bank.length;
  return bank[idx];
}

function bukitHour(d: Date): number {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    hour12: false,
  });
  return Number(f.formatToParts(d).find((p) => p.type === "hour")?.value ?? 12);
}

function dateKey(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}
