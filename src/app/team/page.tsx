import { staff } from "@/lib/seed";
import { TeamClient } from "./TeamClient";

export const metadata = {
  title: "Meet the team · VARA",
  description: "The people behind your residency",
};

export default function TeamPage() {
  return <TeamClient staff={staff} />;
}
