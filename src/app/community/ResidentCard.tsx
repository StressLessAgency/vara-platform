import type { Resident } from "@/lib/types";

// Resident card. Glass card with avatar, bio, interests, and a soft note CTA.
// No 3D tilt and no rotating gradient — they were the largest single source
// of frame jank on the community page.
export function ResidentCard({ r, preOpening }: { r: Resident; preOpening?: boolean }) {
  return (
    <li className="relative bg-white/80 glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col gap-4 group cursor-default list-none h-full active:scale-[0.99] transition-transform">
      <div className="flex items-start gap-4">
        <Avatar seed={r.avatarSeed} />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[1.25rem] leading-tight opsz-text text-[var(--color-ink)]">{r.name}</h3>
          <p className="text-[0.8rem] text-[var(--color-ink-soft)] mt-1">
            {r.villa} <span className="text-[var(--color-accent)]">&middot;</span> {r.villaCollection}
          </p>
        </div>
      </div>

      <p className="text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed line-clamp-2 lg:line-clamp-none">
        {r.bio}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {r.interests.slice(0, 3).map((i) => (
          <span key={i} className="text-[0.65rem] tracking-[0.04em] text-[var(--color-accent)] border border-[var(--color-hairline-strong)] rounded-full px-3 py-1 uppercase font-medium">
            {i}
          </span>
        ))}
      </div>

      <button
        className="text-left font-serif italic text-[0.9rem] text-[var(--color-accent)] hover:text-[var(--color-ink)] transition-colors mt-2 min-h-[44px] flex items-center active:scale-[0.97]"
      >
        {preOpening ? "Send a note before you both arrive" : "Start a conversation"}
      </button>

      <span className="absolute bottom-0 left-8 right-8 h-px bg-[var(--color-accent)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out rounded-full" />
    </li>
  );
}

function Avatar({ seed }: { seed: string }) {
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = (hash % 40) + 15;
  const initials = seed.slice(0, 1).toUpperCase();
  return (
    <div
      className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-serif text-[1.25rem] text-white relative overflow-hidden"
      style={{
        background: `conic-gradient(from 0deg, hsl(${hue}, 55%, 50%), hsl(${hue + 30}, 45%, 40%), #4A90A8, hsl(${hue + 15}, 50%, 55%), hsl(${hue}, 55%, 50%))`,
      }}
      aria-hidden
    >
      <span className="relative font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
        {initials}
      </span>
    </div>
  );
}
