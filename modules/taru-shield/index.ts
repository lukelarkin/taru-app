import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

type ShieldModule = {
  isAvailable?: boolean;
  requestAuthorization?: () => Promise<boolean>;
  applyBlock?: (opts: any) => void;
  clearAllBlocks?: () => void;
  startMonitoring?: (args?: any) => Promise<void>;
  stopMonitoring?: () => Promise<void>;
  getTodayUsageJSON?: () => Promise<string>;
  presentUsageReport?: (opts: any) => void;
  getTodayMinutesTotal?: () => Promise<number>;
  openFamilyActivityPicker?: () => Promise<boolean>;
};

const native: ShieldModule | null =
  Platform.OS === "ios" && NativeModules.TARUShieldBridge
    ? NativeModules.TARUShieldBridge
    : null;

export const SHIELD_AVAILABLE = !!native;

const emitter = native ? new NativeEventEmitter(native as any) : null;

export const PORN_DOMAINS = ["pornhub.com","xvideos.com","xnxx.com","xhamster.com","redtube.com","onlyfans.com"];
export const GAMBLING_DOMAINS = ["bet365.com","draftkings.com","fanduel.com","stake.com","bovada.lv"];
export const GAMING_DOMAINS = ["roblox.com","epicgames.com","store.steampowered.com","twitch.tv"];
export const SOCIAL_BUNDLES = ["com.burbn.instagram","com.facebook.Facebook","com.zhiliaoapp.musically","com.toyopagroup.picaboo"];

export function onAuthorization(cb: (authorized: boolean) => void) {
  if (!emitter) {
    console.warn("[TARU] Shield unavailable (running in Expo Go).");
    return () => {};
  }
  const sub = emitter.addListener('onAuthorization', (p) => cb(!!p?.authorized));
  return () => sub.remove();
}

export function onShieldError(cb: (msg: string) => void) {
  if (!emitter) {
    console.warn("[TARU] Shield unavailable (running in Expo Go).");
    return () => {};
  }
  const sub = emitter.addListener('onError', (p) => cb(String(p?.message ?? '')));
  return () => sub.remove();
}

export async function requestAuthorization(): Promise<boolean> {
  if (!native) {
    console.warn("[TARU] Shield unavailable (running in Expo Go).");
    return false;
  }
  return native.requestAuthorization?.() || false;
}

export function applyBlock(opts: { bundleIds?: string[]; webDomains?: string[]; categories?: string[] }) {
  if (!native) {
    console.warn("[TARU] Shield unavailable (running in Expo Go).");
    return;
  }
  native.applyBlock?.(opts.bundleIds ?? [], opts.webDomains ?? [], opts.categories ?? []);
}

export function clearAllBlocks() {
  if (!native) {
    console.warn("[TARU] Shield unavailable (running in Expo Go).");
    return;
  }
  native.clearAllBlocks?.();
}

export async function getTodayUsageSeconds(bundleId: string): Promise<number> {
  if (!native) return 0;
  return native.getTodayUsageSeconds?.(bundleId) || 0;
}

export async function openApplePicker(): Promise<boolean> {
  if (!native || !native.openFamilyActivityPicker) return false;
  return native.openFamilyActivityPicker() || false;
}

// DeviceActivity monitoring
export async function startMonitoring(opts: { bundleIds?: string[]; webDomains?: string[] } = {}) {
  if (!native) {
    console.warn("[TARU] Shield unavailable (running in Expo Go).");
    return;
  }
  const { bundleIds = [], webDomains = [] } = opts;
  return native.startMonitoring?.(bundleIds, webDomains);
}

export async function stopMonitoring() {
  if (!native) {
    console.warn("[TARU] Shield unavailable (running in Expo Go).");
    return;
  }
  return native.stopMonitoring?.();
}

export async function getTodayUsageJSON(): Promise<string> {
  if (!native) return "{}";
  return native.getTodayUsageJSON?.() || "{}";
}

// Usage reporting
export function presentUsageReport(opts: { bundleIds?: string[]; webDomains?: string[] } = {}) {
  if (!native) {
    console.warn("[TARU] Shield unavailable (running in Expo Go).");
    return;
  }
  return native.presentUsageReport?.(opts.bundleIds ?? [], opts.webDomains ?? []);
}

export async function getTodayMinutesTotal(): Promise<number> {
  if (!native) return 0;
  return native.getTodayMinutesTotal?.() || 0;
}
