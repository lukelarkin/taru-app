// lib/notifications.ts
import * as Notifications from "expo-notifications";

export async function ensureNotifPerms() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === "granted";
  }
  return true;
}

export async function scheduleReminder(title: string, body: string, trigger: any) {
  const hasPermission = await ensureNotifPerms();
  if (!hasPermission) {
    console.warn("Notification permission not granted");
    return null;
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: false,
    },
    trigger,
  });
} 