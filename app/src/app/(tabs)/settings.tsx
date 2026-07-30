import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Card, Chip, GhostButton, Screen, SectionTitle } from '../../components/ui';
import { colors, font, spacing } from '../../theme';
import { CONFIG } from '../../config';
import { useStore } from '../../state/store';
import { restore } from '../../lib/purchases';
import { rescheduleAll, requestPermission, type NotifSetting } from '../../lib/notifications';

const NOTIF_OPTIONS: { id: NotifSetting; label: string }[] = [
  { id: 'morning', label: '🌅 Morning (9:00)' },
  { id: 'evening', label: '🌙 Evening (20:00)' },
  { id: 'off', label: 'Off' },
];

export default function Settings() {
  const isPro = useStore((s) => s.isPro);
  const setPro = useStore((s) => s.setPro);
  const notifSetting = useStore((s) => s.notifSetting);
  const setNotifSetting = useStore((s) => s.setNotifSetting);
  const weeklySpend = useStore((s) => s.weeklySpend);
  const setWeeklySpend = useStore((s) => s.setWeeklySpend);
  const quitDate = useStore((s) => s.quitDate);
  const resetAll = useStore((s) => s.resetAll);

  const [spendDraft, setSpendDraft] = useState(String(weeklySpend));
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const changeNotif = async (s: NotifSetting) => {
    setNotifSetting(s);
    if (s !== 'off') await requestPermission();
    await rescheduleAll(s, quitDate);
  };

  const saveSpend = () => {
    const n = parseFloat(spendDraft.replace(',', '.'));
    if (!Number.isFinite(n) || n < 0) {
      setMsg('Enter a valid weekly amount.');
      return;
    }
    setWeeklySpend(Math.round(n));
    setMsg('Saved ✓');
  };

  const onRestore = async () => {
    setMsg('Checking…');
    const res = await restore();
    if (res.ok) {
      setPro(true);
      setMsg('Purchase restored ✓');
    } else setMsg(res.error ?? 'No purchase found.');
  };

  return (
    <Screen scroll>
      <Text style={styles.heading}>Settings</Text>

      <SectionTitle>Subscription</SectionTitle>
      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.rowLabel}>Status</Text>
          <Text style={[styles.rowValue, { color: isPro ? colors.accent : colors.warning }]}>
            {isPro ? 'PRO — active' : 'Free'}
          </Text>
        </View>
        <View style={styles.divider} />
        <Pressable onPress={onRestore}>
          <Text style={styles.link}>Restore purchases</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}>
          <Text style={styles.link}>Manage subscription</Text>
        </Pressable>
      </Card>

      <SectionTitle>Daily reminder</SectionTitle>
      <Card>
        <View style={styles.chipRow}>
          {NOTIF_OPTIONS.map((o) => (
            <Chip
              key={o.id}
              label={o.label}
              selected={notifSetting === o.id}
              onPress={() => changeNotif(o.id)}
            />
          ))}
        </View>
      </Card>

      <SectionTitle>My data</SectionTitle>
      <Card>
        <Text style={styles.rowLabel}>Weekly nicotine spend (USD)</Text>
        <View style={styles.spendRow}>
          <TextInput
            value={spendDraft}
            onChangeText={setSpendDraft}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor={colors.textFaint}
          />
          <Pressable onPress={saveSpend} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        </View>
        <View style={styles.divider} />
        <View style={styles.rowBetween}>
          <Text style={styles.rowLabel}>Quit date</Text>
          <Text style={styles.rowValue}>
            {quitDate ? new Date(quitDate).toLocaleDateString() : '—'}
          </Text>
        </View>
      </Card>

      <SectionTitle>About</SectionTitle>
      <Card>
        <Pressable onPress={() => WebBrowser.openBrowserAsync(CONFIG.privacyUrl)}>
          <Text style={styles.link}>Privacy policy</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable onPress={() => WebBrowser.openBrowserAsync(CONFIG.termsUrl)}>
          <Text style={styles.link}>Terms of use</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable onPress={() => Linking.openURL(`mailto:${CONFIG.supportEmail}`)}>
          <Text style={styles.link}>Contact support</Text>
        </Pressable>
        <View style={styles.divider} />
        <Text style={styles.disclaimer}>
          {CONFIG.appName} supports habit change and is not a medical device. It does not provide
          medical advice, diagnosis or treatment. For medical concerns, talk to a healthcare
          professional.
        </Text>
      </Card>

      {msg ? <Text style={styles.msg}>{msg}</Text> : null}

      <View style={{ marginTop: spacing(6) }}>
        {confirmReset ? (
          <GhostButton
            label="⚠️ Tap again to erase EVERYTHING"
            onPress={() => {
              resetAll();
              setConfirmReset(false);
            }}
          />
        ) : (
          <GhostButton label="Reset all data" onPress={() => setConfirmReset(true)} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontSize: font.xxl, fontWeight: '900', marginTop: spacing(2) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { color: colors.textDim, fontSize: font.sm, fontWeight: '600' },
  rowValue: { color: colors.text, fontSize: font.sm, fontWeight: '800' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing(3) },
  link: { color: colors.text, fontSize: font.sm, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  spendRow: { flexDirection: 'row', gap: spacing(2.5), marginTop: spacing(2.5), alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2.5),
    fontSize: font.md,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2.5),
  },
  saveBtnText: { color: '#06220F', fontWeight: '800' },
  disclaimer: { color: colors.textFaint, fontSize: font.xs, lineHeight: 17 },
  msg: { color: colors.accent, fontSize: font.sm, textAlign: 'center', marginTop: spacing(3) },
});
