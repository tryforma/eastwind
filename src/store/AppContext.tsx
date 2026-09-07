import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AppState as RNAppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DEFAULT_STATE, Day, Situation, Prep, FruitKind, Fruit, Message, Prompt, DatePlan, dateKey, emptyDay, uid } from '../logic/types';
import { configureBilling, getCustomerInfo, isPremium, addPremiumListener } from '../services/billing';
import { scheduleReminders, cancelReminders } from '../services/notifications';
import { demo } from '../dev/demo';

export const STORAGE_KEY = 'eastwind.state.v1';
const DEV_UNLOCK = process.env.EXPO_PUBLIC_DEV_UNLOCK === '1' || process.env.EXPO_PUBLIC_DEV_UNLOCK === 'true';

export type Setup = { name: string; situation: Situation; preps: Prep[]; lastWarm: string };

type Ctx = {
  ready: boolean;
  state: AppState;
  isPro: boolean;
  setPro: (v: boolean) => void;
  todayKey: string;
  today: Day;
  /** Days since he started. Drives the rotation of lines and scenes. */
  dayIndex: number;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  completeOnboarding: (setup: Setup) => void;
  setDay: (key: string, patch: Partial<Day>) => void;
  setRealThing: (text: string, kind: FruitKind) => void;
  setRealThingDone: (done: boolean) => void;
  markScene: (id: string) => void;
  bumpUrge: () => void;
  addFruit: (kind: FruitKind, text: string) => void;
  removeFruit: (id: string) => void;
  pushMessages: (msgs: Message[], memory?: string) => void;
  clearTalk: () => void;
  toggleCheck: (id: string) => void;
  setPrompt: (q: string, a: string) => void;
  addDate: (d: Omit<DatePlan, 'id'>) => DatePlan;
  updateDate: (id: string, patch: Partial<DatePlan>) => void;
  removeDate: (id: string) => void;
  setReminders: (enabled: boolean, hour?: number) => Promise<boolean>;
  resetAll: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isPro, setIsPro] = useState(DEV_UNLOCK || !!demo?.pro);
  const [todayKey, setTodayKey] = useState(dateKey(demo?.now ?? new Date()));
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppState>;
          setState({ ...DEFAULT_STATE, ...parsed, reminders: { ...DEFAULT_STATE.reminders, ...(parsed.reminders ?? {}) } });
        }
      } catch {
        /* start fresh */
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  useEffect(() => {
    if (demo) return;
    configureBilling();
    getCustomerInfo().then((info) => {
      if (info) setIsPro((p) => p || isPremium(info));
    });
    return addPremiumListener((pro) => setIsPro(DEV_UNLOCK || pro));
  }, []);

  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (st) => {
      if (st !== 'active') return;
      const k = dateKey(demo?.now ?? new Date());
      setTodayKey((cur) => (cur === k ? cur : k));
      const s = stateRef.current;
      if (s.reminders.enabled && isPro) scheduleReminders(s.reminders.hour, s.name).catch(() => {});
    });
    return () => sub.remove();
  }, [isPro]);

  const update = useCallback<Ctx['update']>((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const setDay = useCallback<Ctx['setDay']>((key, patch) => {
    setState((s) => {
      const cur = s.days[key] ?? emptyDay(key);
      return { ...s, days: { ...s.days, [key]: { ...cur, ...patch, date: key } } };
    });
  }, []);

  const today = state.days[todayKey] ?? emptyDay(todayKey);
  const dayIndex = state.createdAt ? Math.max(0, Math.floor((new Date(todayKey).getTime() - new Date(dateKey(new Date(state.createdAt))).getTime()) / 86_400_000)) : 0;

  const completeOnboarding = useCallback<Ctx['completeOnboarding']>(
    (setup) => update({ ...setup, onboarded: true, createdAt: stateRef.current.createdAt || new Date().toISOString() }),
    [update],
  );

  const setRealThing = useCallback<Ctx['setRealThing']>((text, kind) => setDay(todayKey, { realThing: text, realThingKind: kind, realThingDone: false }), [setDay, todayKey]);
  const setRealThingDone = useCallback<Ctx['setRealThingDone']>((done) => setDay(todayKey, { realThingDone: done }), [setDay, todayKey]);
  const markScene = useCallback<Ctx['markScene']>((id) => setDay(todayKey, { sceneId: id, sceneDone: true }), [setDay, todayKey]);
  const bumpUrge = useCallback(() => {
    const cur = stateRef.current.days[todayKey] ?? emptyDay(todayKey);
    setDay(todayKey, { urges: cur.urges + 1 });
  }, [setDay, todayKey]);

  const addFruit = useCallback<Ctx['addFruit']>((kind, text) => {
    const f: Fruit = { id: uid(), at: new Date().toISOString(), kind, text: text.trim() };
    update((s) => ({ fruits: [f, ...s.fruits] }));
  }, [update]);
  const removeFruit = useCallback<Ctx['removeFruit']>((id) => update((s) => ({ fruits: s.fruits.filter((f) => f.id !== id) })), [update]);

  const pushMessages = useCallback<Ctx['pushMessages']>((msgs, memory) => update((s) => ({ talk: [...s.talk, ...msgs].slice(-200), memory: memory ?? s.memory })), [update]);
  const clearTalk = useCallback(() => update({ talk: [], memory: '' }), [update]);

  const toggleCheck = useCallback<Ctx['toggleCheck']>((id) => update((s) => ({ checklist: s.checklist.includes(id) ? s.checklist.filter((x) => x !== id) : [...s.checklist, id] })), [update]);
  const setPrompt = useCallback<Ctx['setPrompt']>((q, a) => update((s) => {
    const rest = s.prompts.filter((p) => p.q !== q);
    return { prompts: a.trim() ? [...rest, { q, a: a.trim() }] : rest };
  }), [update]);

  const addDate = useCallback<Ctx['addDate']>((d) => {
    const plan: DatePlan = { id: uid(), ...d };
    update((s) => ({ dates: [plan, ...s.dates] }));
    return plan;
  }, [update]);
  const updateDate = useCallback<Ctx['updateDate']>((id, patch) => update((s) => ({ dates: s.dates.map((d) => (d.id === id ? { ...d, ...patch } : d)) })), [update]);
  const removeDate = useCallback<Ctx['removeDate']>((id) => update((s) => ({ dates: s.dates.filter((d) => d.id !== id) })), [update]);

  const setReminders = useCallback<Ctx['setReminders']>(
    async (enabled, hour) => {
      const h = hour ?? stateRef.current.reminders.hour;
      if (!enabled) {
        await cancelReminders();
        update({ reminders: { enabled: false, hour: h } });
        return true;
      }
      const ok = await scheduleReminders(h, stateRef.current.name);
      update({ reminders: { enabled: ok, hour: h } });
      return ok;
    },
    [update],
  );

  const resetAll = useCallback(async () => {
    await cancelReminders();
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    setState(DEFAULT_STATE);
  }, []);

  return (
    <AppCtx.Provider
      value={{ ready, state, isPro, setPro: setIsPro, todayKey, today, dayIndex, update, completeOnboarding, setDay, setRealThing, setRealThingDone, markScene, bumpUrge, addFruit, removeFruit, pushMessages, clearTalk, toggleCheck, setPrompt, addDate, updateDate, removeDate, setReminders, resetAll }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}
