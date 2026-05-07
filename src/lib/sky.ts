// Sky photograph helper. Maps a condition + day-phase to a curated photograph.
// Photos live in /public/vara/sky/ and are sourced per public/vara/sky/PROMPTS.md.
// Falls back to clear-evening if a file is missing.

import { dayPhaseForBukit } from "./intention-rotation";

export type SkyCondition =
  | "clear"
  | "hazy"
  | "overcast"
  | "storm"
  | "drizzle"
  | "blue"
  | "monsoon"
  | "mist";

export function skyForCondition(condition: SkyCondition, date: Date = new Date()): string {
  const phase = dayPhaseForBukit(date);
  const tod = phase === "predawn" || phase === "morning" ? "morning" : "evening";
  return `/vara/sky/${condition}-${tod}.webp`;
}

export function inferConditionFromWeather(weather?: { conditions: string } | null): SkyCondition {
  if (!weather) return "clear";
  const c = weather.conditions.toLowerCase();
  if (c.includes("storm") || c.includes("thunder")) return "storm";
  if (c.includes("monsoon")) return "monsoon";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("shower")) return "drizzle";
  if (c.includes("mist") || c.includes("fog")) return "mist";
  if (c.includes("haze")) return "hazy";
  if (c.includes("overcast") || c.includes("cloud")) return "overcast";
  if (c.includes("blue") || c.includes("clear sky")) return "blue";
  return "clear";
}
