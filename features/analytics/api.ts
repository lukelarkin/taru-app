// features/analytics/api.ts
import { getAnalytics } from "./storage";
import type {
  EmotionalState, TriggerType, ResetType, OutcomeRating
} from "../../lib/analytics";

const A = getAnalytics();

/** Start a DAG chain with a trigger event. Returns triggerId. */
export async function logTrigger(params: {
  trigger: TriggerType;
  emotional_state?: EmotionalState | null;
  context?: string | null;
}) {
  return A.log({ type: "trigger", ...params });
}

/** When user starts a reset, link to the trigger if you have it. */
export async function logResetStart(params: {
  reset: ResetType;
  from_trigger_id?: string | null;
}) {
  return A.log({ type: "reset_start", ...params });
}

/** When user finishes a reset, include outcome rating. */
export async function logResetComplete(params: {
  reset: ResetType;
  duration_sec: number;
  outcome?: OutcomeRating | null;
  from_start_id?: string | null;
}) {
  return A.log({ type: "reset_complete", ...params });
}

/** When AI responds (or user sends message). */
export async function logAIMessage(params: {
  emotional_state: EmotionalState;
  input_len: number;
  model?: string | null;
  response_len?: number | null;
}) {
  return A.log({ type: "ai_message", ...params });
}

/** Dev helper */
export async function recentEvents(limit = 50) {
  return A.recent(limit);
} 