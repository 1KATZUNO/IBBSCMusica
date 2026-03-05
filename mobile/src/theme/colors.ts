export const colors = {
  background: '#0A0A0B',
  surface: '#111113',
  surfaceLight: '#1A1A1D',
  surfaceHover: '#222225',
  border: '#2A2A2D',
  borderLight: '#333336',

  text: '#E8E8E8',
  textSecondary: '#999',
  textMuted: '#666',
  textDark: '#444',

  accent: '#6C5CE7',
  accentLight: '#7C6CF7',
  accentDark: '#5C4CD7',

  danger: '#E17055',
  dangerDark: '#C0392B',
  success: '#4CAF50',
  successDark: '#388E3C',
  warning: '#E8B931',

  live: '#4CAF50',
  liveGlow: 'rgba(76,175,80,0.25)',

  cultoColors: ['#E8B931', '#6B8F71', '#B56357', '#7B6B9D', '#5C86A3'] as const,

  overlay: 'rgba(0,0,0,0.6)',
  overlayLight: 'rgba(0,0,0,0.4)',
};

export type CultoColor = typeof colors.cultoColors[number];
