# VARA Resident Platform — MVP

Phase A scaffold. Five surfaces visible, brand v0 applied, AI surfaces wired with graceful fallback.

## Run

```bash
cd /Users/quinn/Dropbox/StudioOS/projects/vara/platform/app
PORT=3030 npm run dev
# open http://localhost:3030
```

(Port 3030 because Quinn's other dev servers run on 3000.)

## Env

Copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY` to enable real AI surfaces. Without a valid key, Home daily intention falls back to curated copy and Concierge triage uses a stock reply. Demo runs without it.

## Surfaces

- **/** — Today. Greeting, AI daily intention, today's recommendation, two upcoming events, day rhythm strip.
- **/calendar** — Retreats and Events. 8 seeded events across 4 types. Reserve / waitlist buttons (visual only in MVP).
- **/wellness** — Wellness Journey. Brechka protocol tags, biomarker bars (in/out of optimal), 4-week check-in history.
- **/community** — Resident directory. In-residence + pre-opening "future neighbors" mode.
- **/concierge** — Form submits to `/api/concierge`, AI triages and returns category + suggested lead + reply opener.

## Stack
- Next.js 16 + React 19 + TypeScript + Tailwind v4 (`@theme` for brand tokens)
- Anthropic SDK (server-only, prompt caching enabled, voice filter)
- Supabase + Stripe + Resend SDKs installed but not wired in MVP

## Brand v0
Tokens live in `src/app/globals.css` and mirror `../../brand/system/tokens.json`. Same tokens are used by the deck stylesheet at `../../brand/decks/pitch/styles.css`. Editing one should update the other.

- **Display type:** Fraunces (variable, opsz + SOFT axes), weight 300 for hero, 400 for titles
- **Text:** Inter
- **Background:** `#FAF7F2` warm off-white
- **Ink:** `#1A2935` deep ocean
- **Accent:** `#B8956A` muted gold (italic numerals, eyebrows, "Recommended" emphasis only)
- **Hairlines:** `#DCD6CD` and `#B8B0A2`. No pastel chips. No rounded rectangles. No drop shadows.

## Where to expand next

1. Replace placeholder portrait/avatar gradients with real imagery once Track 1 captures land.
2. Wire Supabase auth + connect seed data to real tables (`schema/01_initial.sql` + `schema/02_rls.sql` ready to apply).
3. Stripe Checkout on one calendar event end-to-end.
4. Wellness chart can become a small SVG history view rather than the optimal-range bar.
5. Community "send a note" should open a real thread, not a button placeholder.

## Schema
- `../schema/01_initial.sql` — tables for residents, events, RSVPs, wellness, concierge, staff, audit log.
- `../schema/02_rls.sql` — Row-Level Security policies. Residents read their own data. Staff read by role.

Apply both to a fresh Supabase project when Phase B kicks off.

## Voice rules (enforced in `src/lib/anthropic.ts`)

- No em dashes. No filler. No motivational copy.
- No mention of AI, ML, or LLM in user-facing output.
- Tone: refined, slightly literary, calm. Closer to Aman than to a wellness app.
- All AI output passes a regex voice filter before display.
