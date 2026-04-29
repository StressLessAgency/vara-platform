import { conciergeRequests } from "@/lib/seed";
import { SurfaceHeader } from "@/components/SurfaceHeader";
import { ConciergeForm } from "./ConciergeForm";
import { ConciergeHistory } from "./ConciergeHistory";

export default function Concierge() {
  return (
    <div>
      <SurfaceHeader
        eyebrow="Concierge"
        title="We handle it"
        subtitle="Restaurants, transport, in-villa requests, and anything else. We will get back to you within the hour."
      />
      <ConciergeForm />
      <ConciergeHistory requests={conciergeRequests} />
    </div>
  );
}
