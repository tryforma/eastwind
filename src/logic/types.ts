/** Where he says he is. Only shapes the wording. Nothing is inferred from anything he logs. */
export type Situation = 'years' | 'cycle' | 'burnout' | 'lonely' | 'want';
export const SITUATIONS: [Situation, string, string][] = [
  ['years', 'I have fought this for years', 'and I am tired of fighting'],
  ['cycle', 'I quit, then I go back', 'the streak apps made it worse'],
  ['burnout', 'It is the only relief I get', 'I work, and work, and nothing comes back'],
  ['lonely', 'There is no one in my life', 'no woman, few friends, a lot of evenings'],
  ['want', 'I want a woman and I am scared', 'to ask, to be seen, to be bad at it'],
];

/** What he has been preparing with. The life he built the shelves for. */
export type Prep = 'meals' | 'money' | 'business' | 'gym' | 'reading' | 'nodates' | 'nofriends' | 'norest';
export const PREPS: [Prep, string][] = [
  ['meals', 'Meal prep'],
  ['money', 'Saving money'],
  ['business', 'Building a business'],
  ['gym', 'The gym'],
  ['reading', 'Self-improvement'],
  ['nodates', 'No dates in a while'],
  ['nofriends', 'Friends went quiet'],
  ['norest', 'No real rest'],
];

/** The only thing this app counts: real warmth that happened. */
export type FruitKind = 'her' | 'friend' | 'sun' | 'rest' | 'brave' | 'made';
export const FRUITS: { id: FruitKind; label: string; emoji: string; hint: string }[] = [
  { id: 'her', label: 'Her', emoji: '🌹', hint: 'A conversation, a laugh, a date, her hand. Any size.' },
  { id: 'brave', label: 'Asked', emoji: '🕊', hint: 'A message sent, a number asked for, a date proposed.' },
  { id: 'friend', label: 'A friend', emoji: '🍻', hint: 'You called, they came, you went.' },
  { id: 'sun', label: 'Daylight', emoji: '☀️', hint: 'Outside, phone away, face in the sun.' },
  { id: 'rest', label: 'Rest', emoji: '🌙', hint: 'A night off, a nap, a whole Sunday.' },
  { id: 'made', label: 'Made something', emoji: '🔥', hint: 'With life in it, not just work.' },
];

export type Fruit = { id: string; at: string; kind: FruitKind; text: string };

export type Message = { id: string; role: 'user' | 'him'; text: string; at: string; risk?: boolean };

/** One day's record. Keyed by local YYYY-MM-DD. */
export type Day = {
  date: string;
  realThing?: string;
  realThingKind?: FruitKind;
  realThingDone: boolean;
  sceneId?: string;
  sceneDone: boolean;
  /** How many times he opened the urge screen. Private, never shown as a failure, never a streak. */
  urges: number;
};

export type Prompt = { q: string; a: string };
export type DatePlan = { id: string; who: string; where: string; at: string; debrief?: string; feltWarm?: boolean };

export type AppState = {
  onboarded: boolean;
  name: string;
  situation: Situation;
  preps: Prep[];
  /** The last time he felt warm, in his words. Shown back to him on hard nights. */
  lastWarm: string;
  days: Record<string, Day>;
  fruits: Fruit[];
  talk: Message[];
  memory: string;
  checklist: string[];
  prompts: Prompt[];
  dates: DatePlan[];
  reminders: { enabled: boolean; hour: number };
  createdAt: string;
};

export const DEFAULT_STATE: AppState = {
  onboarded: false,
  name: '',
  situation: 'years',
  preps: [],
  lastWarm: '',
  days: {},
  fruits: [],
  talk: [],
  memory: '',
  checklist: [],
  prompts: [],
  dates: [],
  reminders: { enabled: false, hour: 8 },
  createdAt: '',
};

export const FREE_TALK_PER_DAY = 15;
export const FREE_SCENES = 3;

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Local calendar date as YYYY-MM-DD. */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function emptyDay(date: string): Day {
  return { date, realThingDone: false, sceneDone: false, urges: 0 };
}

export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}
