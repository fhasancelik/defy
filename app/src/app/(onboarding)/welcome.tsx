import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { GradientButton, GhostButton, Screen } from '../../components/ui';
import { colors, font, spacing } from '../../theme';
import { CONFIG } from '../../config';
import { restore } from '../../lib/purchases';
import { useStore } from '../../state/store';

const VALUE_PROPS = [
  { emoji: '🧠', text: 'A quit plan built from your answers — not generic advice' },
  { emoji: '🚨', text: 'Panic mode for the exact moment a craving hits' },
  { emoji: '📈', text: 'Watch your body recover, hour by hour' },
];

export default function Welcome() {
  const router = useRouter();
  const setPro = useStore((s) => s.setPro);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);

  const onRestore = async () => {
    setRestoreMsg('Checking…');
    const res = await restore();
    if (res.ok) {
      setPro(true);
      setRestoreMsg('Purchase restored ✓');
    } else {
      setRestoreMsg(res.error ?? 'No purchase found.');
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.logo}>🛡️</Text>
        <Text style={styles.name}>{CONFIG.appName}</Text>
        <Text style={styles.tagline}>{CONFIG.appTagline}</Text>
      </View>

      <View style={styles.props}>
        {VALUE_PROPS.map((v) => (
          <View key={v.emoji} style={styles.propRow}>
            <Text style={styles.propEmoji}>{v.emoji}</Text>
            <Text style={styles.propText}>{v.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <GradientButton
          label="Start the 2-minute quiz"
          onPress={() => router.push('/(onboarding)/quiz')}
        />
        <GhostButton label="Already Pro? Restore purchase" onPress={onRestore} />
        {restoreMsg ? <Text style={styles.restoreMsg}>{restoreMsg}</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 72 },
  name: { color: colors.text, fontSize: font.huge, fontWeight: '900', marginTop: spacing(3) },
  tagline: {
    color: colors.textDim,
    fontSize: font.md,
    textAlign: 'center',
    marginTop: spacing(2),
    maxWidth: 280,
  },
  props: { gap: spacing(3), paddingBottom: spacing(8) },
  propRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  propEmoji: { fontSize: 22 },
  propText: { color: colors.text, fontSize: font.sm, flex: 1, lineHeight: 20 },
  footer: { paddingBottom: spacing(6) },
  restoreMsg: { color: colors.textDim, fontSize: font.xs, textAlign: 'center' },
});
