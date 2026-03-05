import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { AppButton } from '../common/AppButton';
import api from '../../api/client';

interface AssignMusicianModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (musicianId: number, roleId: number) => void;
  existingMusicians?: number[];
}

export function AssignMusicianModal({ visible, onClose, onSubmit, existingMusicians = [] }: AssignMusicianModalProps) {
  const [musicians, setMusicians] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedMusician, setSelectedMusician] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      api.get('/musicians').then(({ data }) => setMusicians(data)).catch(() => {});
      api.get('/musician-roles').then(({ data }) => setRoles(data)).catch(() => {});
    }
  }, [visible]);

  const available = musicians.filter(m => !existingMusicians.includes(m.id));

  const handleSubmit = async () => {
    if (!selectedMusician || !selectedRole) return;
    setLoading(true);
    try {
      await onSubmit(selectedMusician, selectedRole);
      setSelectedMusician(null);
      setSelectedRole(null);
    } catch {
      // handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Asignar Músico</Text>
          <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 450 }}>
            <Text style={styles.label}>Músico</Text>
            <View style={styles.optionList}>
              {available.map(m => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setSelectedMusician(m.id)}
                  style={[styles.option, selectedMusician === m.id && styles.optionSelected]}>
                  <Text style={styles.optionText}>{m.nombre}</Text>
                </TouchableOpacity>
              ))}
              {available.length === 0 && (
                <Text style={styles.empty}>No hay músicos disponibles</Text>
              )}
            </View>

            <Text style={styles.label}>Rol</Text>
            <View style={styles.optionList}>
              {roles.map(r => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setSelectedRole(r.id)}
                  style={[styles.option, selectedRole === r.id && styles.optionSelected]}>
                  <Text style={styles.optionText}>{r.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actions}>
              <AppButton title="Cancelar" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
              <AppButton title="Asignar" onPress={handleSubmit} loading={loading} style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl,
    padding: spacing.xxl, maxHeight: '80%',
  },
  title: {
    fontFamily: fonts.sans, fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold, color: colors.text, marginBottom: spacing.xl,
  },
  label: {
    fontFamily: fonts.sans, fontSize: fontSizes.sm,
    color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: '500',
  },
  optionList: { marginBottom: spacing.lg },
  option: {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm, marginBottom: 4,
  },
  optionSelected: { backgroundColor: colors.accent + '20' },
  optionText: { fontFamily: fonts.sans, fontSize: fontSizes.md, color: colors.text },
  empty: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textMuted, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
