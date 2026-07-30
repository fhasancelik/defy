import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Chip, GhostButton, GradientButton, Screen } from '../components/ui';
import { colors, font, spacing } from '../theme';
import { useStore } from '../state/store';
import { postEvent } from '../lib/api';
import { rescheduleAll } from '../lib/notifications';

const TRIGGERS = ['Stress', 'Boredom', 'Social', 'After a meal', 'Alcohol', 'Saw someone use', 'Other'];

export default function Relapse() {
  const router = useRouter();
  const logRelapse = useStore((s) => s.logRelapse);
  const userId = useStore((s) => s.userId);
  const notifSetting = useStore((s) => s.notifSetting);

  const [trigger, setTrigger] = useState<string | null>(null);

  const restart = async () => {
    if (!trigger) return;
    logRelapse(trigger);
    postEvent(userId, 'relapse', { trigger });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    await rescheduleAll(notifSetting, new Date().toISOString());
    router.dismissTo('/(tabs)');
  };

  return (
    <Screen scroll>
      <Text style={styles.heading}>A slip is not the end.</Text>
      <Text style={styles.body}>
        Most people who quit for good slipped along the way. What matters is what happens in the
        next five minutes: you restart, and your brain keeps every hour of healing it already earned.
      </Text>

      <Text style={styles.label}>What triggered it?</Text>
      <View style={styles.chips}>
        {TRIGGERS.map((t) => (
          <Chip key={t} label={t} selected={trigger === t} onPress={() => setTrigger(t)} />
        ))}
      </View>

      <View style={styles.footer}>
        <GradientButton label="Restart my streak" onPress={restart} disabled={!trigger} />
        <GhostButton label="I didn't slip — take me back" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontSize: font.xxl, fontWeight: '900', marginTop: spacing(4) },
  body: { color: colors.textDim, fontSize: font.sm, lineHeight: 22, marginTop: spacing(3) },
  label: {
    color: colors.textDim,
    fontSize: font.sm,
    fontWeight: '700',
    marginTop: spacing(6),
    marginBottom: spacing(3),
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { marginTop: spacing(8) },
});
