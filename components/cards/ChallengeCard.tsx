import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius } from '../../theme/tokens';
import { Challenge } from '../../lib/supa/types';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress?: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
}) => {
  const progressPercentage = (challenge.completed / challenge.total) * 100;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: challenge.image || 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.subtitle}>
          {challenge.completed} completed, {challenge.total - challenge.completed} remaining
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.sub,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.bg,
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.sub,
    fontWeight: '500',
  },
});
