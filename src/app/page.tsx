import { resident, events, dailyIntention, checkins } from "@/lib/seed";
import { HomeClient } from "./HomeClient";

export default function Home() {
  return (
    <HomeClient
      resident={resident}
      events={events.slice(0, 3)}
      intention={dailyIntention}
      latestCheckin={checkins[0]}
    />
  );
}
