import { checkins, biomarkers, resident } from "@/lib/seed";
import { WellnessClient } from "./WellnessClient";

export default function Wellness() {
  return (
    <WellnessClient
      checkins={checkins}
      biomarkers={biomarkers}
      protocolTags={resident.protocolTags}
    />
  );
}
