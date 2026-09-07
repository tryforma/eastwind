import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from './src/theme';
import { AppProvider, useApp } from './src/store/AppContext';
import { RootStackParamList, TabParamList } from './src/navigation';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import TodayScreen from './src/screens/TodayScreen';
import TalkScreen from './src/screens/TalkScreen';
import DatesScreen from './src/screens/DatesScreen';
import FruitsScreen from './src/screens/FruitsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UrgeScreen from './src/screens/UrgeScreen';
import SceneScreen from './src/screens/SceneScreen';
import PhotoScreen from './src/screens/PhotoScreen';
import { demo } from './src/dev/demo';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const navTheme: Theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.card, text: colors.ink, primary: colors.accentDeep, border: colors.line } };

const TAB_ICONS: Record<keyof TabParamList, string> = { Today: '☀️', Talk: '💬', Dates: '🌹', Fruits: '🧺', Settings: '⚙' };

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName={demo?.tab ?? 'Today'}
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line, height: Platform.OS === 'web' ? 84 : undefined, paddingBottom: Platform.OS === 'web' ? 22 : undefined, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, focused }) => <Text style={{ fontSize: 18, color, opacity: focused ? 1 : 0.55 }}>{TAB_ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Talk" component={TalkScreen} />
      <Tab.Screen name="Dates" component={DatesScreen} />
      <Tab.Screen name="Fruits" component={FruitsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { ready, state } = useApp();
  const [justOnboarded, setJustOnboarded] = useState(false);
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  if (!state.onboarded) return <OnboardingScreen onDone={() => setJustOnboarded(true)} />;
  const initial: keyof RootStackParamList = demo?.screen ?? (justOnboarded ? 'Paywall' : 'Tabs');
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName={initial} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Urge" component={UrgeScreen} options={{ presentation: 'fullScreenModal', contentStyle: { backgroundColor: colors.night } }} />
        <Stack.Screen name="Scene" component={SceneScreen} options={{ presentation: 'fullScreenModal', contentStyle: { backgroundColor: colors.night } }} initialParams={{ id: 'table' }} />
        <Stack.Screen name="Photo" component={PhotoScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: 'modal' }} initialParams={justOnboarded ? { fromOnboarding: true } : undefined} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const webFrame = Platform.OS === 'web' ? ({ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: colors.bg } as const) : null;
const demoInsets = demo ? { paddingTop: 59, paddingBottom: 34 } : null;

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <View style={[{ flex: 1 }, webFrame as any, demoInsets]}>
          <Root />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
