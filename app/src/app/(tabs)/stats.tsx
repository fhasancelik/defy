import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Screen, SectionTitle, StatCard } from '../../components/ui';
import { colors, font, radius, spacing } from '../../theme';
import { useStore } from '../../state/store';
import { useNow } from '../../hooks/useNow';
import {
  cravingSeries,
  formatCompact,
  longestStreakMs,
  streakMs,
  totalCleanMs,
} from '../../lib/stats';
import { MILESTONES } from '../../lib/milestones';

const CHART_MAX = 5;

export default function Stats() {
  const now = useNow(30_000);
  const quitDate = useStore((s) => s.quitDate);
  const relapses = useStore((s) => s.relapses);
  const checkIns = useStore((s) => s.checkIns);
  const cravingsBeaten = useStore((s) => s.cravingsBeaten);

  const current = streakMs(quitDate, now);
  const series = cravingSeries(checkIns, 14, now);
  const hasChartData = series.some((d) => d.value !== null);

  return (
    <Screen scroll>
      <Text style={styles.heading}>Progress</Text>

      <View style={styles.grid}>
        <StatCard label="Current streak" value={formatCompact(current)} accent />
        <StatCard label="Longest streak" value={formatCompact(longestStreakMs(current, relapses))} />
        <StatCard label="Total clean time" value={formatCompact(totalCleanMs(current, relapses))} />
        <StatCard label="Cravings beaten" value={`${cravingsBeaten}`} />
      </View>

      <SectionTitle>Craving intensity — last 14 days</SectionTitle>
      <Card>
        {hasChartData ? (
          <View style={styles.chartRow}>
            {series.map((d, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: d.value === null ? 0 : `${Math.max(8, (d.value / CHART_MAX) * 100)}%`,
                        backgroundColor:
                          d.value === null
                            ? 'transparent'
                            : d.value >= 3.5
                              ? colors.danger
                              : d.value >= 2
                                ? colors.warning
                                : colors.accent,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{i % 2 === 0 ? d.label : ''}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>No check-ins yet. Do your first daily check-in to see the curve bend downward.</Text>
        )}
      </Card>

      {relapses.length > 0 ? (
        <Text style={styles.relapseNote}>
          {relapses.length} restart{relapses.length === 1 ? '' : 's'} — every attempt teaches your plan something.
        </Text>
      ) : null}

      <SectionTitle>Recovery milestones</SectionTitle>
      <View style={{ gap: spacing(2.5) }}>
        {MILESTONES.map((m) => {
          const achieved = current >= m.afterHours * 3_600_000;
          return (
            <Card
              key={m.id}
              style={achieved ? styles.msAchieved : styles.msFuture}
            >
              <View style={styles.msRow}>
                <Text style={styles.msEmoji}>{m.emoji}</Text>
                <View style={styles.msTextWrap}>
                  <Text style={[styles.msTitle, achieved && { color: colors.accent }]}>
                    {m.title} {achieved ? '✓' : ''}
                  </Text>
                  <Text style={styles.msBody}>{m.body}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontSize: font.xxl, fontWeight: '900', marginTop: spacing(2), marginBottom: spacing(4) },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(3) },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 4 },
  chartCol: { flex: 1, alignItems: 'center' },
  barTrack: {
    width: '100%',
    height: 100,
    borderRadius: radius.md / 2,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: radius.md / 2 },
  barLabel: { color: colors.textFaint, fontSize: 9, marginTop: 4 },
  empty: { color: colors.textDim, fontSize: font.sm, lineHeight: 20 },
  relapseNote: { color: colors.textFaint, fontSize: font.xs, marginTop: spacing(3) },
  msAchieved: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  msFuture: { opacity: 0.75 },
  msRow: { flexDirection: 'row', gap: spacing(3), alignItems: 'flex-start' },
  msEmoji: { fontSize: 24 },
  msTextWrap: { flex: 1 },
  msTitle: { color: colors.text, fontSize: font.md, fontWeight: '800' },
  msBody: { color: colors.textDim, fontSize: font.xs, marginTop: 2, lineHeight: 17 },
});
