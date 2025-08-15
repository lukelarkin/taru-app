import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { colors, radius } from '../../theme/tokens';
import { ExerciseCard } from '../../components/cards/ExerciseCard';
import { getTrackByTimeOfDay, audioTracks } from '../../lib/audio/tracks';
import { Exercise } from '../../lib/supa/types';

const { width, height } = Dimensions.get('window');

export function useSoundBath(source: any) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const toggle = async () => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
      soundRef.current = sound;
      setPlaying(true);
      sound.setOnPlaybackStatusUpdate((s) => {
        if ((s as AVPlaybackStatusSuccess).didJustFinish) setPlaying(false);
      });
      return;
    }
    const status = await soundRef.current.getStatusAsync();
    if ((status as AVPlaybackStatusSuccess).isPlaying) {
      await soundRef.current.pauseAsync();
      setPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setPlaying(true);
    }
  };

  return { isPlaying, toggle };
}

export default function ResetScreen() {
  const [currentTrack] = useState(getTrackByTimeOfDay());
  const { isPlaying, toggle } = useSoundBath(null); // TODO: Add actual audio file

  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Physiologic Sigh',
      durationSec: 120,
      kind: 'breath',
    },
    {
      id: '2',
      title: 'Alternate Nostril Breathing',
      durationSec: 180,
      kind: 'breath',
    },
    {
      id: '3',
      title: 'Shake-off Exercise',
      durationSec: 90,
      kind: 'somatic',
    },
  ];



  const getGradientColors = (): [string, string, string] => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return [colors.accent, colors.accent2, '#4C1D95'];
    } else {
      return ['#1E1B4B', colors.accent, '#7C3AED'];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Gradient Background */}
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sound Bath Section */}
        <View style={styles.soundBathContainer}>
          <Text style={styles.soundBathTitle}>{currentTrack.title}</Text>
          <Text style={styles.soundBathDuration}>
            {Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}
          </Text>
          
          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={toggle}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={48}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Exercise Toolbox */}
        <View style={styles.toolboxContainer}>
          <Text style={styles.toolboxTitle}>Quick Reset Tools</Text>
          <Text style={styles.toolboxSubtitle}>
            Exercises under 2 minutes for instant relief
          </Text>

          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={() => console.log('Exercise pressed:', exercise.title)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  soundBathContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  soundBathTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  soundBathDuration: {
    fontSize: 16,
    color: colors.sub,
    marginBottom: 40,
  },
  playButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  toolboxContainer: {
    backgroundColor: 'rgba(21, 21, 27, 0.9)',
    borderRadius: radius.xl,
    padding: 20,
    marginTop: 20,
  },
  toolboxTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  toolboxSubtitle: {
    fontSize: 16,
    color: colors.sub,
    marginBottom: 24,
  },
});
