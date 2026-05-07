import { getClient } from "./client";
import { VOICE_SYSTEM } from "./voice-rules";
import { applyVoiceFilter } from "./voice-filter";
import { MODELS, env } from "../env";

type TriageInput = {
  category: string;
  description: string;
  needBy: string;
};

export type TriageOutput = {
  categoryConfirmed: string;
  suggestedLead: string;
  replyOpener: string;
  source: "live" | "pitch-cache" | "fallback";
};

const SYSTEM = `${VOICE_SYSTEM}

You are the VARA concierge coordinator. Triage requests from residents.

Return JSON only. Schema:
{ "categoryConfirmed": "restaurant" | "transport" | "in_villa" | "retreat_customization" | "off_property",
  "suggestedLead": "Front Desk" | "Wellness Team" | "Villa Host" | "Transport" | "Kitchen",
  "replyOpener": string }

replyOpener: one warm specific sentence acknowledging the request. No questions back to the resident. Never name AI. Never use forbidden words.`;

const STOCK: Record<string, TriageOutput> = {
  restaurant: {
    categoryConfirmed: "restaurant",
    suggestedLead: "Front Desk",
    replyOpener: "Noted. We will look at what is available and come back within the hour.",
    source: "pitch-cache",
  },
  transport: {
    categoryConfirmed: "transport",
    suggestedLead: "Transport",
    replyOpener: "We have a driver who knows the route well. Confirming now.",
    source: "pitch-cache",
  },
  in_villa: {
    categoryConfirmed: "in_villa",
    suggestedLead: "Villa Host",
    replyOpener: "Your villa host has been notified. We will set this up before you return.",
    source: "pitch-cache",
  },
  retreat_customization: {
    categoryConfirmed: "retreat_customization",
    suggestedLead: "Wellness Team",
    replyOpener: "Dr. Vasin has been looped in. We will adjust and confirm by this evening.",
    source: "pitch-cache",
  },
  off_property: {
    categoryConfirmed: "off_property",
    suggestedLead: "Front Desk",
    replyOpener: "We will arrange this off-property and send the details once they are confirmed.",
    source: "pitch-cache",
  },
};

export async function triageConcierge(input: TriageInput): Promise<TriageOutput> {
  if (!env.HAS_LIVE_AI) return STOCK[input.category] ?? STOCK.restaurant;

  try {
    const client = getClient();
    const msg = await client.messages.create({
      model: MODELS.primary,
      max_tokens: 220,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: `Category: ${input.category}\nRequest: ${input.description}\nNeeded by: ${input.needBy}`,
        },
      ],
    });
    const raw = msg.content[0]?.type === "text" ? msg.content[0].text.trim() : "";
    const parsed = safeParse(raw);
    if (!parsed) return { ...STOCK[input.category] ?? STOCK.restaurant, source: "fallback" };
    const filtered = await applyVoiceFilter(parsed.replyOpener);
    return {
      categoryConfirmed: parsed.categoryConfirmed,
      suggestedLead: parsed.suggestedLead,
      replyOpener: filtered.text,
      source: "live",
    };
  } catch (err) {
    console.error("triage failed", err);
    return { ...STOCK[input.category] ?? STOCK.restaurant, source: "fallback" };
  }
}

type ParsedTriage = { categoryConfirmed: string; suggestedLead: string; replyOpener: string };

function safeParse(s: string): ParsedTriage | null {
  try {
    const cleaned = s.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    const obj = JSON.parse(cleaned) as ParsedTriage;
    if (typeof obj?.categoryConfirmed !== "string") return null;
    if (typeof obj?.suggestedLead !== "string") return null;
    if (typeof obj?.replyOpener !== "string") return null;
    return obj;
  } catch {
    return null;
  }
}
