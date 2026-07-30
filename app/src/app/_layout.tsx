import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';
import { useStore } from '../state/store';
import { initPurchases, checkPro } from '../lib/purchases';
import { setupNotificationHandler } from '../lib/notifications';

export default function RootLayout() {
  const setPro = useStore((s) => s.setPro);

  useEffect(() => {
    setupNotificationHandler();
    (async () => {
      await initPurchases((isPro) => setPro(isPro));
      const pro = await checkPro();
      if (pro !== null) setPro(pro);
    })();
  }, [setPro]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="panic" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="checkin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="relapse" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
