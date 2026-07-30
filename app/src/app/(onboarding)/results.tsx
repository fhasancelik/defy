import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, GradientButton, Screen } from '../../components/ui';
import { colors, font, radius, spacing } from '../../theme';
import { useStore } from '../../state/store';
import { yearlySavings } from '../../lib/stats';

const BAND_COLORS: Record<string, string> = {
  Mild: colors.accent,
  Moderate: colors.warning,
  High: '#FB923C',
  Severe: colors.danger,
};

export default function Results() {
  const router = useRouter();
  const dependence = useStore((s) => s.dependence);
  const weeklySpend = useStore((s) => s.weeklySpend);
  const answers = useStore((s) => s.answers);

  const bandColor = BAND_COLORS[dependence.band] ?? colors.accent;
  const triggerCount = answers.triggers?.length ?? 0;
  const morningUser = ['u1', 'u2'].includes(answers.firstUse?.[0] ?? '');

  return (
    <Screen scroll>
      <Text style={styles.heading}>Your results</Text>

      <View style={styles.scoreWrap}>
        <View style={[styles.scoreRing, { borderColor: bandColor }]}>
          <Text style={styles.scoreNum}>{dependence.score}</Text>
          <Text style={styles.scoreOf}>/100</Text>
        </View>
        <View style={[styles.bandChip, { backgroundColor: `${bandColor}22`, borderColor: bandColor }]}>
          <Text style={[styles.bandText, { color: bandColor }]}>
            {dependence.band.toUpperCase()} DEPENDENCE
          </Text>
        </View>
        <Text style={styles.blurb}>{dependence.blurb}</Text>
      </View>

      <Card style={styles.moneyCard}>
        <Text style={styles.moneyLabel}>Money you're burning on nicotine</Text>
        <Text style={styles.moneyValue}>${yearlySavings(weeklySpend)}/year</Text>
        <Text style={styles.moneySub}>Quitting puts it back in your pocket.</Text>
      </Card>

      <Card style={{ marginTop: spacing(3) }}>
        <Text style={styles.insightTitle}>What your answers show</Text>
        {morningUser ? (
          <Text style={styles.insight}>
            • Using within 30 minutes of waking signals strong physical dependence — your plan starts with the morning craving.
          </Text>
        ) : (
          <Text style={styles.insight}>
            • Your cravings are more habitual than physical — pattern-breaking works fast for your profile.
          </Text>
        )}
        <Text style={styles.insight}>
          • You identified {triggerCount || 'several'} craving trigger{triggerCount === 1 ? '' : 's'} — panic mode is built around them.
        </Text>
        <Text style={styles.insight}>
          • Your brain's reward loop can largely reset in ~90 days. We track it day by day.
        </Text>
      </Card>

      <View style={styles.footer}>
        <GradientButton label="See my quit plan →" onPress={() => router.replace('/(onboarding)/paywall')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.text,
    fontSize: font.xxl,
    fontWeight: '900',
    marginTop: spacing(2),
    marginBottom: spacing(5),
  },
  scoreWrap: { alignItems: 'center', marginBottom: spacing(6) },
  scoreRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.surface,
  },
  scoreNum: { color: colors.text, fontSize: 52, fontWeight: '900' },
  scoreOf: { color: colors.textFaint, fontSize: font.md, fontWeight: '700', marginTop: 18 },
  bandChip: {
    marginTop: spacing(4),
    borderRadius: radius.full,
    borderWidth: 1.5,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(1.5),
  },
  bandText: { fontSize: font.sm, fontWeight: '900', letterSpacing: 1 },
  blurb: {
    color: colors.textDim,
    fontSize: font.sm,
    textAlign: 'center',
    marginTop: spacing(3),
    lineHeight: 21,
  },
  moneyCard: { alignItems: 'center', borderColor: colors.accent },
  moneyLabel: { color: colors.textDim, fontSize: font.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  moneyValue: { color: colors.accent, fontSize: font.huge, fontWeight: '900', marginVertical: spacing(1) },
  moneySub: { color: colors.textDim, fontSize: font.sm },
  insightTitle: { color: colors.text, fontSize: font.md, fontWeight: '800', marginBottom: spacing(2) },
  insight: { color: colors.textDim, fontSize: font.sm, lineHeight: 21, marginBottom: spacing(1.5) },
  footer: { marginTop: spacing(6) },
});
