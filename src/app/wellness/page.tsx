import { checkins, biomarkers } from "@/lib/seed";
import { WellnessClient } from "./WellnessClient";

export default function Wellness() {
  return <WellnessClient checkins={checkins} biomarkers={biomarkers} />;
}
