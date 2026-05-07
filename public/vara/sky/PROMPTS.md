# VARA Sky Photographs — Image-Generator Prompts

Render in Higgsfield (or Midjourney v7) outside this chat. We want **16 photographs** total: 8 sky conditions x 2 times of day. Each becomes a `webp` saved into `public/vara/sky/` using the filename listed.

**House aesthetic across all 16:**
- Bukit Peninsula, Bali. Indian Ocean horizon. No buildings, no people, no surf, no boats — sky and sea only.
- Shot from cliff height. Horizon in lower third unless noted.
- Editorial photography register: Steve McCurry meets Aman brand book. Restrained color, never saturated.
- 35mm or medium-format film grain. No digital sharpness halos.
- Aspect ratio 3:2 landscape. 2400x1600px export, then convert to webp at quality 78.
- Suppress: no lens flare, no clouds-shaped-like-anything, no AI-render plasticity, no oversaturation.

**Suffix to append to every prompt below (Higgsfield):**
> "shot on Mamiya RZ67, Portra 400 film, natural light, 35mm equivalent framing, no people, no buildings, no boats, no surf, no aircraft, no birds, no text, no logo, restrained color, editorial Aman brand register, calm composition, soft grain"

**Negative prompt (Midjourney `--no` / Higgsfield filter):**
> "people, buildings, boats, surf, aircraft, birds, text, logo, lens flare, hdr, oversaturated, plasticity, digital, render, illustration, painting"

---

## Filename and prompt list

### Morning bank (golden ascent, Bukit faces east-south)

1. **`clear-morning.webp`** — "Clear Bali sunrise sky over the Indian Ocean from a cliff at the Bukit Peninsula. Pale gold horizon fading to soft cyan above. Horizon glassy, water dark teal. The first hour after dawn."

2. **`hazy-morning.webp`** — "Hazy tropical morning. Soft volcanic haze blurring the horizon line where ocean meets sky. Diffuse warm grey light. No clouds shaped distinctly, just mist and soft amber wash."

3. **`overcast-morning.webp`** — "Overcast morning over the Indian Ocean. Flat dove-grey sky, ocean slate, single hairline of brighter grey at the horizon where the sun is hidden. Restrained, melancholic, calm."

4. **`storm-morning.webp`** — "Approaching tropical squall in early morning. Charcoal cumulus building from the south, ocean indigo, narrow strip of golden sky still visible at the horizon line. Tension before rain."

5. **`drizzle-morning.webp`** — "Light tropical drizzle over the cliff coast. Pewter sky, the ocean a wet flat grey, water droplets implied by overall softness. No visible rain streaks. Quiet melancholy."

6. **`blue-morning.webp`** — "Brilliant cloudless morning sky over Bukit. Saturated blue at the zenith fading to pale near the horizon. Ocean a clear sapphire. Cleanest possible composition, but never digital-looking."

7. **`monsoon-morning.webp`** — "Monsoon morning. Heavy stratus low and dark, rain visible as soft veiling at the horizon, ocean dark teal under it, faint break of light to one side. Drama held back, never theatrical."

8. **`mist-morning.webp`** — "Sea mist clearing at sunrise. Cliffside vantage. Ocean barely visible through low pearlescent fog, sun a soft warm disc rising through it. Dreamlike but quiet, never fantasy."

### Evening bank (the dusk fall, Bukit faces west-south at sunset)

9. **`clear-evening.webp`** — "Cliff-top view of an Indian Ocean sunset, Bukit Peninsula. Sky stratified peach, rose, and indigo. Ocean reflecting amber path. Sun just dropped below horizon, color held a few minutes. Restrained, never postcard."

10. **`hazy-evening.webp`** — "Hazy tropical dusk. Soft pink ash diffusing the sun's last light, ocean silvery grey-pink, horizon line softened by haze. The last twenty minutes of usable light."

11. **`overcast-evening.webp`** — "Overcast tropical evening. Flat plum-grey sky, ocean dark slate, single line of dim copper at the horizon where the sun set behind cloud. Melancholy, restrained, never bleak."

12. **`storm-evening.webp`** — "Late afternoon storm clearing offshore. Cumulus shelf moving south, west-facing sky lit deep violet and burnt orange, ocean indigo with copper highlights. Drama held back, calm composition."

13. **`drizzle-evening.webp`** — "Tropical drizzle at dusk. Pewter sky deepening to indigo, ocean a flat dark teal, soft amber haze where sun sits behind the rain veil. No visible streaks."

14. **`blue-evening.webp`** — "Cloudless deep-blue dusk. Sky cobalt at zenith fading to pale dusty rose at horizon. Ocean dark sapphire. The blue hour just beginning."

15. **`monsoon-evening.webp`** — "Monsoon dusk. Heavy stratus pressing low, narrow band of fierce orange visible at the horizon where the storm meets the sea. Ocean dark teal-black, mood weighted but composed."

16. **`mist-evening.webp`** — "Sea mist rolling in at sunset. Cliff vantage. Sun a soft amber smudge through low fog, ocean barely articulated, palette dusty rose and pewter. Quiet, almost monochrome."

---

## After generation

1. Drop all 16 files into this directory at the filenames above.
2. The frontend reads from `/public/vara/sky/` via the `skyForCondition()` helper (added in `lib/sky.ts`). No code change needed once files are in place.
3. If a generation feels "tropical-postcard" rather than "Aman brand book" — reroll. Restraint is the whole point.

## Backup plan

If any condition can't be generated cleanly, fall back to **Pexels collection: editorial cliff coast / minimalist seascape / Bali sunset (license: free for commercial)**. Hand-pick — never use the first 50 results. Curator's eye is the difference between credible and stocky.
