import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AppButton({
  title, onPress, variant = 'primary', size = 'md',
  loading, disabled, icon, style, textStyle,
}: AppButtonProps) {
  const bg = {
    primary: colors.accent,
    secondary: colors.surfaceLight,
    danger: colors.danger,
    ghost: 'transparent',
  }[variant];

  const textColor = variant === 'ghost' ? colors.accent : colors.text;

  const paddingV = { sm: 8, md: 12, lg: 16 }[size];
  const paddingH = { sm: 14, md: 20, lg: 28 }[size];
  const fontSize = { sm: fontSizes.sm, md: fontSizes.md, lg: fontSizes.lg }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: textColor, fontSize }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  text: {
    fontFamily: fonts.sans,
    fontWeight: '600',
  },
});
