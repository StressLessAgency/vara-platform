import { getClient } from "./client";
import { findForbidden, VOICE_SYSTEM } from "./voice-rules";
import { MODELS, env } from "../env";

type FilterResult = {
  text: string;
  rewritten: boolean;
  hits: string[];
};

// Two-stage filter. First a cheap regex pass strips em-dashes and obvious tells.
// If anything trips, a Haiku rewrite enforces the full voice rule set.
// In pitch mode the filter still runs (seeded content should be clean already, but verify).
export async function applyVoiceFilter(text: string): Promise<FilterResult> {
  const cleaned = stripObvious(text);
  const hits = findForbidden(cleaned);
  if (hits.length === 0) return { text: cleaned, rewritten: false, hits: [] };

  if (!env.HAS_LIVE_AI) {
    // No rewrite available. Strip what we can locally and return.
    return { text: cleaned, rewritten: false, hits };
  }

  const rewritten = await rewriteWithHaiku(cleaned);
  return { text: rewritten, rewritten: true, hits };
}

function stripObvious(text: string): string {
  return text
    .replace(/—/g, ", ")
    .replace(/–/g, ", ")
    .replace(/--/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function rewriteWithHaiku(text: string): Promise<string> {
  try {
    const client = getClient();
    const msg = await client.messages.create({
      model: MODELS.cheap,
      max_tokens: 200,
      system: [
        {
          type: "text",
          text: VOICE_SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Rewrite this in VARA voice. Same meaning, fewer words allowed. Return only the rewritten sentence(s):\n\n${text}`,
        },
      ],
    });
    const out = msg.content[0]?.type === "text" ? msg.content[0].text.trim() : text;
    return stripObvious(out);
  } catch (err) {
    console.error("voice-filter rewrite failed", err);
    return text;
  }
}
