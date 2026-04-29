export type Resident = {
  id: string;
  name: string;
  villa: string;
  villaCollection: "Vantara" | "Signature";
  joinedAt: string;
  protocolTags: string[];
  interests: string[];
  bio: string;
  preOpening: boolean;
  avatarSeed: string;
};

export type EventType =
  | "Signature Retreat"
  | "Master Class"
  | "Community Event"
  | "Health Session";

export type EventItem = {
  id: string;
  title: string;
  type: EventType;
  startsAt: string;
  durationMinutes: number;
  location: string;
  host: string;
  capacity: number;
  rsvpCount: number;
  priceUsd?: number;
  brechkaTags?: string[];
  description: string;
};

export type Checkin = {
  id: string;
  weekOf: string;
  sleep: number;
  energy: number;
  stress: number;
  recovery: number;
};

export type Biomarker = {
  id: string;
  marker: string;
  value: number;
  unit: string;
  takenAt: string;
  optimalLow: number;
  optimalHigh: number;
};

export type ConciergeRequestStatus = "pending" | "in_progress" | "resolved";

export type ConciergeRequest = {
  id: string;
  category:
    | "restaurant"
    | "transport"
    | "in_villa"
    | "retreat_customization"
    | "off_property";
  description: string;
  needBy: string;
  status: ConciergeRequestStatus;
  triage?: { categoryConfirmed: string; suggestedLead: string; replyOpener: string };
  createdAt: string;
  history: { at: string; note: string }[];
};
