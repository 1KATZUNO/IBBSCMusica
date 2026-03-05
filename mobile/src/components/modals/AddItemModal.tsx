import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import api from '../../api/client';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AddItemModal({ visible, onClose, onSubmit }: AddItemModalProps) {
  const [types, setTypes] = useState<any[]>([]);
  const [cantos, setCantos] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedCanto, setSelectedCanto] = useState<any>(null);
  const [titulo, setTitulo] = useState('');
  const [responsable, setResponsable] = useState('');
  const [duracion, setDuracion] = useState('');
  const [cantoSearch, setCantoSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      api.get('/program-item-types').then(({ data }) => setTypes(data)).catch(() => {});
      api.get('/cantos').then(({ data }) => setCantos(data)).catch(() => {});
    }
  }, [visible]);

  const filteredCantos = cantos.filter(c =>
    c.nombre.toLowerCase().includes(cantoSearch.toLowerCase()),
  );

  const isCanto = selectedType?.slug === 'canto';

  const handleSubmit = async () => {
    if (!selectedType) return;
    setLoading(true);
    try {
      await onSubmit({
        program_item_type_id: selectedType.id,
        canto_id: isCanto && selectedCanto ? selectedCanto.id : null,
        titulo: !isCanto ? titulo : null,
        responsable: responsable || null,
        duracion: duracion ? parseInt(duracion, 10) : null,
      });
      // Reset
      setSelectedType(null);
      setSelectedCanto(null);
      setTitulo('');
      setResponsable('');
      setDuracion('');
      setCantoSearch('');
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
          <Text style={styles.title}>Agregar Item</Text>

          <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 500 }}>
            {/* Type selection */}
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.typeGrid}>
              {types.map(t => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => { setSelectedType(t); setSelectedCanto(null); }}
                  style={[
                    styles.typeChip,
                    selectedType?.id === t.id && { borderColor: colors.accent },
                  ]}>
                  <Text style={styles.typeEmoji}>{t.emoji}</Text>
                  <Text style={styles.typeLabel}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedType && isCanto && (
              <>
                <AppInput
                  label="Buscar canto"
                  value={cantoSearch}
                  onChangeText={setCantoSearch}
                  placeholder="Nombre del canto..."
                />
                <View style={styles.cantoList}>
                  {filteredCantos.slice(0, 10).map(c => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setSelectedCanto(c)}
                      style={[
                        styles.cantoItem,
                        selectedCanto?.id === c.id && { backgroundColor: colors.accent + '20' },
                      ]}>
                      <Text style={styles.cantoName}>{c.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {selectedType && !isCanto && (
              <AppInput
                label="Título"
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Título del item"
              />
            )}

            {selectedType && (
              <>
                <AppInput
                  label="Responsable"
                  value={responsable}
                  onChangeText={setResponsable}
                  placeholder="Nombre (opcional)"
                />
                <AppInput
                  label="Duración (minutos)"
                  value={duracion}
                  onChangeText={setDuracion}
                  keyboardType="numeric"
                  placeholder="5"
                />
              </>
            )}

            <View style={styles.actions}>
              <AppButton title="Cancelar" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
              <AppButton title="Agregar" onPress={handleSubmit} loading={loading} style={{ flex: 1 }} />
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
    maxHeight: '85%',
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeEmoji: { fontSize: 16 },
  typeLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  cantoList: {
    marginBottom: spacing.lg,
  },
  cantoItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  cantoName: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
