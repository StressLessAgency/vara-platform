import { events } from "@/lib/seed";
import { CalendarClient } from "./CalendarClient";

export default function Calendar() {
  return <CalendarClient events={events} />;
}
