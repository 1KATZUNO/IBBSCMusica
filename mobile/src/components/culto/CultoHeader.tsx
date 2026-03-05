import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatDate, formatHora, hexToRgb } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

interface CultoHeaderProps {
  culto: any;
  isLive: boolean;
  elapsedSeconds: number;
  isAdmin: boolean;
  onStart: () => void;
  onStop: () => void;
  onOpenDrawer: () => void;
}

export function CultoHeader({
  culto, isLive, elapsedSeconds, isAdmin, onStart, onStop, onOpenDrawer,
}: CultoHeaderProps) {
  const rgb = hexToRgb(culto.color || '#6C5CE7');
  const gradientBg = rgb
    ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)`
    : 'rgba(108,92,231,0.25)';

  return (
    <View style={[styles.container, { backgroundColor: gradientBg }]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onOpenDrawer} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={styles.tipo}>{culto.tipo}</Text>
          <Text style={styles.date}>{formatDate(culto.fecha)} - {formatHora(culto.hora)}</Text>
        </View>
        {isAdmin && (
          <View>
            {isLive ? (
              <TouchableOpacity onPress={onStop} style={styles.liveBtn}>
                <Icon name="stop" size={16} color="#fff" />
                <Text style={styles.liveBtnText}>Detener</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onStart} style={[styles.liveBtn, styles.startBtn]}>
                <Icon name="play" size={16} color="#fff" />
                <Text style={styles.liveBtnText}>Iniciar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {culto.director && (
        <Text style={styles.director}>Director: {culto.director.nombre}</Text>
      )}

      {isLive && (
        <View style={styles.timerRow}>
          <View style={styles.liveDot} />
          <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  titleArea: {
    flex: 1,
  },
  tipo: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  date: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  director: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  liveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  startBtn: {
    backgroundColor: colors.live,
  },
  liveBtnText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: '#fff',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.live,
  },
  timerText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.live,
    letterSpacing: 1,
  },
});
