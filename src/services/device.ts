import AsyncStorage from '@react-native-async-storage/async-storage';
import { uid } from '../logic/types';

const KEY = 'eastwind.device.v1';
let cached: string | null = null;

/** A random per-install id for the free-tier counter. Not tied to the person or the phone; reset by reinstalling. */
export async function deviceId(): Promise<string> {
  if (cached) return cached;
  try {
    const v = await AsyncStorage.getItem(KEY);
    if (v && v.length >= 8) return (cached = v);
  } catch {}
  const v = uid() + uid();
  cached = v;
  AsyncStorage.setItem(KEY, v).catch(() => {});
  return v;
}
