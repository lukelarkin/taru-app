import AsyncStorage from "@react-native-async-storage/async-storage";

const K = {
  status: "taru:program:status",
  progress: "taru:program:progress"
};

export type ProgramStatus = { enrolled: boolean; day: number; week: number };
export async function getStatus(): Promise<ProgramStatus> {
  const raw = await AsyncStorage.getItem(K.status);
  return raw ? JSON.parse(raw) : { enrolled: false, day: 1, week: 1 };
}
export async function setStatus(s: ProgramStatus) {
  await AsyncStorage.setItem(K.status, JSON.stringify(s));
}
export async function markProgress(module_id: string, step_id: string) {
  const raw = await AsyncStorage.getItem(K.progress);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push({ ts: Date.now(), module_id, step_id, done: true });
  await AsyncStorage.setItem(K.progress, JSON.stringify(arr));
}
