import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal, Platform } from 'react-native';
import { Screen, Card, Label, PrimaryButton, SecondaryButton, Tag, Chip, sheetStyles } from '../components/UI';
import { Warmth, OnPhoto } from '../components/Warmth';
import { colors, radius, type } from '../theme';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { PERMISSION, CHECKLIST, PROMPT_QUESTIONS, FIRST_MESSAGE, ASKING, THE_DATE, AFTER } from '../content/dates';
import { scheduleDateReminder } from '../services/notifications';

type Sheet = null | 'prompt' | 'plan' | 'debrief';

export default function DatesScreen({ navigation }: TabProps<'Dates'>) {
  const { state, isPro, toggleCheck, setPrompt, addDate, updateDate, removeDate, addFruit } = useApp();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [q, setQ] = useState(PROMPT_QUESTIONS[0]);
  const [a, setA] = useState('');
  const [who, setWho] = useState('');
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');
  const [dateId, setDateId] = useState<string | null>(null);
  const [debrief, setDebrief] = useState('');
  const [warm, setWarm] = useState<boolean | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const checked = state.checklist.length;
  const openPrompt = (question: string) => {
    setQ(question);
    setA(state.prompts.find((p) => p.q === question)?.a ?? '');
    setSheet('prompt');
  };
  const savePlan = () => {
    const at = parseWhen(when);
    const d = addDate({ who: who.trim(), where: where.trim() || 'Coffee', at: at.toISOString() });
    scheduleDateReminder(at, d.who).catch(() => {});
    setSheet(null);
    setWho(''); setWhere(''); setWhen('');
  };
  const saveDebrief = () => {
    if (!dateId) return;
    updateDate(dateId, { debrief: debrief.trim() || 'It happened.', feltWarm: warm ?? undefined });
    const d = state.dates.find((x) => x.id === dateId);
    addFruit(warm ? 'her' : 'brave', debrief.trim() || `Sat across from ${d?.who || 'a real woman'}. It happened.`);
    setSheet(null); setDebrief(''); setWarm(null);
  };

  const upcoming = state.dates.filter((d) => !d.debrief);
  const past = state.dates.filter((d) => d.debrief);

  return (
    <Screen scroll>
      <Text style={[type.h1, { paddingTop: 6 }]}>Go on the date</Text>
      <Text style={type.caption}>The permission module. Practical, no theory.</Text>

      <Warmth image="dinner" height={260} style={{ marginTop: 14 }}>
        <OnPhoto style={{ fontSize: 24, lineHeight: 31 }}>{PERMISSION[0]}</OnPhoto>
        <Text style={{ color: 'rgba(255,252,248,0.82)', marginTop: 6, fontSize: 14, lineHeight: 20 }}>{PERMISSION[1]}</Text>
      </Warmth>

      <Card style={{ marginTop: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label style={{ marginBottom: 0 }}>Your profile</Label>
          <Tag text={`${checked}/${CHECKLIST.length}`} tone={checked >= 6 ? 'gold' : 'plain'} />
        </View>
        <Text style={[type.bodySoft, { marginTop: 8 }]}>Eight things that make her stop scrolling. Tap for why.</Text>
        <View style={{ marginTop: 10 }}>
          {CHECKLIST.map((c, i) => {
            const on = state.checklist.includes(c.id);
            return (
              <View key={c.id} style={[styles.row, i === CHECKLIST.length - 1 && { borderBottomWidth: 0 }]}>
                <Pressable onPress={() => toggleCheck(c.id)} style={[styles.box, on && styles.boxOn]}>{on && <Text style={{ color: colors.onAccent, fontWeight: '800', fontSize: 13 }}>✓</Text>}</Pressable>
                <Pressable style={{ flex: 1 }} onPress={() => setOpen(open === c.id ? null : c.id)}>
                  <Text style={[type.body, on && { color: colors.inkSoft }]}>{c.text}</Text>
                  {open === c.id && <Text style={[type.sub, { marginTop: 4 }]}>{c.why}</Text>}
                </Pressable>
              </View>
            );
          })}
        </View>
        <SecondaryButton title={isPro ? 'Photo notes: pick a photo' : 'Photo notes (Pro)'} small style={{ marginTop: 12 }} onPress={() => (isPro ? navigation.navigate('Photo') : navigation.navigate('Paywall', { reason: 'photo' }))} />
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Label>Prompts, in your voice</Label>
        <Text style={type.bodySoft}>Write them here, read them out loud, then paste. If you would not say it to a friend, rewrite it. Ask him for help any time.</Text>
        <View style={{ marginTop: 10, gap: 8 }}>
          {PROMPT_QUESTIONS.map((question) => {
            const cur = state.prompts.find((p) => p.q === question);
            return (
              <Pressable key={question} onPress={() => openPrompt(question)} style={({ pressed }) => [styles.prompt, cur && { borderColor: colors.accent, backgroundColor: colors.accentSoft }, pressed && { opacity: 0.8 }]}>
                <Text style={[type.caption, { color: colors.accentDeep }]}>{question}</Text>
                <Text style={[type.body, { marginTop: 2 }, !cur && { color: colors.inkFaint }]}>{cur ? cur.a : 'Tap to write'}</Text>
              </Pressable>
            );
          })}
        </View>
        <SecondaryButton title="Ask him to help with one" small style={{ marginTop: 12 }} onPress={() => navigation.navigate('Talk')} />
      </Card>

      <Guide title="The first message" lines={FIRST_MESSAGE} />
      <Guide title="Asking" lines={ASKING} />

      <Card style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label style={{ marginBottom: 0 }}>Dates</Label>
          <SecondaryButton title="Plan one" small onPress={() => setSheet('plan')} />
        </View>
        {upcoming.length === 0 && past.length === 0 && <Text style={[type.bodySoft, { marginTop: 8 }]}>When she says yes, put it here. You get a four-minute calm before, and an after that logs it as a fruit no matter how it went.</Text>}
        {upcoming.map((d) => (
          <View key={d.id} style={styles.date}>
            <View style={{ flex: 1 }}>
              <Text style={type.h3}>{d.who ? `${d.who} · ` : ''}{d.where}</Text>
              <Text style={type.sub}>{new Date(d.at).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</Text>
            </View>
            <SecondaryButton title="Before" small onPress={() => navigation.navigate('Scene', { id: 'date1' })} />
            <SecondaryButton title="After" small onPress={() => { setDateId(d.id); setSheet('debrief'); }} />
          </View>
        ))}
        {past.map((d) => (
          <Pressable key={d.id} onLongPress={() => removeDate(d.id)} style={styles.date}>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontWeight: '600' }]}>{d.who ? `${d.who} · ` : ''}{d.where}</Text>
              <Text style={type.sub}>{d.debrief}</Text>
            </View>
            <Tag text={d.feltWarm ? 'warm' : 'happened'} tone={d.feltWarm ? 'gold' : 'plain'} />
          </Pressable>
        ))}
      </Card>

      <Guide title="The date" lines={THE_DATE} />
      <Guide title="After" lines={AFTER} />

      <Text style={[type.caption, { textAlign: 'center', marginTop: 20, lineHeight: 17 }]}>{PERMISSION[3]}</Text>

      <Modal visible={sheet !== null} transparent animationType="slide" onRequestClose={() => setSheet(null)}>
        <Pressable style={sheetStyles.backdrop} onPress={() => setSheet(null)} />
        <View style={sheetStyles.sheet}>
          {sheet === 'prompt' && (
            <>
              <Text style={type.h2}>{q}</Text>
              <Text style={[type.sub, { marginTop: 4 }]}>Specific beats clever. One real detail.</Text>
              <TextInput value={a} onChangeText={setA} placeholder="Sunday cooking with the radio on. Beating my brother at anything." placeholderTextColor={colors.inkFaint} style={[sheetStyles.input, { fontSize: 16, fontWeight: '500', minHeight: 90 }]} multiline autoFocus={Platform.OS !== 'web'} />
              <PrimaryButton title="Save" onPress={() => { setPrompt(q, a); setSheet(null); }} style={{ marginTop: 14 }} />
            </>
          )}
          {sheet === 'plan' && (
            <>
              <Text style={type.h2}>Plan the date</Text>
              <Text style={[type.sub, { marginTop: 4 }]}>Daylight, coffee or a walk, sixty to ninety minutes.</Text>
              <TextInput value={who} onChangeText={setWho} placeholder="Her name" placeholderTextColor={colors.inkFaint} style={sheetStyles.input} />
              <TextInput value={where} onChangeText={setWhere} placeholder="Where (coffee on 5th)" placeholderTextColor={colors.inkFaint} style={sheetStyles.input} />
              <TextInput value={when} onChangeText={setWhen} placeholder="When (thu 18:00, or 2026-09-12 18:00)" placeholderTextColor={colors.inkFaint} style={sheetStyles.input} autoCapitalize="none" />
              <Text style={[type.caption, { marginTop: 8 }]}>Two hours before, your phone will say: four minutes, then go.</Text>
              <PrimaryButton title="It’s on" onPress={savePlan} style={{ marginTop: 14 }} />
            </>
          )}
          {sheet === 'debrief' && (
            <>
              <Text style={type.h2}>It happened.</Text>
              <Text style={[type.sub, { marginTop: 4 }]}>That was the assignment. One line about it.</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <Chip text="Felt warm" selected={warm === true} onPress={() => setWarm(true)} color={colors.rose} />
                <Chip text="Not my person" selected={warm === false} onPress={() => setWarm(false)} />
              </View>
              <TextInput value={debrief} onChangeText={setDebrief} placeholder="She laughed at the cilantro thing. Twice." placeholderTextColor={colors.inkFaint} style={[sheetStyles.input, { fontSize: 16, fontWeight: '500' }]} multiline />
              <PrimaryButton title="Log it as a fruit" onPress={saveDebrief} style={{ marginTop: 14 }} />
            </>
          )}
        </View>
      </Modal>
    </Screen>
  );
}

function Guide({ title, lines }: { title: string; lines: string[] }) {
  return (
    <Card style={{ marginTop: 12 }}>
      <Label>{title}</Label>
      <View style={{ gap: 8 }}>
        {lines.map((l, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
            <Text style={[type.body, { color: colors.accent, fontWeight: '800' }]}>·</Text>
            <Text style={[type.body, { flex: 1 }]}>{l}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

/** "thu 18:00", "tomorrow 19:30", "2026-09-12 18:00", "sat". Defaults to the next 18:00 if unparseable. */
export function parseWhen(s: string): Date {
  const now = new Date();
  const t = s.trim().toLowerCase();
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:[ t](\d{1,2})(?::(\d{2}))?)?/.exec(t);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), iso[4] ? Number(iso[4]) : 18, iso[5] ? Number(iso[5]) : 0);
  const time = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/.exec(t.replace(/^\S+\s*/, ''));
  let hour = 18, min = 0;
  if (time) {
    hour = Number(time[1]); min = time[2] ? Number(time[2]) : 0;
    if (time[3] === 'pm' && hour < 12) hour += 12;
    if (time[3] === 'am' && hour === 12) hour = 0;
  }
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min);
  const w = days.findIndex((x) => t.startsWith(x));
  if (w >= 0) {
    let delta = (w - now.getDay() + 7) % 7;
    if (delta === 0 && d.getTime() < now.getTime()) delta = 7;
    d.setDate(d.getDate() + delta);
  } else if (t.startsWith('tomorrow')) d.setDate(d.getDate() + 1);
  else if (d.getTime() < now.getTime()) d.setDate(d.getDate() + 1);
  return d;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  prompt: { backgroundColor: colors.cardAlt, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.line },
  date: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
});
