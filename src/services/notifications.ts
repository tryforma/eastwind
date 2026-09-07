/**
 * One local reminder a day at the chosen hour (Pro). Scheduled on-device; nothing is sent anywhere.
 */
import { Platform } from 'react-native';

const DAYS_AHEAD = 14;

const LINES: string[] = [
  'One real thing today. Any size.',
  'Go outside once. Talk to one person. That is the whole job.',
  'Send the message. Then close the app and go live.',
  'Rest is not a reward. Take some.',
  'You are allowed to want her. Go say hello.',
  'Sun on your face, ten minutes, no phone.',
  'Call a friend. Not about anything.',
  'Ask her for coffee. A day and a time.',
  'Nothing is missing in you. Add one thing around you.',
  'Last night does not get a vote on this morning.',
  'The screen is a picture of a meal. Go eat.',
  'You are not behind. You are early.',
  'Take tonight off. All of it.',
  'One fruit today. Even a tiny one.',
];

type Notif = typeof import('expo-notifications');
let mod: Notif | null = null;
function lib(): Notif | null {
  if (Platform.OS === 'web') return null;
  if (!mod) {
    try {
      mod = require('expo-notifications') as Notif;
      mod.setNotificationHandler({
        handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
      });
    } catch {
      mod = null;
    }
  }
  return mod;
}

export async function requestPermission(): Promise<boolean> {
  const N = lib();
  if (!N) return false;
  const cur = await N.getPermissionsAsync();
  if (cur.granted) return true;
  const res = await N.requestPermissionsAsync();
  return !!res.granted;
}

export async function cancelReminders(): Promise<void> {
  const N = lib();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync().catch(() => {});
}

/** Rebuilds the queue for the next DAYS_AHEAD days. Re-run on every app open while reminders are on. */
export async function scheduleReminders(hour: number, name: string): Promise<boolean> {
  const N = lib();
  if (!N) return false;
  const ok = await requestPermission();
  if (!ok) return false;
  await cancelReminders();
  if (Platform.OS === 'android') {
    await N.setNotificationChannelAsync('reminders', { name: 'Reminders', importance: N.AndroidImportance.DEFAULT }).catch(() => {});
  }
  const now = new Date();
  const offset = Math.floor(now.getTime() / 86_400_000) % LINES.length;
  for (let d = 0; d < DAYS_AHEAD; d++) {
    const when = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, hour, 0, 0, 0);
    if (when.getTime() <= now.getTime() + 60_000) continue;
    await N.scheduleNotificationAsync({
      content: { title: name ? `${name}, morning` : 'Morning', body: LINES[(offset + d) % LINES.length], sound: false },
      trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: when },
    }).catch(() => {});
  }
  return true;
}

export function formatHour(h: number): string {
  const ampm = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:00 ${ampm}`;
}

/** One local notification two hours before a date. Nothing is sent anywhere. */
export async function scheduleDateReminder(at: Date, who: string): Promise<boolean> {
  const N = lib();
  if (!N) return false;
  const ok = await requestPermission();
  if (!ok) return false;
  const when = new Date(at.getTime() - 2 * 3600_000);
  if (when.getTime() <= Date.now() + 60_000) return false;
  await N.scheduleNotificationAsync({
    content: { title: who ? `${who}, in two hours` : 'In two hours', body: 'Four minutes of calm, then go. You are allowed to be nervous.', sound: false },
    trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: when },
  }).catch(() => {});
  return true;
}
