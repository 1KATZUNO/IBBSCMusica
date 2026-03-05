import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatTime } from '../../utils/formatTime';

interface NowPlayingBarProps {
  item: any;
  elapsedSeconds: number;
  autoDeleteCountdown: number | null;
  allCompleted: boolean;
  isAdmin: boolean;
  onComplete: () => void;
  onCancelAutoDelete: () => void;
}

export function NowPlayingBar({
  item, elapsedSeconds, autoDeleteCountdown,
  allCompleted, isAdmin, onComplete, onCancelAutoDelete,
}: NowPlayingBarProps) {
  if (!item && !allCompleted) return null;

  return (
    <View style={styles.container}>
      {allCompleted && autoDeleteCountdown != null ? (
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.label}>Culto completado</Text>
            <Text style={styles.countdown}>
              Auto-eliminando en {autoDeleteCountdown}s
            </Text>
          </View>
          {isAdmin && (
            <TouchableOpacity onPress={onCancelAutoDelete} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : item ? (
        <View style={styles.row}>
          <View style={styles.eqBars}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.eqBar, { height: 6 + (i % 2) * 8 }]} />
            ))}
          </View>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {item.canto?.nombre || item.titulo || item.program_item_type?.label}
            </Text>
            <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
          </View>
          {isAdmin && (
            <TouchableOpacity onPress={onComplete} style={styles.completeBtn}>
              <Icon name="check" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  eqBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 18,
  },
  eqBar: {
    width: 3,
    backgroundColor: colors.live,
    borderRadius: 1,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  timer: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.live,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.warning,
  },
  countdown: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.danger,
  },
  completeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.live,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.danger,
  },
});
