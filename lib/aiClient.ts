// lib/aiClient.ts
export type Role = "user" | "assistant" | "system";

type Scenario = "craving_manager" | "ifs_micro" | "shame_repair" | "relapse_triage";

// Simple system prompts for each scenario
const SCENARIO_PROMPTS = {
  craving_manager: `You are Athena, a compassionate recovery coach specializing in craving management. 
  Help users ride out urges with gentle guidance, breathing techniques, and distraction strategies. 
  Keep responses brief (2-3 sentences) and actionable.`,
  
  ifs_micro: `You are Athena, an Internal Family Systems (IFS) guide. 
  Help users unblend from protective parts with gentle curiosity and compassion. 
  Ask simple questions to help them identify and understand their parts.`,
  
  shame_repair: `You are Athena, a shame repair specialist. 
  Help users recognize shame, separate it from their core self, and practice self-compassion. 
  Use gentle, validating language and offer concrete self-care steps.`,
  
  relapse_triage: `You are Athena, a relapse recovery specialist. 
  Normalize setbacks, help users learn from the experience, and create a plan for moving forward. 
  Focus on self-compassion and practical next steps.`
};

export async function athenaTurn({
  messages,
  prevScenario
}: {
  messages: { role: Role; content: string }[];
  prevScenario?: Scenario;
}) {
  try {
    // For now, use a simple response system until we connect OpenAI
    const lastMessage = messages[messages.length - 1];
    const scenario = prevScenario || "craving_manager";
    
    // Simple response logic based on scenario
    const responses = {
      craving_manager: [
        "I see that urge is here. Let's take a deep breath together - in through your nose, out through your mouth. This wave will pass.",
        "That craving is just a part of you trying to protect you from discomfort. Can you thank it for its concern, then choose something else?",
        "Right now, you have a choice. What's one tiny act of self-care you can do instead?"
      ],
      ifs_micro: [
        "I notice a part of you is really activated right now. Can you describe what it's trying to protect you from?",
        "That part has been working so hard to keep you safe. What would it need to feel heard and understood?",
        "Let's thank this protector for its service, then ask if it's willing to step back for a moment."
      ],
      shame_repair: [
        "You're carrying so much that isn't yours to carry. Can you put down that burden for just this moment?",
        "Shame is a liar. The truth is, you're doing the best you can with what you have right now.",
        "What would you say to a dear friend who was feeling this way? Can you offer yourself that same kindness?"
      ],
      relapse_triage: [
        "Setbacks are part of recovery, not the end of it. What did you learn about your triggers this time?",
        "You're still here, still trying. That's what matters. What's one small step you can take right now?",
        "Recovery isn't linear. Every day is a new opportunity to choose differently."
      ]
    };

    const scenarioResponses = responses[scenario];
    const randomResponse = scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];

    return {
      scenario,
      intent: "support",
      ui: {
        coach_text: randomResponse,
        quick_replies: [
          "I need more help",
          "Thank you",
          "What's next?",
          "I'm struggling"
        ]
      },
      tool_calls: []
    };

  } catch (error) {
    console.error('AI error:', error);
    return {
      scenario: "craving_manager",
      intent: "error",
      ui: {
        coach_text: "I'm having trouble connecting right now. Let's do a quick breathing exercise: 4 counts in, 6 counts out. Repeat 3 times.",
        quick_replies: ["Try again", "I'll breathe", "Help me reset"]
      },
      tool_calls: []
    };
  }
} 