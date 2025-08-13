// lib/aiClient.ts
const AI_URL = process.env.EXPO_PUBLIC_AI_URL!;

export type Role = "user" | "assistant" | "system";

export async function athenaTurn({
  messages,
  prevScenario
}: {
  messages: { role: Role; content: string }[];
  prevScenario?: "craving_manager"|"ifs_micro"|"shame_repair"|"relapse_triage";
}) {
  const r = await fetch(AI_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages, prevScenario })
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json(); // returns athena_turn JSON
} 