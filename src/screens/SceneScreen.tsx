import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, type } from '../theme';
import { PrimaryButton } from '../components/UI';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';
import { scene as getScene } from '../content/scenes';
import { snap } from '../dev/demo';

const LINE_MS = 6500;

/** Lie down. One line at a time. Live it as if it already happened. */
export default function SceneScreen({ navigation, route }: ScreenProps<'Scene'>) {
  const { isPro, markScene } = useApp();
  const scene = getScene(route.params.id);
  const locked = !scene.free && !isPro;
  const [i, setI] = useState(snap ? 3 : 0);
  const [paused, setPaused] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  const total = scene.lines.length;
  const last = i >= total - 1;

  useEffect(() => {
    if (locked) return;
    if (snap || paused || last) return;
    const id = setTimeout(() => {
      Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setI((x) => Math.min(total - 1, x + 1));
        Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }).start();
      });
    }, LINE_MS);
    return () => clearTimeout(id);
  }, [i, paused, last, locked]);

  const finish = () => {
    markScene(scene.id);
    navigation.goBack();
  };

  if (locked) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}>
          <Text style={[type.label, { color: colors.gold }]}>Scene</Text>
          <Text style={[type.h1, { color: colors.onNight, marginTop: 6 }]}>{scene.title}</Text>
          <Text style={{ color: colors.onNightSoft, marginTop: 6, fontSize: 15 }}>{scene.sub}</Text>
          <Text style={[type.voice, { color: colors.onNight, marginTop: 24 }]}>Three scenes are free, always: the table, Sunday morning, the walk home. The rest come with Pro, along with unlimited talk.</Text>
          <PrimaryButton title="See Pro" color={colors.gold} textColor={colors.night} style={{ marginTop: 22 }} onPress={() => navigation.replace('Paywall', { reason: 'scenes' })} />
          <Pressable onPress={() => navigation.goBack()} style={{ alignItems: 'center', paddingVertical: 16 }}><Text style={{ color: colors.onNightSoft, fontWeight: '600' }}>Not tonight</Text></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 6 }}>
        <View>
          <Text style={[type.label, { color: colors.gold }]}>{scene.title}</Text>
          <Text style={{ color: colors.onNightSoft, fontSize: 12, marginTop: 2 }}>{scene.sub}</Text>
        </View>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Text style={{ color: colors.onNightSoft, fontSize: 15, fontWeight: '600' }}>Close</Text></Pressable>
      </View>
      <Pressable style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 30 }} onPress={() => setPaused((p) => !p)}>
        <Animated.Text style={[type.voice, { color: colors.onNight, fontSize: 26, lineHeight: 38, textAlign: 'center', opacity: fade }]}>{scene.lines[i]}</Animated.Text>
        <Text style={{ color: colors.onNightSoft, textAlign: 'center', marginTop: 28, fontSize: 12 }}>{paused ? 'paused · tap to continue' : `${i + 1} of ${total} · tap to pause`}</Text>
      </Pressable>
      <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <View style={styles.bar}><View style={[styles.fill, { width: `${((i + 1) / total) * 100}%` }]} /></View>
        {last ? (
          <PrimaryButton title="Lived it. Sleep." color={colors.gold} textColor={colors.night} style={{ marginTop: 16 }} onPress={finish} />
        ) : (
          <Pressable onPress={() => setI(total - 1)} style={{ alignItems: 'center', paddingVertical: 16 }}><Text style={{ color: colors.onNightSoft, fontWeight: '600' }}>Skip to the end</Text></Pressable>
        )}
        <Text style={{ color: colors.onNightSoft, fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 17 }}>Read it drowsy, first person, present tense. Feel it more than you picture it. Then let it go.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.night },
  bar: { height: 4, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' },
  fill: { height: 4, backgroundColor: colors.gold },
});
