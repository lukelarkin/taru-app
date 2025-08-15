import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { logEvent } from '../lib/store';

export default function Reset() {
  const params = useLocalSearchParams<{ name?: string; duration_s?: string }>();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const name = params.name || 'Reset';
  const duration = parseInt(params.duration_s || '60');

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsComplete(true);
      logEvent({ type: 'reset_complete', meta: { name, duration_s: duration } });
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, name, duration]);

  const startReset = () => {
    setIsActive(true);
    logEvent({ type: 'reset_start', meta: { name, duration_s: duration } });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResetInstructions = () => {
    switch (name.toLowerCase()) {
      case 'physiologic sigh':
        return 'Double inhale through your nose, then a long exhale through your mouth. Repeat.';
      case 'alternate nostril':
        return 'Close right nostril, inhale left. Close left nostril, exhale right. Alternate.';
      case 'box breathing':
        return 'Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat.';
      default:
        return 'Take slow, deep breaths. Focus on the rhythm of your breathing.';
    }
  };

  if (isComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Reset Complete!</Text>
          <Text style={styles.subtitle}>Great job taking care of yourself.</Text>
          <Pressable 
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        
        {!isActive ? (
          <View style={styles.startSection}>
            <Text style={styles.instructions}>{getResetInstructions()}</Text>
            <Text style={styles.duration}>Duration: {formatTime(duration)}</Text>
            <Pressable style={styles.button} onPress={startReset}>
              <Text style={styles.buttonText}>Start Reset</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.timerSection}>
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
            <Text style={styles.instructions}>{getResetInstructions()}</Text>
            <Pressable 
              style={[styles.button, styles.stopButton]} 
              onPress={() => setIsActive(false)}
            >
              <Text style={styles.buttonText}>Stop</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 30,
    textAlign: 'center',
  },
  startSection: {
    alignItems: 'center',
  },
  timerSection: {
    alignItems: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  duration: {
    fontSize: 18,
    color: '#22C55E',
    marginBottom: 30,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
