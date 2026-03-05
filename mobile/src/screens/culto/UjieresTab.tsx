import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUjieres } from '../../hooks/useUjieres';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import api from '../../api/client';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

interface UjieresTabProps {
  cultoId: number;
  isAdmin: boolean;
  showNotif: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function UjieresTab({ cultoId, isAdmin, showNotif }: UjieresTabProps) {
  const { service, loading, fetchService, addAssignment, removeAssignment } = useUjieres();
  const [showAdd, setShowAdd] = useState(false);
  const [nombre, setNombre] = useState('');
  const [responsabilidades, setResponsabilidades] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [detalles, setDetalles] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Servidores with ujier role for dropdown
  const [servidores, setServidores] = useState<any[]>([]);
  const [showServidorPicker, setShowServidorPicker] = useState(false);

  useEffect(() => {
    fetchService(cultoId);
    loadServidores();
  }, [cultoId]);

  const loadServidores = async () => {
    try {
      const { data } = await api.get('/servidores');
      // Filter servidores that have the "Ujier" role
      const ujieres = data.filter((s: any) =>
        s.roles?.some((r: any) => r.nombre?.toLowerCase() === 'ujier') && s.activo
      );
      setServidores(ujieres);
    } catch {
      // silently fail — text input still works as fallback
    }
  };

  const selectServidor = (srv: any) => {
    setNombre(srv.nombre);
    setShowServidorPicker(false);
  };

  const handleAdd = async () => {
    if (!nombre.trim() || !responsabilidades.trim()) return;
    try {
      await addAssignment(cultoId, {
        nombre: nombre.trim(),
        responsabilidades: responsabilidades.trim(),
        observaciones: observaciones.trim() || null,
        detalles: detalles.trim() || null,
      });
      setNombre('');
      setResponsabilidades('');
      setObservaciones('');
      setDetalles('');
      setShowAdd(false);
      showNotif('Ujier asignado');
    } catch {
      showNotif('Error al asignar', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removeAssignment(deleteId);
      showNotif('Asignación eliminada');
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

  const assignments = service?.assignments || [];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        {/* Info cards */}
        {service && (
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Ujieres</Text>
              <Text style={styles.infoValue}>{assignments.length}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Responsabilidades</Text>
              <Text style={styles.infoValue}>
                {[...new Set(assignments.map((a: any) => a.responsabilidades).filter(Boolean))].length}
              </Text>
            </View>
          </View>
        )}

        {isAdmin && (
          <View style={styles.addSection}>
            {showAdd ? (
              <View style={styles.addForm}>
                {/* Servidor picker */}
                <Text style={styles.fieldLabel}>Nombre</Text>
                {servidores.length > 0 && (
                  <TouchableOpacity
                    style={styles.pickerBtn}
                    onPress={() => setShowServidorPicker(!showServidorPicker)}>
                    <Icon name="account-search" size={18} color={colors.accent} />
                    <Text style={styles.pickerBtnText}>
                      {nombre || 'Seleccionar servidor'}
                    </Text>
                    <Icon name={showServidorPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                )}

                {showServidorPicker && (
                  <View style={styles.pickerList}>
                    {servidores.map((srv) => (
                      <TouchableOpacity
                        key={srv.id}
                        style={[
                          styles.pickerItem,
                          nombre === srv.nombre && styles.pickerItemSelected,
                        ]}
                        onPress={() => selectServidor(srv)}>
                        <Icon name="account" size={16} color={nombre === srv.nombre ? colors.accent : colors.textSecondary} />
                        <Text style={[
                          styles.pickerItemText,
                          nombre === srv.nombre && { color: colors.accent },
                        ]}>{srv.nombre}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {servidores.length === 0 && (
                  <AppInput
                    label=""
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Ej: D. Juan, D. Carlos"
                  />
                )}

                {/* Also allow manual typing if they want a custom name */}
                {servidores.length > 0 && (
                  <AppInput
                    label=""
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="O escribe un nombre manualmente"
                  />
                )}

                <AppInput
                  label="Responsabilidades"
                  value={responsabilidades}
                  onChangeText={setResponsabilidades}
                  placeholder="Ej: Bienvenida y Acomodo"
                  multiline
                  numberOfLines={3}
                />

                <AppInput
                  label="Observaciones (opcional)"
                  value={observaciones}
                  onChangeText={setObservaciones}
                  placeholder="Ej: Llenar la capilla de adelante hacia atrás"
                  multiline
                  numberOfLines={2}
                />

                <AppInput
                  label="Detalles (opcional)"
                  value={detalles}
                  onChangeText={setDetalles}
                  placeholder="Ej: Tiempo de oración: no ingresar"
                  multiline
                  numberOfLines={2}
                />

                <View style={styles.addActions}>
                  <AppButton title="Cancelar" variant="secondary" size="sm" onPress={() => { setShowAdd(false); setShowServidorPicker(false); }} />
                  <AppButton title="Agregar" size="sm" onPress={handleAdd} />
                </View>
              </View>
            ) : (
              <AppButton title="+ Agregar Ujier" variant="ghost" size="sm" onPress={() => setShowAdd(true)} />
            )}
          </View>
        )}

        {/* Assignments list */}
        {assignments.length === 0 ? (
          <Text style={styles.empty}>No hay ujieres asignados</Text>
        ) : (
          <View style={{ padding: spacing.lg }}>
            {assignments.map((item: any) => (
              <View key={item.id} style={styles.assignmentRow}>
                <View style={styles.assignmentInfo}>
                  <Text style={styles.assignmentName}>{item.nombre}</Text>
                  {item.responsabilidades && (
                    <Text style={styles.assignmentDetail}>{item.responsabilidades}</Text>
                  )}
                  {item.observaciones && (
                    <Text style={styles.assignmentMeta}>
                      <Text style={styles.metaLabel}>Obs: </Text>{item.observaciones}
                    </Text>
                  )}
                  {item.detalles && (
                    <Text style={styles.assignmentMeta}>
                      <Text style={styles.metaLabel}>Det: </Text>{item.detalles}
                    </Text>
                  )}
                </View>
                {isAdmin && (
                  <TouchableOpacity onPress={() => setDeleteId(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Icon name="trash-can-outline" size={18} color={colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <ConfirmModal
        visible={!!deleteId}
        title="Eliminar Ujier"
        message="¿Eliminar esta asignación?"
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
  infoRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, paddingBottom: 0 },
  infoCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.lg, alignItems: 'center',
  },
  infoLabel: { fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.textMuted },
  infoValue: { fontFamily: fonts.sans, fontSize: fontSizes.xxl, fontWeight: fontWeights.bold, color: colors.text },
  addSection: { padding: spacing.lg, paddingBottom: 0 },
  addForm: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.lg },
  addActions: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end', marginTop: spacing.sm },
  fieldLabel: {
    fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xs,
  },
  pickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.backgroundLight, borderRadius: borderRadius.sm,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  pickerBtnText: { flex: 1, fontFamily: fonts.sans, fontSize: fontSizes.md, color: colors.text },
  pickerList: {
    backgroundColor: colors.backgroundLight, borderRadius: borderRadius.sm,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
    maxHeight: 200,
  },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  pickerItemSelected: { backgroundColor: 'rgba(108,92,231,0.1)' },
  pickerItemText: { fontFamily: fonts.sans, fontSize: fontSizes.md, color: colors.text },
  assignmentRow: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  assignmentInfo: { flex: 1 },
  assignmentName: { fontFamily: fonts.sans, fontSize: fontSizes.md, color: colors.text, fontWeight: '600' },
  assignmentDetail: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 4 },
  assignmentMeta: { fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.textMuted, marginTop: 2 },
  metaLabel: { color: colors.accent, fontWeight: '600' },
  empty: {
    fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textMuted,
    textAlign: 'center', marginVertical: spacing.xl,
  },
});
