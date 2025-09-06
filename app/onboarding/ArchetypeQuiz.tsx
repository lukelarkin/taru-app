app/onboarding/ArchetypeQuiz.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS } from '../../lib/archetypeQuestions';
import { useArchetypeStore } from '../../stores/archetype';

export default function ArchetypeQuiz() {
  const router = useRouter();
  const recordAnswer = useArchetypeStore((s) => s.recordAnswer);
  const computeArchetype = useArchetypeStore((s) => s.computeArchetype);

  const [index, setIndex] = useState(0);
  const total = QUESTIONS.length;
  const q = useMemo(() => QUESTIONS[index], [index]);

  const handlePick = (archetype: ReturnType<typeof computeArchetype>) => {
    recordAnswer(q.qid, archetype as any);
    if (index < total - 1) setIndex((i) => i + 1);
    else {
      const a = computeArchetype();
      router.replace(`/onboarding/ArchetypeResult?archetype=${encodeURIComponent(a)}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>Find your tone</Text>
        <Text style={styles.subtitle}>5 quick choices • ~90 seconds</Text>

        <Text style={styles.progress}>Question {index + 1} of {total}</Text>
        <Text style={styles.prompt}>{q.prompt}</Text>

        <View accessible accessibilityRole="menu">
          {q.options.map((opt) => (
            <Pressable
              key={opt.label}
              onPress={() => handlePick(opt.archetype)}
              accessibilityRole="button"
              accessibilityLabel={opt.label}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0B0B' },
  container: { flex: 1, padding: 20, gap: 16, justifyContent: 'center' },
  title: { color: 'white', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#A0A0A0', marginBottom: 8 },
  progress: { color: '#A0A0A0', marginTop: 12 },
  prompt: { color: 'white', fontSize: 20, marginVertical: 8 },
  option: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#2A2A2A' },
  optionPressed: { backgroundColor: '#232323' },
  optionText: { color: 'white', fontSize: 16 },
});
