import { AppState, Fruit, FruitKind } from './types';

/** Fruits in the last N days. */
export function recentFruits(state: AppState, days: number, now = new Date()): Fruit[] {
  const cutoff = now.getTime() - days * 86_400_000;
  return state.fruits.filter((f) => new Date(f.at).getTime() >= cutoff);
}

/** 0..1, how high the sun is: rises with fruits over 21 days, with variety counting extra. Never resets. */
export function sunLevel(state: AppState, now = new Date()): number {
  const f = recentFruits(state, 21, now);
  const kinds = new Set<FruitKind>(f.map((x) => x.kind));
  const raw = f.length * 0.06 + kinds.size * 0.08;
  return Math.max(0.04, Math.min(1, raw));
}

export const SUN_NAMES = ['First light', 'Dawn', 'Morning', 'Full sun'];
export function sunName(level: number): string {
  return SUN_NAMES[Math.min(3, Math.floor(level * 4))];
}

export function countByKind(fruits: Fruit[]): Record<FruitKind, number> {
  const out = { her: 0, friend: 0, sun: 0, rest: 0, brave: 0, made: 0 } as Record<FruitKind, number>;
  for (const f of fruits) out[f.kind] += 1;
  return out;
}
