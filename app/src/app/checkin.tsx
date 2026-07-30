import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GradientButton, Screen } from '../components/ui';
import { colors, font, radius, spacing } from '../theme';
import { useStore } from '../state/store';
import { postCheckIn } from '../lib/api';

const MOODS = ['😊', '🙂', '😐', '😣', '😖'];

export default function CheckIn() {
  const router = useRouter();
  const addCheckIn = useStore((s) => s.addCheckIn);
  const userId = useStore((s) => s.userId);

  const [craving, setCraving] = useState<number | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const save = () => {
    if (craving === null || mood === null) return;
    addCheckIn({ craving, mood, note: note.trim() || undefined });
    postCheckIn({ userId, craving, mood, note: note.trim() || undefined });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.back();
  };

  return (
    <Screen scroll>
      <Text style={styles.heading}>Daily check-in</Text>

      <Text style={styles.label}>How strong were cravings today?</Text>
      <View style={styles.cravingRow}>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setCraving(n);
            }}
            style={[styles.cravingDot, craving === n && styles.cravingDotSelected]}
          >
            <Text style={[styles.cravingNum, craving === n && styles.cravingNumSelected]}>{n}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.cravingLabels}>
        <Text style={styles.cravingHint}>none</Text>
        <Text style={styles.cravingHint}>unbearable</Text>
      </View>

      <Text style={styles.label}>Mood right now</Text>
      <View style={styles.moodRow}>
        {MOODS.map((m) => (
          <Pressable
            key={m}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setMood(m);
            }}
            style={[styles.mood, mood === m && styles.moodSelected]}
          >
            <Text style={styles.moodEmoji}>{m}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Anything worth noting? (optional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Rough morning, but the walk helped…"
        placeholderTextColor={colors.textFaint}
        multiline
        style={styles.noteInput}
        maxLength={300}
      />

      <View style={{ marginTop: spacing(6) }}>
        <GradientButton label="Save check-in" onPress={save} disabled={craving === null || mood === null} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontSize: font.xxl, fontWeight: '900', marginTop: spacing(4) },
  label: {
    color: colors.textDim,
    fontSize: font.sm,
    fontWeight: '700',
    marginTop: spacing(6),
    marginBottom: spacing(3),
  },
  cravingRow: { flexDirection: 'row', gap: spacing(2) },
  cravingDot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cravingDotSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  cravingNum: { color: colors.textDim, fontSize: font.md, fontWeight: '800' },
  cravingNumSelected: { color: colors.accent },
  cravingLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing(1.5) },
  cravingHint: { color: colors.textFaint, fontSize: font.xs },
  moodRow: { flexDirection: 'row', gap: spacing(2) },
  mood: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  moodEmoji: { fontSize: 26 },
  noteInput: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    color: colors.text,
    padding: spacing(3.5),
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: font.sm,
  },
});
