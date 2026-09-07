import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';
import { PrimaryButton, SecondaryButton } from '../components/UI';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';
import { URGE_LINES, HUNGERS } from '../content/lines';
import { snap } from '../dev/demo';

const TOTAL = 90;

/** The urge screen. Ninety seconds of company, then the question that matters: what is this hunger for? */
export default function UrgeScreen({ navigation }: ScreenProps<'Urge'>) {
  const { state, bumpUrge, setRealThing } = useApp();
  const [t, setT] = useState(snap ? 34 : 0);
  const [hunger, setHunger] = useState<string | null>(null);
  const breath = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    bumpUrge();
  }, []);

  useEffect(() => {
    if (snap) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(breath, { toValue: 0.6, duration: 6000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    const id = setInterval(() => setT((x) => Math.min(TOTAL, x + 1)), 1000);
    return () => {
      loop.stop();
      clearInterval(id);
    };
  }, []);

  const line = URGE_LINES[Math.min(URGE_LINES.length - 1, Math.floor(t / (TOTAL / URGE_LINES.length)))];
  const over = t >= TOTAL;
  const h = HUNGERS.find((x) => x.id === hunger);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 6 }}>
        <Text style={[type.label, { color: colors.gold }]}>It’s loud</Text>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Text style={{ color: colors.onNightSoft, fontSize: 15, fontWeight: '600' }}>Close</Text></Pressable>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 }}>
        <Animated.View style={[styles.orb, { transform: [{ scale: breath }] }]} />
        <Text style={[type.voice, { color: colors.onNight, textAlign: 'center', marginTop: 34, fontSize: 22, lineHeight: 32 }]}>{line}</Text>
        <Text style={{ color: colors.onNightSoft, marginTop: 14, fontSize: 13 }}>{over ? 'The wave passed.' : `${TOTAL - t}s · in through the nose, out slow`}</Text>
        {state.lastWarm ? <Text style={{ color: colors.onNightSoft, marginTop: 26, fontStyle: 'italic', textAlign: 'center', fontSize: 14, lineHeight: 20 }}>Remember: “{state.lastWarm}”</Text> : null}
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <Text style={{ color: colors.onNight, fontWeight: '700', fontSize: 15, marginBottom: 10 }}>What is it actually hungry for?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {HUNGERS.map((x) => (
            <Pressable key={x.id} onPress={() => setHunger(x.id)} style={[styles.chip, hunger === x.id && styles.chipActive]}>
              <Text style={[styles.chipText, hunger === x.id && { color: colors.night }]}>{x.label}</Text>
            </Pressable>
          ))}
        </View>
        {h && (
          <View style={styles.move}>
            <Text style={{ color: colors.onNight, fontSize: 16, lineHeight: 23 }}>{h.move}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <PrimaryButton title="Make it today’s real thing" small color={colors.gold} textColor={colors.night} style={{ flex: 1 }} onPress={() => { setRealThing(h.move, h.kind); navigation.goBack(); }} />
            </View>
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <SecondaryButton title="Talk to him" style={{ flex: 1, backgroundColor: colors.nightSoft, borderColor: 'rgba(255,255,255,0.14)' }} onPress={() => { navigation.goBack(); navigation.navigate('Tabs', { screen: 'Talk' }); }} />
          <SecondaryButton title="Lie down, scene" style={{ flex: 1, backgroundColor: colors.nightSoft, borderColor: 'rgba(255,255,255,0.14)' }} onPress={() => navigation.replace('Scene', { id: 'enough' })} />
        </View>
        <Text style={{ color: colors.onNightSoft, fontSize: 12, textAlign: 'center', marginTop: 12 }}>Nothing was lost. Nothing is being counted.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.night },
  orb: { width: 150, height: 150, borderRadius: 75, backgroundColor: colors.gold, opacity: 0.9, shadowColor: colors.gold, shadowOpacity: 0.7, shadowRadius: 40 },
  chip: { borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.onNight, fontWeight: '700', fontSize: 14 },
  move: { marginTop: 12, backgroundColor: colors.nightSoft, borderRadius: radius.md, padding: 14 },
});
