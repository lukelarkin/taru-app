import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';
import { Exercise } from '../../lib/supa/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
}) => {
  const getIconName = (kind: Exercise['kind']) => {
    switch (kind) {
      case 'breath':
        return 'leaf-outline';
      case 'somatic':
        return 'body-outline';
      case 'audio':
        return 'musical-notes-outline';
      default:
        return 'fitness-outline';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={getIconName(exercise.kind) as any}
          size={24}
          color={colors.accent}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{exercise.title}</Text>
        <Text style={styles.duration}>{formatDuration(exercise.durationSec)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.sub} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: colors.sub,
  },
});
