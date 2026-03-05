import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Toast } from '../../components/common/Toast';
import { useNotification } from '../../hooks/useNotification';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import api from '../../api/client';

export function MembersScreen({ navigation }: any) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeId, setRemoveId] = useState<number | null>(null);
  const { notification, showNotif } = useNotification();

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/organization/members');
      setMembers(data);
    } catch {
      showNotif('Error al cargar miembros', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const toggleRole = async (memberId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    try {
      await api.put(`/organization/members/${memberId}/role`, { role: newRole });
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      showNotif(`Rol cambiado a ${newRole}`);
    } catch {
      showNotif('Error al cambiar rol', 'error');
    }
  };

  const handleRemove = async () => {
    if (!removeId) return;
    try {
      await api.delete(`/organization/members/${removeId}`);
      setMembers(prev => prev.filter(m => m.id !== removeId));
      showNotif('Miembro removido');
    } catch {
      showNotif('Error al remover', 'error');
    }
    setRemoveId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Miembros</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={members}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMembers} tintColor={colors.accent} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleRole(item.id, item.role)}
              style={[styles.roleBadge, item.role === 'admin' && styles.adminBadge]}>
              <Text style={[styles.roleText, item.role === 'admin' && styles.adminText]}>
                {item.role}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRemoveId(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="account-remove" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ padding: spacing.lg }}
      />

      <ConfirmModal
        visible={!!removeId}
        title="Remover Miembro"
        message="¿Remover a este miembro de la organización?"
        confirmLabel="Remover"
        onConfirm={handleRemove}
        onCancel={() => setRemoveId(null)}
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
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.lg, marginBottom: spacing.sm,
  },
  cardContent: { flex: 1 },
  name: { fontFamily: fonts.sans, fontSize: fontSizes.md, fontWeight: fontWeights.medium, color: colors.text },
  email: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textSecondary },
  roleBadge: {
    paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: borderRadius.sm, backgroundColor: colors.surfaceLight,
  },
  adminBadge: { backgroundColor: colors.accent + '20' },
  roleText: { fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.textMuted, fontWeight: '600' },
  adminText: { color: colors.accent },
});
