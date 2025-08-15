// app/onboarding/OnboardingFlow.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, Text, Pressable, SafeAreaView, StyleSheet, Animated, Easing, TextInput, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";

/** =========================
 *  Brand — matches screenshot
 *  ========================= */
const BRAND = {
  bg: "#0F0A13",           // deep black-purple
  card: "#18111F",         // dark plum
  text: "#F4F1F8",         // soft white
  subtext: "rgba(244,241,248,0.72)",
  accent: "#D946EF",       // neon magenta (CTA)
  accentDim: "#A021C5",
  rail: "#2B2233",
  railFill: "#6D28D9",     // royal purple fill
  border: "#241B2A",
  input: "#1A1322",
  mute: "#A696B5",
  success: "#73D99F",
  danger: "#FF6B6B",
};

/** ==============
 * Types & helpers
 * ============== */
type CostInputs = {
  hoursPerDay: number;
  affectedRelationships?: string[];
  spendPerMonth: number;
  healthFreq: "never" | "sometimes" | "often" | "daily";
};

type TriggerItem = { label: string; selected: boolean };
type NeedKey = "overwhelm" | "emptiness" | "boredom" | "loneliness" | "imposter";
type ArchetypeKey = "fighter" | "protector" | "dreamer" | "builder" | "phoenix";
type AllianceChoice = "match" | "invite" | "solo";

type OnboardingState = {
  costs: CostInputs;
  triggers: TriggerItem[];
  needs: NeedKey[];
  // quiz-based archetype (users do NOT choose directly)
  quizAnswers: ArchetypeKey[]; // each answer maps to an archetype
  archetype?: ArchetypeKey;     // assigned at the end
  firstVictorySeconds: number;
  alliance?: AllianceChoice;
  allyPhoneOrEmail?: string;
  name: string;
  daysCommit: number;
  why: string;
  reward: string;
  signed: boolean;
};

const HEALTH_MAP: Record<CostInputs["healthFreq"], number> = {
  never: 0,
  sometimes: 8,
  often: 16,
  daily: 30,
};

const yearsLostByAge60 = (hoursPerDay: number) => {
  const workingYears = 42; // age 18 → 60
  const hours = hoursPerDay * 365 * workingYears;
  return +(hours / 24 / 365).toFixed(1);
};

const yearlySpend = (spendPerMonth: number) => spendPerMonth * 12;

const $ = (n: number) => Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/** =======================
 *  Quiz model (4 questions)
 *  Each option maps to an archetype key
 *  ======================= */
const QUIZ = [
  {
    q: "When stress spikes, your first instinct is to…",
    options: [
      { label: "Push through and take action", key: "fighter" as ArchetypeKey },
      { label: "Pull back and set boundaries", key: "protector" },
      { label: "Reframe and imagine a better path", key: "dreamer" },
      { label: "Make a plan and execute it", key: "builder" },
      { label: "Reset completely and start fresh", key: "phoenix" },
    ],
  },
  {
    q: "What do you need most from TARU right now?",
    options: [
      { label: "Energy and momentum", key: "fighter" },
      { label: "Safety and structure", key: "protector" },
      { label: "Inspiration and meaning", key: "dreamer" },
      { label: "Clear tools and systems", key: "builder" },
      { label: "A deep reset / clean slate", key: "phoenix" },
    ],
  },
  {
    q: "What most gets in your way?",
    options: [
      { label: "Anger or impulsivity", key: "fighter" },
      { label: "People-pleasing / weak boundaries", key: "protector" },
      { label: "Drifting / procrastination", key: "dreamer" },
      { label: "Perfectionism / over-optimizing", key: "builder" },
      { label: "Shame loops after slips", key: "phoenix" },
    ],
  },
  {
    q: "When you DO win, it's because you…",
    options: [
      { label: "Act decisively", key: "fighter" },
      { label: "Protect your time/space", key: "protector" },
      { label: "Follow a compelling vision", key: "dreamer" },
      { label: "Stick to the plan", key: "builder" },
      { label: "Rise after setbacks", key: "phoenix" },
    ],
  },
];

const ARCHETYPE_META: Record<
  ArchetypeKey,
  { icon: string; label: string; line: string }
> = {
  fighter:   { icon: "🗡️", label: "Fighter",   line: "Meets the moment with courage and action." },
  protector: { icon: "🛡️", label: "Protector", line: "Creates safety, boundaries, and steadiness." },
  dreamer:   { icon: "✨", label: "Dreamer",   line: "Keeps hope and meaning alive when it's dark." },
  builder:   { icon: "🔨", label: "Builder",   line: "Turns clear plans into consistent results." },
  phoenix:   { icon: "🔥", label: "Phoenix",   line: "Transforms setbacks into fuel for rebirth." },
};

/** Pick the top-scoring archetype from quiz answers */
function inferArchetype(answers: ArchetypeKey[]): ArchetypeKey | undefined {
  if (!answers.length) return undefined;
  const score: Record<ArchetypeKey, number> = {
    fighter: 0, protector: 0, dreamer: 0, builder: 0, phoenix: 0,
  };
  answers.forEach((k) => { score[k] = (score[k] ?? 0) + 1; });
  const entries = Object.entries(score) as [ArchetypeKey, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  // in case of tie, prefer phoenix then protector (gentle defaults)
  const tied = entries.filter(([, v]) => v === top[1]).map(([k]) => k);
  if (tied.length > 1) {
    if (tied.includes("phoenix")) return "phoenix";
    if (tied.includes("protector")) return "protector";
  }
  return top[0];
}

/** =================
 *  Component
 *  ================= */
export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const defaultTriggers: TriggerItem[] = useMemo(() => {
    const now = new Date();
    const hr = now.getHours();
    const isWeekend = [0, 6].includes(now.getDay());
    return [
      { label: "Alone in bed (11pm)", selected: hr >= 22 || hr <= 1 },
      { label: "Work stress peak (3pm)", selected: hr >= 14 && hr <= 16 },
      { label: "Boredom spiral (weekend)", selected: isWeekend },
    ];
  }, []);

  const [data, setData] = useState<OnboardingState>({
    costs: { hoursPerDay: 2, affectedRelationships: [], spendPerMonth: 0, healthFreq: "sometimes" },
    triggers: defaultTriggers,
    needs: [],
    quizAnswers: [], // filled on Screen 6
    firstVictorySeconds: 0,
    name: "",
    daysCommit: 30,
    why: "",
    reward: "",
    signed: false,
  });

  /** CTA pulse */
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const CTA = ({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) => (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <Pressable onPress={onPress} disabled={disabled} style={[S.cta, disabled && { opacity: 0.5 }]}>
        <Text style={S.ctaText}>{title}</Text>
      </Pressable>
    </Animated.View>
  );

  /** Save after each step (fast, local) */
  const saveAndProceed = async (finalize = false) => {
    try {
      setSaving(true);
      await AsyncStorage.setItem("taru:onboarding", JSON.stringify(data));
      setSaving(false);
      if (finalize) {
        router.replace("/(tabs)"); // adjust to your app route
      } else {
        setStep((s) => Math.min(s + 1, 10));
      }
    } catch (e) {
      setSaving(false);
      console.warn("onboarding save failed", e);
      setStep((s) => Math.min(s + 1, 10));
    }
  };

  /** Breathing timer (Screen 7) */
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathSec, setBreathSec] = useState(60);
  useEffect(() => {
    if (!breathRunning) return;
    if (breathSec <= 0) {
      setBreathRunning(false);
      setData((p) => ({ ...p, firstVictorySeconds: 60 }));
      return;
    }
    const t = setTimeout(() => setBreathSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [breathRunning, breathSec]);

  const Progress = ({ n }: { n: number }) => (
    <View style={S.progressWrap}><View style={[S.progressFill, { width: `${(n / 10) * 100}%` }]} /></View>
  );
  const H = ({ children }: { children: React.ReactNode }) => <Text style={S.h}>{children}</Text>;
  const P = ({ children, style }: any) => <Text style={[S.p, style]}>{children}</Text>;

  const Card = ({ children }: any) => <View style={S.card}>{children}</View>;
  const Row = ({ children }: any) => <View style={S.row}>{children}</View>;
  const Chip = ({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) => (
    <Pressable onPress={onPress} style={[S.chip, selected && { backgroundColor: BRAND.accent, borderColor: BRAND.accent }]}>
      <Text style={[S.chipText, selected && { color: "#18081E", fontWeight: "800" }]}>{label}</Text>
    </Pressable>
  );

  /** ============= Screens ============= */

  const Screen1 = () => (
    <>
      <Progress n={1} />
      <Card>
        <H>See your screen time in 30 seconds</H>
        <P>Join 1,247 people who started their recovery today</P>
        <P style={{ marginTop: 8, color: BRAND.subtext }}>Discover what your addiction is really costing you</P>
      </Card>
      <CTA title="Show Me My Data" onPress={() => saveAndProceed()} />
    </>
  );

    const Screen2 = () => {
    const yrs = yearsLostByAge60(data.costs.hoursPerDay);
    const yrSpend = yearlySpend(data.costs.spendPerMonth);
    return (
      <>
        <Progress n={2} />
        <H>What's your addiction really costing you?</H>
        
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          <Card>
          <P style={S.label}>How many hours/day?</P>
          <Slider
            minimumValue={0}
            maximumValue={12}
            step={0.5}
            value={data.costs.hoursPerDay}
            minimumTrackTintColor={BRAND.accent}
            maximumTrackTintColor={BRAND.rail}
            thumbTintColor={BRAND.text}
            onValueChange={(v) => setData((p) => ({ ...p, costs: { ...p.costs, hoursPerDay: v } }))}
          />
          <P style={{ textAlign: 'center', fontWeight: '600', fontSize: 18, color: BRAND.text }}>
            {data.costs.hoursPerDay} hours/day
          </P>
          
          {/* Visual Timeline */}
          <View style={{ marginVertical: 12, padding: 12, backgroundColor: 'rgba(217, 70, 239, 0.05)', borderRadius: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: BRAND.accent, marginRight: 8 }} />
              <Text style={{ color: BRAND.text, fontWeight: '600' }}>Your Life Timeline</Text>
            </View>
            <View style={{ height: 4, backgroundColor: BRAND.rail, borderRadius: 2, marginBottom: 4 }}>
              <View style={{ 
                width: `${Math.min((yrs / 42) * 100, 100)}%`, 
                height: '100%', 
                backgroundColor: BRAND.accent,
                borderRadius: 2,
              }} />
            </View>
            <Text style={{ color: BRAND.subtext, fontSize: 12 }}>
              {yrs} years lost to screens • {42 - yrs} years remaining for what matters
            </Text>
          </View>
          
          <P>By age 60, that's {yrs} years of memories, relationships, and dreams you could get back.</P>
        </Card>

        <Card>
          <P style={S.label}>Which relationships have been affected?</P>
          <View style={S.rowWrap}>
            {[
              { key: 'myself', label: '🫂 Myself' },
              { key: 'family', label: '👨‍👩‍👧‍👦 Family' },
              { key: 'romantic', label: '💕 Romantic Partner' },
              { key: 'friends', label: '👥 Friends' },
              { key: 'coworkers', label: '💼 Coworkers' },
              { key: 'peers', label: '🎓 Peers/Classmates' },
              { key: 'acquaintances', label: '🤝 Acquaintances' },
            ].map((rel) => {
              const selected = data.costs.affectedRelationships?.includes(rel.key) || false;
              return (
                <Chip
                  key={rel.key}
                  label={rel.label}
                  selected={selected}
                  onPress={() =>
                    setData((p) => {
                      const current = p.costs.affectedRelationships || [];
                      const updated = selected 
                        ? current.filter(k => k !== rel.key)
                        : [...current, rel.key];
                      return { 
                        ...p, 
                        costs: { 
                          ...p.costs, 
                          affectedRelationships: updated 
                        } 
                      };
                    })
                  }
                />
              );
            })}
          </View>
          <P>{data.costs.affectedRelationships?.length || 0} relationships damaged — and they can all be repaired.</P>
        </Card>

        <Card>
          <P style={S.label}>How much do you spend per month?</P>
          <TextInput
            keyboardType="number-pad"
            placeholder="$0"
            placeholderTextColor={BRAND.mute}
            value={String(data.costs.spendPerMonth || "")}
            onChangeText={(t) =>
              setData((p) => ({ ...p, costs: { ...p.costs, spendPerMonth: Number(t.replace(/[^0-9]/g, "")) || 0 } }))
            }
            style={S.input}
          />
          <P>That's {$((yrSpend))} per year — enough to fund real dreams.</P>
        </Card>

        <Card>
          <P style={S.label}>How often does it leave you drained or anxious?</P>
          <Row>
            {([
              { key: "never", label: "Never", days: 0 },
              { key: "sometimes", label: "Sometimes (1-2x/week)", days: 8 },
              { key: "often", label: "Often (3-4x/week)", days: 16 },
              { key: "daily", label: "Daily", days: 30 },
            ] as const).map((option) => (
              <Chip 
                key={option.key} 
                label={option.label} 
                selected={data.costs.healthFreq === option.key}
                onPress={() => setData((p) => ({ ...p, costs: { ...p.costs, healthFreq: option.key } }))} 
              />
            ))}
          </Row>
          <P style={{ marginTop: 8, color: BRAND.subtext }}>
            {data.costs.healthFreq === "never" ? "You're managing well!" : 
             `${HEALTH_MAP[data.costs.healthFreq]} days/month feeling drained — and this is completely reversible.`}
          </P>
        </Card>
        </ScrollView>

        <CTA title="I Want Those Years Back" onPress={() => saveAndProceed()} />
      </>
    );
  };

  const Screen3 = () => (
    <>
      <Progress n={3} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <Card>
          <H>You're not broken. Your brain was hacked.</H>
          <P>Digital addiction is a real brain disorder that changes your neural pathways. It's not a lack of willpower — it's a hijacked reward system.</P>
        </Card>
        
        <Card>
          <P style={S.label}>How addiction works:</P>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Text style={{ color: BRAND.accent, fontSize: 18, fontWeight: 'bold' }}>1.</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: BRAND.text, fontWeight: '600', marginBottom: 2 }}>Dopamine Surge</Text>
                <Text style={{ color: BRAND.subtext, fontSize: 14 }}>Screens trigger 10x more dopamine than natural rewards</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Text style={{ color: BRAND.accent, fontSize: 18, fontWeight: 'bold' }}>2.</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: BRAND.text, fontWeight: '600', marginBottom: 2 }}>Neural Rewiring</Text>
                <Text style={{ color: BRAND.subtext, fontSize: 14 }}>Your brain adapts to expect constant stimulation</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Text style={{ color: BRAND.accent, fontSize: 18, fontWeight: 'bold' }}>3.</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: BRAND.text, fontWeight: '600', marginBottom: 2 }}>Withdrawal Symptoms</Text>
                <Text style={{ color: BRAND.subtext, fontSize: 14 }}>Anxiety, restlessness, and cravings when you're offline</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Card>
          <P style={S.label}>The good news:</P>
          <P>Your brain is neuroplastic — it can rewire itself. With the right tools and support, you can rebuild healthy neural pathways and regain control.</P>
          <P style={{ color: BRAND.accent, fontWeight: '600', marginTop: 8 }}>This is why TARU works: we help you retrain your brain.</P>
        </Card>
      </ScrollView>
      <CTA title="I Understand the Science" onPress={() => saveAndProceed()} />
    </>
  );

  const Screen4 = () => (
    <>
      <Progress n={4} />
      <H>When are you most at risk?</H>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <Card>
          {data.triggers.map((t, i) => (
            <Chip key={t.label} label={t.label} selected={t.selected}
              onPress={() => setData((p) => {
                const next = [...p.triggers]; next[i] = { ...next[i], selected: !next[i].selected }; return { ...p, triggers: next };
              })} />
          ))}
          <Pressable
            onPress={() => setData((p) => ({ ...p, triggers: [...p.triggers, { label: "Custom time/situation", selected: true }] }))}
            style={S.outlineBtn}
          >
            <Text style={S.outlineBtnText}>+ Add custom</Text>
          </Pressable>
          <P style={{ marginTop: 8 }}>Your brain learned this fast — we'll help you unlearn it faster.</P>
        </Card>
      </ScrollView>
      <CTA title="Map My Triggers" onPress={() => saveAndProceed()} />
    </>
  );

  const needsMap: { key: NeedKey; label: string; icon: string }[] = [
    { key: "overwhelm", label: "Overwhelm", icon: "🌊" },
    { key: "emptiness", label: "Emptiness", icon: "🕳️" },
    { key: "boredom", label: "Boredom", icon: "⚡" },
    { key: "loneliness", label: "Loneliness", icon: "💔" },
    { key: "imposter", label: "Feeling Fake", icon: "🎭" },
  ];

  const Screen5 = () => (
    <>
      <Progress n={5} />
      <H>Your addiction is trying to protect you from…</H>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={S.rowWrap}>
            {needsMap.map((n) => {
              const selected = data.needs.includes(n.key);
              return (
                <Chip
                  key={n.key}
                  label={`${n.icon} ${n.label}`}
                  selected={selected}
                  onPress={() =>
                    setData((p) => {
                      const set = new Set(p.needs);
                      selected ? set.delete(n.key) : set.add(n.key);
                      return { ...p, needs: Array.from(set) as NeedKey[] };
                    })
                  }
                />
              );
            })}
          </View>
          <P style={{ marginTop: 8 }}>Valid. Many start here — and move forward.</P>
        </Card>
      </ScrollView>
      <CTA title="Find Better Protection" onPress={() => saveAndProceed()} />
    </>
  );

  /** Screen 6 — Archetype QUIZ (users don't self-pick) */
  const Screen6 = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    
    const setAnswer = (qi: number, key: ArchetypeKey) => {
      setData((p) => {
        const next = [...(p.quizAnswers || [])];
        next[qi] = key;
        return { ...p, quizAnswers: next };
      });
      
      // Auto-advance to next question after 1 second
      setTimeout(() => {
        if (currentQuestion < QUIZ.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
      }, 1000);
    };

    const allAnswered = QUIZ.every((_, i) => data.quizAnswers[i]);
    const currentQ = QUIZ[currentQuestion];

    return (
      <>
        <Progress n={6} />
        <H>Let's tailor TARU to your style.</H>
        <Card>
          <P style={{ color: BRAND.subtext, marginBottom: 8 }}>
            Question {currentQuestion + 1} of {QUIZ.length}
          </P>
          <P style={S.label}>{currentQ.q}</P>
          <View style={S.rowWrap}>
            {currentQ.options.map((opt) => (
              <Chip
                key={opt.label}
                label={opt.label}
                selected={data.quizAnswers[currentQuestion] === opt.key}
                onPress={() => setAnswer(currentQuestion, opt.key as ArchetypeKey)}
              />
            ))}
          </View>
        </Card>
        <CTA 
          title={allAnswered ? "Activate My Strength Profile" : `Continue (${data.quizAnswers.filter(Boolean).length}/${QUIZ.length} answered)`} 
          onPress={() => saveAndProceed()} 
        />
      </>
    );
  };

  const Screen7 = () => {
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
    const [breathCount, setBreathCount] = useState(0);
    const [isBreathing, setIsBreathing] = useState(false);
    const [completed, setCompleted] = useState(false);
    
    const breathCycle = useRef(new Animated.Value(0)).current;
    const breathText = useRef(new Animated.Value(1)).current;
    
    const startBreathing = () => {
      setIsBreathing(true);
      setBreathCount(0);
      runBreathingCycle();
    };
    
    const runBreathingCycle = () => {
      if (breathCount >= 5) {
        setCompleted(true);
        setIsBreathing(false);
        setData((p) => ({ ...p, firstVictorySeconds: 60 }));
        return;
      }
      
      // Inhale (4 seconds)
      setBreathPhase('inhale');
      Animated.sequence([
        Animated.timing(breathCycle, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(breathText, { toValue: 0.8, duration: 200, useNativeDriver: true }),
        Animated.timing(breathText, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        // Hold (4 seconds)
        setBreathPhase('hold');
        Animated.timing(breathCycle, { toValue: 0, duration: 4000, useNativeDriver: true }).start(() => {
          // Exhale (6 seconds)
          setBreathPhase('exhale');
          Animated.sequence([
            Animated.timing(breathCycle, { toValue: -1, duration: 6000, useNativeDriver: true }),
            Animated.timing(breathText, { toValue: 0.8, duration: 200, useNativeDriver: true }),
            Animated.timing(breathText, { toValue: 1, duration: 200, useNativeDriver: true }),
          ]).start(() => {
            // Rest (2 seconds)
            setBreathPhase('rest');
            setTimeout(() => {
              setBreathCount(prev => prev + 1);
              if (breathCount < 4) runBreathingCycle();
            }, 2000);
          });
        });
      });
    };
    
    const getBreathText = () => {
      switch (breathPhase) {
        case 'inhale': return 'Inhale slowly...';
        case 'hold': return 'Hold...';
        case 'exhale': return 'Exhale completely...';
        case 'rest': return 'Rest...';
        default: return '';
      }
    };
    
    const getBreathSubtext = () => {
      if (breathPhase === 'inhale') return 'Fill your lungs completely';
      if (breathPhase === 'hold') return 'Feel the calm';
      if (breathPhase === 'exhale') return 'Release all tension';
      if (breathPhase === 'rest') return 'Notice the peace';
      return '';
    };
    
    return (
      <>
        <Progress n={7} />
        <H>Your first victory starts now.</H>
        <Card>
          <P>Let's do 5 rounds of calming breath. This will reset your nervous system in just 2 minutes.</P>
          
          {!isBreathing && !completed && (
            <View style={S.timerWrap}>
              <Text style={S.timerText}>Ready?</Text>
              <Text style={{ color: BRAND.subtext, fontSize: 16, marginTop: 8 }}>5 rounds • 2 minutes</Text>
            </View>
          )}
          
          {isBreathing && (
            <View style={S.timerWrap}>
              <Animated.View style={{ transform: [{ scale: breathCycle }] }}>
                <View style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  borderWidth: 3,
                  borderColor: BRAND.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: breathPhase === 'inhale' ? 'rgba(217, 70, 239, 0.1)' : 'transparent',
                }}>
                  <Animated.Text style={[S.timerText, { transform: [{ scale: breathText }] }]}>
                    {breathCount + 1}/5
                  </Animated.Text>
                </View>
              </Animated.View>
              <Text style={{ color: BRAND.text, fontSize: 20, fontWeight: '600', marginTop: 16 }}>
                {getBreathText()}
              </Text>
              <Text style={{ color: BRAND.subtext, fontSize: 14, marginTop: 4 }}>
                {getBreathSubtext()}
              </Text>
            </View>
          )}
          
          {completed && (
            <View style={S.timerWrap}>
              <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 3,
                borderColor: BRAND.success,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(115, 217, 159, 0.1)',
              }}>
                <Text style={[S.timerText, { color: BRAND.success }]}>✓</Text>
              </View>
              <Text style={{ color: BRAND.text, fontSize: 20, fontWeight: '600', marginTop: 16 }}>
                You did it!
              </Text>
              <Text style={{ color: BRAND.subtext, fontSize: 14, marginTop: 4 }}>
                Notice how much calmer you feel
              </Text>
            </View>
          )}
          
          {!isBreathing && !completed && (
            <Pressable onPress={startBreathing} style={S.outlineBtn}>
              <Text style={S.outlineBtnText}>Start My First Victory</Text>
            </Pressable>
          )}
        </Card>
        <CTA 
          title={completed ? "I Feel Calmer" : "Skip (you'll miss the feeling)"} 
          onPress={() => saveAndProceed()} 
        />
      </>
    );
  };

  const Screen8 = () => {
    const chosen = data.triggers.filter((t) => t.selected).map((t) => t.label.replace(/\s*\(.+\)/, ""));
    return (
      <>
        <Progress n={8} />
        <H>Your triggers hit at {chosen.length ? chosen.join(", ") : "key moments"}. Here's your defense.</H>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          <Card>
            <P style={S.label}>Your Recovery Defense System:</P>
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Text style={{ color: BRAND.accent, fontSize: 20 }}>🚨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: BRAND.text, fontWeight: "800", marginBottom: 4 }}>Red Zones</Text>
                  <Text style={{ color: BRAND.subtext, fontSize: 14 }}>Your identified trigger times. Set reminders 5 minutes before.</Text>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Text style={{ color: BRAND.accent, fontSize: 20 }}>🛡️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: BRAND.text, fontWeight: "800", marginBottom: 4 }}>Shields</Text>
                  <Text style={{ color: BRAND.subtext, fontSize: 14 }}>60-second breathing exercise before entering a red zone.</Text>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Text style={{ color: BRAND.accent, fontSize: 20 }}>⚔️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: BRAND.text, fontWeight: "800", marginBottom: 4 }}>Moves</Text>
                  <Text style={{ color: BRAND.subtext, fontSize: 14 }}>EFT tapping or cold water splash when cravings spike.</Text>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Text style={{ color: BRAND.accent, fontSize: 20 }}>🏆</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: BRAND.text, fontWeight: "800", marginBottom: 4 }}>Rituals</Text>
                  <Text style={{ color: BRAND.subtext, fontSize: 14 }}>Log every win + write 3 words of gratitude.</Text>
                </View>
              </View>
            </View>
          </Card>
          
          <Card>
            <P style={S.label}>Why this works:</P>
            <P>Recovery isn't about willpower — it's about having better tools than your addiction. Each tool interrupts the craving cycle and builds new neural pathways.</P>
            <P style={{ color: BRAND.accent, fontWeight: '600', marginTop: 8 }}>You're not fighting your brain, you're retraining it.</P>
          </Card>
        </ScrollView>
        <CTA title="Deploy My Defense" onPress={() => saveAndProceed()} />
      </>
    );
  };

  const Screen9 = () => (
    <>
      <Progress n={9} />
      <H>Recovery is 3× faster with allies.</H>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <Card>
          <P style={S.label}>Choose your support level:</P>
          <View style={{ gap: 12 }}>
            {([
              { key: "match", label: "Match me with a recovery buddy", desc: "Get paired with someone on a similar journey", icon: "🤝" },
              { key: "invite", label: "Invite my own ally", desc: "Bring someone you trust into your recovery", icon: "💕" },
              { key: "solo", label: "Solo for now", desc: "Focus on building your own foundation first", icon: "🦋" },
            ] as const).map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: data.alliance === opt.key ? BRAND.accent : BRAND.border,
                    backgroundColor: data.alliance === opt.key ? 'rgba(217, 70, 239, 0.1)' : 'transparent',
                  }
                ]}
                onPress={() => setData((p) => ({ ...p, alliance: opt.key }))}
              >
                <Text style={{ fontSize: 24, marginRight: 12 }}>{opt.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: BRAND.text, fontWeight: '600', marginBottom: 2 }}>{opt.label}</Text>
                  <Text style={{ color: BRAND.subtext, fontSize: 14 }}>{opt.desc}</Text>
                </View>
                {data.alliance === opt.key && (
                  <Text style={{ color: BRAND.accent, fontSize: 20 }}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
          
          {data.alliance === "invite" && (
            <View style={{ marginTop: 16 }}>
              <P style={S.label}>Ally contact</P>
              <TextInput
                placeholder="Email or phone number"
                placeholderTextColor={BRAND.mute}
                style={S.input}
                value={data.allyPhoneOrEmail || ""}
                onChangeText={(t) => setData((p) => ({ ...p, allyPhoneOrEmail: t }))}
              />
              <P style={{ color: BRAND.subtext, marginTop: 8 }}>We'll send a simple daily check-in link.</P>
            </View>
          )}
        </Card>
        
        <Card>
          <P style={S.label}>Why social support matters:</P>
          <P>Recovery research shows that people with social support are 3x more likely to succeed. Having someone to celebrate wins with and hold you accountable makes all the difference.</P>
          <P style={{ color: BRAND.accent, fontWeight: '600', marginTop: 8 }}>You can always change your mind later.</P>
        </Card>
      </ScrollView>
      <CTA title="Build My Alliance" onPress={() => saveAndProceed()} />
    </>
  );

  /** Screen 10 — Covenant + Archetype reveal (assigned at the end) */
  const Screen10 = () => {
    const assigned = inferArchetype(data.quizAnswers);
    const meta = assigned ? ARCHETYPE_META[assigned] : undefined;

    // persist chosen archetype into state for downstream personalization
    useEffect(() => {
      if (assigned && data.archetype !== assigned) setData((p) => ({ ...p, archetype: assigned }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assigned]);

    return (
      <>
        <Progress n={10} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          {meta && (
            <Card>
              <P style={S.badgeTitle}>Your Guide Archetype</P>
              <H>{meta.icon} {meta.label}</H>
              <P>{meta.line}</P>
            </Card>
          )}
          
          <Card>
            <P style={S.label}>Why commitment matters:</P>
            <P>Recovery research shows that people who make a formal commitment are 5x more likely to succeed. This isn't about perfection — it's about showing up for yourself every day.</P>
          </Card>
          
          <Card>
          <P style={S.label}>Your name</P>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor={BRAND.mute}
            style={S.input}
            value={data.name}
            onChangeText={(t) => setData((p) => ({ ...p, name: t }))}
          />
          
          <View style={{ height: 16 }} />
          <P style={S.label}>Start with a 7-day commitment</P>
          <Slider
            minimumValue={7}
            maximumValue={30}
            step={1}
            value={data.daysCommit}
            minimumTrackTintColor={BRAND.accent}
            maximumTrackTintColor={BRAND.rail}
            thumbTintColor={BRAND.text}
            onValueChange={(v) => setData((p) => ({ ...p, daysCommit: v }))}
          />
          <P style={{ color: BRAND.subtext }}>
            {data.daysCommit} days • {data.daysCommit >= 21 ? "You're ready for transformation!" : "Perfect for building momentum"}
          </P>

          <View style={{ height: 16 }} />
          <P style={S.label}>My why…</P>
          <TextInput
            placeholder="Why am I doing this? What will change?"
            placeholderTextColor={BRAND.mute}
            style={[S.input, { height: 80 }]}
            multiline
            value={data.why}
            onChangeText={(t) => setData((p) => ({ ...p, why: t }))}
          />
          
          <View style={{ height: 16 }} />
          <P style={S.label}>My reward at completion…</P>
          <TextInput
            placeholder="What will I treat myself to?"
            placeholderTextColor={BRAND.mute}
            style={S.input}
            value={data.reward}
            onChangeText={(t) => setData((p) => ({ ...p, reward: t }))}
          />

          <Pressable
            onPress={() => setData((p) => ({ ...p, signed: !p.signed }))}
            style={[S.checkbox, data.signed && { borderColor: BRAND.accent, backgroundColor: BRAND.accent }]}
          >
            <Text style={[S.checkboxText, data.signed && { color: "#18081E" }]}>
              {data.signed ? "✓ " : ""}I sign this covenant
            </Text>
          </Pressable>
        </Card>
        </ScrollView>
        
        {(!data.name.trim() || !data.why.trim() || !data.signed) && (
          <View style={{ padding: 12, backgroundColor: 'rgba(217, 70, 239, 0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(217, 70, 239, 0.3)' }}>
            <Text style={{ color: BRAND.accent, fontSize: 14, textAlign: 'center' }}>
              {!data.name.trim() ? 'Please enter your name' : 
               !data.why.trim() ? 'Please share your why' : 
               'Please sign the covenant'}
            </Text>
          </View>
        )}
        <CTA 
          title="Seal My Commitment" 
          onPress={() => saveAndProceed(true)} 
          disabled={!data.name.trim() || !data.why.trim() || !data.signed} 
        />
      </>
    );
  };

  /** Render */
  return (
    <SafeAreaView style={S.safe}>
      <View style={S.wrap}>
        {step === 1 && <Screen1 />}
        {step === 2 && <Screen2 />}
        {step === 3 && <Screen3 />}
        {step === 4 && <Screen4 />}
        {step === 5 && <Screen5 />}
        {step === 6 && <Screen6 />}
        {step === 7 && <Screen7 />}
        {step === 8 && <Screen8 />}
        {step === 9 && <Screen9 />}
        {step === 10 && <Screen10 />}

        <View style={S.footerRow}>
          <Pressable onPress={() => setStep((s) => Math.max(1, s - 1))} style={[S.linkBtn, step === 1 && { opacity: 0.35 }]} disabled={step === 1}>
            <Text style={S.linkText}>Back</Text>
          </Pressable>
          <Text style={S.meta}>{saving ? "Saving…" : `Step ${step}/10`}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

/** =================
 *  Styles
 *  ================= */
const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BRAND.bg },
  wrap: { flex: 1, paddingHorizontal: 16, paddingTop: 12, gap: 18 },
  h: { color: BRAND.text, fontSize: 28, fontWeight: "800", letterSpacing: 0.2, marginBottom: 4 },
  p: { color: BRAND.subtext, fontSize: 16, lineHeight: 22 },
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BRAND.border,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cta: {
    backgroundColor: BRAND.accent,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BRAND.accent,
    shadowOpacity: Platform.OS === "ios" ? 0.25 : 0.5,
    shadowRadius: 16,
    elevation: 3,
    marginTop: 6,
  },
  ctaText: { color: "#18081E", fontWeight: "900", fontSize: 16, letterSpacing: 0.2 },
  progressWrap: { height: 6, backgroundColor: BRAND.rail, borderRadius: 6, overflow: "hidden", marginTop: 4 },
  progressFill: { height: "100%", backgroundColor: BRAND.railFill },
  label: { color: BRAND.text, fontWeight: "800", marginBottom: 6 },
  input: {
    backgroundColor: BRAND.input,
    color: BRAND.text,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 52,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  rowWrap: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    borderWidth: 1,
    borderColor: BRAND.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#140D1A",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chipText: { color: BRAND.text, fontWeight: "700" },
  outlineBtn: {
    borderWidth: 1,
    borderColor: BRAND.accent,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  outlineBtnText: { color: BRAND.accent, fontWeight: "800" },
  timerWrap: {
    alignSelf: "center",
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: BRAND.accent,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  timerText: { color: BRAND.text, fontWeight: "900", fontSize: 36, letterSpacing: 1 },
  footerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto", marginBottom: 8 },
  linkBtn: { paddingVertical: 8, paddingHorizontal: 8 },
  linkText: { color: BRAND.subtext, fontWeight: "700" },
  meta: { color: BRAND.subtext, fontWeight: "600" },
  checkbox: { marginTop: 10, borderWidth: 1, borderColor: BRAND.border, borderRadius: 14, paddingVertical: 10, alignItems: "center" },
  checkboxText: { color: BRAND.text, fontWeight: "800" },
  badgeTitle: { color: BRAND.subtext, fontWeight: "800", marginBottom: 4, letterSpacing: 0.2 },
});
