import { Platform, TextStyle } from 'react-native';

/** Dawn paper, deep ink, and a sunrise accent. Rose is for warmth that has a person in it. Night is the scene screen. */
export const colors = {
  bg: '#FAF5EE',
  bgElevated: '#F2EAE0',
  card: '#FFFCF8',
  cardAlt: '#F5EDE3',
  ink: '#1B1A1F',
  inkSoft: '#625C66',
  inkFaint: '#958E97',
  accent: '#E0763A',
  accentDeep: '#B5551F',
  accentSoft: 'rgba(224,118,58,0.14)',
  glow: 'rgba(224,118,58,0.30)',
  rose: '#C9647A',
  roseSoft: 'rgba(201,100,122,0.13)',
  gold: '#E8B04B',
  goldSoft: 'rgba(232,176,75,0.16)',
  night: '#1F2233',
  nightSoft: '#2B2F45',
  onNight: '#F3EDE4',
  onNightSoft: 'rgba(243,237,228,0.62)',
  line: 'rgba(27,26,31,0.08)',
  lineStrong: 'rgba(27,26,31,0.16)',
  success: '#5F8F6A',
  successSoft: 'rgba(95,143,106,0.14)',
  danger: '#B9463A',
  dangerSoft: 'rgba(185,70,58,0.12)',
  overlay: 'rgba(27,26,31,0.55)',
  onAccent: '#FFFCF8',
  onInk: '#FAF5EE',
};

export const radius = { sm: 12, md: 16, lg: 20, xl: 28, pill: 999 };

export const space = (n: number) => n * 4;

/** System serif for headings and for his voice; sans for everything else. */
export const serif = Platform.select({
  ios: 'Georgia',
  web: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
  default: 'serif',
}) as string;

const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export const type: Record<string, TextStyle> = {
  display: { fontFamily: serif, fontSize: 34, fontWeight: '700', color: colors.ink, letterSpacing: -0.4, lineHeight: 40 },
  h1: { fontFamily: serif, fontSize: 27, fontWeight: '700', color: colors.ink, letterSpacing: -0.3, lineHeight: 33 },
  h2: { fontFamily: serif, fontSize: 21, fontWeight: '700', color: colors.ink, letterSpacing: -0.2, lineHeight: 27 },
  h3: { fontSize: 17, fontWeight: '700', color: colors.ink },
  voice: { fontFamily: serif, fontSize: 19, fontWeight: '400', color: colors.ink, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400', color: colors.ink, lineHeight: 23 },
  bodySoft: { fontSize: 15, fontWeight: '400', color: colors.inkSoft, lineHeight: 22 },
  label: { fontSize: 12, fontWeight: '700', color: colors.accentDeep, letterSpacing: 1.4, textTransform: 'uppercase' },
  sub: { fontSize: 13, fontWeight: '500', color: colors.inkSoft },
  caption: { fontSize: 12, fontWeight: '500', color: colors.inkFaint },
  num: { fontSize: 30, fontWeight: '800', color: colors.ink, letterSpacing: -0.8, ...tabular },
  numSm: { fontSize: 15, fontWeight: '700', color: colors.ink, ...tabular },
  numLg: { fontSize: 44, fontWeight: '800', color: colors.ink, letterSpacing: -1.2, ...tabular },
};

/** react-native-web paints the "on" thumb teal by default; keep it white to match iOS. */
export const switchProps = Platform.OS === 'web' ? ({ activeThumbColor: '#fff' } as Record<string, unknown>) : {};
