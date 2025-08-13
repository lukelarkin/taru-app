import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import eft from "../content/eft.json";
import { logEvent } from "../lib/store";
import { router, useLocalSearchParams } from "expo-router";

type Point = { id: string; label: string };

enum Phase { Intro="intro", Setup="setup", Round="round", Check="check", Done="done" }

export default function EFT() {
  const p = useLocalSearchParams<{ feeling?: string; slow?: string }>();
  const [phase, setPhase] = useState<Phase>(Phase.Intro);
  const [feeling, setFeeling] = useState(p.feeling || "this urge");
  const [slow, setSlow] = useState(p.slow === "1");
  const [sudBefore, setSudBefore] = useState<number | null>(null);
  const [sudAfter, setSudAfter] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const points = eft.points as Point[];
  const perPoint = slow ? Math.round(Number(eft.per_point_ms) * 1.5) : Number(eft.per_point_ms);
  const setupMs = slow ? Math.round(Number(eft.setup_ms) * 1.3) : Number(eft.setup_ms);

  useEffect(()=> ()=> { if (timerRef.current) clearTimeout(timerRef.current); Speech.stop(); }, []);

  function speak(line: string) {
    try { Speech.speak(line, { rate: 1.0, pitch: 1.0 }); } catch {}
  }

  async function startSetup() {
    setPhase(Phase.Setup);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(()=>{});
    const script = eft.setup_lines.map((l:string)=>l.replace("{feeling}", feeling)).join(" ");
    speak("Karate Chop. " + script);
    setTimeout(()=> startRound(1), setupMs);
  }

  function tickPoint(r: number, i: number) {
    setIdx(i);
    const point = points[i];
    Haptics.selectionAsync().catch(()=>{});
    const truth = eft.truth_lines[(i + r) % eft.truth_lines.length];
    speak(`${point.label}. ${truth}`);
    if (i < points.length - 1) {
      timerRef.current = setTimeout(()=> tickPoint(r, i+1), perPoint) as any;
    } else {
      // next round or check
      if (r < Number(eft.rounds)) {
        setRound(r+1);
        timerRef.current = setTimeout(()=> { tickPoint(r+1, 0); }, 1200) as any;
      } else {
        timerRef.current = setTimeout(()=> finishRounds(), 800) as any;
      }
    }
  }

  function startRound(r: number) {
    setPhase(Phase.Round);
    setRound(r); setIdx(0); setRunning(true);
    tickPoint(r, 0);
  }

  function finishRounds() {
    setRunning(false);
    setPhase(Phase.Check);
  }

  function stopAll() {
    if (timerRef.current) clearTimeout(timerRef.current);
    Speech.stop();
    setRunning(false);
  }

  async function onComplete() {
    await logEvent({
      type: "reset_done",
      meta: { name: "eft_mini", sud_before: sudBefore, sud_after: sudAfter, slow }
    });
    setPhase(Phase.Done);
  }

  function Header() {
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={S.h1}>EFT Mini (≈{Math.round((setupMs + perPoint*points.length*Number(eft.rounds))/1000)}s)</Text>
        <Text style={S.sub}>Tap gently on each point while repeating short truth lines.</Text>
      </View>
    );
  }

  function SudPicker({ value, onChange }: { value: number | null; onChange: (n:number)=>void }) {
    return (
      <View style={{ flexDirection:"row", flexWrap:"wrap", gap:8 }}>
        {[0,1,2,3,4,5,6,7,8,9,10].map(n=>(
          <Pressable key={n} onPress={()=>onChange(n)} style={[S.sud, value===n && S.sudActive]}>
            <Text style={{ color:"white" }}>{n}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  // RENDER
  return (
    <SafeAreaView style={S.safe}>
      <Header />

      {phase === Phase.Intro && (
        <View style={S.card}>
          {eft.intro.map((line:string, i:number)=>(
            <Text key={i} style={S.li}>• {line}</Text>
          ))}
          <Text style={[S.sub, { marginTop: 12 }]}>What are we tapping on?</Text>
          <TextInput
            placeholder='e.g., "this urge", "shame", "tight chest"'
            placeholderTextColor="#888"
            value={feeling}
            onChangeText={setFeeling}
            style={S.input}
          />
          <View style={{ flexDirection:"row", gap:8 }}>
            <Pressable onPress={()=>{ setSlow(false); startSetup(); }} style={S.cta}><Text style={S.ctaText}>Start (90s)</Text></Pressable>
            <Pressable onPress={()=>{ setSlow(true); startSetup(); }} style={S.ghost}><Text style={S.ghostText}>Slow (2 min)</Text></Pressable>
          </View>
        </View>
      )}

      {phase === Phase.Setup && (
        <View style={S.card}>
          <Text style={S.title}>Karate Chop</Text>
          <Text style={S.body}>Tap side of hand. Repeat:</Text>
          {eft.setup_lines.map((l:string, i:number)=>(
            <Text key={i} style={S.quote}>"{l.replace("{feeling}", feeling)}"</Text>
          ))}
          <Text style={[S.sub, {marginTop:8}]}>We'll switch to points in a few seconds…</Text>
          <Pressable onPress={()=> startRound(1)} style={[S.ghost, {marginTop:8}]}><Text style={S.ghostText}>Skip</Text></Pressable>
        </View>
      )}

      {phase === Phase.Round && (
        <View style={S.card}>
          <Text style={S.title}>Round {round} • {points[idx].label}</Text>
          <Text style={S.body}>Tap 6–8 times; breathe naturally.</Text>
          <View style={{ flexDirection:"row", gap:8, marginTop:8 }}>
            <Pressable onPress={()=>{ stopAll(); setPhase(Phase.Check); }} style={S.ghost}><Text style={S.ghostText}>Finish</Text></Pressable>
            <Pressable onPress={()=>{ stopAll(); startRound(round); }} style={S.ghost}><Text style={S.ghostText}>Repeat Point</Text></Pressable>
          </View>
        </View>
      )}

      {phase === Phase.Check && (
        <View style={S.card}>
          {sudBefore === null ? (
            <>
              <Text style={S.title}>Before we started—rate the intensity (0–10):</Text>
              <SudPicker value={sudBefore} onChange={setSudBefore}/>
            </>
          ) : sudAfter === null ? (
            <>
              <Text style={S.title}>Now—what's the intensity (0–10)?</Text>
              <SudPicker value={sudAfter} onChange={setSudAfter}/>
            </>
          ) : (
            <>
              <Text style={S.title}>Nice work.</Text>
              <Text style={S.body}>Change: {sudBefore} → {sudAfter}. Want one next step?</Text>
              <View style={{ flexDirection:"row", gap:8, marginTop:8, flexWrap:"wrap" }}>
                <Pressable onPress={()=> router.push({ pathname:"/reset", params:{ name:"physiologic_sigh", duration_s:"60" }})} style={S.cta}><Text style={S.ctaText}>Do a 60s Sigh</Text></Pressable>
                <Pressable onPress={()=> router.push("/(tabs)/block")} style={S.ghost}><Text style={S.ghostText}>Shield for 24h</Text></Pressable>
                <Pressable onPress={()=> router.push({ pathname:"/(tabs)/ai", params:{ scenarioOverride:"ifs_micro" }})} style={S.ghost}><Text style={S.ghostText}>Continue IFS</Text></Pressable>
              </View>
              <Pressable onPress={onComplete} style={[S.cta, { marginTop: 12 }]}><Text style={S.ctaText}>Finish</Text></Pressable>
            </>
          )}
        </View>
      )}

      {phase === Phase.Done && (
        <View style={S.card}>
          <Text style={S.title}>Saved.</Text>
          <Text style={S.body}>Proud of you for doing the work.</Text>
          <Pressable onPress={()=> router.back()} style={[S.cta, {marginTop:8}]}><Text style={S.ctaText}>Back</Text></Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe:{ flex:1, backgroundColor:"#0b0b0a", padding:16 },
  h1:{ color:"white", fontSize:20, fontWeight:"700", marginBottom:4 },
  sub:{ color:"rgba(255,255,255,0.7)" },
  card:{ backgroundColor:"#121210", borderRadius:16, padding:16, borderWidth:1, borderColor:"#23231e", marginTop:8 },
  li:{ color:"white", marginBottom:6 },
  title:{ color:"white", fontSize:18, fontWeight:"700" },
  body:{ color:"white", opacity:0.9, marginTop:6 },
  quote:{ color:"rgba(255,255,255,0.9)", fontStyle:"italic", marginTop:6 },
  input:{ backgroundColor:"#0f0f0c", color:"white", borderRadius:12, padding:10, borderWidth:1, borderColor:"#21211d", marginTop:10 },
  cta:{ backgroundColor:"#1a1a16", paddingVertical:10, paddingHorizontal:14, borderRadius:12, borderWidth:1, borderColor:"#262622", alignItems:"center" },
  ctaText:{ color:"white", fontWeight:"600" },
  ghost:{ backgroundColor:"#10100e", paddingVertical:10, paddingHorizontal:14, borderRadius:12, borderWidth:1, borderColor:"#21211d" },
  ghostText:{ color:"white", fontWeight:"600", opacity:0.9 },
  sud:{ backgroundColor:"#10100e", paddingVertical:8, paddingHorizontal:12, borderRadius:10, borderWidth:1, borderColor:"#21211d" },
  sudActive:{ backgroundColor:"#1e293b", borderColor:"#334155" }
});
