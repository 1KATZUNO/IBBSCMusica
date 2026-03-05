import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEnsayos } from '../../hooks/useEnsayos';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Toast } from '../../components/common/Toast';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { formatDate, formatHora } from '../../utils/formatDate';

export function EnsayosListScreen({ navigation }: any) {
  const { ensayos, loading, fetchEnsayos, createEnsayo, deleteEnsayo } = useEnsayos();
  const { isAdmin } = useAuth();
  const { notification, showNotif } = useNotification();
  const [showCreate, setShowCreate] = useState(false);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [duracion, setDuracion] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchEnsayos();
  }, []);

  const handleCreate = async () => {
    if (!fecha) return;
    try {
      await createEnsayo({ fecha, hora: hora || '19:00', duracion: duracion ? parseInt(duracion, 10) : 60 });
      setShowCreate(false);
      setFecha('');
      showNotif('Ensayo creado');
    } catch {
      showNotif('Error al crear', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEnsayo(deleteId);
      showNotif('Ensayo eliminado');
    } catch {
      showNotif('Error al eliminar', 'error');
    }
    setDeleteId(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Ensayos</Text>
        {isAdmin && (
          <TouchableOpacity onPress={() => setShowCreate(true)}>
            <Icon name="plus" size={24} color={colors.accent} />
          </TouchableOpacity>
        )}
      </View>

      {showCreate && isAdmin && (
        <View style={styles.createForm}>
          <AppInput label="Fecha (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} placeholder="2025-01-15" />
          <AppInput label="Hora" value={hora} onChangeText={setHora} placeholder="19:00" />
          <AppInput label="Duración (min)" value={duracion} onChangeText={setDuracion} keyboardType="numeric" placeholder="60" />
          <View style={styles.formActions}>
            <AppButton title="Cancelar" variant="secondary" size="sm" onPress={() => setShowCreate(false)} />
            <AppButton title="Crear" size="sm" onPress={handleCreate} />
          </View>
        </View>
      )}

      <FlatList
        data={ensayos}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchEnsayos} tintColor={colors.accent} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EnsayoDetail', { ensayoId: item.id })}
            activeOpacity={0.7}>
            <View style={styles.cardContent}>
              <Text style={styles.cardDate}>{formatDate(item.fecha)}</Text>
              <Text style={styles.cardTime}>{formatHora(item.hora)} - {item.duracion} min</Text>
              <View style={styles.countsRow}>
                <Text style={styles.countText}>{item.cantos_count || 0} cantos</Text>
                <Text style={styles.countText}>{item.asistentes_count || 0} asistentes</Text>
              </View>
            </View>
            {isAdmin && (
              <TouchableOpacity onPress={() => setDeleteId(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="trash-can-outline" size={18} color={colors.danger} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>No hay ensayos programados</Text> : null
        }
        contentContainerStyle={{ padding: spacing.lg }}
      />

      <ConfirmModal
        visible={!!deleteId}
        title="Eliminar Ensayo"
        message="¿Eliminar este ensayo?"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
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
  createForm: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.lg, marginHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  formActions: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.lg, marginBottom: spacing.sm,
  },
  cardContent: { flex: 1 },
  cardDate: { fontFamily: fonts.sans, fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.text },
  cardTime: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  countsRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xs },
  countText: { fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.textMuted },
  empty: {
    fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textMuted,
    textAlign: 'center', marginVertical: spacing.xxxl,
  },
});
