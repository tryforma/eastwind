import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PurchasesPackage } from 'react-native-purchases';
import { colors, radius, type } from '../theme';
import { PrimaryButton } from '../components/UI';
import { Warmth, OnPhoto } from '../components/Warmth';
import { getPackages, purchase, restore, isCancelledError } from '../services/billing';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';

export const SITE = 'https://tryforma.app/eastwind';
const BENEFITS: [string, string][] = [
  ['Unlimited talk', 'Fifteen a day is free. Pro is as many as the night needs.'],
  ['Every scene', 'All eleven: her hand, being chosen, rest earned, the porch, enough. Three stay free forever.'],
  ['Photo notes', 'Three honest fixes on any photo before it goes on your profile. No filters.'],
  ['The morning line', 'One line at your hour, scheduled on your phone.'],
  ['Free forever', 'The urge screen, one real thing, the harvest, the date guide, three scenes, fifteen messages a day. Everything that gets you through tonight.'],
];
const REASON: Record<string, string> = { talk: 'You have used today’s free messages.', scenes: 'That scene is part of Pro.', photo: 'Photo notes are part of Pro.', reminders: 'The morning line is part of Pro.' };

export default function PaywallScreen({ navigation, route }: ScreenProps<'Paywall'>) {
  const { setPro } = useApp();
  const [pkgs, setPkgs] = useState<PurchasesPackage[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fromOnboarding = route.params?.fromOnboarding;
  const reason = route.params?.reason;

  useEffect(() => {
    getPackages().then((p) => {
      setPkgs(p);
      const annual = p.find(isAnnual);
      setSelected((annual ?? p[0])?.identifier ?? null);
      setLoaded(true);
    });
  }, []);

  const close = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace('Tabs');
  };
  const unlocked = () => { setPro(true); close(); };

  const onSubscribe = async () => {
    const pkg = pkgs.find((p) => p.identifier === selected);
    if (!pkg) return Alert.alert('Not available yet', 'Plans could not be loaded right now. Check your connection and try again.');
    setBusy(true);
    try {
      if (await purchase(pkg)) unlocked();
    } catch (e) {
      if (!isCancelledError(e)) Alert.alert('Purchase failed', 'Nothing was charged. Try again in a minute.');
    } finally {
      setBusy(false);
    }
  };
  const onRestore = async () => {
    setBusy(true);
    try {
      if (await restore()) unlocked();
      else Alert.alert('Nothing to restore', 'No active subscription was found for this Apple ID.');
    } catch {
      Alert.alert('Could not restore', 'Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Pressable onPress={close} hitSlop={12}><Text style={styles.close}>{fromOnboarding ? 'Continue free' : 'Close'}</Text></Pressable>
        </View>
        <Warmth image="bench" height={220}>
          <Text style={[type.label, { color: colors.gold }]}>Eastwind Pro</Text>
          <OnPhoto style={{ fontSize: 26, lineHeight: 32 }}>More of him. More nights covered.</OnPhoto>
        </Warmth>
        {reason && REASON[reason] ? <Text style={[type.sub, { marginTop: 12, color: colors.accentDeep }]}>{REASON[reason]}</Text> : null}
        <Text style={[type.voice, { marginTop: 14 }]}>Everything that gets you through tonight is free. Always. Pro is for the men who want him there every night.</Text>
        <View style={{ marginTop: 18, gap: 12 }}>
          {BENEFITS.map(([t, s]) => (
            <View key={t} style={{ flexDirection: 'row', gap: 12 }}>
              <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '800' }}>·</Text>
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>{t}</Text>
                <Text style={[type.sub, { marginTop: 2 }]}>{s}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 22, gap: 10 }}>
          {pkgs.map((p) => {
            const sel = p.identifier === selected;
            const annual = isAnnual(p);
            return (
              <Pressable key={p.identifier} onPress={() => setSelected(p.identifier)} style={[styles.plan, sel && styles.planActive]}>
                <View style={{ flex: 1 }}>
                  <Text style={type.h3}>{annual ? 'Yearly' : 'Monthly'}</Text>
                  <Text style={type.sub}>{p.product.priceString}{annual ? ' · 7 days free' : ' · 7 days free'}</Text>
                </View>
                {annual && <Text style={styles.best}>Best</Text>}
                <View style={[styles.radio, sel && { borderColor: colors.accent }]}>{sel && <View style={styles.dot} />}</View>
              </Pressable>
            );
          })}
          {loaded && pkgs.length === 0 && <Text style={type.caption}>Plans are not available right now. The free version works without them.</Text>}
        </View>
        <PrimaryButton title="Start 7 days free" onPress={onSubscribe} loading={busy} disabled={!selected} style={{ marginTop: 18 }} />
        <Pressable onPress={onRestore} disabled={busy} style={{ alignItems: 'center', paddingVertical: 14 }}><Text style={type.sub}>Restore purchases</Text></Pressable>
        <Text style={[type.caption, { textAlign: 'center', lineHeight: 17 }]}>
          Payment is charged to your Apple ID at confirmation after the free trial. Renews automatically unless cancelled at least 24 hours before the end of the period. Manage in Apple ID settings.{' '}
          <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL(`${SITE}/terms.html`)}>Terms</Text> ·{' '}
          <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL(`${SITE}/privacy.html`)}>Privacy</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function isAnnual(p: PurchasesPackage): boolean {
  return p.packageType === 'ANNUAL' || /annual|year/i.test(p.identifier);
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 22, paddingBottom: 30, paddingTop: 6 },
  close: { color: colors.inkSoft, fontSize: 15, fontWeight: '600', paddingVertical: 8 },
  plan: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1.5, borderColor: colors.line },
  planActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  best: { color: colors.accentDeep, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
});
