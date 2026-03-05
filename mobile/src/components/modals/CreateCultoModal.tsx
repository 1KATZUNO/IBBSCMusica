import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import api from '../../api/client';

interface CreateCultoModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateCultoModal({ visible, onClose, onSubmit }: CreateCultoModalProps) {
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [directorId, setDirectorId] = useState('');
  const [directors, setDirectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      api.get('/directors').then(({ data }) => setDirectors(data)).catch(() => {});
      // Default to today
      const today = new Date();
      setFecha(today.toISOString().split('T')[0]);
      setHora('10:00');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!tipo.trim() || !fecha) return;
    setLoading(true);
    try {
      await onSubmit({
        tipo: tipo.trim(),
        fecha,
        hora: hora || '10:00',
        director_id: directorId || null,
      });
      setTipo('');
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
          <Text style={styles.title}>Nuevo Culto</Text>

          <ScrollView keyboardShouldPersistTaps="handled">
            <AppInput
              label="Tipo de culto"
              value={tipo}
              onChangeText={setTipo}
              placeholder="Ej: Culto Dominical"
            />
            <AppInput
              label="Fecha (YYYY-MM-DD)"
              value={fecha}
              onChangeText={setFecha}
              placeholder="2025-01-01"
            />
            <AppInput
              label="Hora (HH:MM)"
              value={hora}
              onChangeText={setHora}
              placeholder="10:00"
            />

            {directors.length > 0 && (
              <View style={styles.directorSection}>
                <Text style={styles.label}>Director</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <AppButton
                    title="Ninguno"
                    variant={!directorId ? 'primary' : 'secondary'}
                    size="sm"
                    onPress={() => setDirectorId('')}
                    style={{ marginRight: 8 }}
                  />
                  {directors.map(d => (
                    <AppButton
                      key={d.id}
                      title={d.nombre}
                      variant={String(d.id) === directorId ? 'primary' : 'secondary'}
                      size="sm"
                      onPress={() => setDirectorId(String(d.id))}
                      style={{ marginRight: 8 }}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.actions}>
              <AppButton title="Cancelar" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
              <AppButton title="Crear" onPress={handleSubmit} loading={loading} style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xxl,
    maxHeight: '80%',
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  directorSection: {
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
