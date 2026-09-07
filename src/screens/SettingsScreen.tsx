import React, { useState } from 'react';
import { View, Text, Linking, TextInput, Alert, Modal } from 'react-native';
import { Screen, PrimaryButton, Chip, Row, Group, SectionCaption, ToggleRow, sheetStyles, SecondaryButton } from '../components/UI';
import { colors, type } from '../theme';
import { useApp } from '../store/AppContext';
import { restore } from '../services/billing';
import { formatHour } from '../services/notifications';
import { TabProps } from '../navigation';
import { SITE } from './PaywallScreen';
import { SITUATIONS, Situation } from '../logic/types';

export const SUPPORT_EMAIL = 'tryformaapp@gmail.com';
const HOURS = [6, 7, 8, 9, 10, 12, 18, 20, 21, 22];

type Sheet = null | 'name' | 'warm' | 'situation' | 'hour' | 'about';

export default function SettingsScreen({ navigation }: TabProps<'Settings'>) {
  const { state, isPro, update, setReminders, resetAll, clearTalk } = useApp();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [text, setText] = useState('');

  const open = (s: Sheet, initial = '') => { setText(initial); setSheet(s); };
  const close = () => setSheet(null);

  const onDelete = () =>
    Alert.alert('Delete everything?', 'Fruits, dates, prompts, the conversation and settings are removed from this phone. Nothing is kept anywhere else.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => resetAll() },
    ]);
  const onClearTalk = () => Alert.alert('Clear the conversation?', 'He forgets everything he learned about you. Your fruits stay.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: clearTalk }]);

  const onReminders = async (v: boolean) => {
    if (!isPro) return navigation.navigate('Paywall', { reason: 'reminders' });
    const ok = await setReminders(v);
    if (v && !ok) Alert.alert('Notifications are off', 'Allow notifications for Eastwind in iOS Settings to get the morning line.');
  };

  const onRestore = async () => {
    try {
      const ok = await restore();
      Alert.alert(ok ? 'Pro restored' : 'Nothing to restore', ok ? 'Welcome back.' : 'No active subscription was found for this Apple ID.');
    } catch {
      Alert.alert('Could not restore', 'Check your connection and try again.');
    }
  };

  return (
    <Screen scroll>
      <Text style={[type.h1, { paddingTop: 6 }]}>Settings</Text>

      <SectionCaption>You</SectionCaption>
      <Group>
        <Row label="Name" value={state.name} onPress={() => open('name', state.name)} />
        <Row label="Where you are" value={SITUATIONS.find((s) => s[0] === state.situation)?.[1]} onPress={() => open('situation')} />
        <Row label="Last time you felt warm" value={state.lastWarm ? '…' : 'Add'} onPress={() => open('warm', state.lastWarm)} last />
      </Group>

      <SectionCaption>Morning line</SectionCaption>
      <Group>
        <ToggleRow label="Daily reminder" sub={isPro ? 'One line, on your phone, nothing sent' : 'Part of Pro'} value={state.reminders.enabled && isPro} onChange={onReminders} />
        <Row label="Hour" value={formatHour(state.reminders.hour)} onPress={() => (isPro ? open('hour') : navigation.navigate('Paywall', { reason: 'reminders' }))} last />
      </Group>

      <SectionCaption>Pro</SectionCaption>
      <Group>
        {!isPro ? <Row label="Unlimited talk, all scenes, photo notes" onPress={() => navigation.navigate('Paywall')} /> : <Row label="Pro is on" value="thank you" onPress={() => {}} />}
        <Row label="Restore purchases" onPress={onRestore} />
        <Row label="Manage subscription" onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')} last />
      </Group>

      <SectionCaption>Privacy</SectionCaption>
      <Group>
        <Row label="Clear the conversation" onPress={onClearTalk} />
        <Row label="Delete all data" onPress={onDelete} danger last />
      </Group>

      <SectionCaption>About</SectionCaption>
      <Group>
        <Row label="What this is" onPress={() => open('about')} />
        <Row label="Privacy policy" onPress={() => Linking.openURL(`${SITE}/privacy.html`)} />
        <Row label="Terms of use" onPress={() => Linking.openURL(`${SITE}/terms.html`)} />
        <Row label="Email us" value={SUPPORT_EMAIL} onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Eastwind`)} last />
      </Group>
      <Text style={[type.caption, { textAlign: 'center', marginTop: 20, lineHeight: 17 }]}>Eastwind is for adults. It is not therapy, medical advice or a crisis service. If it is dark tonight: 988 in the US, findahelpline.com elsewhere.</Text>

      <Modal visible={sheet !== null} transparent animationType="slide" onRequestClose={close}>
        <View style={sheetStyles.backdrop} onTouchEnd={close} />
        <View style={sheetStyles.sheet}>
          {sheet === 'name' && (
            <>
              <Text style={type.h2}>What should he call you?</Text>
              <TextInput value={text} onChangeText={setText} style={sheetStyles.input} autoFocus />
              <PrimaryButton title="Save" onPress={() => { update({ name: text.trim() }); close(); }} style={{ marginTop: 14 }} />
            </>
          )}
          {sheet === 'warm' && (
            <>
              <Text style={type.h2}>The last time you felt warm</Text>
              <Text style={[type.sub, { marginTop: 4 }]}>He hands it back to you on hard nights.</Text>
              <TextInput value={text} onChangeText={setText} style={[sheetStyles.input, { fontSize: 16, fontWeight: '500' }]} multiline autoFocus />
              <PrimaryButton title="Save" onPress={() => { update({ lastWarm: text.trim() }); close(); }} style={{ marginTop: 14 }} />
            </>
          )}
          {sheet === 'situation' && (
            <>
              <Text style={type.h2}>Where you are</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {SITUATIONS.map(([id, label]) => (
                  <Chip key={id} text={label} selected={state.situation === id} onPress={() => { update({ situation: id as Situation }); close(); }} />
                ))}
              </View>
            </>
          )}
          {sheet === 'hour' && (
            <>
              <Text style={type.h2}>Which hour?</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {HOURS.map((h) => (
                  <Chip key={h} text={formatHour(h)} selected={state.reminders.hour === h} onPress={async () => { await setReminders(state.reminders.enabled, h); close(); }} />
                ))}
              </View>
            </>
          )}
          {sheet === 'about' && (
            <>
              <Text style={type.h2}>What this is</Text>
              <Text style={[type.body, { marginTop: 10 }]}>Eastwind is for men who have fought lust and porn for years, quit and gone back, and are tired of apps that count their failures. It does not count. It does not block. It does not lecture.</Text>
              <Text style={[type.body, { marginTop: 10 }]}>It gives you one real thing a day, a scene to live before you sleep, ninety seconds of company when it is loud, someone to talk to who came through it, and permission to go on the date. The only thing it counts is warmth that actually happened.</Text>
              <Text style={[type.caption, { marginTop: 12, lineHeight: 17 }]}>The name: when the sea parted, the man just held his hand up. An east wind did the work all night. That is how this goes too.</Text>
              <SecondaryButton title="Close" onPress={close} style={{ marginTop: 16 }} />
            </>
          )}
        </View>
      </Modal>
    </Screen>
  );
}
