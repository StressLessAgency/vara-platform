"use client";

import { useEffect, useState } from "react";

// Background gradient that drifts with Bukit local time.
// Sunrise warm → noon cool → sunset gold-coral → night ink.
// Uses CSS @property in globals.css so the gradient interpolates smoothly.
//
// Updates every 60s, transitions over 60s, so motion is subliminal.
export function AmbientBackdrop() {
  const [hour, setHour] = useState<number>(() => bukitHour());
  useEffect(() => {
    const tick = () => setHour(bukitHour());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const palette = paletteForHour(hour);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: `
          radial-gradient(80% 60% at 50% 0%, ${palette.top} 0%, transparent 70%),
          radial-gradient(120% 90% at 80% 100%, ${palette.warm} 0%, transparent 65%),
          linear-gradient(180deg, ${palette.body} 0%, var(--color-bg) 60%)
        `,
        transition: "background 60s linear",
      }}
    >
      {/* Subtle film grain. CSS-only, GPU-cheap. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,42,61,1) 1px, transparent 1.5px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}

function bukitHour(): number {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = f.formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 12);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
}

type Palette = { top: string; warm: string; body: string };

function paletteForHour(h: number): Palette {
  // 5  predawn cool
  // 6  sunrise warm
  // 9  morning soft
  // 12 noon cool stone
  // 16 late afternoon gold
  // 18 sunset coral-gold
  // 20 dusk inked
  // 23 night
  const stops: Array<[number, Palette]> = [
    [3,  { top: "rgba(15,42,61,0.18)", warm: "rgba(20,30,45,0.10)", body: "rgba(15,42,61,0.06)" }],
    [5,  { top: "rgba(184,149,106,0.10)", warm: "rgba(184,149,106,0.18)", body: "rgba(239,232,220,0.16)" }],
    [7,  { top: "rgba(184,149,106,0.18)", warm: "rgba(184,149,106,0.22)", body: "rgba(239,232,220,0.30)" }],
    [10, { top: "rgba(184,149,106,0.10)", warm: "rgba(239,232,220,0.30)", body: "rgba(250,247,242,0.55)" }],
    [13, { top: "rgba(15,42,61,0.06)", warm: "rgba(239,232,220,0.20)", body: "rgba(250,247,242,0.65)" }],
    [16, { top: "rgba(184,149,106,0.14)", warm: "rgba(184,149,106,0.20)", body: "rgba(239,232,220,0.40)" }],
    [18, { top: "rgba(184,149,106,0.28)", warm: "rgba(212,138,98,0.28)", body: "rgba(239,232,220,0.42)" }],
    [20, { top: "rgba(15,42,61,0.18)", warm: "rgba(184,149,106,0.08)", body: "rgba(15,42,61,0.10)" }],
    [23, { top: "rgba(15,42,61,0.20)", warm: "rgba(20,30,45,0.10)", body: "rgba(15,42,61,0.10)" }],
  ];

  // find the segment and lerp
  for (let i = 0; i < stops.length - 1; i++) {
    const [h0, p0] = stops[i];
    const [h1, p1] = stops[i + 1];
    if (h >= h0 && h <= h1) {
      const t = (h - h0) / (h1 - h0);
      return {
        top: lerpColor(p0.top, p1.top, t),
        warm: lerpColor(p0.warm, p1.warm, t),
        body: lerpColor(p0.body, p1.body, t),
      };
    }
  }
  return stops[stops.length - 1][1];
}

// Cheap rgba string lerp.
function lerpColor(a: string, b: string, t: number): string {
  const pa = a.match(/[\d.]+/g)!.map(Number);
  const pb = b.match(/[\d.]+/g)!.map(Number);
  const out = pa.map((v, i) => v + (pb[i] - v) * t);
  return `rgba(${Math.round(out[0])},${Math.round(out[1])},${Math.round(out[2])},${out[3].toFixed(3)})`;
}
