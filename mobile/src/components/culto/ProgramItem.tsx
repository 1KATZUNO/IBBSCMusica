import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { formatTime } from '../../utils/formatTime';

interface ProgramItemProps {
  item: any;
  isActive: boolean;
  isLive: boolean;
  isAdmin: boolean;
  itemElapsed: number;
  onComplete: () => void;
  onUncomplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProgramItemComponent({
  item, isActive, isLive, isAdmin,
  itemElapsed, onComplete, onUncomplete, onEdit, onDelete,
}: ProgramItemProps) {
  const isCompleted = !!item.completed_at;
  const type = item.program_item_type;
  const emoji = type?.emoji || '';
  const bgColor = type?.bg_color || colors.surfaceLight;

  const title = item.canto?.nombre || item.titulo || type?.label || 'Item';
  const subtitle = item.responsable || '';
  const duration = item.duracion;

  return (
    <View style={[
      styles.container,
      isActive && styles.activeContainer,
      isCompleted && styles.completedContainer,
    ]}>
      <View style={styles.row}>
        {/* Emoji / type indicator */}
        <View style={[styles.emojiBox, { backgroundColor: bgColor }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[
            styles.title,
            isCompleted && styles.completedText,
          ]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          ) : null}
          {duration ? (
            <Text style={styles.duration}>{duration} min</Text>
          ) : null}
        </View>

        {/* Timer for active item */}
        {isActive && isLive && (
          <Text style={styles.timer}>{formatTime(itemElapsed)}</Text>
        )}

        {/* Actions */}
        {isLive && isAdmin && !isCompleted && (
          <TouchableOpacity onPress={onComplete} style={styles.checkBtn}>
            <Icon name="check" size={20} color={colors.live} />
          </TouchableOpacity>
        )}
        {isLive && isAdmin && isCompleted && (
          <TouchableOpacity onPress={onUncomplete} style={styles.checkBtn}>
            <Icon name="undo" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {!isLive && isAdmin && (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="pencil" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="trash-can-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeContainer: {
    borderColor: colors.live,
    backgroundColor: 'rgba(76,175,80,0.05)',
  },
  completedContainer: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  emojiBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 1,
  },
  duration: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  timer: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.live,
    minWidth: 50,
    textAlign: 'right',
  },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.live,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
