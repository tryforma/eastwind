import React, { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { Screen, Header, Card, Label, PrimaryButton, SecondaryButton } from '../components/UI';
import { colors, radius, type } from '../theme';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';
import { photo as photoApi, LimitError, ProError, PhotoResponse } from '../services/api';
import { deviceId } from '../services/device';
import { getAppUserID } from '../services/billing';

/** Pick a photo, get three honest fixes. No filters, no retouching, no verdicts on his face. */
export default function PhotoScreen({ navigation }: ScreenProps<'Photo'>) {
  const { isPro } = useApp();
  const [uri, setUri] = useState<string | null>(null);
  const [b64, setB64] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<PhotoResponse | null>(null);

  const pick = async (camera: boolean) => {
    try {
      const Picker = require('expo-image-picker') as typeof import('expo-image-picker');
      const Manip = require('expo-image-manipulator') as typeof import('expo-image-manipulator');
      if (camera) {
        const p = await Picker.requestCameraPermissionsAsync();
        if (!p.granted) return;
      } else {
        const p = await Picker.requestMediaLibraryPermissionsAsync();
        if (!p.granted) return;
      }
      const r = camera ? await Picker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.9 }) : await Picker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
      if (r.canceled || !r.assets[0]) return;
      const m = await Manip.manipulateAsync(r.assets[0].uri, [{ resize: { width: 1024 } }], { compress: 0.82, format: Manip.SaveFormat.JPEG, base64: true });
      setUri(m.uri);
      setB64(m.base64 ?? null);
      setRes(null);
    } catch {
      Alert.alert('Could not open that', 'Try another photo.');
    }
  };

  const ask = async () => {
    if (!b64) return;
    setBusy(true);
    try {
      const [device, rcId] = await Promise.all([deviceId(), getAppUserID()]);
      setRes(await photoApi({ device, mode: 'photo', image: b64, pro: isPro, rcId, user: { name: '' } }));
    } catch (e) {
      if (e instanceof ProError) navigation.replace('Paywall', { reason: 'photo' });
      else if (e instanceof LimitError) Alert.alert('That is enough for today', 'Thirty photos a day. Pick the best three and go live.');
      else Alert.alert('No connection', 'Try again in a minute.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll>
      <Header title="Photo notes" onBack={() => navigation.goBack()} />
      <Text style={[type.bodySoft, { marginTop: 4 }]}>Pick the photo you are thinking of using first. He looks at the light, the expression and the framing, and gives three fixes. Never your face, never a filter. The photo is sent once and not stored.</Text>
      <View style={{ marginTop: 16, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.cardAlt, height: 360, alignItems: 'center', justifyContent: 'center' }}>
        {uri ? <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> : <Text style={type.caption}>No photo yet</Text>}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <SecondaryButton title="Library" style={{ flex: 1 }} onPress={() => pick(false)} />
        <SecondaryButton title="Camera" style={{ flex: 1 }} onPress={() => pick(true)} />
      </View>
      <PrimaryButton title="Three fixes" onPress={ask} disabled={!b64} loading={busy} style={{ marginTop: 10 }} />
      {res && (
        <Card style={{ marginTop: 16 }}>
          <Label>His notes</Label>
          <Text style={type.voice}>{res.verdict}</Text>
          {res.keep ? <Text style={[type.bodySoft, { marginTop: 8 }]}>Keep: {res.keep}</Text> : null}
          <View style={{ marginTop: 12, gap: 8 }}>
            {res.fixes.map((f, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={[type.body, { color: colors.accent, fontWeight: '800' }]}>{i + 1}</Text>
                <Text style={[type.body, { flex: 1 }]}>{f}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </Screen>
  );
}
