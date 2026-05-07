"use client";

import { motion } from "motion/react";
import { NumberFlow } from "@/components/motion/NumberFlow";

// Ambient environment strip showing Bali conditions. Static seed data for MVP.
// In production this would pull from a weather API.
const CONDITIONS = {
  temp: 28,
  humidity: 72,
  uv: 6,
  water: 27,
  tide: "Rising",
  sunrise: "6:12",
  sunset: "18:24",
};

export function BaliPulse() {
  return (
    <motion.div
      className="flex items-center gap-6 lg:gap-8 overflow-x-auto scrollbar-hide py-4 -my-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <Metric label="Air" value={CONDITIONS.temp} suffix="\u00B0C" />
      <Divider />
      <Metric label="Ocean" value={CONDITIONS.water} suffix="\u00B0C" />
      <Divider />
      <Metric label="UV" value={CONDITIONS.uv} suffix="/11" />
      <Divider />
      <Metric label="Humidity" value={CONDITIONS.humidity} suffix="%" />
      <Divider />
      <div className="flex-shrink-0">
        <span className="text-[0.5rem] tracking-[0.14em] uppercase text-[#6B7A85] block">Tide</span>
        <span className="text-[0.8rem] text-[#1A2935] font-medium tabular">{CONDITIONS.tide}</span>
      </div>
      <Divider />
      <div className="flex-shrink-0">
        <span className="text-[0.5rem] tracking-[0.14em] uppercase text-[#6B7A85] block">Sunrise</span>
        <span className="text-[0.8rem] text-[#1A2935] tabular">{CONDITIONS.sunrise}</span>
      </div>
      <Divider />
      <div className="flex-shrink-0">
        <span className="text-[0.5rem] tracking-[0.14em] uppercase text-[#6B7A85] block">Sunset</span>
        <span className="text-[0.8rem] text-[#1A2935] tabular">{CONDITIONS.sunset}</span>
      </div>
    </motion.div>
  );
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="flex-shrink-0">
      <span className="text-[0.5rem] tracking-[0.14em] uppercase text-[#6B7A85] block">{label}</span>
      <span className="text-[0.8rem] text-[#1A2935] font-medium">
        <NumberFlow to={value} duration={800} />{suffix}
      </span>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-6 bg-[rgba(74,144,168,0.12)] flex-shrink-0" />;
}
