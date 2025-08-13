// server/tools.ts
import type { Scenario } from "./contract";

export const TOOLSETS: Record<Scenario, ReadonlyArray<string>> = {
  craving_manager:   ["start_reset","nudge_block","schedule_reminder","log_event"],
  ifs_micro:         ["stash_reflection","log_event","start_reset"],
  shame_repair:      ["stash_reflection","start_reset","schedule_reminder","log_event"],
  relapse_triage:    ["nudge_block","schedule_reminder","stash_reflection","log_event"]
};

// (Optional) expose JSON Schemas if/when you use tool-calling.
// For now we only need the names in the response contract. 