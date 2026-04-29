import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

type TriageInput = {
  category: string;
  description: string;
  needBy: string;
};

type TriageOutput = {
  categoryConfirmed: string;
  suggestedLead: string;
  replyOpener: string;
};

export async function triageConcierge(input: TriageInput): Promise<TriageOutput> {
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 300,
    system: `You are the VARA Longevity Resort concierge coordinator. Triage guest requests.
Return JSON only: { "categoryConfirmed": string, "suggestedLead": string, "replyOpener": string }.
categoryConfirmed: one of restaurant, transport, in_villa, retreat_customization, off_property.
suggestedLead: which team handles this (Front Desk, Wellness Team, Villa Host, Transport, Kitchen).
replyOpener: a warm, specific one-sentence acknowledgment to the guest. Never mention AI.`,
    messages: [
      {
        role: "user",
        content: `Category: ${input.category}\nRequest: ${input.description}\nNeeded by: ${input.needBy}`,
      },
    ],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  return JSON.parse(text) as TriageOutput;
}
