import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useStore } from '../state/store';
import { CONFIG } from '../config';
import { colors } from '../theme';

export default function Index() {
  const hydrated = useStore((s) => s.hydrated);
  const onboarded = useStore((s) => s.onboarded);
  const isPro = useStore((s) => s.isPro);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!onboarded) return <Redirect href="/(onboarding)/welcome" />;
  if (CONFIG.requirePurchase && !isPro) return <Redirect href="/(onboarding)/paywall" />;
  return <Redirect href="/(tabs)" />;
}
