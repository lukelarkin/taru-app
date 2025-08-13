import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { logEvent } from "./store";

export async function startReset(name: string, duration_s: number) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(()=>{});
  if (name === "eft_mini") {
    router.push({ pathname: "/eft", params: { feeling: "this urge" } });
  } else {
    logEvent({ type:"reset_start", meta:{ name, duration_s } });
    router.push({ pathname: "/reset", params: { name, duration_s: String(duration_s) } });
  }
}
