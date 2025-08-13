import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Switch,
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../ui/designSystem';
import { Text } from '../../ui/Text';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';
import { haptics } from '../../lib/haptics';

// Block trigger types
const blockTriggers = [
  {
    id: 'time-based',
    title: 'Time-based Limits',
    description: 'Set daily usage limits',
    icon: 'time',
    color: colors.aqua,
  },
  {
    id: 'keywords',
    title: 'Keyword Triggers',
    description: 'Block specific content',
    icon: 'search',
    color: colors.salmon,
  },
  {
    id: 'manual',
    title: 'Manual Pause',
    description: 'Instant break when needed',
    icon: 'hand-left',
    color: colors.amber,
  },
];

// Time limit options
const timeLimits = [
  { id: '30min', label: '30 minutes', value: 30 },
  { id: '1hour', label: '1 hour', value: 60 },
  { id: '2hours', label: '2 hours', value: 120 },
  { id: '4hours', label: '4 hours', value: 240 },
];

export default function BlockScreen() {
  const [enabledTriggers, setEnabledTriggers] = useState<string[]>([]);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleTriggerToggle = (triggerId: string) => {
    haptics.light();
    setEnabledTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(id => id !== triggerId)
        : [...prev, triggerId]
    );
  };

  const handleTimeLimitSelect = (minutes: number) => {
    haptics.light();
    setSelectedTimeLimit(minutes);
  };

  const handlePauseAndReset = () => {
    haptics.medium();
    setIsPaused(true);
    
    // TODO: Implement actual device blocking
    console.log('Pause & Reset activated');
    
    // Simulate pause duration
    setTimeout(() => {
      setIsPaused(false);
      haptics.success();
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displayLarge" style={styles.title}>
            Block & Limit
          </Text>
          <Text variant="bodyLarge" color="textSecondary" style={styles.subtitle}>
            Set healthy boundaries
          </Text>
        </View>

        {/* Pause & Reset Button */}
        <TouchableOpacity
          style={[
            styles.pauseButton,
            isPaused && styles.pauseButtonActive
          ]}
          onPress={handlePauseAndReset}
          disabled={isPaused}
          activeOpacity={0.8}
        >
          <View style={styles.pauseContent}>
            <Icon 
              name={isPaused ? "checkmark-circle" : "pause"} 
              size="large" 
              color="white" 
            />
            <View style={styles.pauseText}>
              <Text variant="displaySmall" color="white" style={styles.pauseTitle}>
                {isPaused ? 'Paused' : 'Pause & Reset'}
              </Text>
              <Text variant="bodyMedium" color="white" style={styles.pauseSubtitle}>
                {isPaused ? 'Taking a mindful break...' : 'Instant 3-minute break'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Block Triggers */}
        <View style={styles.section}>
          <Text variant="displaySmall" style={styles.sectionTitle}>
            Block Triggers
          </Text>
          {blockTriggers.map((trigger) => (
            <Card key={trigger.id} variant="surface" style={styles.triggerCard}>
              <View style={styles.triggerHeader}>
                <View style={styles.triggerInfo}>
                  <View 
                    style={[
                      styles.triggerIcon, 
                      { backgroundColor: trigger.color }
                    ]}
                  >
                    <Icon name={trigger.icon as any} size="medium" color="white" />
                  </View>
                  <View style={styles.triggerText}>
                    <Text variant="bodyLarge" style={styles.triggerTitle}>
                      {trigger.title}
                    </Text>
                    <Text variant="bodyMedium" color="textSecondary">
                      {trigger.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={enabledTriggers.includes(trigger.id)}
                  onValueChange={() => handleTriggerToggle(trigger.id)}
                  trackColor={{ false: colors.textTertiary, true: colors.jade }}
                  thumbColor={colors.white}
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Time Limits */}
        {enabledTriggers.includes('time-based') && (
          <View style={styles.section}>
            <Text variant="displaySmall" style={styles.sectionTitle}>
              Daily Time Limit
            </Text>
            <View style={styles.timeLimitGrid}>
              {timeLimits.map((limit) => (
                <TouchableOpacity
                  key={limit.id}
                  style={[
                    styles.timeLimitCard,
                    selectedTimeLimit === limit.value && styles.timeLimitCardSelected
                  ]}
                  onPress={() => handleTimeLimitSelect(limit.value)}
                  activeOpacity={0.8}
                >
                  <Text 
                    variant="bodyLarge" 
                    color={selectedTimeLimit === limit.value ? 'white' : 'textPrimary'}
                    style={styles.timeLimitText}
                  >
                    {limit.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Status */}
        <View style={styles.section}>
          <Text variant="displaySmall" style={styles.sectionTitle}>
            Status
          </Text>
          <Card variant="surface" style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text variant="bodyMedium" color="textSecondary">
                Active triggers:
              </Text>
              <Text variant="bodyMedium" style={styles.statusValue}>
                {enabledTriggers.length || 'None'}
              </Text>
            </View>
            {selectedTimeLimit && (
              <View style={styles.statusRow}>
                <Text variant="bodyMedium" color="textSecondary">
                  Daily limit:
                </Text>
                <Text variant="bodyMedium" style={styles.statusValue}>
                  {selectedTimeLimit} minutes
                </Text>
              </View>
            )}
            <View style={styles.statusRow}>
              <Text variant="bodyMedium" color="textSecondary">
                Last reset:
              </Text>
              <Text variant="bodyMedium" style={styles.statusValue}>
                Today at 9:30 AM
              </Text>
            </View>
          </Card>
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Icon name="information-circle" size="small" color="textSecondary" />
          <Text variant="caption" color="textSecondary" style={styles.noteText}>
            This is a preview. Full device-wide blocking requires additional setup.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    opacity: 0.8,
  },
  pauseButton: {
    backgroundColor: colors.jade,
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: colors.jade,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  pauseButtonActive: {
    backgroundColor: colors.amber,
    shadowColor: colors.amber,
  },
  pauseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pauseText: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  pauseTitle: {
    marginBottom: spacing.xs,
  },
  pauseSubtitle: {
    opacity: 0.9,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
  },
  triggerCard: {
    marginBottom: spacing.md,
  },
  triggerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  triggerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  triggerText: {
    flex: 1,
  },
  triggerTitle: {
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  timeLimitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeLimitCard: {
    width: '48%',
    backgroundColor: colors.sand,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeLimitCardSelected: {
    backgroundColor: colors.jade,
    borderColor: colors.jade,
  },
  timeLimitText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  statusCard: {
    padding: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusValue: {
    fontWeight: '600',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.glass,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  noteText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
}); 