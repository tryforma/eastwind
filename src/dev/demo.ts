/**
 * Web-only demo seeding for App Store screenshots. `?demo=<name>` on web writes a canned AppState to
 * localStorage before AppContext hydrates. Null on iOS/Android.
 */
import { Platform } from 'react-native';
import { AppState, DEFAULT_STATE, Day, dateKey } from '../logic/types';
import { RootStackParamList, TabParamList } from '../navigation';

const STORAGE_KEY = 'eastwind.state.v1';

export type DemoName = 'today' | 'talk' | 'dates' | 'fruits' | 'settings' | 'paywall' | 'onboard' | 'urge' | 'scene' | 'fresh';
const VALID: DemoName[] = ['today', 'talk', 'dates', 'fruits', 'settings', 'paywall', 'onboard', 'urge', 'scene', 'fresh'];

export type Demo = { name: DemoName; screen: keyof RootStackParamList | null; tab: keyof TabParamList; pro: boolean; snap: boolean; now?: Date; onboardStep?: number };

function iso(now: Date, daysAgo: number, hour = 19): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, hour, 12);
  return d.toISOString();
}

function buildState(name: DemoName, now: Date, pro: boolean): AppState | null {
  if (name === 'onboard' || name === 'fresh') return null;
  const days: Record<string, Day> = {};
  for (let i = 12; i >= 0; i--) {
    const k = dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i));
    days[k] = { date: k, realThing: i === 0 ? 'Ask her for coffee with a day and a time. "Thursday at 6, the place on 5th?"' : 'Ten minutes outside before noon.', realThingKind: i === 0 ? 'brave' : 'sun', realThingDone: i !== 0 && i % 4 !== 1, sceneDone: i % 3 !== 0, urges: i % 5 === 0 ? 1 : 0 };
  }
  return {
    ...DEFAULT_STATE,
    onboarded: true,
    name: 'Dan',
    situation: 'burnout',
    preps: ['meals', 'money', 'business', 'nodates'],
    lastWarm: 'My cousin’s wedding. Dancing with her friend, badly.',
    days,
    fruits: [
      { id: 'f1', at: iso(now, 0, 13), kind: 'sun', text: 'Lunch outside. Actually outside.' },
      { id: 'f2', at: iso(now, 1), kind: 'her', text: 'Maya laughed at the cilantro thing. Twice.' },
      { id: 'f3', at: iso(now, 2), kind: 'brave', text: 'Sent the message. Named the bakery.' },
      { id: 'f4', at: iso(now, 3), kind: 'friend', text: 'Called Sam. 40 minutes. Nothing about any of this.' },
      { id: 'f5', at: iso(now, 5), kind: 'rest', text: 'Took Saturday. All of it.' },
      { id: 'f6', at: iso(now, 6), kind: 'made', text: 'Cooked for my sister. She had seconds.' },
      { id: 'f7', at: iso(now, 8), kind: 'sun', text: 'Walked to the market instead of driving.' },
      { id: 'f8', at: iso(now, 9), kind: 'brave', text: 'Rewrote the first prompt. Sounds like me now.' },
    ],
    talk: [
      { id: 'm1', role: 'user', at: iso(now, 0, 21), text: 'matched with someone. she runs a bakery and hates cilantro. no idea what to say' },
      { id: 'm2', role: 'him', at: iso(now, 0, 21), text: 'you already have it. "a baker who hates cilantro. what happens when someone orders the cilantro loaf?"\n\ntwo sentences, then close the app. it is her turn.' },
      { id: 'm3', role: 'user', at: iso(now, 0, 21), text: 'she replied. she said "it doesn’t exist and it never will". what now' },
      { id: 'm4', role: 'him', at: iso(now, 0, 21), text: 'that is a yes with a joke on it. two more exchanges, then ask: a day, a time, a place. coffee near her bakery, thursday at 6.\n\nyou are allowed to ask. she wants you to.' },
    ],
    memory: 'Dan. Runs a small business, 14-hour days. Matched with Maya (bakery). Cousin\'s wedding was the last warm thing.',
    checklist: ['c1', 'c2', 'c4', 'c7'],
    prompts: [{ q: 'My simple pleasures', a: 'Sunday cooking with the radio on. Beating my brother at anything.' }, { q: 'Together, we could', a: 'find the best taco in the city and argue about it.' }],
    dates: [{ id: 'd1', who: 'Maya', where: 'Coffee near the bakery', at: iso(now, -2, 18) }],
    reminders: { enabled: pro, hour: 8 },
    createdAt: iso(now, 12, 9),
  };
}

function read(): Demo | null {
  if (Platform.OS !== 'web') return null;
  if (typeof window === 'undefined' || !window.location || !window.localStorage) return null;
  const params = new URLSearchParams(window.location.search);
  const name = params.get('demo') as DemoName | null;
  if (!name || !VALID.includes(name)) return null;
  const pro = name !== 'paywall' && params.get('pro') !== '0';
  const now = new Date();
  const state = buildState(name, now, pro);
  try {
    if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
  const tab: keyof TabParamList = name === 'talk' ? 'Talk' : name === 'dates' ? 'Dates' : name === 'fruits' ? 'Fruits' : name === 'settings' ? 'Settings' : 'Today';
  const onboarding = name === 'onboard' || name === 'fresh';
  const step = params.get('step');
  return { name, screen: name === 'paywall' ? 'Paywall' : name === 'urge' ? 'Urge' : name === 'scene' ? 'Scene' : onboarding ? null : 'Tabs', tab, pro, snap: params.get('snap') === '1', onboardStep: step ? Number(step) : undefined };
}

export const demo: Demo | null = read();
export const snap = !!demo?.snap;
