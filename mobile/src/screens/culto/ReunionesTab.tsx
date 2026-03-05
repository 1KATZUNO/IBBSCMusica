import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUjieres } from '../../hooks/useUjieres';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

interface ReunionesTabProps {
  cultoId: number;
  isAdmin: boolean;
  showNotif: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function ReunionesTab({ cultoId, isAdmin, showNotif }: ReunionesTabProps) {
  const { service, loading, fetchService, addReunion, updateReunion, removeReunion } = useUjieres();
  const [showAdd, setShowAdd] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [hora, setHora] = useState('');
  const [lugar, setLugar] = useState('');
  const [asistentes, setAsistentes] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchService(cultoId);
  }, [cultoId]);

  const resetForm = () => {
    setDescripcion('');
    setHora('');
    setLugar('');
    setAsistentes('');
    setEditingId(null);
    setShowAdd(false);
  };

  const handleAdd = async () => {
    if (!descripcion.trim()) return;
    try {
      await addReunion(cultoId, {
        descripcion: descripcion.trim(),
        hora: hora.trim() || null,
        lugar: lugar.trim() || null,
        asistentes: asistentes.trim() || null,
      });
      resetForm();
      showNotif('Reunion agregada');
    } catch {
      showNotif('Error al agregar', 'error');
    }
  };

  const startEdit = (reunion: any) => {
    setEditingId(reunion.id);
    setDescripcion(reunion.descripcion || '');
    setHora(reunion.hora || '');
    setLugar(reunion.lugar || '');
    setAsistentes(reunion.asistentes || '');
    setShowAdd(true);
  };

  const handleUpdate = async () => {
    if (!editingId || !descripcion.trim()) return;
    try {
      await updateReunion(editingId, {
        descripcion: descripcion.trim(),
        hora: hora.trim() || null,
        lugar: lugar.trim() || null,
        asistentes: asistentes.trim() || null,
      });
      resetForm();
      showNotif('Reunion actualizada');
    } catch {
      showNotif('Error al actualizar', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removeReunion(deleteId);
      showNotif('Reunion eliminada');
    } catch {
      showNotif('Error al eliminar', 'error');
    }
    setDeleteId(null);
  };

  if (loading && !service) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const reuniones = service?.reuniones || [];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        {isAdmin && (
          <View style={styles.addSection}>
            {showAdd ? (
              <View style={styles.addForm}>
                <AppInput
                  label="Descripcion"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="Descripcion de la reunion"
                />
                <AppInput
                  label="Hora (opcional)"
                  value={hora}
                  onChangeText={setHora}
                  placeholder="Ej: 9:00 AM"
                />
                <AppInput
                  label="Lugar (opcional)"
                  value={lugar}
                  onChangeText={setLugar}
                  placeholder="Ej: Salon principal"
                />
                <AppInput
                  label="Asistentes (opcional)"
                  value={asistentes}
                  onChangeText={setAsistentes}
                  placeholder="Ej: Todos los ujieres"
                  multiline
                  numberOfLines={2}
                />
                <View style={styles.addActions}>
                  <AppButton title="Cancelar" variant="secondary" size="sm" onPress={resetForm} />
                  <AppButton
                    title={editingId ? 'Actualizar' : 'Agregar'}
                    size="sm"
                    onPress={editingId ? handleUpdate : handleAdd}
                  />
                </View>
              </View>
            ) : (
              <AppButton title="+ Nueva Reunion" variant="ghost" size="sm" onPress={() => setShowAdd(true)} />
            )}
          </View>
        )}

        {reuniones.length === 0 ? (
          <Text style={styles.empty}>No hay reuniones programadas</Text>
        ) : (
          <View style={{ padding: spacing.lg }}>
            {reuniones.map((item: any) => (
              <View key={item.id} style={styles.reunionCard}>
                <View style={styles.reunionInfo}>
                  <Text style={styles.reunionTitle}>{item.descripcion}</Text>
                  <View style={styles.metaRow}>
                    {item.hora && (
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Hora</Text>
                        <Text style={styles.metaValue}>{item.hora}</Text>
                      </View>
                    )}
                    {item.lugar && (
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Lugar</Text>
                        <Text style={styles.metaValue}>{item.lugar}</Text>
                      </View>
                    )}
                  </View>
                  {item.asistentes && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Asistentes</Text>
                      <Text style={styles.metaValue}>{item.asistentes}</Text>
                    </View>
                  )}
                </View>
                {isAdmin && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => startEdit(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Icon name="pencil-outline" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDeleteId(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Icon name="trash-can-outline" size={18} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <ConfirmModal
        visible={!!deleteId}
        title="Eliminar Reunion"
        message="¿Eliminar esta reunion?"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addSection: { padding: spacing.lg, paddingBottom: 0 },
  addForm: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.lg },
  addActions: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end', marginTop: spacing.sm },
  reunionCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.lg, marginBottom: spacing.sm,
  },
  reunionInfo: { flex: 1 },
  reunionTitle: {
    fontFamily: fonts.sans, fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.text,
    marginBottom: spacing.xs,
  },
  metaRow: { flexDirection: 'row', gap: spacing.xl, flexWrap: 'wrap' },
  metaItem: { marginTop: spacing.xs },
  metaLabel: {
    fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.accent,
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  metaValue: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textSecondary },
  cardActions: { gap: spacing.sm, marginLeft: spacing.sm },
  empty: {
    fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textMuted,
    textAlign: 'center', marginVertical: spacing.xl,
  },
});
