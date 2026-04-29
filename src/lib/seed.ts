import type {
  Resident,
  EventItem,
  Checkin,
  Biomarker,
  ConciergeRequest,
} from "./types";

export const resident: Resident = {
  id: "res_001",
  name: "Olivia",
  villa: "Villa Surya 12",
  villaCollection: "Vantara",
  joinedAt: "2026-03-01",
  protocolTags: ["longevity-core", "metabolic-reset"],
  interests: ["breathwork", "open-water", "fermentation"],
  bio: "Two decades in venture. Now investing in the next thirty years of living well.",
  preOpening: true,
  avatarSeed: "olivia-surya",
};

export const events: EventItem[] = [
  {
    id: "evt_001",
    title: "Dawn Breathwork on the Cliff",
    type: "Health Session",
    startsAt: "2026-05-02T06:00:00+08:00",
    durationMinutes: 75,
    location: "Uluwatu Terrace",
    host: "Dr. Wayan Sudarma",
    capacity: 12,
    rsvpCount: 8,
    description: "Guided Wim Hof and pranayama sequence overlooking the Indian Ocean. Cold plunge follows for those who want it.",
  },
  {
    id: "evt_002",
    title: "Fermentation Master Class",
    type: "Master Class",
    startsAt: "2026-05-03T10:00:00+08:00",
    durationMinutes: 120,
    location: "Garden Kitchen",
    host: "Chef Nadia Lim",
    capacity: 8,
    rsvpCount: 5,
    priceUsd: 150,
    description: "Hands-on tempeh, kombucha, and kimchi workshop using ingredients from the VARA permaculture garden.",
  },
  {
    id: "evt_003",
    title: "Full Moon Sound Bath",
    type: "Signature Retreat",
    startsAt: "2026-05-04T19:30:00+08:00",
    durationMinutes: 90,
    location: "Bamboo Pavilion",
    host: "Ana Kaur",
    capacity: 20,
    rsvpCount: 14,
    description: "Crystal bowls, gongs, and Balinese gamelan under the full moon. Bring nothing. Wear white if you like.",
  },
  {
    id: "evt_004",
    title: "Founders Dinner: The Next Chapter",
    type: "Community Event",
    startsAt: "2026-05-05T19:00:00+08:00",
    durationMinutes: 180,
    location: "Long Table, Main Pavilion",
    host: "VARA Founding Team",
    capacity: 24,
    rsvpCount: 18,
    description: "An evening for pre-opening residents. Multi-course tasting menu paired with biodynamic wines from the cellar program.",
  },
  {
    id: "evt_005",
    title: "Ocean Swim: Padang Padang Circuit",
    type: "Health Session",
    startsAt: "2026-05-06T06:30:00+08:00",
    durationMinutes: 60,
    location: "Beach Club",
    host: "Coach Remy Albrecht",
    capacity: 6,
    rsvpCount: 3,
    description: "Guided 1.2km open-water circuit along the reef. Safety kayak provided. All swim levels.",
  },
  {
    id: "evt_006",
    title: "Metabolic Health Deep Dive",
    type: "Master Class",
    startsAt: "2026-05-07T14:00:00+08:00",
    durationMinutes: 90,
    location: "Wellness Library",
    host: "Dr. Lena Marcos",
    capacity: 16,
    rsvpCount: 9,
    description: "Understanding your blood panel results. Bring your latest biomarker report or use ours from the onboarding assessment.",
  },
];

export const checkins: Checkin[] = [
  { id: "chk_01", weekOf: "2026-04-21", sleep: 4, energy: 3, stress: 2, recovery: 4 },
  { id: "chk_02", weekOf: "2026-04-14", sleep: 3, energy: 3, stress: 3, recovery: 3 },
  { id: "chk_03", weekOf: "2026-04-07", sleep: 4, energy: 4, stress: 2, recovery: 4 },
  { id: "chk_04", weekOf: "2026-03-31", sleep: 3, energy: 2, stress: 4, recovery: 2 },
];

export const biomarkers: Biomarker[] = [
  { id: "bio_01", marker: "Vitamin D", value: 62, unit: "ng/mL", takenAt: "2026-04-10", optimalLow: 40, optimalHigh: 80 },
  { id: "bio_02", marker: "HbA1c", value: 5.1, unit: "%", takenAt: "2026-04-10", optimalLow: 4.0, optimalHigh: 5.6 },
  { id: "bio_03", marker: "hs-CRP", value: 0.8, unit: "mg/L", takenAt: "2026-04-10", optimalLow: 0, optimalHigh: 1.0 },
  { id: "bio_04", marker: "Omega-3 Index", value: 7.2, unit: "%", takenAt: "2026-04-10", optimalLow: 8, optimalHigh: 12 },
  { id: "bio_05", marker: "ApoB", value: 82, unit: "mg/dL", takenAt: "2026-04-10", optimalLow: 40, optimalHigh: 90 },
  { id: "bio_06", marker: "Testosterone", value: 680, unit: "ng/dL", takenAt: "2026-04-10", optimalLow: 400, optimalHigh: 900 },
];

export const conciergeRequests: ConciergeRequest[] = [
  {
    id: "con_001",
    category: "restaurant",
    description: "Table for two at Locavore, Saturday evening. Window seat preferred.",
    needBy: "2026-05-03T19:00:00+08:00",
    status: "resolved",
    triage: {
      categoryConfirmed: "restaurant",
      suggestedLead: "Front Desk",
      replyOpener: "Locavore is fully booked Saturday, but we secured a chef's counter seat at 8pm. Shall we confirm?",
    },
    createdAt: "2026-04-28T09:00:00+08:00",
    history: [
      { at: "2026-04-28T09:05:00+08:00", note: "Request received and triaged." },
      { at: "2026-04-28T11:30:00+08:00", note: "Chef's counter confirmed for 8pm Saturday." },
    ],
  },
];

export const dailyIntention =
  "Today is for stillness before motion. Let the cliff breathwork settle what yesterday stirred, then carry that calm into whatever the afternoon asks of you.";
