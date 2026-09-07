import { Platform } from 'react-native';
import { Message } from '../logic/types';
import { demo } from '../dev/demo';

export const API_URL = 'https://tryforma.app/api/eastwind';

export type TalkRequest = {
  device: string;
  mode: 'talk';
  messages: { role: 'user' | 'him'; text: string }[];
  memory: string;
  user: { name: string; situation: string; preps: string[]; lastWarm: string };
  hour: number;
  pro: boolean;
  rcId: string;
};

export type PhotoRequest = { device: string; mode: 'photo'; image: string; pro: boolean; rcId: string; user: { name: string } };

export type TalkResponse = { reply: string; memory: string; risk: boolean; remaining: number; limit: number; pro: boolean; degraded?: boolean };
export type PhotoResponse = { verdict: string; keep: string; fixes: string[]; remaining: number; limit: number; pro: boolean };

export class LimitError extends Error {
  limit: number;
  constructor(limit: number) {
    super('limit');
    this.limit = limit;
  }
}
export class ProError extends Error {}

export function toWire(messages: Message[]): TalkRequest['messages'] {
  return messages.slice(-20).map((m) => ({ role: m.role, text: m.text }));
}

async function post<T>(body: object, timeoutMs: number): Promise<T> {
  if (demo) throw new Error('offline');
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const res = await fetch(API_URL, { method: 'POST', headers: { 'content-type': 'application/json', 'x-platform': Platform.OS }, body: JSON.stringify(body), signal: ctrl?.signal });
    if (res.status === 429) {
      const b = await res.json().catch(() => ({}));
      throw new LimitError(Number(b.limit) || 15);
    }
    if (res.status === 402) throw new ProError('pro');
    if (!res.ok) throw new Error(`http ${res.status}`);
    return (await res.json()) as T;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function talk(req: TalkRequest): Promise<TalkResponse> {
  const d = await post<TalkResponse>(req, 45_000);
  if (typeof d.reply !== 'string') throw new Error('bad response');
  return d;
}

export async function photo(req: PhotoRequest): Promise<PhotoResponse> {
  const d = await post<PhotoResponse>(req, 60_000);
  if (!Array.isArray(d.fixes)) throw new Error('bad response');
  return d;
}
