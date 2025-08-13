// lib/toolDispatcher.ts
import { haptics } from './haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logEvent } from './store';
import { scheduleReminder as scheduleReminderUtil } from './notifications';

type ToolCall =
  | { tool: "start_reset"; args: { name: string; duration_s: number } }
  | { tool: "nudge_block"; args: { domains: string[] } }
  | { tool: "schedule_reminder"; args: { minutes_from_now: number; title: string } }
  | { tool: "log_event"; args: { kind: string; payload?: Record<string, any> } }
  | { tool: "stash_reflection"; args: { text: string } };

const toolsEnabled = process.env.EXPO_PUBLIC_TOOLS_ENABLED !== "false";

export async function runTools(toolCalls: ToolCall[] = []) {
  if (!toolsEnabled) {
    console.log('Tools disabled by feature flag');
    return;
  }
  
  for (const tc of toolCalls) {
    try {
      if (tc.tool === "start_reset") {
        await startReset(tc.args.name as any, tc.args.duration_s);
      } else if (tc.tool === "nudge_block") {
        await nudgeBlock(tc.args.domains);
      } else if (tc.tool === "schedule_reminder") {
        await scheduleReminder(tc.args.minutes_from_now, tc.args.title);
      } else if (tc.tool === "log_event") {
        await logEvent({ type: tc.args.kind, meta: tc.args.payload ?? {} });
      } else if (tc.tool === "stash_reflection") {
        await stashReflection(tc.args.text);
      }
    } catch (e) {
      // swallow tool errors so UI continues; optionally toast
      console.warn("tool error", tc.tool, e);
    }
  }
}

// Tool implementations
async function startReset(name: string, duration_s: number) {
  haptics.success();
  // TODO: Navigate to resets tab and start the specific reset
  console.log('Starting reset:', name, duration_s);
  await logEvent({ type: 'reset_start', meta: { name, duration_s } });
}

async function nudgeBlock(domains: string[]) {
  haptics.medium();
  // TODO: Implement actual blocking functionality
  console.log('Blocking domains:', domains);
  await logEvent({ type: 'block_nudge', meta: { domains } });
}

async function scheduleReminder(minutes: number, title: string) {
  haptics.light();
  const success = await scheduleReminderUtil(minutes, title);
  if (success) {
    await logEvent({ type: 'reminder_scheduled', meta: { minutes, title } });
  } else {
    await logEvent({ type: 'reminder_failed', meta: { minutes, title } });
  }
}

async function stashReflection(text: string) {
  haptics.light();
  const key = "taru:journal";
  const raw = await AsyncStorage.getItem(key);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push({ ts: Date.now(), text });
  await AsyncStorage.setItem(key, JSON.stringify(arr));
  await logEvent({ type: 'reflection_stashed', meta: { textLength: text.length } });
} 