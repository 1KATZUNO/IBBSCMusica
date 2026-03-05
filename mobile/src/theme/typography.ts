import { Platform } from 'react-native';

const outfit = Platform.select({
  ios: 'Outfit',
  android: 'Outfit',
  default: 'Outfit',
});

const fraunces = Platform.select({
  ios: 'Fraunces',
  android: 'Fraunces',
  default: 'Fraunces',
});

export const fonts = {
  sans: outfit,
  serif: fraunces,
};

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
