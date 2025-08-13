// lib/pineconeClient.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export type VectorEvent = { 
  id: string; 
  type: string; 
  payload: any; 
  ts: number; 
  deviceId?: string; 
  userId?: string; 
};

const KEY = "taru_event_queue_v1";
const MAX = 1000;

let memoryQueue: VectorEvent[] = [];
let hydrated = false;
let flushing = false;

async function hydrate() {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    memoryQueue = raw ? JSON.parse(raw) : [];
    hydrated = true;
    console.log(`📦 Hydrated ${memoryQueue.length} events from storage`);
  } catch (error) {
    console.error('Failed to hydrate queue:', error);
    memoryQueue = [];
    hydrated = true;
  }
}

async function persist() {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(memoryQueue.slice(-MAX)));
    console.log(`💾 Persisted ${memoryQueue.length} events to storage`);
  } catch (error) {
    console.error('Failed to persist queue:', error);
  }
}

export async function enqueueEvent(e: VectorEvent) {
  await hydrate();
  memoryQueue.push(e);
  if (memoryQueue.length > MAX) {
    const dropped = memoryQueue.length - MAX;
    memoryQueue = memoryQueue.slice(-MAX);
    console.warn(`⚠️ Queue full, dropped ${dropped} oldest events`);
  }
  await persist();
  console.log(`📝 Event queued: ${e.type} (${memoryQueue.length} total)`);
}

export async function getQueuedEvents() {
  await hydrate();
  return [...memoryQueue];
}

export async function clearQueue() {
  await hydrate();
  memoryQueue = [];
  await persist();
  console.log('🗑️ Queue cleared');
}

export async function flushQueuedEvents(opts?: { endpoint?: string; token?: string }) {
  await hydrate();
  if (flushing) {
    console.log('⏳ Flush already in progress, skipping');
    return { ok: false, reason: "in-progress" };
  }
  if (!memoryQueue.length) {
    console.log('📭 No events to flush');
    return { ok: true, count: 0 };
  }

  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    console.log('📡 No network connection, skipping flush');
    return { ok: false, reason: "offline" };
  }

  flushing = true;
  const batch = [...memoryQueue];
  console.log(`🚀 Flushing ${batch.length} events to server...`);
  
  try {
    const endpoint = opts?.endpoint ?? process.env.EXPO_PUBLIC_INGEST_ENDPOINT!;
    const token = opts?.token ?? process.env.EXPO_PUBLIC_INGEST_TOKEN!;
    
    if (!endpoint || !token) {
      console.warn('⚠️ Missing endpoint or token, skipping flush');
      return { ok: false, reason: "missing-config" };
    }
    
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ events: batch }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    // On success, clear what we sent
    memoryQueue = [];
    await persist();
    console.log(`✅ Successfully flushed ${batch.length} events`);
    return { ok: true, count: batch.length };
    
  } catch (err) {
    console.error('❌ Flush failed:', err);
    // leave queue intact for retry
    return { ok: false, error: String(err) };
  } finally {
    flushing = false;
  }
}

// Legacy functions for backward compatibility
export function getQueueSize(): number {
  return memoryQueue.length;
}

// Convenience functions for common event types
export async function trackBehavior(userId: string, behavior: any) {
  await enqueueEvent({
    id: `behavior-${userId}-${Date.now()}`,
    type: 'behavior',
    payload: behavior,
    ts: Date.now(),
    userId,
  });
}

export async function trackIntervention(userId: string, intervention: any) {
  await enqueueEvent({
    id: `intervention-${userId}-${Date.now()}`,
    type: 'intervention',
    payload: intervention,
    ts: Date.now(),
    userId,
  });
}

export async function trackOutcome(userId: string, outcome: any) {
  await enqueueEvent({
    id: `outcome-${userId}-${Date.now()}`,
    type: 'outcome',
    payload: outcome,
    ts: Date.now(),
    userId,
  });
}

export async function trackResetComplete(userId: string, resetData: any) {
  await enqueueEvent({
    id: `reset-${userId}-${Date.now()}`,
    type: 'reset_complete',
    payload: resetData,
    ts: Date.now(),
    userId,
  });
} 