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

      {/* Glass card form container */}
      <div className="bg-white/80 backdrop-blur-xl border border-[rgba(74,144,168,0.12)] rounded-3xl shadow-[0_2px_24px_rgba(26,41,53,0.06)] p-6 sm:p-8 lg:p-10">
        <ConciergeForm />
      </div>

      <ConciergeHistory requests={conciergeRequests} />
    </div>
  );
}
