"use client";

import { StaggerGrid, StaggerItem, ScrollReveal } from "@/components/motion/ScrollReveal";
import { HairlineDraw } from "@/components/motion/HairlineDraw";
import { ResidentCard } from "./ResidentCard";
import type { Resident } from "@/lib/types";

const DEMO_RESIDENTS: Resident[] = [
  {
    id: "res_001", name: "Olivia S.", villa: "Villa Surya 12", villaCollection: "Vantara",
    joinedAt: "2026-03-01", protocolTags: ["longevity-core"], interests: ["breathwork", "open-water", "fermentation"],
    bio: "Two decades in venture. Now investing in the next thirty years of living well.", preOpening: true, avatarSeed: "olivia-surya",
  },
  {
    id: "res_002", name: "Marco Reeves", villa: "Villa Angin 3", villaCollection: "Signature",
    joinedAt: "2026-03-10", protocolTags: ["metabolic-reset"], interests: ["cycling", "wine", "meditation"],
    bio: "Former Olympic cycling coach. Brought the family to Bali for a slower chapter.", preOpening: true, avatarSeed: "marco-angin",
  },
  {
    id: "res_003", name: "Yuki Tanaka", villa: "Villa Surya 8", villaCollection: "Vantara",
    joinedAt: "2026-02-20", protocolTags: ["longevity-core"], interests: ["ceramics", "yoga", "plant medicine"],
    bio: "Ceramicist and Zen practitioner. Splits time between Kyoto and Bukit.", preOpening: true, avatarSeed: "yuki-surya",
  },
  {
    id: "res_004", name: "James Koh", villa: "Villa Angin 7", villaCollection: "Signature",
    joinedAt: "2026-03-05", protocolTags: ["metabolic-reset"], interests: ["surfing", "longevity science", "jazz"],
    bio: "Cardiologist turned longevity researcher. Moved here to surf before clinic every morning.", preOpening: true, avatarSeed: "james-angin",
  },
  {
    id: "res_005", name: "Priya Mehta", villa: "Villa Surya 5", villaCollection: "Vantara",
    joinedAt: "2026-02-28", protocolTags: ["longevity-core"], interests: ["Ayurveda", "trail running", "cooking"],
    bio: "Built three hospitality brands in India. Here to live the longevity lifestyle from the inside.", preOpening: true, avatarSeed: "priya-surya",
  },
  {
    id: "res_006", name: "Stefan Weber", villa: "Villa Angin 1", villaCollection: "Signature",
    joinedAt: "2026-03-12", protocolTags: ["metabolic-reset"], interests: ["freediving", "architecture", "cold exposure"],
    bio: "Architect. Designed two of the villas, then decided to live in one.", preOpening: true, avatarSeed: "stefan-angin",
  },
];

export function CommunityClient({ currentResident: _ }: { currentResident: Resident }) {
  return (
    <div>
      {/* Pre-opening framing — written like a host introducing the room. */}
      <ScrollReveal preset="fade">
        <div className="layout-frame-flush mb-10 lg:mb-14 max-w-[60ch]">
          <p
            className="font-serif italic text-[1.1rem] sm:text-[1.25rem] lg:text-[1.4rem] text-[var(--color-ink-soft)] leading-snug"
            style={{ fontVariationSettings: '"opsz" 24, "SOFT" 100' }}
          >
            Construction completes Q4 2026. Until then, these are the people moving in with you. Some of them you may already know.
          </p>
        </div>
      </ScrollReveal>

      <StaggerGrid className="layout-frame-flush grid gap-4 md:gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {DEMO_RESIDENTS.map((r) => (
          <StaggerItem key={r.id}>
            <ResidentCard r={r} preOpening={r.preOpening} />
          </StaggerItem>
        ))}
      </StaggerGrid>

      <HairlineDraw className="mt-14" />

      <ScrollReveal preset="fade" delay={0.2}>
        <div className="text-center py-14">
          <p className="body-serif text-[var(--color-ink-soft)] text-[1.1rem]">
            More residents join as we approach opening.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
