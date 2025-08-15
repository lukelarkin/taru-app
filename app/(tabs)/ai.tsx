import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, Alert, StyleSheet, SafeAreaView } from "react-native";
import { getAthenaResponse } from "../../lib/ai/athenaApi";
import { UserCard, Moment, EmotionalState } from "../../lib/ai/types";
import Bubble from "../../components/ChatBubble";
import QuickReplies from "../../components/QuickReplies";
import prompts from "../../content/quickPrompts.json";
import { useLocalSearchParams } from "expo-router";
import { logEvent } from "../../lib/store";

type Scenario = "craving_manager"|"ifs_micro"|"shame_repair"|"relapse_triage";

const MAX_MSG = 40;

export default function AI() {
  const params = useLocalSearchParams<{ scenarioOverride?: string }>();
  const [scenario, setScenario] = useState<Scenario | undefined>(undefined);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{role:"user"|"assistant"; content:string}[]>([]);
  const listRef = useRef<FlatList>(null);

  useEffect(()=>{ if (params?.scenarioOverride) setScenario(params.scenarioOverride as Scenario); }, [params?.scenarioOverride]);

  const quickItems = useMemo(()=>{
    const base = (prompts as Record<string, string[]>)["common"] || [];
    const extra = scenario ? (prompts as Record<string, string[]>)[scenario] || [] : [];
    return [...base, ...extra].slice(0,8);
  }, [scenario]);

  function push(m: {role:"user"|"assistant"; content:string}) {
    setMessages(prev => {
      const next = [...prev, m];
      return next.length > MAX_MSG ? next.slice(next.length - MAX_MSG) : next;
    });
    requestAnimationFrame(()=>listRef.current?.scrollToEnd({ animated:true }));
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    push({ role:"user", content });
    setBusy(true);

    try {
      // Create user context
      const userCard: UserCard = {
        userId: "user_123",
        firstName: "User",
        archetype: "Coach",
        daysStreak: 5,
        recentTriggers: ["bored at night", "stress"],
        supportContact: null
      };

      // Map scenario to emotional state
      const getEmotionalState = (scenario?: Scenario): EmotionalState => {
        switch (scenario) {
          case "craving_manager": return "craving";
          case "shame_repair": return "shame";
          case "relapse_triage": return "shame";
          case "ifs_micro": return "craving";
          default: return "craving";
        }
      };

      const moment: Moment = {
        state: getEmotionalState(scenario),
        timebox: 60,
        contextNote: "Using TARU app",
        attemptedBypass: false
      };

      const response = await getAthenaResponse(userCard, moment, content);
      
      // Update scenario based on response
      setScenario(scenario);

      // Push the response
      push({
        role: "assistant",
        content: response.message
      });

      logEvent({ type: "ai_turn", meta: { scenario, intent: "support" } });
    } catch (e: unknown) {
      console.error('AI error:', e);
      push({ 
        role: "assistant", 
        content: "I hit a snag. Here's a quick reset instead: Double inhale, long exhale (8 cycles)." 
      });
      logEvent({ type: "ai_error", meta: { error: e instanceof Error ? e.message : String(e) } });
    } finally {
      setBusy(false);
    }
  }



  return (
    <SafeAreaView style={S.safe}>
      <View style={S.container}>
        {/* Header */}
        <View style={S.header}>
          <Text style={S.title}>Athena</Text>
          <Text style={S.subtitle}>Your recovery coach</Text>
          {scenario && (
            <View style={S.badge}>
              <Text style={S.badgeText}>{scenario.replace('_', ' ')}</Text>
            </View>
          )}
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <Bubble msg={item} />}
          contentContainerStyle={S.messages}
          showsVerticalScrollIndicator={false}
        />

        {/* Quick Replies */}
        <QuickReplies items={quickItems} onPick={send} />

        {/* Input */}
        <View style={S.inputRow}>
          <TextInput
            style={S.input}
            value={input}
            onChangeText={setInput}
            placeholder="Tell Athena what's happening..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            multiline
            maxLength={500}
            editable={!busy}
            accessibilityLabel="Message Athena"
            accessibilityHint="Describe what is happening and send"
          />
          <Pressable
            style={[S.sendBtn, { opacity: (input.trim() && !busy) ? 1 : 0.5 }]}
            onPress={() => send()}
            disabled={!input.trim() || busy}
            accessibilityLabel="Send message to Athena"
            accessibilityRole="button"
          >
            <Text style={S.sendText}>{busy ? "…" : "Send"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0A" },
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 16 },
  title: { color: "white", fontSize: 24, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "rgba(255,255,255,0.65)", fontSize: 16 },
  badge: { 
    backgroundColor: "#121210", 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8, 
    alignSelf: "flex-start", 
    marginTop: 8 
  },
  badgeText: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  messages: { paddingBottom: 16 },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  input: {
    flex: 1,
    backgroundColor: "#121210",
    borderRadius: 16,
    padding: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "#23231e",
    minHeight: 44,
    maxHeight: 120
  },
  sendBtn: {
    backgroundColor: "#22C55E",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center"
  },
  sendText: { color: "white", fontWeight: "600" }
}); 