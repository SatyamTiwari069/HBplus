import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { COLORS, FONT_WEIGHT, RADIUS, SPACING } from '../constants';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorAlert = ({ message, onDismiss }: ErrorAlertProps) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Shake
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 3, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  }, [message]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateX: shakeAnim }],
        },
      ]}
    >
      <Text style={styles.icon}>⚠</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        onPress={onDismiss}
        style={({ pressed }) => [styles.dismiss, pressed && { opacity: 0.6 }]}
        hitSlop={12}
        accessibilityLabel="Dismiss error"
      >
        <Text style={styles.dismissText}>✕</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 15,
    color: COLORS.error,
    marginTop: 1,
  },
  message: {
    flex: 1,
    color: COLORS.error,
    fontSize: 13,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: 20,
  },
  dismiss: {
    paddingTop: 2,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  dismissText: {
    color: COLORS.error,
    fontSize: 12,
    opacity: 0.7,
    fontWeight: FONT_WEIGHT.bold,
  },
});
