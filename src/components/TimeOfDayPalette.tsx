"use client";

import { useEffect } from "react";

// TimeOfDayPalette breathes the property's light into the app.
// Mounts at HomeClient and shifts a small set of root variables on a 4-stop curve.
// Components that opt-in by reading var(--tod-*) get a free time-of-day pass.
// Predawn (00:00–05:00)  -- indigo / cool grey
// Morning (05:00–11:00)  -- warm amber / dawn rose
// Midday  (11:00–16:00)  -- neutral cream / silver ocean
// Evening (16:00–24:00)  -- ocean blue / dusk gold

type Stop = { from: number; vars: Record<string, string> };

const STOPS: Stop[] = [
  { from: 0, vars: {
    "--tod-tint":         "rgba(40, 50, 80, 0.06)",
    "--tod-accent":       "#5d6e8a",
    "--tod-accent-soft":  "rgba(93, 110, 138, 0.10)",
    "--tod-bg-warm":      "rgba(245, 245, 250, 1)",
    "--tod-haze":         "rgba(40, 50, 80, 0.04)",
  }},
  { from: 5, vars: {
    "--tod-tint":         "rgba(220, 165, 120, 0.07)",
    "--tod-accent":       "#b87a4a",
    "--tod-accent-soft":  "rgba(184, 122, 74, 0.10)",
    "--tod-bg-warm":      "rgba(252, 246, 238, 1)",
    "--tod-haze":         "rgba(255, 200, 150, 0.06)",
  }},
  { from: 11, vars: {
    "--tod-tint":         "rgba(74, 144, 168, 0.04)",
    "--tod-accent":       "#4a90a8",
    "--tod-accent-soft":  "rgba(74, 144, 168, 0.10)",
    "--tod-bg-warm":      "rgba(250, 250, 248, 1)",
    "--tod-haze":         "rgba(74, 144, 168, 0.03)",
  }},
  { from: 16, vars: {
    "--tod-tint":         "rgba(35, 60, 95, 0.07)",
    "--tod-accent":       "#3a6a8e",
    "--tod-accent-soft":  "rgba(58, 106, 142, 0.10)",
    "--tod-bg-warm":      "rgba(248, 246, 244, 1)",
    "--tod-haze":         "rgba(35, 60, 95, 0.05)",
  }},
];

export function TimeOfDayPalette() {
  useEffect(() => {
    let stopped = false;
    const apply = () => {
      const h = bukitHour();
      const stop = STOPS.slice().reverse().find((s) => h >= s.from) ?? STOPS[0];
      const root = document.documentElement;
      for (const [k, v] of Object.entries(stop.vars)) root.style.setProperty(k, v);
      root.dataset.todPhase = labelForHour(h);
    };
    apply();
    const id = setInterval(() => { if (!stopped) apply(); }, 60_000);
    return () => { stopped = true; clearInterval(id); };
  }, []);
  return null;
}

function bukitHour(): number {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Makassar", hour: "2-digit", hour12: false });
  return Number(f.formatToParts(new Date()).find((p) => p.type === "hour")?.value ?? 12);
}

function labelForHour(h: number): "predawn" | "morning" | "midday" | "evening" {
  if (h < 5) return "predawn";
  if (h < 11) return "morning";
  if (h < 16) return "midday";
  return "evening";
}
