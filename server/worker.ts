// server/worker.ts
export interface Env {
  OPENAI_API_KEY: string;
}

import { AthenaTurn, Scenario } from "./contract";
import { classifyScenario, GLOBAL_POLICY, POLICY_BY_SCENARIO } from "./router";
import { TOOLSETS } from "./tools";

// -------- util
async function openaiJson(system: string, userMessages: any[], apiKey: string): Promise<string> {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",               // fast and cheap; upgrade if needed
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        ...userMessages
      ]
    })
  });
  if (!r.ok) throw new Error(await r.text());
  const data = await r.json();
  const text: string = data.choices?.[0]?.message?.content ?? "{}";
  return text;
}

function buildSystem(s: Scenario) {
  return `${GLOBAL_POLICY}\n\n[Scenario:${s}]\n${POLICY_BY_SCENARIO[s]}\n\nJSON contract keys: type, scenario, state{intensity,risk,trigger_guess?}, intent, intervention{suggested_reset{ name, duration_s }?, micro_action?, script_lines?}, tool_calls[{tool,args}]?, ui{coach_text,cta_primary?,cta_secondary?}, log{labels?,confidence?}. Only use allowed tools for this scenario.`;
}

// -------- Worker
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "content-type, authorization",
          "access-control-allow-methods": "POST, OPTIONS"
        }
      });
    }
    if (req.method !== "POST")
      return new Response("Method Not Allowed", { status: 405 });

    let body: any;
    try { body = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }

    // Client can optionally pass prevScenario to keep continuity
    const { messages = [], scenario: clientScenario, prevScenario } = body || {};
    if (!Array.isArray(messages)) return new Response("messages[] required", { status: 400 });

    // Decide scenario
    const userText = (messages[messages.length - 1]?.content ?? "") as string;
    const scenario: Scenario = clientScenario || classifyScenario(userText, prevScenario);

    // Advertise allowed tool names in the system (model must obey)
    const allowed = TOOLSETS[scenario];
    const toolsBanner = `Allowed tools for ${scenario}: ${allowed.join(", ")}. Do not reference other tools.`;

    // 1st attempt
    const system = `${buildSystem(scenario)}\n${toolsBanner}`;
    let raw = await openaiJson(system, messages, env.OPENAI_API_KEY);

    // Validate & repair loop (max 1 repair)
    const tryParse = (txt: string) => {
      try {
        const j = JSON.parse(txt);
        const parsed = AthenaTurn.parse(j);
        // Enforce tool whitelist server-side
        if (parsed.tool_calls?.some((tc: { tool: string }) => !allowed.includes(tc.tool))) {
          parsed.tool_calls = parsed.tool_calls?.filter((tc: { tool: string }) => allowed.includes(tc.tool));
        }
        return parsed;
      } catch (e) { return null; }
    };

    let parsed = tryParse(raw);

    if (!parsed) {
      const repairMessages = [
        ...messages,
        { role: "assistant", content: raw },
        { role: "system", content: "Your previous message was not valid JSON per the schema. Reply again with ONLY a valid JSON object conforming exactly to the contract—no prose." }
      ];
      raw = await openaiJson(system, repairMessages, env.OPENAI_API_KEY);
      parsed = tryParse(raw);
    }

    if (!parsed) {
      return new Response(JSON.stringify({
        type: "athena_error",
        message: "Model failed to produce valid JSON after repair."
      }), {
        status: 502,
        headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
      });
    }

    // Return validated contract
    return new Response(JSON.stringify(parsed), {
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
    });
  }
}; 