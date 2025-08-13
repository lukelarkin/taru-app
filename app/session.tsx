import React, { useMemo } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import cards from "../content/curriculum.json";
import { markProgress } from "../lib/programStore";
import { athenaTurn } from "../lib/aiClient";

export default function Session() {
  const { module_id, step_idx } = useLocalSearchParams<{module_id:string; step_idx:string}>();
  const card: any = (cards as any)[module_id!];
  const step = card?.steps?.[Number(step_idx!)] || null;
  const [text, setText] = React.useState("");

  if (!step) return null;

  async function complete() {
    await markProgress(module_id!, step.type);
    Alert.alert("Saved", "Step marked complete");
  }

  async function run() {
    // Route by mode
    if (step.mode === "reset" && step.reset) {
      // For now, just navigate to resets tab
      // TODO: Implement startReset function
      Alert.alert("Reset", `Would start ${step.reset.name} for ${step.reset.duration_s}s`);
    } else if (step.mode === "ifs_micro") {
      const userMsg = { role:"user", content: "Guide me through this step: " + (step.script || "") };
      // Navigate to AI with IFS scenario
      // TODO: Implement proper routing
      Alert.alert("IFS Guide", "Would open AI with IFS scenario");
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={S.safe}>
      <View style={S.card}>
        <Text style={S.h1}>{card?.title}</Text>
        <Text style={S.sub}>{labelFor(step)}</Text>

        {step.prompt ? (
          <>
            <Text style={S.prompt}>{step.prompt}</Text>
            <TextInput
              placeholder="Type a brief note…"
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
              style={S.input}
              multiline
            />
          </>
        ) : null}

        <View style={{ flexDirection:"row", gap:8 }}>
          {step.mode ? (
            <Pressable onPress={run} style={({pressed})=>[S.btn, pressed && S.pressed]}>
              <Text style={S.btnText}>{actionFor(step)}</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={complete} style={({pressed})=>[S.btnGhost, pressed && S.pressed]}>
            <Text style={S.btnGhostText}>Mark Complete</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function labelFor(s: any) {
  if (s.type === "checkin") return "Check-In";
  if (s.type === "work") return "Deep Work";
  if (s.type === "commit") return "Commitment";
  if (s.type === "guide") return "Guided Deep Session";
  return "Step";
}
function actionFor(s: any) {
  if (s.mode === "reset") return "Start Reset";
  if (s.mode === "ifs_micro") return "Open IFS Guide";
  if (s.mode === "journal") return "Write Reflection";
  return "Continue";
}

const S = StyleSheet.create({
  safe: { flex:1, backgroundColor:"#0b0b0a", padding:16 },
  card: { backgroundColor:"#121210", borderRadius:16, padding:16, borderWidth:1, borderColor:"#23231e", gap:12, flex:1 },
  h1: { color:"white", fontSize:20, fontWeight:"700" },
  sub: { color:"white", opacity:0.7 },
  prompt: { color:"white", opacity:0.8 },
  input: { backgroundColor:"#0f0f0c", color:"white", borderRadius:12, padding:12, minHeight:120, borderWidth:1, borderColor:"#21211d" },
  btn: { backgroundColor:"#1a1a16", padding:12, borderRadius:12, borderWidth:1, borderColor:"#262622" },
  btnText: { color:"white", fontWeight:"600" },
  btnGhost: { backgroundColor:"#10100e", padding:12, borderRadius:12, borderWidth:1, borderColor:"#21211d" },
  btnGhostText: { color:"white", fontWeight:"600", opacity:0.9 },
  pressed: { transform:[{scale:0.98}], opacity:0.9 }
});
