# TARU — Athena (Scenario) Deployment

## 0) Prereqs
- Node 18+
- `wrangler` installed: `npm i -g wrangler`
- OpenAI key on hand

## 1) Secrets & Deploy
```bash
wrangler secret put OPENAI_API_KEY
wrangler deploy
```

## 2) Sanity curl
```bash
curl -s -X POST https://<worker>.workers.dev \
 -H 'content-type: application/json' \
 -d '{"messages":[{"role":"user","content":"It\'s 11pm and I\'m about to scroll again."}]}'
```

# Expect: JSON with scenario:"craving_manager" and a start_reset tool.

## 3) Point the app
`.env` -> `EXPO_PUBLIC_AI_URL="https://<worker>.workers.dev"`
Kill & restart Expo.

## 4) Smoke test on device
- **Airplane mode**: AI tab shows friendly error, resets still work.
- **Online**: 4 scenario prompts return valid JSON and CTAs render.
- **start_reset** auto-opens your timer (or logs if timer not wired).

## 5) Rollback
- Flip `.env` to backup worker or local server.
- Feature flag to disable tool execution: `EXPO_PUBLIC_TOOLS_ENABLED=false`

## 6) Final QA Script
Use these four texts in the app:

* **Craving Manager:** "It's 11pm and I'm about to scroll again."
  Expect: `scenario=craving_manager`, CTA "Start 60-second Sigh", tool `start_reset`.
* **IFS Micro-Guide:** "A part of me wants to sabotage my progress."
  Expect: `scenario=ifs_micro`, <4 short questions, no block tool.
* **Shame Repair:** "I feel disgusting and broken."
  Expect: `scenario=shame_repair`, an EFT truth line + micro-commitment.
* **Relapse Triage:** "I relapsed this morning."
  Expect: `scenario=relapse_triage`, `nudge_block` or reminder + 4-hour plan.

## 7) Definition of Done (today)
* ✅ Worker deployed; curl returns valid `athena_turn` for all 4 prompts.
* ✅ App uses JSON endpoint; `ui.coach_text` renders.
* ✅ Tools fire without crashing; if permissions missing, UX continues.
* ✅ Block stub authorized; `blockDomains(['pornhub.com'])` doesn't crash.
* ✅ Events stored locally for future analytics. 