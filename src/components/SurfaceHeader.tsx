import type { ReactNode } from "react";

export function SurfaceHeader({
  eyebrow,
  title,
  subtitle,
  meta,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-12 lg:mb-16">
      <div className="flex items-baseline justify-between mb-4">
        <span className="eyebrow">{eyebrow}</span>
        {meta && (
          <span className="text-[0.75rem] text-[var(--color-ink-mute)] tabular">{meta}</span>
        )}
      </div>
      <h1 className="display-1 text-[var(--color-ink)] max-w-[22ch]">{title}</h1>
      {subtitle && (
        <p className="body-serif mt-4 text-[var(--color-ink-soft)] max-w-[40ch] text-lg">
          {subtitle}
        </p>
      )}
      <div className="hairline-x mt-10" />
    </header>
  );
}
