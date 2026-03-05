import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

interface ToastProps {
  notification: { msg: string; type: 'success' | 'error' | 'info' } | null;
}

export function Toast({ notification }: ToastProps) {
  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (notification) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: -60, duration: 200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  const bg = {
    success: colors.success,
    error: colors.danger,
    info: colors.accent,
  }[notification.type];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bg, transform: [{ translateY }], opacity },
      ]}>
      <Text style={styles.text}>{notification.msg}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: spacing.xl,
    right: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    zIndex: 9999,
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: '#fff',
    fontWeight: '600',
  },
});
