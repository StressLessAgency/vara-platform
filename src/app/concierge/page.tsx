import Link from "next/link";
import { conciergeRequests, staff } from "@/lib/seed";
import { SurfaceHeader } from "@/components/SurfaceHeader";
import { ConciergeForm } from "./ConciergeForm";
import { ConciergeHistory } from "./ConciergeHistory";
import { ConciergePerson } from "./ConciergePerson";

export default function Concierge() {
  const onShiftCount = staff.filter((s) => s.shift !== "off").length;
  return (
    <div>
      <SurfaceHeader
        eyebrow="Concierge"
        title="We handle it"
        subtitle="Restaurants, transport, in-villa requests, and anything else. Reply within the hour."
        heroImage="/vara/photos/p12-img03-1002x755.jpeg"
      />

      <div className="layout-frame-flush lg:grid lg:grid-cols-[3fr_2fr] lg:gap-10 xl:gap-12 2xl:gap-16">
        {/* Glass card form container */}
        <div className="bg-white/80 backdrop-blur-xl border border-[var(--color-hairline)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8 lg:p-10">
          <ConciergePerson />
          <ConciergeForm />

          {/* Don't know who to ask? */}
          <Link
            href="/team"
            className="group mt-6 flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-[var(--color-accent-wash)] border border-[var(--color-accent-soft)] hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-[var(--color-accent)]">
                  <circle cx="7" cy="6" r="2.5"/><path d="M2.5 16c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5"/><circle cx="14" cy="7" r="2"/><path d="M14 11.5c2 0 3.5 1.5 3.5 3.5"/>
                </svg>
              </span>
              <div className="min-w-0">
                <span className="block text-[0.8rem] font-medium text-[var(--color-ink)]">Not sure who to ask?</span>
                <span className="block text-[0.65rem] text-[var(--color-ink-soft)]">Meet the team — {onShiftCount} on shift now</span>
              </div>
            </div>
            <span className="text-[var(--color-accent)] transition-transform group-hover:translate-x-0.5" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 3l4 4-4 4"/></svg>
            </span>
          </Link>
        </div>

        <div>
          <ConciergeHistory requests={conciergeRequests} />
        </div>
      </div>
    </div>
  );
}
