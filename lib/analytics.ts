// lib/analytics.ts
export type EmotionalState =
  | "resentment" | "shame" | "craving" | "anger" | "grief" | "denial" | "self-deception" | "lust";

export type TriggerType =
  | "manual"         // user opened app intentionally
  | "keyword"        // from Block sheet keyword trigger
  | "time"           // time-based limit
  | "panic"          // panic button
  | "unknown";

export type ResetType = "nostril" | "sigh" | "eft" | "box" | "shake" | "cold" | "shadow";
export type OutcomeRating = 1 | 2 | 3 | 4 | 5;

export type EventBase = {
  id?: string;              // uuid set by storage
  user_id?: string | null;  // optional until auth exists
  ts: number;               // ms epoch
};

export type TriggerEvent = EventBase & {
  type: "trigger";
  trigger: TriggerType;
  emotional_state?: EmotionalState | null;
  context?: string | null;     // free text (e.g., user note)
};

export type ResetStartEvent = EventBase & {
  type: "reset_start";
  reset: ResetType;
  from_trigger_id?: string | null; // chain to previous trigger
};

export type ResetCompleteEvent = EventBase & {
  type: "reset_complete";
  reset: ResetType;
  duration_sec: number;         // elapsed seconds
  outcome?: OutcomeRating | null; // post-check 1–5
  from_start_id?: string | null;  // chain to start
};

export type AIMessageEvent = EventBase & {
  type: "ai_message";
  emotional_state: EmotionalState;
  input_len: number;
  model?: string | null;        // e.g. "gpt-4o-mini"
  response_len?: number | null;
};

export type AnalyticsEvent =
  | TriggerEvent
  | ResetStartEvent
  | ResetCompleteEvent
  | AIMessageEvent;

// Public API
export interface Analytics {
  log(e: Omit<AnalyticsEvent, "ts" | "id">): Promise<string>; // returns event id
  recent(limit?: number): Promise<AnalyticsEvent[]>;
  link(fromId: string, toId: string): Promise<void>; // optional graph edge
  resetAll(): Promise<void>; // wipe local (dev only)
}

export { getAnalytics } from "../features/analytics/storage"; // concrete impl 