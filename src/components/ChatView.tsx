import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Platform, KeyboardAvoidingView, Linking } from 'react-native';
import { colors, radius, type } from '../theme';
import { Message } from '../logic/types';
import { snap } from '../dev/demo';

type Props = {
  messages: Message[];
  typing: boolean;
  busy: boolean;
  notice: string | null;
  onSend: (text: string) => void;
  placeholder?: string;
  footerLeft?: React.ReactNode;
  empty?: React.ReactNode;
};

export default function ChatView({ messages, typing, busy, notice, onSend, placeholder, footerLeft, empty }: Props) {
  const [draft, setDraft] = useState('');
  const list = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const t = setTimeout(() => list.current?.scrollToEnd({ animated: !snap }), 60);
    return () => clearTimeout(t);
  }, [messages.length, typing]);

  const submit = () => {
    const t = draft.trim();
    if (!t || busy) return;
    setDraft('');
    onSend(t);
  };

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    const prev = messages[index - 1];
    if (item.role === 'user') {
      return (
        <View style={[styles.rowUser, prev?.role === 'user' && { marginTop: 4 }]}>
          <View style={styles.bubbleUser}><Text style={styles.userText}>{item.text}</Text></View>
        </View>
      );
    }
    return (
      <View>
        <View style={[styles.rowHim, prev?.role === 'him' && { marginTop: 4 }]}>
          <Text style={styles.himText}>{item.text}</Text>
        </View>
        {item.risk ? <RiskCard /> : null}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
      <FlatList
        ref={list}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={empty ? <View style={{ paddingTop: 20 }}>{empty}</View> : null}
        ListFooterComponent={
          <View>
            {typing ? <Text style={[styles.himText, { color: colors.inkFaint, marginTop: 10 }]}>…</Text> : null}
            {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          </View>
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => list.current?.scrollToEnd({ animated: !snap })}
      />
      <View style={styles.inputWrap}>
        {footerLeft ? <View style={{ marginBottom: 8 }}>{footerLeft}</View> : null}
        <View style={styles.inputRow}>
          <TextInput value={draft} onChangeText={setDraft} placeholder={placeholder ?? 'say it'} placeholderTextColor={colors.inkFaint} style={styles.input} multiline maxLength={1500} onSubmitEditing={submit} blurOnSubmit returnKeyType="send" />
          <Pressable onPress={submit} disabled={!draft.trim() || busy} style={({ pressed }) => [styles.sendBtn, (!draft.trim() || busy) && { opacity: 0.35 }, pressed && { transform: [{ scale: 0.96 }] }]}>
            <Text style={styles.sendText}>↑</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export function RiskCard() {
  return (
    <View style={styles.risk}>
      <Text style={[type.sub, { color: colors.ink, lineHeight: 20 }]}>
        If you are in danger or thinking about hurting yourself: US{' '}
        <Text style={styles.riskLink} onPress={() => Linking.openURL('tel:988')}>call</Text> or{' '}
        <Text style={styles.riskLink} onPress={() => Linking.openURL('sms:988')}>text 988</Text> · elsewhere{' '}
        <Text style={styles.riskLink} onPress={() => Linking.openURL('https://findahelpline.com')}>findahelpline.com</Text>. He is not a crisis service, but he is still here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
  rowUser: { alignItems: 'flex-end', marginTop: 14 },
  bubbleUser: { backgroundColor: colors.ink, borderRadius: 18, borderBottomRightRadius: 6, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '84%' },
  userText: { color: colors.onInk, fontSize: 16, lineHeight: 22 },
  rowHim: { alignItems: 'flex-start', marginTop: 16, maxWidth: '92%' },
  himText: { ...type.voice, fontSize: 18, lineHeight: 27 },
  notice: { ...type.caption, textAlign: 'center', marginTop: 14 },
  inputWrap: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: Platform.OS === 'web' ? 10 : 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, backgroundColor: colors.bg },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, backgroundColor: colors.card, borderRadius: 22, borderWidth: 1, borderColor: colors.lineStrong, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 11, color: colors.ink, fontSize: 16, maxHeight: 130 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: colors.onAccent, fontWeight: '800', fontSize: 20 },
  risk: { marginTop: 10, backgroundColor: colors.goldSoft, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.gold },
  riskLink: { color: colors.accentDeep, fontWeight: '700', textDecorationLine: 'underline' },
});
