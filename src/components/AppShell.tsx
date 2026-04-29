"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Magnetic } from "./motion/Magnetic";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: SunIcon },
  { href: "/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/wellness", label: "Wellness", icon: HeartIcon },
  { href: "/community", label: "Community", icon: PeopleIcon },
  { href: "/concierge", label: "Concierge", icon: BellIcon },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop side rail -- frosted glass */}
      <nav
        className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col items-center justify-between w-[72px] xl:w-[80px] py-8 glass-nav"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex flex-col items-center gap-2"
        >
          {/* V monogram */}
          <span className="font-serif text-[1.4rem] text-[var(--color-accent)] leading-none" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 50' }}>V</span>
          {/* Wordmark */}
          <span className="font-serif text-[0.7rem] tracking-[0.22em] text-[var(--color-ink)] leading-none" style={{ fontVariationSettings: '"opsz" 36, "SOFT" 50' }}>VARA</span>
          {/* Accent line */}
          <span className="w-6 h-px bg-[var(--color-hairline-strong)]" />
        </Link>

        <div className="flex flex-col gap-1.5 items-center">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Magnetic key={href} as="a" href={href} strength={8} ariaLabel={label}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                  active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-mute)] hover:text-[var(--color-ink-soft)]"
                }`}
              >
                <Icon strokeWidth={active ? 1.6 : 1.3} />
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full"
                    style={{ zIndex: -1, background: "var(--color-accent-wash)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </Magnetic>
            );
          })}
        </div>

        <span className="text-[0.55rem] text-[var(--color-ink-faint)] tracking-[0.2em] uppercase"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
          Bukit, Bali
        </span>
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-[72px] xl:ml-[80px] pb-28 md:pb-0">
        <div className="px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-8 sm:pt-12 md:pt-14 lg:pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile bottom bar -- floating frosted pill */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 md:hidden flex justify-center pointer-events-none"
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
                className={`relative flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors duration-200 ${
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

// Minimal SVG icons. 20x20, stroke-based, variable weight.
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
