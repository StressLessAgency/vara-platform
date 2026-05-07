"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// Quiet route signal. A single 1px gold hairline scribes across the top
// of the viewport when the page changes. No curtain, no chapter title,
// no text. Total ~600ms. Reduced motion: nothing.
const SCRIBE_DURATION = 0.55;

export function RouteTransitionOverlay() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const prevPath = useRef(pathname);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setActiveKey(`${pathname}-${Date.now()}`);
    const t = window.setTimeout(() => setActiveKey(null), SCRIBE_DURATION * 1000 + 120);
    return () => window.clearTimeout(t);
  }, [pathname, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {activeKey && (
        <motion.span
          key={activeKey}
          aria-hidden
          className="fixed left-0 right-0 top-0 pointer-events-none"
          style={{
            height: "1px",
            zIndex: 9000,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212, 184, 148, 0.0) 4%, rgba(212, 184, 148, 0.65) 50%, rgba(212, 184, 148, 0.0) 96%, transparent 100%)",
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: SCRIBE_DURATION,
            times: [0, 0.45, 0.7, 1],
            ease: [0.22, 0.61, 0.36, 1],
          }}
        />
      )}
    </AnimatePresence>
  );
}
