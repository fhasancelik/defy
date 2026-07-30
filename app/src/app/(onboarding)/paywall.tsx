import React, { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GhostButton, GradientButton, Screen } from '../../components/ui';
import { colors, font, radius, spacing } from '../../theme';
import { CONFIG } from '../../config';
import {
  isMockBilling,
  loadOffering,
  purchasePlan,
  restore,
  type OfferingInfo,
  type PlanId,
} from '../../lib/purchases';
import { useStore } from '../../state/store';
import { requestPermission, rescheduleAll } from '../../lib/notifications';

const FEATURES = [
  'Personalized quit plan from your dependence profile',
  'Panic mode — beat cravings in the moment',
  'Body-recovery timeline & milestone alerts',
  'Streak, money-saved and craving analytics',
];

export default function Paywall() {
  const router = useRouter();
  const dependence = useStore((s) => s.dependence);
  const setPro = useStore((s) => s.setPro);
  const notifSetting = useStore((s) => s.notifSetting);
  const quitDate = useStore((s) => s.quitDate);

  const [offering, setOffering] = useState<OfferingInfo | null>(null);
  const [plan, setPlan] = useState<PlanId>('annual');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOffering().then(setOffering);
  }, []);

  const unlock = async () => {
    setPro(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const granted = await requestPermission();
    if (granted) await rescheduleAll(notifSetting, quitDate);
    router.replace('/(tabs)');
  };

  const buy = async () => {
    setBusy(true);
    setError(null);
    const res = await purchasePlan(offering?.[plan]);
    setBusy(false);
    if (res.ok) await unlock();
    else if (res.error) setError(res.error);
  };

  const onRestore = async () => {
    setBusy(true);
    setError(null);
    const res = await restore();
    setBusy(false);
    if (res.ok) await unlock();
    else if (res.error) setError(res.error);
  };

  const monthlyPrice = offering?.monthly?.priceString ?? CONFIG.prices.monthly;
  const annualPrice = offering?.annual?.priceString ?? CONFIG.prices.annual;

  return (
    <Screen scroll>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{CONFIG.appName.toUpperCase()} PRO</Text>
      </View>
      <Text style={styles.heading}>Quit for good.</Text>
      <Text style={styles.sub}>
        Your dependence level: <Text style={{ color: colors.warning, fontWeight: '800' }}>{dependence.band}</Text>.
        Your personalized plan is ready.
      </Text>

      <View style={styles.features}>
        {FEATURES.map((f) => (
          <View key={f} style={styles.featRow}>
            <Text style={styles.featCheck}>✓</Text>
            <Text style={styles.featText}>{f}</Text>
          </View>
        ))}
      </View>

      <View style={styles.plans}>
        <Pressable
          onPress={() => setPlan('annual')}
          style={[styles.plan, plan === 'annual' && styles.planSelected]}
        >
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>SAVE {CONFIG.prices.savePct}</Text>
          </View>
          <Text style={styles.planName}>Annual</Text>
          <Text style={styles.planPrice}>{annualPrice}</Text>
          <Text style={styles.planSub}>≈ {CONFIG.prices.annualMonthlyEq}/month</Text>
        </Pressable>

        <Pressable
          onPress={() => setPlan('monthly')}
          style={[styles.plan, plan === 'monthly' && styles.planSelected]}
        >
          <Text style={styles.planName}>Monthly</Text>
          <Text style={styles.planPrice}>{monthlyPrice}</Text>
          <Text style={styles.planSub}>per month</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <GradientButton label="Start My Quit Plan" onPress={buy} busy={busy} />
      <GhostButton label="Restore purchases" onPress={onRestore} />

      {isMockBilling() ? (
        <Text style={styles.mockNote}>
          DEV: mock billing active (Expo Go / placeholder API key) — purchase will simulate success.
        </Text>
      ) : null}

      <Text style={styles.legal}>
        Payment is charged to your Apple ID. Subscription auto-renews unless cancelled at least 24h
        before the end of the period. Manage or cancel anytime in App Store settings.
      </Text>
      <View style={styles.legalLinks}>
        <Pressable onPress={() => Linking.openURL(CONFIG.termsUrl)}>
          <Text style={styles.legalLink}>Terms</Text>
        </Pressable>
        <Text style={styles.legalDot}>·</Text>
        <Pressable onPress={() => Linking.openURL(CONFIG.privacyUrl)}>
          <Text style={styles.legalLink}>Privacy</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1),
    marginTop: spacing(2),
  },
  badgeText: { color: colors.accent, fontSize: font.xs, fontWeight: '900', letterSpacing: 1.5 },
  heading: { color: colors.text, fontSize: 40, fontWeight: '900', marginTop: spacing(3) },
  sub: { color: colors.textDim, fontSize: font.sm, lineHeight: 21, marginTop: spacing(2) },
  features: { marginTop: spacing(5), gap: spacing(2.5) },
  featRow: { flexDirection: 'row', gap: spacing(2.5), alignItems: 'flex-start' },
  featCheck: { color: colors.accent, fontSize: font.md, fontWeight: '900' },
  featText: { color: colors.text, fontSize: font.sm, flex: 1, lineHeight: 20 },

  plans: { flexDirection: 'row', gap: spacing(3), marginTop: spacing(6), marginBottom: spacing(4) },
  plan: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing(4),
    alignItems: 'center',
  },
  planSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  saveBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: spacing(2.5),
    paddingVertical: 3,
  },
  saveBadgeText: { color: '#06220F', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  planName: { color: colors.textDim, fontSize: font.sm, fontWeight: '700', marginTop: spacing(1) },
  planPrice: { color: colors.text, fontSize: font.xl, fontWeight: '900', marginTop: spacing(1) },
  planSub: { color: colors.textFaint, fontSize: font.xs, marginTop: spacing(0.5) },

  error: { color: colors.danger, fontSize: font.sm, textAlign: 'center', marginBottom: spacing(3) },
  mockNote: { color: colors.warning, fontSize: font.xs, textAlign: 'center', marginTop: spacing(2) },
  legal: { color: colors.textFaint, fontSize: 11, lineHeight: 16, marginTop: spacing(4), textAlign: 'center' },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing(2),
    marginTop: spacing(2),
    marginBottom: spacing(4),
  },
  legalLink: { color: colors.textDim, fontSize: font.xs, textDecorationLine: 'underline' },
  legalDot: { color: colors.textFaint },
});
