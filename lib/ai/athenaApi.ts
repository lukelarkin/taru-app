// lib/ai/athenaApi.ts
import { UserCard, Moment, AthenaResponse } from "./types";
import { composeFromState } from "./composeAthena";
import { State } from "./insight-map";

function safeParse(json: string): AthenaResponse {
  try {
    return JSON.parse(json);
  } catch {
    // Minimal fallback so the UI never breaks
    return {
      message:
        "I'm here. Let's take one slow breath together—in through your nose, out through your mouth. What's one tiny action you can take in the next minute?",
      buttons: ["Physiologic sigh (2x)", "Close trigger tab", "Cold splash"],
      breath: { type: "physiologic_sigh", in: 2, hold: 0, out: 6, cycles: 2 },
      reset_script:
        "Double‑inhale through nose, long exhale—twice. Put the phone down. Walk 20 steps, return.",
      content_warning: null,
      next_prompt: "What helped even a little?"
    };
  }
}

// Simple state classification based on user message
function classifyState(userMessage: string): State {
  const message = userMessage.toLowerCase();
  
  if (/craving|want|need|urge|desire|tempted|scroll|porn|substance/i.test(message)) {
    return "craving";
  }
  if (/shame|disgusting|broken|failure|worthless|hate myself/i.test(message)) {
    return "shame";
  }
  if (/angry|rage|furious|hate|resent/i.test(message)) {
    return "anger";
  }
  if (/grief|loss|sad|depressed|hopeless/i.test(message)) {
    return "grief";
  }
  if (/deny|not me|fine|okay|ignore/i.test(message)) {
    return "denial";
  }
  if (/lie|deceive|pretend|fake/i.test(message)) {
    return "self-deception";
  }
  if (/resent|unfair|victim|blame/i.test(message)) {
    return "resentment";
  }
  if (/lust|sexual|fantasy|arouse/i.test(message)) {
    return "lust";
  }
  
  // Default to craving for most addiction-related messages
  return "craving";
}

export async function getAthenaResponse(
  userCard: UserCard,
  moment: Moment,
  userMessage: string
): Promise<AthenaResponse> {
  try {
    // Classify the user's emotional state
    const state = classifyState(userMessage);
    
    // Compose response using optimized system
    const response = composeFromState(state);
    
    // Convert to AthenaResponse format
    const athenaResponse: AthenaResponse = {
      message: response.text,
      buttons: response.followUps || ["I'll try that", "Tell me more", "Help me reset"],
      breath: response.tool ? {
        type: response.tool.type === "physiologic_sigh" ? "physiologic_sigh" : "box_breath",
        in: 2,
        hold: 0,
        out: 6,
        cycles: 2
      } : undefined,
      reset_script: response.tool ? 
        `Start ${response.tool.type} for ${response.tool.durationSec} seconds.` : "",
      content_warning: null,
      next_prompt: response.followUps?.[0] || "What helped even a little?"
    };
    
    return athenaResponse;
  } catch (error) {
    console.error("Insights API error:", error);
    return safeParse("");
  }
}
