import React, { useRef } from 'react';
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
import { useDaily } from '../../lib/store/useDaily';
import { Section } from '../../components/ui/Section';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Skeleton } from '../../components/ui/Skeleton';
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { streak, dailyFocus, todayProgress, isLoading, refresh } = useDaily();
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const quickActions = [
    { title: 'STOP Technique', icon: 'pause-circle-outline', onPress: () => router.push("/lesson/stop") },
    { title: "Today's Exercise", icon: 'fitness-outline', onPress: () => {} },
    { title: 'Check-in', icon: 'checkmark-circle-outline', onPress: () => {} },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Skeleton height={24} width="60%" style={styles.greetingSkeleton} />
          <Skeleton height={16} width="40%" style={styles.streakSkeleton} />
          <Section>
            <Skeleton height={100} borderRadius={radius.lg} />
          </Section>
          <Section>
            <Skeleton height={120} borderRadius={radius.lg} />
          </Section>
          <Section>
            <Skeleton height={80} borderRadius={radius.lg} />
          </Section>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.streak}>
            🔥 {streak.count} day streak
          </Text>
        </View>

        {/* Daily Focus */}
        <Section title="Today's Focus">
          <Text style={styles.focusText}>{dailyFocus.text}</Text>
        </Section>

        {/* Progress Ring */}
        <Section title="Today's Progress">
          <View style={styles.progressContainer}>
            <ProgressRing progress={todayProgress} size={120} />
            <Text style={styles.progressLabel}>
              {todayProgress}% complete
            </Text>
          </View>
        </Section>

        {/* Quick Actions */}
        <Section title="Quick Actions">
          <View style={styles.actionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={action.onPress}
              >
                <Ionicons name={action.icon as any} size={24} color={colors.accent} />
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  streak: {
    fontSize: 16,
    color: colors.sub,
  },
  focusText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.sub,
    marginTop: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  greetingSkeleton: {
    marginBottom: 8,
  },
  streakSkeleton: {
    marginBottom: 24,
  },
});
