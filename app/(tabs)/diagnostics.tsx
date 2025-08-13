import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../ui/designSystem';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { getEvents, clearEvents } from '../../lib/store';

interface Event {
  ts: number;
  type: string;
  meta?: any;
}

export default function DiagnosticsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const eventList = await getEvents();
      setEvents(eventList.slice(-20)); // Show last 20 events
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleClearEvents = async () => {
    await clearEvents();
    setEvents([]);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="displayLarge" style={styles.title}>
          Diagnostics
        </Text>
        <Text variant="bodyLarge" color="textSecondary" style={styles.subtitle}>
          Event logs and system status
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearEvents}>
          <Text variant="bodyMedium" color="white">Clear Events</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.eventsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" color="textSecondary">
              No events logged yet. Try using Athena to generate some events.
            </Text>
          </View>
        ) : (
          events.map((event, index) => (
            <Card key={index} variant="surface" style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text variant="bodyMedium" color="textPrimary" style={styles.eventType}>
                  {event.type}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {formatTime(event.ts)}
                </Text>
              </View>
              {event.meta && (
                <Text variant="caption" color="textSecondary" style={styles.eventMeta}>
                  {JSON.stringify(event.meta, null, 2)}
                </Text>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    opacity: 0.8,
  },
  controls: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  clearButton: {
    backgroundColor: colors.salmon,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  eventCard: {
    marginBottom: spacing.sm,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eventType: {
    fontWeight: '600',
  },
  eventMeta: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
}); 