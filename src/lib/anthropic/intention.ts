import { getClient } from "./client";
import { VOICE_SYSTEM } from "./voice-rules";
import { applyVoiceFilter } from "./voice-filter";
import { MODELS, env } from "../env";
import { pickRotation, dayPhaseForBukit } from "../intention-rotation";
import type { Resident, Checkin } from "../types";

type IntentionInput = {
  resident: Resident;
  latestCheckin: Checkin;
  weather?: { conditions: string; tempC: number } | null;
  date?: Date;
};

export type IntentionResult = {
  text: string;
  source: "live" | "fallback" | "pitch-cache";
};

const SYSTEM = `${VOICE_SYSTEM}

Your task: write today's intention for one resident at VARA. One or two short sentences. Maximum 180 characters total. No greeting, no signature. Quietly observed, slightly literary, specific to the day's phase and the resident's recent week. Never advise. Suggest by noticing.`;

export async function generateIntention(input: IntentionInput): Promise<IntentionResult> {
  const date = input.date ?? new Date();

  if (!env.HAS_LIVE_AI) {
    return { text: pickRotation(input.resident.id, date), source: "pitch-cache" };
  }

  try {
    const client = getClient();
    const phase = dayPhaseForBukit(date);
    const userPrompt = buildUserPrompt(input, phase);

    const msg = await client.messages.create({
      model: MODELS.primary,
      max_tokens: 120,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userPrompt }],
    });
    const raw = msg.content[0]?.type === "text" ? msg.content[0].text.trim() : "";
    if (!raw) return { text: pickRotation(input.resident.id, date), source: "fallback" };
    const filtered = await applyVoiceFilter(raw);
    return { text: filtered.text, source: "live" };
  } catch (err) {
    console.error("intention generation failed", err);
    return { text: pickRotation(input.resident.id, date), source: "fallback" };
  }
}

function buildUserPrompt(input: IntentionInput, phase: string): string {
  const { resident, latestCheckin, weather } = input;
  const lines = [
    `Resident: ${resident.name}, ${resident.villa}.`,
    `Recent week: sleep ${latestCheckin.sleep}/5, energy ${latestCheckin.energy}/5, stress ${latestCheckin.stress}/5, recovery ${latestCheckin.recovery}/5.`,
    `Interests: ${resident.interests.join(", ")}.`,
    `Phase of day in Bukit: ${phase}.`,
  ];
  if (weather) lines.push(`Weather: ${weather.conditions}, ${weather.tempC}°C.`);
  lines.push("Write today's intention.");
  return lines.join("\n");
}
