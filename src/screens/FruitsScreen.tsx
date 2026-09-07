import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Screen, Card, Label, PrimaryButton, Chip, Tag, StatTile } from '../components/UI';
import { Sun } from '../components/Sun';
import { WarmthStrip } from '../components/Warmth';
import { colors, radius, type } from '../theme';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { FRUITS, FruitKind } from '../logic/types';
import { sunLevel, sunName, recentFruits, countByKind } from '../logic/harvest';

/** The ledger of real warmth. The only thing this app counts, and it never resets. */
export default function FruitsScreen({ navigation }: TabProps<'Fruits'>) {
  const { state, addFruit, removeFruit } = useApp();
  const [kind, setKind] = useState<FruitKind>('her');
  const [text, setText] = useState('');
  const level = sunLevel(state);
  const week = recentFruits(state, 7);
  const three = recentFruits(state, 21);
  const counts = countByKind(three);

  const save = () => {
    addFruit(kind, text.trim() || FRUITS.find((f) => f.id === kind)?.label || '');
    setText('');
  };
  const onRemove = (id: string) => Alert.alert('Remove this one?', 'It is gone from the harvest.', [{ text: 'Keep', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => removeFruit(id) }]);

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 6 }}>
        <View>
          <Text style={type.caption}>The harvest</Text>
          <Text style={type.h1}>Fruits</Text>
        </View>
        <Tag text={sunName(level)} tone={level > 0.5 ? 'gold' : 'plain'} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 6 }}>
        <Sun level={level} size={200} />
        <Text style={[type.bodySoft, { textAlign: 'center', marginTop: -6, paddingHorizontal: 20 }]}>The sun rises with the last three weeks of real warmth. It never goes back to zero.</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <StatTile label="This week" value={`${week.length}`} sub="fruits" />
        <StatTile label="Her" value={`${counts.her + counts.brave}`} sub="3 weeks" color={colors.rose} />
        <StatTile label="Rest" value={`${counts.rest}`} sub="3 weeks" />
      </View>

      <Card style={{ marginTop: 14 }}>
        <Label>Something warm happened</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {FRUITS.map((f) => (
            <Chip key={f.id} text={`${f.emoji} ${f.label}`} selected={kind === f.id} onPress={() => setKind(f.id)} color={f.id === 'her' ? colors.rose : undefined} />
          ))}
        </View>
        <Text style={[type.caption, { marginTop: 8 }]}>{FRUITS.find((f) => f.id === kind)?.hint}</Text>
        <TextInput value={text} onChangeText={setText} placeholder="One line, in your words" placeholderTextColor={colors.inkFaint} style={styles.input} multiline />
        <PrimaryButton title="Add to the harvest" onPress={save} style={{ marginTop: 12 }} small color={colors.accent} />
      </Card>

      {state.fruits.length === 0 ? (
        <View style={{ marginTop: 16 }}>
          <WarmthStrip keys={['coffee', 'friends', 'porch']} />
          <Text style={[type.bodySoft, { textAlign: 'center', marginTop: 14 }]}>Nothing here yet. A text back counts. Sun on your face counts. A nap counts.</Text>
        </View>
      ) : (
        <View style={{ marginTop: 16 }}>
          {state.fruits.slice(0, 60).map((f) => {
            const meta = FRUITS.find((x) => x.id === f.kind);
            const d = new Date(f.at);
            return (
              <Pressable key={f.id} onLongPress={() => onRemove(f.id)} delayLongPress={350} style={styles.fruit}>
                <Text style={{ fontSize: 20 }}>{meta?.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={type.body}>{f.text}</Text>
                  <Text style={type.caption}>{d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} · {meta?.label}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
      <Text style={[type.caption, { textAlign: 'center', marginTop: 18 }]}>Nothing else is counted. Not days, not slips, not streaks.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { marginTop: 10, backgroundColor: colors.bgElevated, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, paddingHorizontal: 14, paddingVertical: 11, color: colors.ink, fontSize: 15, minHeight: 48 },
  fruit: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: colors.card, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.line, marginBottom: 8 },
});
