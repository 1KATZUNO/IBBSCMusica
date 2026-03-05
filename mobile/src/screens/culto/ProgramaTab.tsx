import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgramItemComponent } from '../../components/culto/ProgramItem';
import { AddItemModal } from '../../components/modals/AddItemModal';
import { EditItemModal } from '../../components/modals/EditItemModal';
import { AssignMusicianModal } from '../../components/modals/AssignMusicianModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

interface ProgramaTabProps {
  cultoDetail: any;
  cultosHook: any;
  liveMode: any;
  isAdmin: boolean;
  showNotif: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function ProgramaTab({ cultoDetail, cultosHook, liveMode, isAdmin, showNotif }: ProgramaTabProps) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [showAssignMusician, setShowAssignMusician] = useState(false);

  const programa = cultoDetail?.programa || [];
  const musicos = cultoDetail?.musicos || [];

  const handleAddItem = async (data: any) => {
    try {
      await cultosHook.addProgramItem(cultoDetail.id, data);
      setShowAddItem(false);
      showNotif('Item agregado');
    } catch {
      showNotif('Error al agregar item', 'error');
    }
  };

  const handleEditItem = async (data: any) => {
    try {
      await cultosHook.updateProgramItem(cultoDetail.id, editItem.id, data);
      setEditItem(null);
      showNotif('Item actualizado');
    } catch {
      showNotif('Error al actualizar', 'error');
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    try {
      await cultosHook.removeProgramItem(cultoDetail.id, deleteItemId);
      showNotif('Item eliminado');
    } catch {
      showNotif('Error al eliminar', 'error');
    }
    setDeleteItemId(null);
  };

  const handleAssignMusician = async (musicianId: number, roleId: number) => {
    try {
      await cultosHook.addMusician(cultoDetail.id, musicianId, roleId);
      setShowAssignMusician(false);
      showNotif('Músico asignado');
    } catch {
      showNotif('Error al asignar', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={programa}
        keyExtractor={item => String(item.id)}
        ListHeaderComponent={() => (
          <View>
            {/* Musicians section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Músicos</Text>
                {isAdmin && (
                  <TouchableOpacity onPress={() => setShowAssignMusician(true)}>
                    <Icon name="plus" size={20} color={colors.accent} />
                  </TouchableOpacity>
                )}
              </View>
              {musicos.length === 0 ? (
                <Text style={styles.empty}>Sin músicos asignados</Text>
              ) : (
                <View style={styles.musiciansList}>
                  {musicos.map((m: any) => (
                    <View key={m.pivot_id} style={styles.musicianChip}>
                      <Text style={styles.musicianName}>{m.nombre}</Text>
                      <Text style={styles.musicianRole}>{m.role_name}</Text>
                      {isAdmin && (
                        <TouchableOpacity
                          onPress={() => cultosHook.removeMusician(cultoDetail.id, m.pivot_id)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <Icon name="close" size={14} color={colors.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Program header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Programa</Text>
              {isAdmin && !liveMode.isLive && (
                <TouchableOpacity onPress={() => setShowAddItem(true)}>
                  <Icon name="plus" size={20} color={colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <ProgramItemComponent
            item={item}
            isActive={item.id === liveMode.activeItemId}
            isLive={liveMode.isLive}
            isAdmin={isAdmin}
            itemElapsed={liveMode.getItemElapsedSeconds(item)}
            onComplete={() => liveMode.completeItem(cultoDetail.id, item.id)}
            onUncomplete={() => liveMode.uncompleteItem(cultoDetail.id, item.id)}
            onEdit={() => setEditItem(item)}
            onDelete={() => setDeleteItemId(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay items en el programa</Text>
        }
        contentContainerStyle={{ padding: spacing.lg }}
      />

      <AddItemModal visible={showAddItem} onClose={() => setShowAddItem(false)} onSubmit={handleAddItem} />
      <EditItemModal visible={!!editItem} item={editItem} onClose={() => setEditItem(null)} onSubmit={handleEditItem} />
      <AssignMusicianModal
        visible={showAssignMusician}
        onClose={() => setShowAssignMusician(false)}
        onSubmit={handleAssignMusician}
        existingMusicians={musicos.map((m: any) => m.id)}
      />
      <ConfirmModal
        visible={!!deleteItemId}
        title="Eliminar Item"
        message="¿Eliminar este item del programa?"
        confirmLabel="Eliminar"
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteItemId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: { marginBottom: spacing.lg },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.sans, fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  musiciansList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  musicianChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  musicianName: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.text, fontWeight: '500' },
  musicianRole: { fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.textMuted },
  empty: {
    fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textMuted,
    textAlign: 'center', marginVertical: spacing.xl,
  },
});
