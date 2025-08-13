// server/contract.ts
import { z } from "zod";

export const Scenario = z.enum([
  "craving_manager",
  "ifs_micro",
  "shame_repair",
  "relapse_triage",
]);
export type Scenario = z.infer<typeof Scenario>;

export const AthenaTurn = z.object({
  type: z.literal("athena_turn"),
  scenario: Scenario,
  state: z.object({
    intensity: z.number().int().min(1).max(5),
    risk: z.enum(["low","med","high"]),
    trigger_guess: z.string().optional(),
  }),
  intent: z.enum(["stabilize","explore","plan","reinforce"]),
  intervention: z.object({
    suggested_reset: z.object({
      name: z.enum(["physiologic_sigh","alt_nostril","eft_mini","shake_off","box_breath","cold_splash"]),
      duration_s: z.number().int().min(20).max(120)
    }).optional(),
    micro_action: z.string().optional(),
    script_lines: z.array(z.string()).max(6).optional()
  }),
  tool_calls: z.array(z.object({
    tool: z.enum(["start_reset","nudge_block","schedule_reminder","log_event","stash_reflection"]),
    args: z.record(z.string(), z.any())
  })).optional(),
  ui: z.object({
    coach_text: z.string().max(800),     // hard cap for safety
    cta_primary: z.string().optional(),
    cta_secondary: z.string().optional()
  }),
  log: z.object({
    labels: z.array(z.string()).optional(),
    confidence: z.number().min(0).max(1).optional()
  }).optional()
});
export type AthenaTurn = z.infer<typeof AthenaTurn>; 