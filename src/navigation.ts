import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Today: undefined;
  Talk: undefined;
  Dates: undefined;
  Fruits: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Paywall: { fromOnboarding?: boolean; reason?: 'talk' | 'scenes' | 'photo' | 'reminders' } | undefined;
  Urge: undefined;
  Scene: { id: string };
  Photo: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type TabProps<T extends keyof TabParamList> = CompositeScreenProps<BottomTabScreenProps<TabParamList, T>, NativeStackScreenProps<RootStackParamList>>;
export type RootNav = NativeStackNavigationProp<RootStackParamList>;
