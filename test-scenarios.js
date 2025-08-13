const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const url = process.env.AI_URL; // set AI_URL before running

const cases = [
  ["craving", "It's 11pm and I'm about to scroll porn again."],
  ["ifs", "A part of me wants to sabotage my progress."],
  ["shame", "I feel disgusting and like a failure."],
  ["relapse", "I relapsed this morning and I'm spiraling."]
];

(async () => {
  for (const [name, content] of cases) {
    const r = await fetch(url, {
      method: "POST",
      headers: {'content-type':'application/json'},
      body: JSON.stringify({ messages:[{role:"user", content}] })
    });
    const j = await r.json();
    const ok = j?.type === "athena_turn" && !!j?.scenario && !!j?.ui?.coach_text;
    console.log(`${name.padEnd(7)} | ${ok ? "OK" : "FAIL"} | scenario=${j?.scenario} | tools=${(j?.tool_calls||[]).map(t=>t.tool).join(",")}`);
  }
})().catch(e=>{ console.error(e); process.exit(1); }); 