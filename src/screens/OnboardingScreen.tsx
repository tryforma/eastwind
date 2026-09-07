import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';
import { PrimaryButton, GhostButton, Chip, ProgressDots, OptionButton } from '../components/UI';
import { Warmth, OnPhoto, WarmthStrip } from '../components/Warmth';
import { useApp } from '../store/AppContext';
import { Situation, SITUATIONS, Prep, PREPS } from '../logic/types';
import { PERMISSION } from '../content/dates';
import { demo } from '../dev/demo';

const STEPS = 5;

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { completeOnboarding } = useApp();
  const seeded = demo?.onboardStep !== undefined;
  const [step, setStep] = useState(demo?.onboardStep ?? 0);
  const [situation, setSituation] = useState<Situation | null>(seeded ? 'burnout' : null);
  const [preps, setPreps] = useState<Prep[]>(seeded ? ['meals', 'money', 'business', 'nodates'] : []);
  const [name, setName] = useState(seeded ? 'Dan' : '');
  const [lastWarm, setLastWarm] = useState(seeded ? 'My cousin’s wedding. Dancing, badly.' : '');

  const toggle = (v: Prep) => setPreps(preps.includes(v) ? preps.filter((x) => x !== v) : [...preps, v]);
  const canContinue = step === 1 ? situation !== null : step === 3 ? name.trim().length > 0 : true;

  const finish = () => {
    completeOnboarding({ name: name.trim(), situation: situation ?? 'years', preps, lastWarm: lastWarm.trim() });
    onDone();
  };
  const next = () => (step < STEPS - 1 ? setStep(step + 1) : finish());
  const back = () => step > 0 && setStep(step - 1);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <ProgressDots count={STEPS} index={step} />
      </View>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <>
            <Warmth image="cafe" height={340}>
              <Text style={[type.label, { color: colors.gold }]}>Eastwind</Text>
              <OnPhoto style={{ fontSize: 30, lineHeight: 36, marginTop: 4 }}>You are not broken.{'\n'}You are starved.</OnPhoto>
            </Warmth>
            <Text style={[type.voice, { marginTop: 22 }]}>
              The thing you reach for at night is hunger for something real: a woman, a friend, sun on your face, a night off. This is not another counter. Nobody here counts days, blocks sites, or makes you feel like a project.
            </Text>
            <Text style={[type.bodySoft, { marginTop: 14 }]}>Just someone who has been through it, and a way out that adds instead of subtracts.</Text>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={type.label}>Where you are</Text>
            <Text style={styles.q}>Which is closest, right now?</Text>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>Only shapes the wording. Nothing is inferred from anything you say or do.</Text>
            <View style={{ gap: 10, marginTop: 18 }}>
              {SITUATIONS.map(([id, label, sub]) => (
                <OptionButton key={id} label={label} sub={sub} selected={situation === id} onPress={() => setSituation(id)} />
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={type.label}>Preparing</Text>
            <Text style={styles.q}>What have you been building the shelves with?</Text>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>Most men who end up here have been preparing hard for a life they have not let themselves live. Tap what fits.</Text>
            <View style={styles.chips}>
              {PREPS.map(([id, label]) => (
                <Chip key={id} text={label} big selected={preps.includes(id)} onPress={() => toggle(id)} />
              ))}
            </View>
            {preps.length > 0 && <Text style={[type.voice, { marginTop: 22, color: colors.inkSoft }]}>Good. The shelves are built. Now we put a life on them.</Text>}
          </>
        )}

        {step === 3 && (
          <>
            <Text style={type.label}>You</Text>
            <Text style={styles.q}>What should he call you?</Text>
            <TextInput value={name} onChangeText={setName} placeholder="First name" placeholderTextColor={colors.inkFaint} style={styles.input} autoFocus={!demo} returnKeyType="done" />
            <Text style={[type.h3, { marginTop: 26 }]}>The last time you felt warm</Text>
            <Text style={[type.sub, { marginTop: 4 }]}>A moment. A person, a room, a laugh. Optional. He will hand it back to you on a hard night.</Text>
            <TextInput value={lastWarm} onChangeText={setLastWarm} placeholder="My cousin’s wedding. Dancing, badly." placeholderTextColor={colors.inkFaint} style={[styles.input, { fontSize: 16, fontWeight: '500' }]} multiline />
          </>
        )}

        {step === 4 && (
          <>
            <Text style={type.label}>Permission</Text>
            <Text style={styles.q}>Read this once, slowly.</Text>
            <View style={{ marginTop: 18, gap: 14 }}>
              {PERMISSION.map((p, i) => (
                <Text key={i} style={[type.voice, i === 0 && { fontSize: 24, lineHeight: 32, fontWeight: '700' }]}>{p}</Text>
              ))}
            </View>
            <View style={{ marginTop: 24 }}>
              <WarmthStrip keys={['dinner', 'bench', 'walk']} height={120} />
            </View>
            <Text style={[type.caption, { marginTop: 18, lineHeight: 17 }]}>
              Eastwind is for adults. It is not therapy or medical advice. If it is dark tonight: 988 in the US, findahelpline.com elsewhere.
            </Text>
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        {step > 0 ? <GhostButton title="Back" onPress={back} /> : <View style={{ width: 60 }} />}
        <PrimaryButton title={step === 0 ? 'Begin' : step === STEPS - 1 ? 'I accept' : 'Continue'} onPress={next} disabled={!canContinue} style={{ flex: 1, marginLeft: 12 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { paddingTop: 14, paddingBottom: 6 },
  body: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 30 },
  q: { ...type.h1, marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  input: { marginTop: 14, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, paddingHorizontal: 16, paddingVertical: 14, color: colors.ink, fontSize: 18, fontWeight: '600' },
  footer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});
