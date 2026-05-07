"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Magnetic } from "./motion/Magnetic";
import { HairlineDraw } from "./motion/HairlineDraw";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: SunIcon, description: "Your daily view" },
  { href: "/calendar", label: "Calendar", icon: CalendarIcon, description: "Events and retreats" },
  { href: "/wellness", label: "Wellness", icon: HeartIcon, description: "How you feel" },
  { href: "/community", label: "Community", icon: PeopleIcon, description: "Your neighbors" },
  { href: "/concierge", label: "Concierge", icon: BellIcon, description: "We handle it" },
] as const;

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 72;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <>
      {/* ============================================================
          DESKTOP SIDEBAR -- expanded with labels, descriptions, active state
          ============================================================ */}
      <nav
        className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col justify-between glass-nav border-r border-[var(--color-hairline)]"
        style={{ width: SIDEBAR_WIDTH }}
        aria-label="Main navigation"
      >
        {/* Brand block */}
        <div className="px-7 pt-8 pb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.span
              className="font-serif text-[1.6rem] text-[var(--color-accent)] leading-none"
              style={{ fontVariationSettings: '"opsz" 96, "SOFT" 50' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              V
            </motion.span>
            <div className="flex flex-col">
              <span
                className="font-serif text-[0.85rem] tracking-[0.2em] text-[var(--color-ink)] leading-none"
                style={{ fontVariationSettings: '"opsz" 36, "SOFT" 50' }}
              >
                VARA
              </span>
              <span className="text-[0.55rem] tracking-[0.08em] text-[var(--color-ink-faint)] mt-0.5 uppercase">
                Longevity Resort
              </span>
            </div>
          </Link>

          <HairlineDraw className="mt-6" />
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon, description }) => {
            const active = pathname === href;
            return (
              <Magnetic key={href} as="a" href={href} strength={4} ariaLabel={label}
                className={`relative flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all duration-200 group ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-ink-mute)] hover:text-[var(--color-ink-soft)] hover:bg-[var(--color-accent-wash)]"
                }`}
              >
                {/* Active pill background */}
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-2xl"
                    style={{ zIndex: -1, background: "var(--color-accent-wash)", border: "1px solid var(--color-accent-soft)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Icon container */}
                <span className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-colors ${
                  active ? "bg-[var(--color-accent)]/10" : "group-hover:bg-[var(--color-accent-wash)]"
                }`}>
                  <Icon strokeWidth={active ? 1.6 : 1.2} />
                </span>

                {/* Label + description */}
                <div className="flex flex-col min-w-0">
                  <span className={`text-[0.8rem] font-medium leading-tight ${
                    active ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
                  }`}>
                    {label}
                  </span>
                  <span className="text-[0.6rem] text-[var(--color-ink-faint)] leading-tight mt-0.5 truncate">
                    {description}
                  </span>
                </div>

                {/* Active dot */}
                {active && (
                  <motion.span
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                  />
                )}
              </Magnetic>
            );
          })}
        </div>

        {/* Footer — Profile entry */}
        <div className="px-7 py-6">
          <HairlineDraw className="mb-5" />
          <Link
            href="/profile"
            aria-label="Open your profile"
            className={`group flex items-center gap-3 rounded-2xl px-2 py-1.5 -mx-2 transition-all hover:bg-[var(--color-accent-wash)] active:scale-[0.98] ${
              pathname === "/profile" ? "bg-[var(--color-accent-wash)] ring-1 ring-[var(--color-accent-soft)]" : ""
            }`}
          >
            {/* Resident avatar placeholder */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-ocean-deep)] to-[var(--color-accent)] flex items-center justify-center transition-transform group-hover:scale-[1.04]">
              <span className="font-serif text-[0.85rem] text-white">O</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[0.75rem] font-medium text-[var(--color-ink)] truncate">Olivia</span>
              <span className="text-[0.55rem] text-[var(--color-ink-faint)] truncate">Villa Surya 12</span>
            </div>
            <span className="text-[var(--color-ink-faint)] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M5 3l4 4-4 4"/></svg>
            </span>
          </Link>
        </div>
      </nav>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <main className="flex-1 pb-32 lg:pb-0" style={{ marginLeft: `var(--sidebar-width, 0px)` }}>
        <style>{`@media (min-width: 1024px) { :root { --sidebar-width: ${SIDEBAR_WIDTH}px; } }`}</style>
        <div className="layout-frame pt-8 sm:pt-12 md:pt-10 lg:pt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.985, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99, filter: "blur(3px)" }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ============================================================
          MOBILE BOTTOM BAR -- floating frosted pill
          ============================================================ */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden flex justify-center pointer-events-none"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <nav
          className="pointer-events-auto flex items-center justify-around w-[calc(100%-2rem)] max-w-md h-14 glass-nav rounded-full shadow-[0_2px_24px_rgba(26,41,53,0.08)]"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} aria-label={label}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-14 min-h-[44px] h-full transition-colors duration-200 active:scale-[0.93] ${
                  active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-mute)]"
                }`}
              >
                <Icon strokeWidth={active ? 1.6 : 1.3} />
                <span className="text-[0.5rem] tracking-[0.06em] uppercase font-medium">{label}</span>
                {active && (
                  <motion.span
                    layoutId="mobile-indicator"
                    className="absolute -bottom-0.5 left-4 right-4 h-[2px] rounded-full"
                    style={{ background: "var(--color-accent)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

// ============================================================
// SVG icons -- 20x20, stroke-based, variable weight
// ============================================================
interface IconProps { strokeWidth?: number }

function SunIcon({ strokeWidth = 1.3 }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" />
    </svg>
  );
}

function CalendarIcon({ strokeWidth = 1.3 }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="13" rx="2" />
      <path d="M3 8h14M7 2v4M13 2v4" />
    </svg>
  );
}

function HeartIcon({ strokeWidth = 1.3 }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 16.5S3 12.5 3 7.5a3.5 3.5 0 0 1 7 0 3.5 3.5 0 0 1 7 0c0 5-7 9-7 9Z" />
    </svg>
  );
}

function PeopleIcon({ strokeWidth = 1.3 }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="6" r="2.5" />
      <path d="M2.5 16c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" />
      <circle cx="14" cy="7" r="2" />
      <path d="M14 11.5c2 0 3.5 1.5 3.5 3.5" />
    </svg>
  );
}

function BellIcon({ strokeWidth = 1.3 }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2.5a4.5 4.5 0 0 0-4.5 4.5c0 5-2 6.5-2 6.5h13s-2-1.5-2-6.5a4.5 4.5 0 0 0-4.5-4.5Z" />
      <path d="M8.5 16a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}
