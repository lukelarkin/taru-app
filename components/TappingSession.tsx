import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { colors } from "../ui/designSystem";
import { haptics } from "../lib/haptics";
import { logResetStart, logResetComplete } from "../features/analytics/api";

type Step = { at: number; point: string; line: string };
type Session = {
  id: string;
  durationSec: number;
  steps: Step[];
  chips: string[];
  breath?: { pattern: string; physiologicSighAtSec?: number[] };
};

type Props = {
  session: Session;
  vertical: "porn" | "gambling" | "gaming";
  onDone?: () => void;
  onBack?: () => void;
  voiceUri?: string; // optional pre-recorded VO
};

const TAP_POINTS: Record<string, string> = {
  karate_chop: "Karate Chop",
  eyebrow: "Eyebrow",
  side_eye: "Side of Eye",
  under_eye: "Under Eye",
  under_nose: "Under Nose",
  chin: "Chin",
  collarbone: "Collarbone",
  under_arm: "Under Arm",
  top_head: "Top of Head"
};

const TAP_POINT_ICONS: Record<string, string> = {
  karate_chop: "hand-left",
  eyebrow: "eye",
  side_eye: "eye",
  under_eye: "eye",
  under_nose: "medical",
  chin: "person",
  collarbone: "body",
  under_arm: "body",
  top_head: "person"
};

export default function TappingSession({ session, vertical, onDone, onBack, voiceUri }: Props) {
  const [time, setTime] = useState(0);
  const [line, setLine] = useState(session.steps[0]?.line || "");
  const [point, setPoint] = useState(session.steps[0]?.point || "karate_chop");
  const [running, setRunning] = useState(false);
  const [microAction, setMicroAction] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;

  // Analytics tracking
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // hydrate templates
  const hydratedSteps = useMemo(() => {
    return session.steps.map(s => ({
      ...s,
      line: s.line
        .replace("{{vertical}}", vertical)
        .replace("{{micro_action}}", microAction || "my breath")
        .replace("{{one_action}}", "one meaningful action")
    }));
  }, [session.steps, vertical, microAction]);

  // Breath animation
  useEffect(() => {
    if (running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
          Animated.timing(breathAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
          Animated.timing(breathAnim, { toValue: 0, duration: 6000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      breathAnim.setValue(0);
    }
  }, [running, breathAnim]);

  // Point pulse animation
  useEffect(() => {
    if (running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [running, pulseAnim]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => {
    const current = [...hydratedSteps].reverse().find(s => time >= s.at);
    if (current) {
      if (current.point !== point) {
        haptics.light();
      }
      setPoint(current.point);
      setLine(current.line);
    }
    // Seal at end
    if (time >= session.durationSec) {
      setRunning(false);
      setIsCompleted(true);
      haptics.success();
      
      // Log completion
      if (startTime && sessionId) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        logResetComplete({
          reset: 'eft',
          duration_sec: duration,
          outcome: 4, // Good outcome
          from_start_id: sessionId,
        });
      }
    }
  }, [time, hydratedSteps, point, startTime, sessionId]);

  useEffect(() => {
    (async () => {
      if (!voiceUri) return;
      const { sound } = await Audio.Sound.createAsync({ uri: voiceUri }, { shouldPlay: false });
      setSound(sound);
    })();
    return () => { sound?.unloadAsync(); };
  }, [voiceUri]);

  const start = async () => {
    setRunning(true);
    setTime(0);
    setStartTime(Date.now());
    
    // Log session start
    const id = await logResetStart({
      reset: 'eft',
      from_trigger_id: null,
    });
    setSessionId(id);
    
    if (sound) { 
      await sound.setPositionAsync(0); 
      await sound.playAsync(); 
    }
  };

  const handleComplete = () => {
    haptics.success();
    onDone?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionTitle}>Great job! 🎉</Text>
          <Text style={styles.completionText}>
            You've completed the {session.id === 'emergency_3min' ? '3-minute emergency' : '7-minute daily'} EFT session.
          </Text>
          <Text style={styles.completionSubtext}>
            You showed up. That's the win.
          </Text>
          
          {microAction && (
            <View style={styles.actionContainer}>
              <Text style={styles.actionLabel}>Next action:</Text>
              <Text style={styles.actionText}>{microAction}</Text>
            </View>
          )}
          
          <Pressable style={styles.completionButton} onPress={handleComplete}>
            <Text style={styles.completionButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityLabel="Tapping session">
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.sessionTitle}>
          {session.id === 'emergency_3min' ? '3-Minute Rescue' : '7-Minute Reset'}
        </Text>
        <View style={styles.spacer} />
      </View>

      {/* Active Point Badge */}
      <Animated.View 
        style={[
          styles.pointBadge, 
          { transform: [{ scale: pulseAnim }] }
        ]} 
        accessibilityLabel={`Tap point: ${TAP_POINTS[point]}`}
      >
        <Text style={styles.pointText}>{TAP_POINTS[point]}</Text>
      </Animated.View>

      {/* Breath Ring */}
      <View style={styles.breathContainer}>
        <Animated.View 
          style={[
            styles.breathRing,
            {
              transform: [{ scale: breathAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2]
              })}],
              opacity: breathAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8]
              })
            }
          ]}
        />
        <Text style={styles.breathText}>4-2-6</Text>
      </View>

      {/* Current Line */}
      <Text style={styles.line} accessibilityLiveRegion="polite">{line}</Text>

      {/* Progress */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {formatTime(Math.min(time, session.durationSec))} / {formatTime(session.durationSec)}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(time / session.durationSec) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Action Chips */}
      <View style={styles.chips}>
        <Text style={styles.chipsLabel}>Choose your next action:</Text>
        <View style={styles.chipsGrid}>
          {session.chips.map(c => (
            <Pressable 
              key={c} 
              style={[
                styles.chip, 
                microAction === c && styles.chipActive
              ]} 
              onPress={() => setMicroAction(c)}
            >
              <Text style={[
                styles.chipText,
                microAction === c && styles.chipTextActive
              ]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Start Button */}
      <Pressable 
        style={[
          styles.cta, 
          running && styles.ctaDisabled
        ]} 
        onPress={running ? undefined : start} 
        accessibilityHint="Begin session"
      >
        <Text style={styles.ctaText}>
          {running ? "In Progress…" : "Start"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    padding: 20 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  sessionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  spacer: {
    width: 60,
  },
  pointBadge: { 
    alignSelf: "center", 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 999, 
    backgroundColor: colors.sand, 
    marginBottom: 24,
    shadowColor: colors.jade,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pointText: { 
    color: colors.textPrimary, 
    fontSize: 16,
    fontWeight: '600',
  },
  breathContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  breathRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.aqua,
    position: 'absolute',
  },
  breathText: {
    color: colors.aqua,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 60,
  },
  line: { 
    color: colors.textPrimary, 
    fontSize: 20, 
    textAlign: "center", 
    lineHeight: 28, 
    marginHorizontal: 8, 
    marginBottom: 32,
    fontWeight: '500',
  },
  progress: { 
    alignItems: "center", 
    marginBottom: 32 
  },
  progressText: { 
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.glass,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.jade,
    borderRadius: 2,
  },
  chips: {
    marginBottom: 32,
  },
  chipsLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  chipsGrid: {
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center", 
    gap: 10,
  },
  chip: { 
    borderWidth: 1, 
    borderColor: colors.glass, 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 20,
    backgroundColor: colors.sand,
  },
  chipActive: { 
    backgroundColor: colors.jade,
    borderColor: colors.jade,
  },
  chipText: { 
    color: colors.textPrimary,
    fontSize: 14,
  },
  chipTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  cta: { 
    backgroundColor: colors.jade, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: "center",
    shadowColor: colors.jade,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaDisabled: {
    backgroundColor: colors.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: { 
    color: colors.background, 
    fontSize: 18, 
    fontWeight: "600" 
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  completionTitle: {
    fontSize: 32,
    color: colors.jade,
    textAlign: 'center',
    lineHeight: 38,
    fontWeight: '700',
    marginBottom: 16,
  },
  completionText: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  completionSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  actionContainer: {
    backgroundColor: colors.sand,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  completionButton: {
    backgroundColor: colors.jade,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionButtonText: {
    fontSize: 18,
    color: colors.background,
    lineHeight: 24,
    fontWeight: '600',
  },
}); 