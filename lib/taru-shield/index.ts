import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const NATIVE = NativeModules.TARUShieldBridge;
const emitter = new NativeEventEmitter(NATIVE);

export function onAuthorization(cb: (authorized: boolean) => void) {
  const sub = emitter.addListener('onAuthorization', (p) => cb(!!p?.authorized));
  return () => sub.remove();
}

export function onShieldError(cb: (msg: string) => void) {
  const sub = emitter.addListener('onError', (p) => cb(String(p?.message ?? '')));
  return () => sub.remove();
}

export async function requestAuthorization(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  return NATIVE.requestAuthorization();
}

export function applyBlock(opts: { bundleIds?: string[]; webDomains?: string[]; categories?: string[] }) {
  if (Platform.OS !== 'ios') return;
  NATIVE.applyBlock(opts.bundleIds ?? [], opts.webDomains ?? [], opts.categories ?? []);
}

export function clearAllBlocks() {
  if (Platform.OS !== 'ios') return;
  NATIVE.clearAllBlocks();
}

export async function getTodayUsageSeconds(bundleId: string): Promise<number> {
  if (Platform.OS !== 'ios') return 0;
  return NATIVE.getTodayUsageSeconds(bundleId);
}

// Predefined blocking lists
export const PORN_DOMAINS = [
  "pornhub.com", "xvideos.com", "xnxx.com", "xhamster.com", 
  "redtube.com", "onlyfans.com", "chaturbate.com", "myfreecams.com"
];

export const GAMBLING_DOMAINS = [
  "bet365.com", "draftkings.com", "fanduel.com", "stake.com", 
  "bovada.lv", "888casino.com", "pokerstars.com"
];

export const GAMING_DOMAINS = [
  "roblox.com", "epicgames.com", "store.steampowered.com", 
  "twitch.tv", "discord.com", "minecraft.net"
];

export const SOCIAL_BUNDLES = [
  "com.burbn.instagram", "com.facebook.Facebook", 
  "com.toyopagroup.picaboo", "com.zhiliaoapp.musically",
  "com.twitter.ios", "com.snapchat.ghost"
];
