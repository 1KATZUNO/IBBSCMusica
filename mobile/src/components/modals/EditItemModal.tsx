import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';

interface EditItemModalProps {
  visible: boolean;
  item: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function EditItemModal({ visible, item, onClose, onSubmit }: EditItemModalProps) {
  const [titulo, setTitulo] = useState('');
  const [responsable, setResponsable] = useState('');
  const [duracion, setDuracion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setTitulo(item.titulo || '');
      setResponsable(item.responsable || '');
      setDuracion(item.duracion ? String(item.duracion) : '');
    }
  }, [item]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        titulo: titulo || null,
        responsable: responsable || null,
        duracion: duracion ? parseInt(duracion, 10) : null,
      });
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
          <Text style={styles.title}>Editar Item</Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            <AppInput label="Título" value={titulo} onChangeText={setTitulo} placeholder="Título" />
            <AppInput label="Responsable" value={responsable} onChangeText={setResponsable} placeholder="Nombre" />
            <AppInput label="Duración (min)" value={duracion} onChangeText={setDuracion} keyboardType="numeric" placeholder="5" />
            <View style={styles.actions}>
              <AppButton title="Cancelar" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
              <AppButton title="Guardar" onPress={handleSubmit} loading={loading} style={{ flex: 1 }} />
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
    padding: spacing.xxl, maxHeight: '70%',
  },
  title: {
    fontFamily: fonts.sans, fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold, color: colors.text, marginBottom: spacing.xl,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
