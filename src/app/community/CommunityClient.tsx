"use client";

import { Reveal } from "@/components/motion/Reveal";
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
    bio: "Built three hospitality brands in India. Here to learn what luxury longevity feels like from the inside.", preOpening: true, avatarSeed: "priya-surya",
  },
  {
    id: "res_006", name: "Stefan Weber", villa: "Villa Angin 1", villaCollection: "Signature",
    joinedAt: "2026-03-12", protocolTags: ["metabolic-reset"], interests: ["freediving", "architecture", "cold exposure"],
    bio: "Architect. Designed two of the villas, then decided to live in one.", preOpening: true, avatarSeed: "stefan-angin",
  },
];

export function CommunityClient({ currentResident }: { currentResident: Resident }) {
  return (
    <Reveal>
      <ul className="grid gap-px bg-[var(--color-hairline)]">
        {DEMO_RESIDENTS.map((r) => (
          <ResidentCard key={r.id} r={r} preOpening={r.preOpening} />
        ))}
      </ul>

      <HairlineDraw className="mt-12" />

      <div className="text-center py-12">
        <p className="body-serif text-[var(--color-ink-soft)] text-[1.1rem]">
          More residents join as we approach opening.
        </p>
      </div>
    </Reveal>
  );
}
