// lib/ai/composeAthena.ts
import { STATE_TO_INSIGHTS, STATE_TO_TOOL, SEQUEL_TOOL, State } from "./insight-map";
import { INSIGHTS } from "./insights";

type Insight = { title: string; content: string; follow_up?: string[] };

export function composeFromState(state: State) {
  const titles = STATE_TO_INSIGHTS[state];
  const picks: Insight[] = titles
    .map(t => INSIGHTS.find(x => x.title === t))
    .filter(Boolean) as Insight[];

  const tool = STATE_TO_TOOL[state];
  const sequel = SEQUEL_TOOL[state];

  // Pre‑reset copy: belonging → 1 short Jungian line → tool CTA
  const pre = [
    "You're not alone. I'm right here.",
    oneLiner(picks[0]?.content),
    toolCta(tool.type)
  ].filter(Boolean).join(" ");

  // Post‑reset follow‑ups: 1–2 shadow prompts max
  const followUps = (picks[1]?.follow_up || picks[2]?.follow_up || [])
    .slice(0, 2);

  return { text: pre, tool, sequel, followUps };
}

const oneLiner = (s?: string) => (s || "").replace(/\s+/g, " ").split(". ").slice(0, 1).join(". ") + (s ? "." : "");
const toolCta = (t: string) => ({
  physiologic_sigh: "Let's release that chest tightness with a 75‑second Physiologic Sigh.",
  alt_nostril: "Let's balance your system with 90 seconds of Alternate Nostril.",
  eft_tapping_simple: "Let's tap for two minutes to de‑shame and reset.",
  box_breath: "Let's box breathe for one minute to get clear.",
  shake_off: "Let's shake off the charge for 45 seconds and re‑check."
}[t] || "");
