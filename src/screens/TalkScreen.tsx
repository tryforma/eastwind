import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Screen, Tag } from '../components/UI';
import ChatView from '../components/ChatView';
import { colors, type } from '../theme';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { Message, uid, FREE_TALK_PER_DAY } from '../logic/types';
import { talk, toWire, LimitError } from '../services/api';
import { deviceId } from '../services/device';
import { getAppUserID } from '../services/billing';
import { demo } from '../dev/demo';

const OPENERS = [
  'Hey. No counter here, no rules. What is tonight like?',
  'I have been where you are. Say whatever it actually is.',
  'You do not have to explain anything. Start anywhere.',
];

export default function TalkScreen({ navigation }: TabProps<'Talk'>) {
  const { state, isPro, pushMessages } = useApp();
  const [typing, setTyping] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const send = useCallback(
    async (text: string) => {
      const mine: Message = { id: uid(), role: 'user', text, at: new Date().toISOString() };
      pushMessages([mine]);
      setTyping(true);
      setNotice(null);
      try {
        const [device, rcId] = await Promise.all([deviceId(), getAppUserID()]);
        const res = await talk({ device, mode: 'talk', messages: toWire([...state.talk, mine]), memory: state.memory, user: { name: state.name, situation: state.situation, preps: state.preps, lastWarm: state.lastWarm }, hour: new Date().getHours(), pro: isPro, rcId });
        pushMessages([{ id: uid(), role: 'him', text: res.reply, at: new Date().toISOString(), risk: res.risk || undefined }], res.memory);
        setRemaining(res.pro ? null : res.remaining);
        if (res.degraded) setNotice('connection wobbled; he answered from memory');
      } catch (e) {
        if (e instanceof LimitError) {
          setRemaining(0);
          setNotice(`That is ${e.limit} for today. He is back at midnight, or unlimited with Pro.`);
        } else if (demo) {
          pushMessages([{ id: uid(), role: 'him', text: 'demo mode. on a phone this is him.', at: new Date().toISOString() }]);
        } else {
          setNotice('No connection. He is not going anywhere; try again in a minute.');
        }
      } finally {
        setTyping(false);
      }
    },
    [state.talk, state.memory, state.name, state.situation, state.preps, state.lastWarm, isPro, pushMessages],
  );

  const opener = OPENERS[Math.abs(state.name.length) % OPENERS.length];

  return (
    <Screen edges={['top']} contentStyle={{ paddingHorizontal: 0 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 4 }}>
        <View>
          <Text style={type.h1}>Talk</Text>
          <Text style={type.caption}>No title. No program. Just him.</Text>
        </View>
        {!isPro && (
          <Pressable onPress={() => navigation.navigate('Paywall', { reason: 'talk' })}>
            <Tag text={remaining === null ? `${FREE_TALK_PER_DAY} a day free` : `${remaining} left today`} tone={remaining === 0 ? 'red' : 'gold'} />
          </Pressable>
        )}
      </View>
      <ChatView
        messages={state.talk}
        typing={typing}
        busy={typing}
        notice={notice}
        onSend={send}
        placeholder="say it"
        empty={
          <View style={{ paddingHorizontal: 4 }}>
            <Text style={type.voice}>{opener}</Text>
            <Text style={[type.bodySoft, { marginTop: 14 }]}>Things he is good at: what to text her, whether to ask, what a relapse was really hungry for, when to take the night off, how to survive a first date.</Text>
            <Text style={[type.caption, { marginTop: 14, lineHeight: 17 }]}>He is an AI in the voice of someone who came through this. Not a therapist, not a crisis line. Messages go to our server and to Google Gemini to make the reply and are not stored. What he remembers stays on your phone.</Text>
          </View>
        }
        footerLeft={remaining === 0 && !isPro ? (
          <Pressable onPress={() => navigation.navigate('Paywall', { reason: 'talk' })} style={{ backgroundColor: colors.goldSoft, borderRadius: 12, padding: 10 }}>
            <Text style={[type.sub, { color: colors.accentDeep }]}>Out for today. Pro is unlimited, and everything that gets you through tonight stays free.</Text>
          </Pressable>
        ) : null}
      />
    </Screen>
  );
}
