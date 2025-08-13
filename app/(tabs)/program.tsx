import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, StyleSheet, SafeAreaView } from "react-native";
import { getStatus, setStatus, markProgress } from "../../lib/programStore";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import cards from "../../content/curriculum.json";

type Step = { type: "checkin"|"work"|"commit"|"guide"; prompt?: string; mode?: "ifs_micro"|"reset"|"journal"; reset?: { name:string; duration_s:number }; script?: string };
type Card = { title: string; steps: Step[]; deep_session: boolean };

export default function ProgramTab() {
  const [status, setStat] = useState<{enrolled:boolean; day:number; week:number}>({enrolled:false, day:1, week:1});
  const [card, setCard] = useState<Card | null>(null);
  const moduleId = status.week === 1 && status.day === 2 ? "w1_d2" : (status.week === 1 && status.day === 1 ? "w1_d1" : "w1_deep");

  useEffect(() => { (async ()=>{
    const s = await getStatus(); setStat(s);
    const c = (cards as any)[moduleId]; setCard(c);
  })(); }, [moduleId]);

  const enroll = async () => {
    await setStatus({ enrolled: true, day: 1, week: 1 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(()=>{});
    const c = (cards as any)["w1_d1"]; setCard(c); setStat({ enrolled:true, day:1, week:1 });
  };

  const startStep = async (idx: number) => {
    if (!card) return;
    const step = card.steps[idx];
    // Route by type
    if (step.type === "work" && step.mode === "reset" && step.reset) {
      router.push({ pathname: "/reset", params: { name: step.reset.name, duration_s: String(step.reset.duration_s), module_id: moduleId, step_id: "work" }});
    } else {
      router.push({ pathname: "/session", params: { module_id: moduleId, step_idx: String(idx) }});
    }
  };

  const completeDay = async () => {
    await markProgress(moduleId, "complete");
    const next = nextStatus(status);
    await setStatus(next); setStat(next);
    Alert.alert("Nice work", "You completed Today's Plan.");
  };

  if (!status.enrolled) {
    return (
      <SafeAreaView style={S.safe}>
        <View style={S.card}>
          <Text style={S.h1}>Start the 60-Day Intensive</Text>
          <Text style={S.sub}>15 minutes a day + one 30-minute deep session each week.</Text>
          <Pressable onPress={enroll} style={({pressed})=>[S.cta, pressed && S.pressed]}>
            <Text style={S.ctaText}>Begin Day 1</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!card) return null;

  return (
    <SafeAreaView style={S.safe}>
      <View style={S.card}>
        <Text style={S.h1}>{card.title}</Text>
        {card.steps.map((s, i) => (
          <Pressable key={i} onPress={()=>startStep(i)} style={({pressed})=>[S.step, pressed && S.pressed]}>
            <Text style={S.stepTitle}>{labelFor(s)}</Text>
            <Text style={S.stepSub}>{hintFor(s)}</Text>
          </Pressable>
        ))}
        <Pressable onPress={completeDay} style={({pressed})=>[S.done, pressed && S.pressed]}>
          <Text style={S.doneText}>Mark Day Complete</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function labelFor(s: any) {
  if (s.type === "checkin") return "Check-In (2 min)";
  if (s.type === "work") return s.mode === "reset" ? "Regulation (1–2 min)" : "Deep Work (10 min)";
  if (s.type === "commit") return "Commitment (3 min)";
  if (s.type === "guide") return "Guided Deep Session (30 min)";
  return "Step";
}
function hintFor(s: any) {
  if (s.type === "checkin") return s.prompt || "Name state in 3 words";
  if (s.type === "work" && s.mode === "reset") return `${s.reset?.name} ${s.reset?.duration_s}s`;
  if (s.type === "work" && s.mode === "ifs_micro") return "Unblend a Protector; ask its job";
  if (s.type === "commit") return s.prompt || "One tiny act you'll do today";
  if (s.type === "guide") return "IFS + reflection + boundary";
  return "";
}
function nextStatus(s: {day: number; week: number}) {
  const day = s.day >= 6 ? 1 : s.day + 1;
  const week = s.day >= 6 ? s.week + 1 : s.week;
  return { enrolled: true, day, week };
}

const S = StyleSheet.create({
  safe: { flex:1, backgroundColor:"#0b0b0a", padding:16 },
  card: { backgroundColor:"#121210", borderRadius:16, padding:16, borderWidth:1, borderColor:"#23231e", gap:12 },
  h1: { color:"white", fontSize:20, fontWeight:"700" },
  sub: { color:"white", opacity:0.7 },
  cta: { backgroundColor:"#1a1a16", borderRadius:12, padding:12, borderWidth:1, borderColor:"#262622", alignItems:"center" },
  ctaText: { color:"white", fontSize:16, fontWeight:"600" },
  step: { backgroundColor:"#10100e", borderRadius:12, padding:12, borderWidth:1, borderColor:"#21211d" },
  stepTitle: { color:"white", fontSize:16, fontWeight:"600" },
  stepSub: { color:"white", opacity:0.6, marginTop:4, fontSize:12 },
  done: { marginTop:8, backgroundColor:"#1a1a16", borderRadius:12, padding:12, alignItems:"center", borderWidth:1, borderColor:"#262622" },
  doneText: { color:"white", fontSize:16, fontWeight:"600" },
  pressed: { transform:[{scale:0.98}], opacity:0.9 }
});
