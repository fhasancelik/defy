import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, font, gradients, radius, spacing } from '../theme';

export function Screen({
  children,
  scroll = false,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.pad, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function GradientButton({
  label,
  onPress,
  variant = 'accent',
  disabled = false,
  busy = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'accent' | 'panic';
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress();
      }}
      disabled={disabled || busy}
      style={({ pressed }) => [{ opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }]}
    >
      <LinearGradient
        colors={variant === 'accent' ? gradients.accent : gradients.panic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBtn}
      >
        {busy ? (
          <ActivityIndicator color="#06220F" />
        ) : (
          <Text style={styles.gradientBtnText}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.ghostBtn, { opacity: pressed ? 0.6 : 1 }]}>
      <Text style={styles.ghostBtnText}>{label}</Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ProgressBar({ progress, color = colors.accent }: { progress: number; color?: string }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${Math.max(0, Math.min(1, progress)) * 100}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

export function OptionRow({
  label,
  emoji,
  selected,
  onPress,
}: {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={[styles.option, selected && styles.optionSelected]}
    >
      {emoji ? <Text style={styles.optionEmoji}>{emoji}</Text> : null}
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <Text style={styles.radioCheck}>✓</Text> : null}
      </View>
    </Pressable>
  );
}

export function Chip({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accent && { color: colors.accent }]}>{value}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </Card>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  pad: { paddingHorizontal: spacing(5) },
  scrollContent: { paddingHorizontal: spacing(5), paddingBottom: spacing(10) },

  gradientBtn: {
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(6),
  },
  gradientBtnText: { color: '#06220F', fontSize: font.lg, fontWeight: '800' },

  ghostBtn: { alignItems: 'center', paddingVertical: spacing(3.5) },
  ghostBtnText: { color: colors.textDim, fontSize: font.sm, fontWeight: '600' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(4),
  },

  progressTrack: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radius.full },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(4),
    marginBottom: spacing(3),
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionEmoji: { fontSize: 20, marginRight: spacing(3) },
  optionLabel: { flex: 1, color: colors.text, fontSize: font.md, fontWeight: '600' },
  optionLabelSelected: { color: colors.accent },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.accent, backgroundColor: colors.accent },
  radioCheck: { color: '#06220F', fontSize: 13, fontWeight: '900' },

  chip: {
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3.5),
    marginRight: spacing(2),
    marginBottom: spacing(2),
  },
  chipSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  chipText: { color: colors.textDim, fontSize: font.sm, fontWeight: '600' },
  chipTextSelected: { color: colors.accent },

  statCard: { flex: 1, minWidth: '45%' },
  statLabel: { color: colors.textDim, fontSize: font.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  statValue: { color: colors.text, fontSize: font.xl, fontWeight: '800', marginTop: spacing(1) },
  statSub: { color: colors.textFaint, fontSize: font.xs, marginTop: spacing(0.5) },

  sectionTitle: {
    color: colors.text,
    fontSize: font.lg,
    fontWeight: '800',
    marginTop: spacing(6),
    marginBottom: spacing(3),
  },
});
