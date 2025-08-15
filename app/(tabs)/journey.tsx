import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';
import { useChallenges } from '../../lib/store/useChallenges';
import { ChallengeCard } from '../../components/cards/ChallengeCard';
import { Section } from '../../components/ui/Section';
import { Skeleton } from '../../components/ui/Skeleton';

type ViewMode = 'challenges' | 'progress';

export default function JourneyScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('challenges');
  const { challenges, isLoading, refresh } = useChallenges();
  const scrollRef = useRef<ScrollView>(null);

  const renderChallengesView = () => (
    <View style={styles.content}>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} height={200} borderRadius={radius.lg} style={styles.skeleton} />
        ))
      ) : (
        challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onPress={() => console.log('Challenge pressed:', challenge.title)}
          />
        ))
      )}
    </View>
  );

  const renderProgressView = () => (
    <View style={styles.content}>
      <Section title="Weekly Streak">
        <View style={styles.streakContainer}>
          <Text style={styles.streakNumber}>7</Text>
          <Text style={styles.streakLabel}>days</Text>
        </View>
      </Section>

      <Section title="Badges Earned">
        <View style={styles.badgesContainer}>
          {['First Step', 'Week Warrior', 'Mindful Master'].map((badge, index) => (
            <View key={index} style={styles.badge}>
              <Ionicons name="trophy" size={24} color={colors.accent} />
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Weekly Activity">
        <View style={styles.activityContainer}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <View key={day} style={styles.dayContainer}>
              <Text style={styles.dayText}>{day}</Text>
              <View
                style={[
                  styles.dayIndicator,
                  { backgroundColor: index < 5 ? colors.accent : colors.card },
                ]}
              />
            </View>
          ))}
        </View>
      </Section>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Toggle Header */}
      <View style={styles.header}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'challenges' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('challenges')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'challenges' && styles.toggleTextActive,
              ]}
            >
              Challenges
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'progress' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('progress')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'progress' && styles.toggleTextActive,
              ]}
            >
              Progress
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
      >
        {viewMode === 'challenges' ? renderChallengesView() : renderProgressView()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.sub,
  },
  toggleTextActive: {
    color: colors.text,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  skeleton: {
    marginBottom: 12,
  },
  streakContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.accent,
  },
  streakLabel: {
    fontSize: 16,
    color: colors.sub,
    marginTop: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  badge: {
    alignItems: 'center',
    padding: 16,
  },
  badgeText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    color: colors.sub,
    marginBottom: 8,
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
