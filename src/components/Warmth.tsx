import React from 'react';
import { View, Image, ImageStyle, StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, type } from '../theme';

/** The pictures. Warm, clothed, candid, never the point. Rotated by day so the app feels lived-in. */
export const WARMTH = {
  cafe: require('../../assets/warmth/cafe.jpg'),
  walk: require('../../assets/warmth/walk.jpg'),
  window: require('../../assets/warmth/window.jpg'),
  bench: require('../../assets/warmth/bench.jpg'),
  dinner: require('../../assets/warmth/dinner.jpg'),
  coffee: require('../../assets/warmth/coffee.jpg'),
  porch: require('../../assets/warmth/porch.jpg'),
  friends: require('../../assets/warmth/friends.jpg'),
} as const;
export type WarmthKey = keyof typeof WARMTH;
const ORDER: WarmthKey[] = ['cafe', 'walk', 'window', 'bench', 'dinner', 'coffee', 'porch', 'friends'];

export function warmthFor(dayIndex: number): WarmthKey {
  return ORDER[Math.abs(dayIndex) % ORDER.length];
}

/** A photo with a soft fade at the bottom so text can sit on it. */
export function Warmth({ image, height = 300, children, style, radius = 22, fade = colors.bg }: { image: WarmthKey; height?: number; children?: React.ReactNode; style?: ViewStyle; radius?: number; fade?: string }) {
  return (
    <View style={[{ height, borderRadius: radius, overflow: 'hidden', backgroundColor: colors.cardAlt }, style]}>
      <Image source={WARMTH[image]} style={StyleSheet.absoluteFill as ImageStyle} resizeMode="cover" />
      <LinearGradient colors={['rgba(27,26,31,0)', 'rgba(27,26,31,0.10)', 'rgba(27,26,31,0.72)']} locations={[0.35, 0.6, 1]} style={StyleSheet.absoluteFill} />
      {children ? <View style={{ flex: 1, justifyContent: 'flex-end', padding: 18 }}>{children}</View> : null}
    </View>
  );
}

/** A quiet little strip of three photos, used where love should be visible without a caption. */
export function WarmthStrip({ keys, height = 110 }: { keys: WarmthKey[]; height?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {keys.map((k) => (
        <View key={k} style={{ flex: 1, height, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.cardAlt }}>
          <Image source={WARMTH[k]} style={StyleSheet.absoluteFill as ImageStyle} resizeMode="cover" />
        </View>
      ))}
    </View>
  );
}

export function OnPhoto({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[type.h2, { color: '#FFFCF8', textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 8 }, style]}>{children}</Text>;
}
