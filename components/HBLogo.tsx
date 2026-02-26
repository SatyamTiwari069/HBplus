import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONT_WEIGHT } from '../constants';

interface HBLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const SIZES = {
  sm: { ring: 40, text: 14, plus: 10 },
  md: { ring: 64, text: 22, plus: 15 },
  lg: { ring: 96, text: 32, plus: 22 },
};

export const HBLogo = ({ size = 'md', animate = false }: HBLogoProps) => {
  const s = SIZES[size];
  const scale = useRef(new Animated.Value(animate ? 0.5 : 1)).current;
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <View
        style={[
          styles.ring,
          {
            width: s.ring,
            height: s.ring,
            borderRadius: s.ring / 2,
          },
        ]}
      >
        <View style={styles.inner}>
          <Text style={[styles.hb, { fontSize: s.text }]}>HB</Text>
          <Text style={[styles.plus, { fontSize: s.plus }]}>+</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ring: {
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldGlowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hb: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.black,
    letterSpacing: 2,
  },
  plus: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    marginTop: 2,
  },
});
