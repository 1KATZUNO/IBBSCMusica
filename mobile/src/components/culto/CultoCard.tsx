import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { formatDate, formatHora } from '../../utils/formatDate';

interface CultoCardProps {
  culto: any;
  selected?: boolean;
  onPress: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export function CultoCard({ culto, selected, onPress, onDelete, isAdmin }: CultoCardProps) {
  const isLive = !!culto.started_at;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        selected && { borderColor: culto.color || colors.accent },
      ]}>
      <View style={[styles.colorDot, { backgroundColor: culto.color || colors.accent }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.tipo} numberOfLines={1}>{culto.tipo}</Text>
          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN VIVO</Text>
            </View>
          )}
        </View>
        <Text style={styles.date}>{formatDate(culto.fecha)}</Text>
        <Text style={styles.time}>{formatHora(culto.hora)}</Text>
        {culto.programa_count != null && (
          <Text style={styles.count}>{culto.programa_count} items</Text>
        )}
      </View>
      {isAdmin && onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="trash-can-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tipo: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.live,
  },
  liveText: {
    fontFamily: fonts.sans,
    fontSize: 9,
    fontWeight: fontWeights.bold,
    color: colors.live,
    letterSpacing: 0.5,
  },
  date: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  time: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    padding: spacing.sm,
  },
});
