import { resident } from "@/lib/seed";
import { SurfaceHeader } from "@/components/SurfaceHeader";
import { CommunityClient } from "./CommunityClient";

export default function Community() {
  return (
    <div>
      <SurfaceHeader
        eyebrow="Community"
        title="Your neighbors"
        subtitle="Pre-opening residents building the founding culture of VARA."
        meta="12 residents"
        heroImage="/vara/photos/p07-img02-1740x899.jpeg"
      />
      <CommunityClient currentResident={resident} />
    </div>
  );
}
