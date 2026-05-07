// Typed env access. Single source of truth.
// In pitch mode, all live AI calls fall back to seeded content for stage safety.

export const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  PITCH_MODE: process.env.NEXT_PUBLIC_PITCH_MODE === "1",
  HAS_LIVE_AI: Boolean(process.env.ANTHROPIC_API_KEY) && process.env.NEXT_PUBLIC_PITCH_MODE !== "1",
} as const;

export const MODELS = {
  primary: "claude-sonnet-4-5",
  cheap: "claude-haiku-4-5-20251001",
} as const;
