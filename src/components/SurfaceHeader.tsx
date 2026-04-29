import type { ReactNode } from "react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

export function SurfaceHeader({
  eyebrow,
  title,
  subtitle,
  meta,
  heroImage,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  heroImage?: string;
}) {
  if (heroImage) {
    return (
      <header className="-mx-5 sm:-mx-8 lg:-mx-12 -mt-8 sm:-mt-12 lg:-mt-16 mb-12 lg:mb-16">
        {/* Full-bleed hero */}
        <div className="relative h-[40vh] sm:h-[48vh] lg:h-[56vh] min-h-[280px]">
          <ParallaxImage
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full"
            priority
            speed={0.12}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2935]/70 via-[#1A2935]/20 to-transparent" />
        </div>

        {/* Glass card floating over the hero bottom edge */}
        <div className="relative px-5 sm:px-8 lg:px-12 -mt-20 sm:-mt-24">
          <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8 lg:p-10">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[#4A90A8]">
                {eyebrow}
              </span>
              {meta && (
                <span className="text-[0.75rem] text-[#6B7A85] tabular">{meta}</span>
              )}
            </div>
            <h1 className="display-1 text-[#1A2935] max-w-[22ch]">{title}</h1>
            {subtitle && (
              <p className="body-serif mt-3 text-[#6B7A85] max-w-[44ch] text-lg leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>
    );
  }

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
