import { FruitKind, AppState, Prep } from '../logic/types';

export type RealThing = { id: string; kind: FruitKind; text: string; size: 'tiny' | 'small' | 'brave' };

/** The daily suggestions. Life acts, not disciplines. Everything here adds; nothing subtracts. */
export const REAL_THINGS: RealThing[] = [
  { id: 'h1', kind: 'brave', text: 'Open Hinge. Send one message that names something specific in her profile. Close the app.', size: 'small' },
  { id: 'h2', kind: 'brave', text: 'Ask her for coffee with a day and a time. "Thursday at 6, the place on 5th?"', size: 'brave' },
  { id: 'h3', kind: 'brave', text: 'Reply to the match you have been sitting on. Two sentences. Then go outside.', size: 'tiny' },
  { id: 'h4', kind: 'brave', text: 'Ask the woman you already know, the one you keep noticing, if she wants to get lunch.', size: 'brave' },
  { id: 'h5', kind: 'brave', text: 'Rewrite one Hinge prompt so it sounds like you talking, not you performing.', size: 'small' },
  { id: 'h6', kind: 'brave', text: 'Get a friend to take three photos of you outside today, in daylight, doing something.', size: 'small' },
  { id: 'r1', kind: 'her', text: 'Plan the date somewhere with daylight: a walk, a market, a coffee with a window.', size: 'small' },
  { id: 'r2', kind: 'her', text: 'On the date, ask one question you are actually curious about, then shut up and listen.', size: 'small' },
  { id: 'r3', kind: 'her', text: 'Compliment a woman on something she chose, not something she was born with. Her earrings. Her order.', size: 'tiny' },
  { id: 'r4', kind: 'her', text: 'Text her the next morning after a date. One line. "Had a good time. Same again next week?"', size: 'small' },
  { id: 'f1', kind: 'friend', text: 'Text the friend you went quiet on: "thinking about you. how is it going?"', size: 'tiny' },
  { id: 'f2', kind: 'friend', text: 'Call someone for five minutes. Not about any of this. Just a voice.', size: 'small' },
  { id: 'f3', kind: 'friend', text: 'Say yes to the next invitation, even the one you would normally skip.', size: 'small' },
  { id: 'f4', kind: 'friend', text: 'Plan Saturday with a person. Anything. Put it in the calendar now.', size: 'small' },
  { id: 'f5', kind: 'friend', text: 'Cook the meal you prep every week, for two, and invite someone over.', size: 'brave' },
  { id: 's1', kind: 'sun', text: 'Ten minutes outside before noon. Phone in your pocket. Face up.', size: 'tiny' },
  { id: 's2', kind: 'sun', text: 'Walk somewhere with people in it. A market, a park, a main street. Be around.', size: 'small' },
  { id: 's3', kind: 'sun', text: 'Eat lunch outside. No laptop.', size: 'tiny' },
  { id: 's4', kind: 'sun', text: 'Train outside instead of inside, once this week.', size: 'small' },
  { id: 'z1', kind: 'rest', text: 'Take tonight off. All of it. Nothing gets built. You get rebuilt.', size: 'small' },
  { id: 'z2', kind: 'rest', text: 'Lights off before eleven. The phone charges in another room.', size: 'small' },
  { id: 'z3', kind: 'rest', text: 'A whole Sunday with nothing scheduled. Sleep, eat, sun, people. That is the schedule.', size: 'brave' },
  { id: 'z4', kind: 'rest', text: 'Twenty-minute nap after lunch. Set a timer. Nobody is watching.', size: 'tiny' },
  { id: 'm1', kind: 'made', text: 'Do one hour on the business that you actually enjoy. Skip the part you dread today.', size: 'small' },
  { id: 'm2', kind: 'made', text: 'Make something with no purpose. A meal for the taste of it. A song. A bad drawing.', size: 'small' },
  { id: 'm3', kind: 'made', text: 'Fix one broken thing in the house. Feel the small pride. That is fuel.', size: 'tiny' },
];

const KIND_WEIGHT: Record<FruitKind, number> = { her: 1, brave: 1, friend: 1, sun: 1, rest: 1, made: 0.6 };

/** Picks a spread of suggestions, weighted toward what he said is missing, rotated by day so it is not the same four. */
export function suggestions(state: AppState, todayKey: string, n = 4): RealThing[] {
  const w = { ...KIND_WEIGHT };
  const has = (p: Prep) => state.preps.includes(p);
  if (has('nodates')) { w.brave += 1.2; w.her += 0.6; }
  if (has('nofriends')) w.friend += 1.2;
  if (has('norest') || state.situation === 'burnout') w.rest += 1.4;
  if (has('business')) w.made += 0.3;
  if (state.situation === 'want') w.brave += 1;
  if (state.situation === 'lonely') { w.friend += 0.8; w.brave += 0.5; }
  const seed = todayKey.split('-').reduce((a, b) => a + Number(b) * 31, 0);
  const scored = REAL_THINGS.map((t, i) => ({ t, s: (w[t.kind] ?? 1) * (0.55 + ((seed * (i + 7)) % 97) / 97) }));
  scored.sort((a, b) => b.s - a.s);
  const out: RealThing[] = [];
  const kinds = new Set<FruitKind>();
  for (const { t } of scored) {
    if (kinds.has(t.kind) && out.length < n - 1) continue;
    out.push(t);
    kinds.add(t.kind);
    if (out.length >= n) break;
  }
  return out;
}
