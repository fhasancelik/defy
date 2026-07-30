import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BreathingCircle } from '../components/BreathingCircle';
import { Chip, GhostButton, GradientButton } from '../components/ui';
import { colors, font, spacing } from '../theme';
import { useStore } from '../state/store';
import { useNow } from '../hooks/useNow';
import { optionLabel } from '../lib/quiz-data';
import { postEvent } from '../lib/api';

export default function Panic() {
  const router = useRouter();
  const now = useNow(1000);
  const openedAt = React.useRef(Date.now()).current;
  const beatCraving = useStore((s) => s.beatCraving);
  const userId = useStore((s) => s.userId);
  const whys = useStore((s) => s.answers.whys ?? []);

  const elapsed = Math.floor((now - openedAt) / 1000);
  const mm = Math.floor(elapsed / 60);
  const ss = (elapsed % 60).toString().padStart(2, '0');

  const beatIt = () => {
    beatCraving();
    postEvent(userId, 'craving_beaten', { seconds: elapsed });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.back();
  };

  return (
    <LinearGradient colors={['#1A0B10', '#0A0E1A']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>This craving will pass.</Text>
          <Text style={styles.sub}>
            Most urges fade in ~3–5 minutes. You've been riding this one for{' '}
            <Text style={styles.timer}>
              {mm}:{ss}
            </Text>
            . Breathe with the circle.
          </Text>

          <BreathingCircle />

          {whys.length > 0 ? (
            <View style={styles.whysWrap}>
              <Text style={styles.whysTitle}>YOU'RE DOING THIS FOR</Text>
              <View style={styles.whysChips}>
                {whys.map((w) => (
                  <Chip key={w} label={optionLabel('whys', w)} selected />
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <GradientButton label="I beat it 💪" onPress={beatIt} />
          <GhostButton label="I slipped →" onPress={() => router.replace('/relapse')} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing(6), paddingTop: spacing(8) },
  title: { color: colors.text, fontSize: font.xxl, fontWeight: '900', textAlign: 'center' },
  sub: {
    color: colors.textDim,
    fontSize: font.sm,
    textAlign: 'center',
    marginTop: spacing(3),
    lineHeight: 21,
  },
  timer: { color: colors.warning, fontWeight: '900', fontVariant: ['tabular-nums'] },
  whysWrap: { alignItems: 'center', marginTop: spacing(4) },
  whysTitle: { color: colors.textFaint, fontSize: font.xs, fontWeight: '800', letterSpacing: 1.5 },
  whysChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing(2.5),
  },
  footer: { paddingHorizontal: spacing(6), paddingBottom: spacing(4) },
});
