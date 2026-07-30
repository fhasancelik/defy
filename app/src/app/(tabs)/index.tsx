import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, GradientButton, ProgressBar, StatCard } from '../../components/ui';
import { StreakTimer } from '../../components/StreakTimer';
import { colors, font, radius, spacing } from '../../theme';
import { CONFIG } from '../../config';
import { useStore } from '../../state/store';
import { useNow } from '../../hooks/useNow';
import {
  brainRewiringPct,
  formatCompact,
  hasCheckInToday,
  moneySaved,
  streakMs,
} from '../../lib/stats';
import { msUntil, nextMilestone, progressToNext } from '../../lib/milestones';
import { fetchMotivation } from '../../lib/api';
import type { Quote } from '../../lib/quotes';
import { dailyQuote } from '../../lib/quotes';

export default function Home() {
  const router = useRouter();
  const now = useNow(1000);
  const quitDate = useStore((s) => s.quitDate);
  const weeklySpend = useStore((s) => s.weeklySpend);
  const cravingsBeaten = useStore((s) => s.cravingsBeaten);
  const checkIns = useStore((s) => s.checkIns);
  const isPro = useStore((s) => s.isPro);

  const [quote, setQuote] = useState<Quote>(dailyQuote());
  useEffect(() => {
    fetchMotivation().then(setQuote);
  }, []);

  const ms = streakMs(quitDate, now);
  const rewiring = brainRewiringPct(ms);
  const next = nextMilestone(ms);
  const checkedToday = hasCheckInToday(checkIns, now);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>{CONFIG.appName}</Text>
          {isPro ? (
            <View style={styles.proChip}>
              <Text style={styles.proChipText}>PRO</Text>
            </View>
          ) : null}
        </View>

        <StreakTimer quitISO={quitDate} now={now} />

        <View style={styles.statRow}>
          <StatCard
            label="Money saved"
            value={`$${moneySaved(weeklySpend, ms).toFixed(2)}`}
            sub={`$${weeklySpend}/week habit`}
            accent
          />
          <StatCard label="Cravings beaten" value={`${cravingsBeaten}`} sub="panic mode wins" />
        </View>

        <Card style={{ marginTop: spacing(3) }}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>🧠 Brain rewiring</Text>
            <Text style={styles.cardValue}>{rewiring.toFixed(1)}%</Text>
          </View>
          <View style={{ marginTop: spacing(2.5) }}>
            <ProgressBar progress={rewiring / 100} />
          </View>
          <Text style={styles.cardHint}>Dopamine pathways largely reset over ~90 days.</Text>
        </Card>

        {next ? (
          <Card style={{ marginTop: spacing(3) }}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>
                {next.emoji} {next.title}
              </Text>
              <Text style={styles.cardValueDim}>in {formatCompact(msUntil(next, ms))}</Text>
            </View>
            <View style={{ marginTop: spacing(2.5) }}>
              <ProgressBar progress={progressToNext(ms)} color={colors.warning} />
            </View>
            <Text style={styles.cardHint}>{next.body}</Text>
          </Card>
        ) : null}

        {!checkedToday ? (
          <Card style={[styles.checkinCard, { marginTop: spacing(3) }]}>
            <Text style={styles.cardTitle}>How are the cravings today?</Text>
            <Text style={styles.cardHint}>30 seconds. Tracking them makes them weaker.</Text>
            <View style={{ marginTop: spacing(3) }}>
              <GradientButton label="Daily check-in" onPress={() => router.push('/checkin')} />
            </View>
          </Card>
        ) : null}

        <Card style={{ marginTop: spacing(3), borderColor: colors.surfaceAlt }}>
          <Text style={styles.quote}>“{quote.text}”</Text>
          {quote.author ? <Text style={styles.quoteAuthor}>— {quote.author}</Text> : null}
        </Card>
      </ScrollView>

      <View style={styles.panicBar}>
        <GradientButton
          label="🚨  I'm craving — PANIC"
          variant="panic"
          onPress={() => router.push('/panic')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(4) },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing(2),
  },
  brand: { color: colors.text, fontSize: font.xl, fontWeight: '900' },
  proChip: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing(2.5),
    paddingVertical: 2,
  },
  proChipText: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  statRow: { flexDirection: 'row', gap: spacing(3), marginTop: spacing(2) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.text, fontSize: font.md, fontWeight: '800' },
  cardValue: { color: colors.accent, fontSize: font.md, fontWeight: '900' },
  cardValueDim: { color: colors.textDim, fontSize: font.sm, fontWeight: '700' },
  cardHint: { color: colors.textDim, fontSize: font.xs, marginTop: spacing(2), lineHeight: 17 },
  checkinCard: { borderColor: colors.accent },
  quote: { color: colors.text, fontSize: font.sm, fontStyle: 'italic', lineHeight: 21 },
  quoteAuthor: { color: colors.textFaint, fontSize: font.xs, marginTop: spacing(1.5) },
  panicBar: {
    paddingHorizontal: spacing(5),
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
  },
});
