import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, spacing } from '../theme';
import { streakMs, streakParts } from '../lib/stats';

const pad2 = (n: number) => n.toString().padStart(2, '0');

export function StreakTimer({ quitISO, now }: { quitISO: string | null; now: number }) {
  const parts = streakParts(streakMs(quitISO, now));
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>NICOTINE-FREE FOR</Text>
      <View style={styles.daysRow}>
        <Text style={styles.days}>{parts.days}</Text>
        <Text style={styles.daysUnit}>{parts.days === 1 ? 'day' : 'days'}</Text>
      </View>
      <Text style={styles.clock}>
        {pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing(4) },
  label: {
    color: colors.textDim,
    fontSize: font.xs,
    fontWeight: '800',
    letterSpacing: 2,
  },
  daysRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing(2) },
  days: { color: colors.accent, fontSize: font.giant + 8, fontWeight: '900', lineHeight: font.giant + 18 },
  daysUnit: { color: colors.text, fontSize: font.xl, fontWeight: '700' },
  clock: {
    color: colors.text,
    fontSize: font.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginTop: spacing(1),
  },
});
