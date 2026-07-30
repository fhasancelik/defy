import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GradientButton, OptionRow, ProgressBar, Screen } from '../../components/ui';
import { colors, font, spacing } from '../../theme';
import { QUIZ_STEPS, type Answers } from '../../lib/quiz-data';
import { useStore } from '../../state/store';

export default function Quiz() {
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const advancing = useRef(false);

  const current = QUIZ_STEPS[step];
  const selected = answers[current.id] ?? [];

  const finish = (finalAnswers: Answers) => {
    completeOnboarding(finalAnswers);
    router.replace('/(onboarding)/analyzing');
  };

  const goNext = (finalAnswers: Answers) => {
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish(finalAnswers);
    }
  };

  const pickSingle = (optionId: string) => {
    if (advancing.current) return;
    advancing.current = true;
    const next = { ...answers, [current.id]: [optionId] };
    setAnswers(next);
    setTimeout(() => {
      advancing.current = false;
      goNext(next);
    }, 260);
  };

  const toggleMulti = (optionId: string) => {
    const has = selected.includes(optionId);
    const nextSel = has ? selected.filter((x) => x !== optionId) : [...selected, optionId];
    setAnswers({ ...answers, [current.id]: nextSel });
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
    else router.back();
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <View style={styles.progressWrap}>
          <ProgressBar progress={(step + 1) / QUIZ_STEPS.length} />
        </View>
        <Text style={styles.stepCount}>
          {step + 1}/{QUIZ_STEPS.length}
        </Text>
      </View>

      <Text style={styles.title}>{current.title}</Text>
      {current.subtitle ? <Text style={styles.subtitle}>{current.subtitle}</Text> : null}

      <View style={styles.options}>
        {current.options.map((o) => (
          <OptionRow
            key={o.id}
            label={o.label}
            emoji={o.emoji}
            selected={selected.includes(o.id)}
            onPress={() => (current.multi ? toggleMulti(o.id) : pickSingle(o.id))}
          />
        ))}
      </View>

      {current.multi ? (
        <View style={styles.footer}>
          <GradientButton
            label="Continue"
            disabled={selected.length === 0}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              goNext(answers);
            }}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3),
    paddingTop: spacing(2),
    paddingBottom: spacing(6),
  },
  back: { color: colors.textDim, fontSize: 24, fontWeight: '600' },
  progressWrap: { flex: 1 },
  stepCount: { color: colors.textFaint, fontSize: font.xs, fontWeight: '700' },
  title: { color: colors.text, fontSize: font.xxl, fontWeight: '800', lineHeight: 34 },
  subtitle: { color: colors.textDim, fontSize: font.sm, marginTop: spacing(2), lineHeight: 20 },
  options: { marginTop: spacing(6), flex: 1 },
  footer: { paddingBottom: spacing(6) },
});
