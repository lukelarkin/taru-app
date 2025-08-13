import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, Alert } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { logEvent } from "../lib/store";
import { startReset } from "../lib/resets";

type Scenario = "craving_manager" | "ifs_micro" | "shame_repair" | "relapse_triage";

export default function Home() {
  const goAI = useCallback((scenario: Scenario) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(()=>{});
    logEvent({ type: "funnel_tap", meta: { dest: "ai", scenario } });
    router.push({ pathname: "/(tabs)/ai", params: { scenarioOverride: scenario } });
  }, []);

  const quickCalm = useCallback(async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(()=>{});
      logEvent({ type: "funnel_tap", meta: { dest: "reset", name: "physiologic_sigh" } });
      await startReset("physiologic_sigh", 75);
    } catch (e: any) {
      Alert.alert("Couldn't start reset", "Try the Resets tab while we sort this.");
    }
  }, []);

  const goResets = () => { logEvent({ type:"nav", meta:{ dest:"resets" } }); router.push("/(tabs)/resets"); };
  const goBlock  = () => { logEvent({ type:"nav", meta:{ dest:"block" }  }); router.push("/(tabs)/block"); };
  const goDiag   = () => { logEvent({ type:"nav", meta:{ dest:"diagnostics" } }); router.push("/diagnostics"); };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Top: Big Calm Button */}
        <Pressable
          onPress={quickCalm}
          style={({ pressed }) => [styles.calmCard, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Calm now"
          accessibilityHint="Starts a 60–90 second breathing reset"
        >
          <Text style={styles.calmTitle}>Calm Now</Text>
          <Text style={styles.calmSub}>60–90s physiologic sigh</Text>
        </Pressable>

        {/* What do you need? */}
        <Text style={styles.sectionTitle}>What do you need right now?</Text>

        <View style={styles.grid}>
          <Tile title="Craving" subtitle="Stop the urge fast" onPress={()=>goAI("craving_manager")} />
          <Tile title="IFS" subtitle="Unblend with a Part" onPress={()=>goAI("ifs_micro")} />
          <Tile title="Shame Spiral" subtitle="Compassion + next step" onPress={()=>goAI("shame_repair")} />
          <Tile title="After a Slip" subtitle="Normalize + plan" onPress={()=>goAI("relapse_triage")} />
        </View>

        {/* 60-Day Intensive */}
        <Text style={styles.sectionTitle}>Deep Work</Text>
        <Pressable
          onPress={() => { logEvent({ type:"nav", meta:{ dest:"program" } }); router.push("/(tabs)/program"); }}
          style={({ pressed }) => [styles.programCard, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Start 60-Day Intensive"
          accessibilityHint="Begin the structured recovery program"
        >
          <Text style={styles.programTitle}>Start 60-Day Intensive</Text>
          <Text style={styles.programSub}>15 min daily + weekly deep sessions</Text>
        </Pressable>

        {/* Shortcuts */}
        <Text style={styles.sectionTitle}>Shortcuts</Text>
        <View style={styles.row}>
          <Shortcut label="Resets" onPress={goResets} />
          <Shortcut label="Program" onPress={() => { logEvent({ type:"nav", meta:{ dest:"program" } }); router.push("/(tabs)/program"); }} />
          <Shortcut label="Blocking" onPress={goBlock} />
        </View>

        {/* Footer hint */}
        <Text style={styles.hint}>
          Tip: You can switch scenarios in chat anytime.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Tile({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
    >
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSub}>{subtitle}</Text>
    </Pressable>
  );
}

function Shortcut({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.shortcutText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0a" },
  container: { flex: 1, padding: 16, gap: 12 },
  sectionTitle: { color: "white", fontSize: 16, opacity: 0.9, marginTop: 8, marginBottom: 4 },
  hint: { color: "white", opacity: 0.5, marginTop: 8 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },

  calmCard: {
    backgroundColor: "#1a1a16",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#262622"
  },
  calmTitle: { color: "white", fontSize: 22, fontWeight: "700" },
  calmSub: { color: "white", opacity: 0.6, marginTop: 4 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  tile: {
    width: "47%",
    backgroundColor: "#121210",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#23231e"
  },
  tileTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  tileSub: { color: "white", opacity: 0.6, marginTop: 4, fontSize: 12 },

  row: { flexDirection: "row", gap: 12, marginTop: 8 },
  shortcut: {
    flex: 1,
    backgroundColor: "#10100e",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21211d"
  },
  shortcutText: { color: "white", fontSize: 14, fontWeight: "600" },
  
  programCard: {
    backgroundColor: "#1a1a16",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#262622"
  },
  programTitle: { color: "white", fontSize: 18, fontWeight: "700" },
  programSub: { color: "white", opacity: 0.6, marginTop: 4 }
}); 