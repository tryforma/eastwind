import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Screen, Card, Label, PrimaryButton, SecondaryButton, Tag, Chip } from '../components/UI';
import { Warmth, OnPhoto, warmthFor } from '../components/Warmth';
import { colors, radius, type } from '../theme';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { FRUITS, FruitKind } from '../logic/types';
import { morningLine, situationLine } from '../content/lines';
import { suggestions } from '../content/realThings';
import { tonightScene } from '../content/scenes';

export default function TodayScreen({ navigation }: TabProps<'Today'>) {
  const { state, today, todayKey, dayIndex, isPro, setRealThing, setRealThingDone, addFruit } = useApp();
  const [custom, setCustom] = useState('');
  const [logging, setLogging] = useState(false);
  const picks = useMemo(() => suggestions(state, todayKey, 4), [state.preps, state.situation, todayKey]);
  const scene = tonightScene(dayIndex, isPro);
  const hour = new Date().getHours();
  const evening = hour >= 19 || hour < 4;
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
  const upcoming = state.dates.find((d) => new Date(d.at).getTime() > Date.now() - 3 * 3600_000 && !d.debrief);

  const done = () => {
    setRealThingDone(true);
    setLogging(true);
  };

  return (
    <Screen scroll>
      <View style={{ paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <Text style={type.caption}>{dateLabel}</Text>
          <Text style={type.h1}>{state.name ? `Morning, ${state.name}` : 'Morning'}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Urge')} hitSlop={8} style={({ pressed }) => [styles.urge, pressed && { opacity: 0.8 }]}>
          <Text style={styles.urgeText}>It’s loud</Text>
        </Pressable>
      </View>

      <Warmth image={warmthFor(dayIndex)} height={330} style={{ marginTop: 14 }}>
        <OnPhoto style={{ fontFamily: type.voice.fontFamily, fontWeight: '400', fontSize: 20, lineHeight: 28 }}>{morningLine(dayIndex)}</OnPhoto>
        <Text style={{ color: 'rgba(255,252,248,0.78)', marginTop: 8, fontSize: 14, lineHeight: 20 }}>{situationLine(state.situation, dayIndex)}</Text>
      </Warmth>

      {upcoming && (
        <Card style={{ marginTop: 14, borderColor: colors.rose, backgroundColor: colors.roseSoft }}>
          <Label color={colors.rose}>Coming up</Label>
          <Text style={type.h2}>{upcoming.who ? `${upcoming.who}, ` : ''}{upcoming.where}</Text>
          <Text style={[type.sub, { marginTop: 4 }]}>{new Date(upcoming.at).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <SecondaryButton title="Four minutes before" small onPress={() => navigation.navigate('Scene', { id: 'date1' })} />
            <SecondaryButton title="After" small onPress={() => navigation.navigate('Dates')} />
          </View>
        </Card>
      )}

      <Card style={{ marginTop: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label style={{ marginBottom: 0 }}>One real thing</Label>
          {today.realThing ? <Tag text={FRUITS.find((f) => f.id === today.realThingKind)?.label ?? ''} tone="gold" /> : null}
        </View>
        {today.realThing ? (
          <>
            <Text style={[type.h2, { marginTop: 10 }, today.realThingDone && { color: colors.inkSoft }]}>{today.realThing}</Text>
            {!today.realThingDone ? (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <PrimaryButton title="Did it" onPress={done} style={{ flex: 1 }} small />
                <SecondaryButton title="Swap" small onPress={() => setRealThing('', 'sun')} />
              </View>
            ) : logging ? (
              <FruitLogger kind={today.realThingKind ?? 'sun'} onSave={(k, t) => { addFruit(k, t || today.realThing || ''); setLogging(false); }} onSkip={() => setLogging(false)} />
            ) : (
              <Text style={[type.sub, { marginTop: 12, color: colors.success }]}>Done. That was the whole job today.</Text>
            )}
          </>
        ) : (
          <>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>Not a discipline. A life act. Pick one; any size counts.</Text>
            <View style={{ gap: 8, marginTop: 12 }}>
              {picks.map((a) => (
                <Pressable key={a.id} onPress={() => setRealThing(a.text, a.kind)} style={({ pressed }) => [styles.pick, pressed && { opacity: 0.7 }]}>
                  <Text style={{ fontSize: 18 }}>{FRUITS.find((f) => f.id === a.kind)?.emoji}</Text>
                  <Text style={[type.body, { flex: 1 }]}>{a.text}</Text>
                  {a.size === 'brave' && <Tag text="brave" color={colors.rose} />}
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' }}>
              <TextInput value={custom} onChangeText={setCustom} placeholder="Or your own" placeholderTextColor={colors.inkFaint} style={styles.input} returnKeyType="done" onSubmitEditing={() => custom.trim() && setRealThing(custom.trim(), 'made')} />
              <SecondaryButton title="Set" small disabled={!custom.trim()} onPress={() => setRealThing(custom.trim(), 'made')} />
            </View>
          </>
        )}
      </Card>

      <Pressable onPress={() => navigation.navigate('Scene', { id: scene.id })} style={({ pressed }) => [styles.night, pressed && { opacity: 0.9 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[type.label, { color: colors.gold }]}>{evening ? 'Tonight' : 'Tonight, when you lie down'}</Text>
          <Text style={[type.h2, { color: colors.onNight, marginTop: 6 }]}>{scene.title}</Text>
          <Text style={{ color: colors.onNightSoft, marginTop: 4, fontSize: 14 }}>{scene.sub} · about four minutes</Text>
          {today.sceneDone && <Text style={{ color: colors.gold, marginTop: 8, fontSize: 13, fontWeight: '700' }}>Lived it tonight.</Text>}
        </View>
        <Text style={{ color: colors.gold, fontSize: 26 }}>›</Text>
      </Pressable>

      <Card style={{ marginTop: 12 }}>
        <Label>Something warm happened?</Label>
        <Text style={type.bodySoft}>A laugh, a text back, sun on your face, a nap. Log it. It is the only thing this app counts.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {FRUITS.map((f) => (
            <Chip key={f.id} text={`${f.emoji} ${f.label}`} onPress={() => navigation.navigate('Fruits')} />
          ))}
        </View>
      </Card>

      {state.lastWarm ? <Text style={[type.caption, { textAlign: 'center', marginTop: 22, fontStyle: 'italic' }]}>“{state.lastWarm}” — you, on a warm day.</Text> : null}
    </Screen>
  );
}

export function FruitLogger({ kind, onSave, onSkip }: { kind: FruitKind; onSave: (kind: FruitKind, text: string) => void; onSkip: () => void }) {
  const [k, setK] = useState<FruitKind>(kind);
  const [t, setT] = useState('');
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={type.sub}>Log it as a fruit. One line, in your words.</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        {FRUITS.map((f) => (
          <Chip key={f.id} text={`${f.emoji} ${f.label}`} selected={k === f.id} onPress={() => setK(f.id)} />
        ))}
      </View>
      <TextInput value={t} onChangeText={setT} placeholder={FRUITS.find((f) => f.id === k)?.hint} placeholderTextColor={colors.inkFaint} style={[styles.input, { marginTop: 10 }]} multiline />
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <PrimaryButton title="Save fruit" small onPress={() => onSave(k, t.trim())} style={{ flex: 1 }} color={colors.accent} />
        <SecondaryButton title="Not now" small onPress={onSkip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pick: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.cardAlt, borderRadius: radius.md, padding: 12 },
  input: { flex: 1, backgroundColor: colors.bgElevated, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, paddingHorizontal: 14, paddingVertical: 11, color: colors.ink, fontSize: 15 },
  urge: { backgroundColor: colors.roseSoft, borderColor: colors.rose, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  urgeText: { color: colors.rose, fontWeight: '800', fontSize: 13 },
  night: { marginTop: 12, backgroundColor: colors.night, borderRadius: radius.lg, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
});
