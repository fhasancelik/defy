import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, font } from '../theme';

const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;

/** Guided-breathing circle: 4s in, 2s hold, 6s out — a proven urge-surfing pattern. */
export function BreathingCircle() {
  const scale = useRef(new Animated.Value(1)).current;
  const [phase, setPhase] = useState<'Breathe in' | 'Hold' | 'Breathe out'>('Breathe in');

  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycle = () => {
      if (!alive) return;
      setPhase('Breathe in');
      Animated.timing(scale, { toValue: 1.45, duration: INHALE_MS, useNativeDriver: true }).start();
      timers.push(
        setTimeout(() => {
          if (!alive) return;
          setPhase('Hold');
          timers.push(
            setTimeout(() => {
              if (!alive) return;
              setPhase('Breathe out');
              Animated.timing(scale, { toValue: 1, duration: EXHALE_MS, useNativeDriver: true }).start();
              timers.push(setTimeout(cycle, EXHALE_MS));
            }, HOLD_MS),
          );
        }, INHALE_MS),
      );
    };
    cycle();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      scale.stopAnimation();
    };
  }, [scale]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.halo, { transform: [{ scale }] }]} />
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Text style={styles.phase}>{phase}</Text>
      </Animated.View>
    </View>
  );
}

const SIZE = 150;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', height: SIZE * 1.7 },
  halo: {
    position: 'absolute',
    width: SIZE * 1.25,
    height: SIZE * 1.25,
    borderRadius: (SIZE * 1.25) / 2,
    backgroundColor: 'rgba(74,222,128,0.10)',
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'rgba(74,222,128,0.18)',
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phase: { color: colors.text, fontSize: font.md, fontWeight: '700' },
});
