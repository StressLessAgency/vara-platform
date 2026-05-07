import { resident, events, checkins } from "@/lib/seed";
import { generateIntention } from "@/lib/anthropic";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestCheckin = checkins[0];
  const intention = await generateIntention({
    resident,
    latestCheckin,
    weather: { conditions: "clear", tempC: 28 },
  });

  return (
    <HomeClient
      resident={resident}
      events={events.slice(0, 3)}
      intention={intention.text}
      intentionSource={intention.source}
      latestCheckin={latestCheckin}
    />
  );
}
