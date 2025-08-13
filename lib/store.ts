// lib/store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function logEvent(evt: { type: string; meta?: any }) {
  const key = "taru:events";
  const raw = await AsyncStorage.getItem(key);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push({ ts: Date.now(), ...evt });
  await AsyncStorage.setItem(key, JSON.stringify(arr));
  if (__DEV__) console.log("EVENT", evt);
}

export async function getEvents() {
  const key = "taru:events";
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

export async function clearEvents() {
  const key = "taru:events";
  await AsyncStorage.removeItem(key);
} 