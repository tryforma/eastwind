import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme';

/**
 * The harvest sun. Rises with fruits over the last 21 days and never sets all the way.
 * 0 = a thin line of dawn on the horizon; 1 = full sun clear of the horizon.
 */
export function Sun({ level, size = 180 }: { level: number; size?: number }) {
  const l = Math.max(0, Math.min(1, level));
  const r = size * 0.28;
  const horizon = size * 0.66;
  const cy = horizon + r * 0.9 - l * r * 1.7;
  return (
    <View style={{ width: size, height: size * 0.8 }}>
      <Svg width={size} height={size * 0.8}>
        <Defs>
          <RadialGradient id="g" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.gold} stopOpacity={0.55 * (0.4 + l * 0.6)} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={cy} r={r * 2.1} fill="url(#g)" />
        <Circle cx={size / 2} cy={cy} r={r} fill={colors.gold} />
        <Rect x={0} y={horizon} width={size} height={size} fill={colors.bg} />
        <Rect x={size * 0.08} y={horizon - 1} width={size * 0.84} height={2} fill={colors.lineStrong} rx={1} />
        {[0, 1, 2].map((i) => (
          <Rect key={i} x={size * (0.36 + i * 0.05)} y={cy - r * 0.42 + i * r * 0.42} width={size * (0.42 - i * 0.09)} height={Math.max(2, size * 0.026)} rx={size * 0.013} fill={colors.bg} opacity={0.92} />
        ))}
      </Svg>
    </View>
  );
}
