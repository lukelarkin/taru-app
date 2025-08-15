// lib/ai/types.ts
export type EmotionalState =
  | "craving" | "shame" | "anger" | "grief"
  | "resentment" | "denial" | "self-deception" | "lust";

export type Archetype = "Stoic" | "Coach" | "BigBrother" | "Monk";

export interface UserCard {
  userId: string;
  firstName?: string;
  archetype: Archetype;
  daysStreak?: number;
  recentTriggers?: string[];
  supportContact?: string | null;
}

export interface Moment {
  state: EmotionalState;
  timebox: number;          // seconds user says they have (e.g., 60)
  contextNote?: string;
  attemptedBypass?: boolean;
}

export interface AthenaResponse {
  message: string;
  buttons?: string[];
  breath?: {
    type: "physiologic_sigh" | "alt_nostril" | "box" | "none";
    in: number;
    hold: number;
    out: number;
    cycles: number;
  };
  reset_script?: string;
  content_warning?: string | null;
  next_prompt?: string;
}

export type Insight = {
  title: string;
  content: string;
  tags: string[];          // e.g., ["Jungian","shadow work","craving"]
  type?: "Jungian Insight" | "Shadow Work Intervention";
  follow_up?: string[];    // optional questions
};

export type State =
  | "craving" | "shame" | "anger" | "grief"
  | "denial" | "self-deception" | "resentment" | "lust";
