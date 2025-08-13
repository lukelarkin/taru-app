# TARU AI Backend Deployment Guide

## Overview

TARU now uses a scenario-based AI system with a Cloudflare Worker backend. This replaces the old persona-based approach with a more sophisticated, tool-calling capable system.

## Quick Deploy

### 1. Install Dependencies
```bash
npm install zod
npm install -g wrangler
```

### 2. Set up Cloudflare Worker
```bash
# Login to Cloudflare
wrangler login

# Set your OpenAI API key
wrangler secret put OPENAI_API_KEY

# Deploy the worker
wrangler deploy
```

### 3. Update App Configuration
Update `app.json` with your worker URL:
```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_ATHENA_ENDPOINT": "https://your-worker-url.workers.dev"
    }
  }
}
```

### 4. Update Client Code
In `app/(tabs)/ai.tsx`, replace the placeholder URL:
```typescript
const response = await fetch(process.env.EXPO_PUBLIC_ATHENA_ENDPOINT!, {
  // ... rest of the code
});
```

## Testing

### Test the Worker
```bash
curl -s -X POST https://your-worker-url.workers.dev \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"I slipped this morning and feel awful."}]}'
```

Expected response:
```json
{
  "type": "athena_turn",
  "scenario": "relapse_triage",
  "state": {"intensity": 4, "risk": "high"},
  "intent": "stabilize",
  "intervention": {...},
  "ui": {"coach_text": "..."}
}
```

### Test Scenario Classification
```bash
node -r ts-node/register server/test.ts
```

## Architecture

### Scenarios
- **craving_manager**: Digital compulsion loops
- **ifs_micro**: Internal Family Systems work
- **shame_repair**: Self-compassion and identity work
- **relapse_triage**: Post-slip crisis management

### Tools (by scenario)
- **start_reset**: Trigger wellness exercises
- **nudge_block**: Activate blocking features
- **schedule_reminder**: Set future interventions
- **log_event**: Analytics tracking
- **stash_reflection**: Store insights

### Contract Validation
- Zod schema validation
- Automatic JSON repair (1 attempt)
- Tool whitelisting per scenario
- Response format enforcement

## Integration Points

### Reset Integration
When `start_reset` tool is called:
```typescript
// In ai.tsx handleToolCall
case 'start_reset':
  // Navigate to resets tab
  // Start the suggested reset timer
  // This integrates with your existing resets system
```

### Block Integration
When `nudge_block` tool is called:
```typescript
case 'nudge_block':
  // Trigger blocking functionality
  // This integrates with your block & limit system
```

## Monitoring

### Worker Logs
```bash
wrangler tail
```

### Error Handling
- Invalid JSON responses are automatically repaired
- Tool calls are validated against scenario whitelists
- Network errors return graceful fallbacks

## Security

- OpenAI API key is stored as Cloudflare secret
- CORS enabled for app domains
- Input validation and sanitization
- Rate limiting (Cloudflare default)

## Performance

- GPT-4o-mini for fast responses
- JSON response format for efficiency
- Single repair attempt to balance speed/accuracy
- Cloudflare edge caching

## Next Steps

1. **Deploy the worker** and update the endpoint URL
2. **Test the integration** with real user messages
3. **Implement tool integrations** (reset starting, blocking)
4. **Add analytics** for intervention effectiveness
5. **Optimize prompts** based on user feedback 