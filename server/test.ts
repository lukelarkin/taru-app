// server/test.ts
import { Scenario, AthenaTurn } from './contract.js';
import { classifyScenario } from './router.js';

// Test scenario classification
console.log('Testing scenario classification:');
console.log('"I feel like scrolling" ->', classifyScenario('I feel like scrolling'));
console.log('"I slipped this morning" ->', classifyScenario('I slipped this morning'));
console.log('"A part of me wants to" ->', classifyScenario('A part of me wants to'));
console.log('"I\'m a failure" ->', classifyScenario('I\'m a failure'));

// Test contract validation
const validTurn: AthenaTurn = {
  type: 'athena_turn',
  scenario: 'craving_manager',
  state: {
    intensity: 3,
    risk: 'med',
    trigger_guess: 'late night boredom'
  },
  intent: 'stabilize',
  intervention: {
    suggested_reset: {
      name: 'physiologic_sigh',
      duration_s: 60
    },
    micro_action: 'Stand up and change posture'
  },
  tool_calls: [
    {
      tool: 'start_reset',
      args: { name: 'physiologic_sigh', duration_s: 60 }
    }
  ],
  ui: {
    coach_text: 'I see you\'re feeling the urge to scroll. Let\'s take a moment to reset your nervous system with a simple breathing exercise.',
    cta_primary: 'Start 60-second Sigh'
  },
  log: {
    labels: ['session', 'reset_proposed'],
    confidence: 0.85
  }
};

console.log('\nValid turn structure:', JSON.stringify(validTurn, null, 2)); 