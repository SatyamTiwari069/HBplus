import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  View,
  Platform,
} from 'react-native';
import { COLORS, FONT_WEIGHT, RADIUS, SPACING } from '../constants';

interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const GoogleColorG = () => (
  <View style={styles.gWrap}>
    <Text style={styles.gBlue}>G</Text>
  </View>
);

export const GoogleButton = ({ onPress, loading, disabled }: GoogleButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 2,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.wrapper]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          (disabled || loading) && styles.disabled,
        ]}
        accessibilityLabel="Sign in with Google"
        accessibilityRole="button"
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color={COLORS.black} />
            <Text style={styles.label}>Signing in…</Text>
          </>
        ) : (
          <>
            <GoogleColorG />
            <Text style={styles.label}>Continue with Google</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  button: {
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm + 2,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pressed: {
    backgroundColor: '#ececec',
  },
  disabled: {
    opacity: 0.65,
  },
  gWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gBlue: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: 20,
  },
  label: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.2,
  },
});
