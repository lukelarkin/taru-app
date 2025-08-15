import { Insight, State } from "./types";

// Jungian and Shadow Work insights library
export const INSIGHTS: Insight[] = [
  {
    title: "Introduction",
    content: "Athena: Hello, I'm Athena. You're not alone; I'm here to support you through what you're experiencing right now.",
    tags: ["Jungian", "supportive", "compassionate", "introduction", "connection"],
    type: "Jungian Insight"
  },
  {
    title: "Craving as Symbolic Communication from the Psyche",
    content: "Cravings are often symbolic messages from the unconscious. Rather than a literal desire for a substance or behavior, the craving may represent a deeper unmet psychological or emotional need. Encourage the individual to explore what the craving might symbolize—loneliness, anger, the need for connection, or unexpressed emotion. Reflect on recent dreams, compulsive thoughts, or fantasies. These may hold clues to the inner world seeking expression.",
    tags: ["Jungian", "symbolism", "emotional needs", "psyche", "cravings"],
    type: "Jungian Insight"
  },
  {
    title: "Addiction as a Misguided Quest for Wholeness or Spirit",
    content: "Addiction can be seen as a misguided attempt to achieve a transcendent or spiritual state—a yearning for connection with something greater. Guide the user to consider: 'What is this craving trying to give you that your spirit longs for?' Offer grounding practices or meditations that bring spiritual presence or awe into the body—breathwork, visualization of divine light, or meaningful memories that evoked a sense of the sacred.",
    tags: ["Jungian", "spirituality", "transcendence", "addiction", "grounding"],
    type: "Jungian Insight"
  },
  {
    title: "Shadow Work and the Root of Destructive Behavior",
    content: "The Shadow represents rejected or unconscious parts of the self. Cravings often surge when the Shadow is active but unseen. Encourage curiosity without judgment. Ask the user: 'What part of yourself are you running from or refusing to feel right now?' Naming it—shame, rage, powerlessness—reduces its grip. Invite the user to sit with the feeling without acting on it. Offer phrases like, 'Even this part of me belongs,' or 'I don't have to fear what I can see.'",
    tags: ["Jungian", "shadow work", "emotional awareness", "self-integration", "healing"],
    type: "Jungian Insight"
  },
  {
    title: "Personality Type and Suppressed Inner Needs",
    content: "According to Jungian typology, we all have a dominant mode of perception or judgment—and a shadow function we avoid. Addiction often compensates for that ignored part. For example, someone who's hyper-rational may ignore emotional or sensory needs. Ask: 'What have you not allowed yourself to feel or enjoy lately?' Direct the user toward neglected sources of joy—music, beauty, creativity, movement—that nourish the soul without destroying the self.",
    tags: ["Jungian", "personality", "neglected needs", "balance", "emotional health"],
    type: "Jungian Insight"
  },
  {
    title: "Individuation and Long-Term Recovery",
    content: "Cravings may be signals that the self longs to evolve. Jung called this individuation—the path toward wholeness. Instead of labeling the craving as failure, frame it as part of the journey. Ask the user, 'What is the deeper life trying to emerge in you?' or 'What would wholeness look like, even in this moment of struggle?' Offer gentle affirmations of growth: 'This craving doesn't define me. It reminds me that I'm becoming someone new.'",
    tags: ["Jungian", "individuation", "growth", "self-transformation", "long-term recovery"],
    type: "Jungian Insight"
  },
  {
    title: "Dreams and Archetypes as Craving Insight Tools",
    content: "Dreams often reflect psychic tension or repressed desires. Archetypal images—like the Hero, the Orphan, the Seducer—can show up in both dreams and addictive fantasies. Encourage the user to ask, 'If this craving were a character in a dream, who would it be?' Helping the user externalize the craving can create space for insight, compassion, and creative dialogue with the craving rather than blind submission.",
    tags: ["Jungian", "dreams", "archetypes", "symbolism", "insight"],
    type: "Jungian Insight"
  },
  {
    title: "Emotional Alchemy Instead of Suppression",
    content: "Jung taught that energy doesn't disappear—it transforms. When a craving arises, encourage emotional alchemy: rather than repressing or indulging the desire, explore ways to transmute it. This could involve journaling the sensation in poetic form, dancing it out, painting the craving, or speaking it out loud with dramatic flair. Transformation becomes possible when we offer creative containers for raw energy.",
    tags: ["Jungian", "emotional alchemy", "transformation", "expression", "creativity"],
    type: "Jungian Insight"
  },
  {
    title: "Personify the Craving (Active Imagination)",
    content: "Athena: If this craving had a face, a voice, a personality—who or what would it be? You're not trying to fight it—you're trying to understand what part of you wants to be heard.",
    follow_up: [
      "What does this part want for you?",
      "What is it afraid would happen if you didn't listen to it?"
    ],
    tags: ["shadow work", "Jungian", "active imagination", "personification", "craving"],
    type: "Shadow Work Intervention"
  },
  {
    title: "Expose the Repression (What's Being Avoided?)",
    content: "Athena: What part of yourself are you trying *not* to feel right now? Even naming it—shame, rage, grief—can release some of its hold.",
    follow_up: [
      "What would happen if you allowed yourself to feel it, even a little?",
      "Can you be with it without judgment?"
    ],
    tags: ["shadow work", "emotional avoidance", "repression", "Jungian", "craving"],
    type: "Shadow Work Intervention"
  },
  {
    title: "Reverse the Fantasy (Break the Spell)",
    content: "Athena: What's the fantasy behind this craving? What does it promise you? Imagine acting on it—what are you really seeking? And what happens right after?",
    follow_up: [
      "What is the craving trying to help you avoid or control?",
      "What does it want you to believe you'll feel?"
    ],
    tags: ["craving", "fantasy", "Jungian", "shadow work", "desire awareness"],
    type: "Shadow Work Intervention"
  },
  {
    title: "Mirror the Core Belief",
    content: "Athena: When this craving hits, what belief about yourself or life becomes loud? Let's hold that belief gently, not as fact, but as a story you've carried.",
    follow_up: [
      "Where did that belief begin?",
      "Is it true—or just familiar?",
      "Can you say, 'Even this belief is part of my healing?'"
    ],
    tags: ["core belief", "shadow integration", "Jungian", "identity", "craving"],
    type: "Shadow Work Intervention"
  },
  {
    title: "Use the Craving as a Compass",
    content: "Athena: What if this craving is pointing toward something you've disowned or suppressed—joy, connection, freedom? Let's ask it what it wants you to reclaim.",
    follow_up: [
      "What part of your life have you been denying?",
      "What desire under this craving feels honest and human?",
      "How could you meet that desire differently?"
    ],
    tags: ["shadow work", "craving insight", "inner compass", "self-reclamation", "Jungian"],
    type: "Shadow Work Intervention"
  },
  {
    title: "Ritualize the Integration (Mini Shadow Ritual)",
    content: "Athena: Would you like to turn toward this craving instead of pushing it away? Try this: Breathe. Name the feeling. Say, 'I see you. You belong.' Sit with it. Ask: 'What do you need me to know?'",
    follow_up: [
      "What arose for you when you welcomed that part?",
      "Is there something it's been waiting a long time to tell you?"
    ],
    tags: ["integration", "ritual", "Jungian", "somatic", "emotional transformation"],
    type: "Shadow Work Intervention"
  }
];

// State mapping to insights
const MAP: Record<State, (i: Insight) => boolean> = {
  craving: (i) => /craving|symbol|shadow|compass/i.test(i.content + " " + i.tags.join(" ")),
  shame: (i) => /belong|gentle|welcome|healing|affirm/i.test(i.content),
  anger: (i) => /power|rage|shadow|energy|transform/i.test(i.content),
  grief: (i) => /grief|loss|tender|compassion/i.test(i.content),
  denial: (i) => /avoid|repression|not to feel|blind/i.test(i.content),
  "self-deception": (i) => /belief|story|mirror/i.test(i.title + i.content),
  resentment: (i) => /powerlessness|control|fantasy|justice/i.test(i.content),
  lust: (i) => /fantasy|personify|archetype|seducer/i.test(i.content),
};

export function pickInsights(state: State, n = 2): Insight[] {
  const pool = INSIGHTS.filter(MAP[state]);
  // Stable, short, varied
  return pool.sort(() => Math.random() - 0.5).slice(0, n);
}

// Tool types
export type ToolCall =
  | { name: "start_reset"; args: { type: "physiologic_sigh" | "alt_nostril" | "eft_tapping_simple" | "box_breath" | "shake_off"; durationSec: number } }
  | { name: "nudge_block"; args: { categories: string[]; hours: number } };

// Compose Athena responses
export function composeAthena(state: State, userLine: string): { text: string; followUps?: string[]; tool?: ToolCall } {
  const [a, b] = pickInsights(state, 2);
  const tool = toolFor(state);
  
  return {
    text: compact([
      "You're not alone. I'm here with you.",
      summarize(a),
      summarize(b),
      tool ? shortCallout(tool) : undefined
    ].filter(Boolean).join(" ")),
    followUps: uniq((a?.follow_up || []).concat(b?.follow_up || [])).slice(0, 3),
    tool
  };
}

function toolFor(state: State): ToolCall | undefined {
  switch (state) {
    case "craving": return { name: "start_reset", args: { type: "physiologic_sigh", durationSec: 75 } };
    case "lust": return { name: "start_reset", args: { type: "alt_nostril", durationSec: 90 } };
    case "anger": return { name: "start_reset", args: { type: "shake_off", durationSec: 45 } };
    case "shame": return { name: "start_reset", args: { type: "eft_tapping_simple", durationSec: 120 } };
    case "self-deception": return { name: "start_reset", args: { type: "box_breath", durationSec: 60 } };
    default: return undefined;
  }
}

function summarize(i: Insight | undefined) {
  if (!i) return "";
  // 1–2 sentences max; strip long clauses
  return i.content.replace(/\s+/g, ' ')
    .replace(/(^Athena:\s*)/i, '')
    .split('. ').slice(0, 2).join('. ') + '.';
}

const compact = (s: string) => s.replace(/\s{2,}/g, ' ').trim();
const uniq = (a: string[]) => Array.from(new Set(a));

function shortCallout(t: ToolCall) {
  if (t.name !== "start_reset") return "";
  const map = {
    physiologic_sigh: "Let's release the chest tightness with a 75‑second Physiologic Sigh.",
    alt_nostril: "Let's balance your nervous system with 90 seconds of Alternate Nostril.",
    shake_off: "Let's shake off the charge for 45 seconds, then re-check.",
    eft_tapping_simple: "Let's tap for 2 minutes to de-shame and reset.",
    box_breath: "Let's box breathe for one minute to get clear."
  } as const;
  return map[t.args.type];
}
