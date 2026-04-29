"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

type Props = {
  to: number;
  decimals?: number;
  className?: string;
  duration?: number;     // ms
  prefix?: string;
  suffix?: string;
};

// Spring-eased count-up when the number scrolls into view.
// Stays editorial — no bouncing, no overshoot.
export function NumberFlow({
  to, decimals = 0, className, duration: dur = 1200, prefix, suffix,
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(reduced ? to : 0);

  useEffect(() => {
    if (reduced || !inView) { setVal(to); return; }
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      // ease-out-quart -- stops sharply, not bouncy.
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, dur, reduced]);

  const formatted =
    decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();

  return (
    <span ref={ref} className={`tabular oldstyle ${className ?? ""}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
