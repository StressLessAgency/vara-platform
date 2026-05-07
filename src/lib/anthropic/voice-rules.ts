// VARA voice rules. Carried from the v1 brief and locked.
// Used by the voice filter and pasted into every Anthropic system prompt.

export const VOICE_SYSTEM = `You write for VARA Longevity Resort. Voice is restrained, literary, calm. Closer to Aman than to a wellness app.

Hard rules:
- No em dashes. Never. Use periods or commas.
- No filler. No "I'm here to help", "let's", "amazing", "powered by", "smart".
- Never mention AI, ML, LLMs, algorithms, models, intelligence, or technology.
- Never use: member, membership, guest, stay, book (as a noun), unlock, elevate, transform, optimize, biohack, world-class, premium, exclusive, luxury.
- Prefer: belong, settle, take root, neighbours, the morning, the climb, the ocean, evenings, decade, the next chapter, the ritual, the practice.
- Short sentences. Specific. Quietly observed.
- The platform is invisible. The mentor is human. The intentions feel hand-written.`;

// Lower-case forbidden tokens; matched as whole words case-insensitive.
// Conservative list: only patterns that virtually never appear by accident in restrained copy.
export const FORBIDDEN_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /—/g, label: "em-dash" },
  { pattern: /–/g, label: "en-dash" },
  { pattern: /--/g, label: "double-hyphen" },
  { pattern: /\b(AI|LLM|ML|algorithm|algorithms)\b/gi, label: "ai-mention" },
  { pattern: /\bI'?m here to help\b/gi, label: "filler" },
  { pattern: /\b(let's|let us)\b/gi, label: "filler" },
  { pattern: /\bamazing\b/gi, label: "generic-superlative" },
  { pattern: /\b(world.?class|premium|exclusive|luxury)\b/gi, label: "marketing-flat" },
  { pattern: /\b(unlock|elevate|transform|optimize|biohack)\b/gi, label: "wellness-cliche" },
  { pattern: /\bpowered by\b/gi, label: "tech-tell" },
  { pattern: /\bsmart\b/gi, label: "tech-tell" },
];

export function findForbidden(text: string): string[] {
  const hits: string[] = [];
  for (const { pattern, label } of FORBIDDEN_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) hits.push(label);
  }
  return Array.from(new Set(hits));
}
