// features/analytics/storage.ts
import { v4 as uuidv4 } from "uuid";
import type { Analytics, AnalyticsEvent } from "../../lib/analytics";

// Simple in-memory storage for now
// TODO: Replace with SQLite implementation
const events: AnalyticsEvent[] = [];
const edges: { from_id: string; to_id: string }[] = [];

function insertEvent(e: Omit<AnalyticsEvent, "id" | "ts"> & { ts?: number }): Promise<string> {
  const id = uuidv4();
  const ts = e.ts ?? Date.now();
  const event = { ...e, ts, id } as AnalyticsEvent;
  events.push(event);
  console.log('📊 Analytics event logged:', event);
  return Promise.resolve(id);
}

async function selectRecent(limit = 100): Promise<AnalyticsEvent[]> {
  return events
    .sort((a, b) => b.ts - a.ts)
    .slice(0, limit);
}

function insertEdge(fromId: string, toId: string): Promise<void> {
  edges.push({ from_id: fromId, to_id: toId });
  console.log('🔗 Analytics edge created:', { from_id: fromId, to_id: toId });
  return Promise.resolve();
}

function resetAll(): Promise<void> {
  events.length = 0;
  edges.length = 0;
  console.log('🗑️ Analytics data cleared');
  return Promise.resolve();
}

export function getAnalytics(): Analytics {
  return {
    async log(e) { return insertEvent(e as any); },
    async recent(limit) { return selectRecent(limit); },
    async link(fromId, toId) { return insertEdge(fromId, toId); },
    async resetAll() { return resetAll(); },
  };
} 