import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { getQueuedEvents, flushQueuedEvents, clearQueue, getQueueSize } from "../lib/pineconeClient";

export default function AnalyticsDiagnostics() {
  const [events, setEvents] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");
  const [queueSize, setQueueSize] = useState<number>(0);

  async function load() {
    const queuedEvents = await getQueuedEvents();
    setEvents(queuedEvents);
    setQueueSize(getQueueSize());
  }

  async function flush() {
    setStatus("Flushing...");
    const result = await flushQueuedEvents();
    setStatus(JSON.stringify(result, null, 2));
    await load();
  }

  async function clear() {
    await clearQueue();
    setStatus("Queue cleared");
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics Diagnostics</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Queue Size: {queueSize}</Text>
        <Text style={styles.statsText}>Events Loaded: {events.length}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable onPress={load} style={[styles.button, styles.loadButton]}>
          <Text style={styles.buttonText}>Load</Text>
        </Pressable>
        <Pressable onPress={flush} style={[styles.button, styles.flushButton]}>
          <Text style={styles.buttonText}>Flush</Text>
        </Pressable>
        <Pressable onPress={clear} style={[styles.button, styles.clearButton]}>
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
      </View>

      {status ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      ) : null}

      <Text style={styles.eventsLabel}>Queued Events:</Text>
      {events.map((event, i) => (
        <View key={i} style={styles.eventContainer}>
          <Text style={styles.eventType}>{event.type}</Text>
          <Text style={styles.eventTime}>
            {new Date(event.ts).toLocaleTimeString()}
          </Text>
          <Text style={styles.eventPayload}>
            {JSON.stringify(event.payload, null, 2)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsText: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  loadButton: {
    backgroundColor: "#333",
  },
  flushButton: {
    backgroundColor: "#2a5",
  },
  clearButton: {
    backgroundColor: "#a22",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  statusContainer: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusLabel: {
    color: "#9f9",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "monospace",
  },
  eventsLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  eventContainer: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventType: {
    color: "#4af",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventTime: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
  eventPayload: {
    color: "#ddd",
    fontSize: 12,
    fontFamily: "monospace",
  },
}); 