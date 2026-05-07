import { resident, checkins, events, staff } from "@/lib/seed";
import { ProfileClient } from "./ProfileClient";

export const metadata = {
  title: "Profile · VARA",
  description: "Olivia · Villa Surya 12",
};

export default function ProfilePage() {
  const myTeam = staff.filter((s) => s.isOliviasTeam);
  return (
    <ProfileClient
      resident={resident}
      checkins={checkins}
      events={events}
      myTeam={myTeam}
    />
  );
}
