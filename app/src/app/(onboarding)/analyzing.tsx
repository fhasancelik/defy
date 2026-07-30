import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui';
import { colors, font, radius, spacing } from '../../theme';

const PHASES = [
  'Analyzing your answers…',
  'Calculating your dependence score…',
  'Building your quit plan…',
];

const TOTAL_MS = 3400;

export default function Analyzing() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: TOTAL_MS, useNativeDriver: false }).start();
    const phaseTimer = setInterval(
      () => setPhaseIdx((i) => Math.min(i + 1, PHASES.length - 1)),
      TOTAL_MS / PHASES.length,
    );
    const done = setTimeout(() => router.replace('/(onboarding)/results'), TOTAL_MS + 250);
    return () => {
      clearInterval(phaseTimer);
      clearTimeout(done);
    };
  }, [progress, router]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.emoji}>🧬</Text>
        <Text style={styles.phase}>{PHASES[phaseIdx]}</Text>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width }]} />
        </View>
        <Text style={styles.hint}>Based on your 12 answers</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(4) },
  emoji: { fontSize: 56 },
  phase: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  track: {
    width: '84%',
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.full },
  hint: { color: colors.textFaint, fontSize: font.xs },
});
