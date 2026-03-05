import React, { useEffect } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useReuniones } from '../../hooks/useReuniones';
import { useNotification } from '../../hooks/useNotification';
import { Toast } from '../../components/common/Toast';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { formatDate } from '../../utils/formatDate';

export function ReunionesListScreen({ navigation }: any) {
  const { reuniones, loading, fetchReuniones } = useReuniones();
  const { notification } = useNotification();

  useEffect(() => {
    fetchReuniones();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Reuniones</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={reuniones}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchReuniones} tintColor={colors.accent} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.descripcion}</Text>
              {item.culto_tipo && (
                <Text style={styles.cardCulto}>
                  {item.culto_tipo} — {formatDate(item.culto_fecha)}
                </Text>
              )}
              <View style={styles.metaRow}>
                {item.hora && (
                  <View style={styles.metaItem}>
                    <Icon name="clock-outline" size={14} color={colors.accent} />
                    <Text style={styles.metaText}>{item.hora}</Text>
                  </View>
                )}
                {item.lugar && (
                  <View style={styles.metaItem}>
                    <Icon name="map-marker-outline" size={14} color={colors.accent} />
                    <Text style={styles.metaText}>{item.lugar}</Text>
                  </View>
                )}
              </View>
              {item.asistentes && (
                <View style={styles.metaItem}>
                  <Icon name="account-group-outline" size={14} color={colors.accent} />
                  <Text style={styles.metaText}>{item.asistentes}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>No hay reuniones programadas</Text> : null
        }
        contentContainerStyle={{ padding: spacing.lg }}
      />

      <Toast notification={notification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.lg, paddingTop: spacing.xl,
  },
  title: {
    fontFamily: fonts.serif, fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold, color: colors.text,
  },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.lg, marginBottom: spacing.sm,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontFamily: fonts.sans, fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold, color: colors.text,
  },
  cardCulto: {
    fontFamily: fonts.sans, fontSize: fontSizes.xs,
    color: colors.textMuted, marginTop: 2,
  },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xs, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  metaText: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textSecondary },
  empty: {
    fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textMuted,
    textAlign: 'center', marginVertical: spacing.xxxl,
  },
});
