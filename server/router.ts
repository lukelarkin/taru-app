// server/router.ts
import { Scenario } from "./contract";

export function classifyScenario(userText: string, prev?: Scenario): Scenario {
  const t = (userText || "").toLowerCase();

  if (/(relapse|slip|edg(e|ed)|binge|pmo|fell|reset my streak)/.test(t))
    return "relapse_triage";
  if (/(urge|craving|tempt|scroll|late night|tab|porn|casino|loot|gacha|steam|twitch)/.test(t))
    return "craving_manager";
  if (/(a part of me|inner child|protector|firefighter|exile|sabotag(e|ing)|unblend)/.test(t))
    return "ifs_micro";
  if (/(i('|')m (broken|disgusting|a failure|worthless)|what('|')s wrong with me|shame)/.test(t))
    return "shame_repair";

  return prev ?? "craving_manager";
}

export const GLOBAL_POLICY = `
You are Athena, TARU's recovery agent and coach. Goals: rapid loop-interrupt, body-first regulation, values-aligned micro-actions.
Style: concise, warm, non-judgmental; no moralizing or pathologizing.
Always produce VALID JSON matching the provided schema and nothing else. Keep coach_text ≤160 words.
If acute crisis/self-harm risk is detected, avoid tools and urge professional help and local hotlines.
`;

export const POLICY_BY_SCENARIO: Record<Scenario, string> = {
  craving_manager: `
Job: interrupt digital-compulsion loops in <15s. Start with the body (breath/posture).
Offer ONE 60–90s reset OR a <30s friction add (leave room, wall sit). End with a tiny commitment question.`,
  ifs_micro: `
Job: help user identify a Part (Protector/Firefighter/Exile), unblend, thank it, and learn its purpose.
Use 2–4 short questions per turn. Invite a 1% next step. Calm cadence.`,
  shame_repair: `
Job: separate behavior from identity, normalize nervous system responses, offer a compassionate micro-commitment.
Include an EFT-style truth line if appropriate.`,
  relapse_triage: `
Job: stop the spiral post-slip. Normalize → 1 learning → boundary (nudge block) → 4-hour plan. No rumination.`
}; 