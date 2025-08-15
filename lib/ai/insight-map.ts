// lib/ai/insight-map.ts
export type State =
  | "craving" | "shame" | "anger" | "grief"
  | "denial" | "self-deception" | "resentment" | "lust";

export const STATE_TO_INSIGHTS: Record<State, string[]> = {
  // 1–2 lines, pre‑reset. Deeper prompts post‑reset only.
  craving: [
    "Craving as Symbolic Communication from the Psyche",
    "Use the Craving as a Compass",
    "Personify the Craving (Active Imagination)"
  ],
  shame: [
    "Shadow Work and the Root of Destructive Behavior",
    "Mirror the Core Belief",
    "Ritualize the Integration (Mini Shadow Ritual)"
  ],
  anger: [
    "Emotional Alchemy Instead of Suppression",
    "Shadow Work and the Root of Destructive Behavior",
    "Reverse the Fantasy (Break the Spell)"
  ],
  grief: [
    "Individuation and Long-Term Recovery",
    "Expose the Repression (What's Being Avoided?)",
    "Ritualize the Integration (Mini Shadow Ritual)"
  ],
  denial: [
    "Expose the Repression (What's Being Avoided?)",
    "Personality Type and Suppressed Inner Needs",
    "Mirror the Core Belief"
  ],
  "self-deception": [
    "Mirror the Core Belief",
    "Reverse the Fantasy (Break the Spell)",
    "Addiction as a Misguided Quest for Wholeness or Spirit"
  ],
  resentment: [
    "Shadow Work and the Root of Destructive Behavior",
    "Use the Craving as a Compass",
    "Emotional Alchemy Instead of Suppression"
  ],
  lust: [
    "Craving as Symbolic Communication from the Psyche",
    "Personify the Craving (Active Imagination)",
    "Dreams and Archetypes as Craving Insight Tools"
  ],
};

// Default tool per state (90s to relief; ≤3 taps)
export const STATE_TO_TOOL: Record<State, {type:
  "physiologic_sigh" | "alt_nostril" | "eft_tapping_simple" | "box_breath" | "shake_off",
  durationSec: number
}> = {
  craving:         { type: "physiologic_sigh",    durationSec: 75 },
  shame:           { type: "eft_tapping_simple",  durationSec: 120 },
  anger:           { type: "shake_off",           durationSec: 45 },
  grief:           { type: "alt_nostril",         durationSec: 90 },
  denial:          { type: "box_breath",          durationSec: 60 },
  "self-deception":{ type: "box_breath",          durationSec: 60 },
  resentment:      { type: "shake_off",           durationSec: 45 },
  lust:            { type: "alt_nostril",         durationSec: 90 },
};

// Optional second‑step tool chaining (keeps flows under 2m)
export const SEQUEL_TOOL: Partial<Record<State, {type:
  "box_breath" | "physiologic_sigh", durationSec:number}>> = {
  anger:      { type: "box_breath",       durationSec: 60 },    // Shake → Box
  resentment: { type: "physiologic_sigh", durationSec: 60 },    // Shake → Sigh
};
