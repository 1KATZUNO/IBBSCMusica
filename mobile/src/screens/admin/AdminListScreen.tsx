import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Toast } from '../../components/common/Toast';
import { useNotification } from '../../hooks/useNotification';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

interface Field {
  key: string;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

interface AdminListScreenProps {
  navigation: any;
  title: string;
  fields: Field[];
  displayField: string;
  secondaryField?: string;
  fetchItems: () => Promise<any[]>;
  createItem: (data: any) => Promise<any>;
  updateItem: (id: number, data: any) => Promise<any>;
  deleteItem: (id: number) => Promise<void>;
}

export function AdminListScreen({
  navigation, title, fields, displayField, secondaryField,
  fetchItems, createItem, updateItem, deleteItem,
}: AdminListScreenProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { notification, showNotif } = useNotification();

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch {
      showNotif('Error al cargar', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const resetForm = () => {
    setFormData({});
    setEditId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    const data: Record<string, string> = {};
    fields.forEach(f => { data[f.key] = item[f.key] != null ? String(item[f.key]) : ''; });
    setFormData(data);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {};
      fields.forEach(f => {
        payload[f.key] = f.keyboardType === 'numeric'
          ? (formData[f.key] ? parseInt(formData[f.key], 10) : null)
          : formData[f.key] || null;
      });

      if (editId) {
        await updateItem(editId, payload);
        showNotif('Actualizado');
      } else {
        await createItem(payload);
        showNotif('Creado');
      }
      resetForm();
      loadItems();
    } catch (e: any) {
      const msg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat().join('\n')
        : 'Error al guardar';
      showNotif(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteItem(deleteId);
      setItems(prev => prev.filter(i => i.id !== deleteId));
      showNotif('Eliminado');
    } catch {
      showNotif('Error al eliminar', 'error');
    }
    setDeleteId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={openCreate}>
          <Icon name="plus" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          {fields.map(f => (
            <AppInput
              key={f.key}
              label={f.label}
              value={formData[f.key] || ''}
              onChangeText={(v) => setFormData(prev => ({ ...prev, [f.key]: v }))}
              placeholder={f.placeholder}
              keyboardType={f.keyboardType}
            />
          ))}
          <View style={styles.formActions}>
            <AppButton title="Cancelar" variant="secondary" size="sm" onPress={resetForm} />
            <AppButton title={editId ? 'Guardar' : 'Crear'} size="sm" onPress={handleSave} loading={saving} />
          </View>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadItems} tintColor={colors.accent} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardContent} onPress={() => openEdit(item)}>
              <Text style={styles.cardTitle}>{item[displayField]}</Text>
              {secondaryField && item[secondaryField] && (
                <Text style={styles.cardSecondary}>{item[secondaryField]}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteId(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="trash-can-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>Sin elementos</Text> : null}
        contentContainerStyle={{ padding: spacing.lg }}
      />

      <ConfirmModal
        visible={!!deleteId}
        title={`Eliminar ${title.slice(0, -1)}`}
        message="¿Estás seguro? Esta acción no se puede deshacer."
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
  title: { fontFamily: fonts.serif, fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.text },
  form: {
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
  cardTitle: { fontFamily: fonts.sans, fontSize: fontSizes.md, fontWeight: fontWeights.medium, color: colors.text },
  cardSecondary: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  empty: {
    fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textMuted,
    textAlign: 'center', marginVertical: spacing.xxxl,
  },
});
