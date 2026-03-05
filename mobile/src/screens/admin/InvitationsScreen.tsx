import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl, Share,
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
import api from '../../api/client';

export function InvitationsScreen({ navigation }: any) {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { notification, showNotif } = useNotification();

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/invitations');
      setInvitations(data);
    } catch {
      showNotif('Error al cargar', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInvitations(); }, []);

  const handleCreate = async () => {
    if (!email.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post('/invitations', { email: email.trim(), role });
      setInvitations(prev => [...prev, data]);
      setEmail('');
      setShowCreate(false);
      showNotif('Invitación creada');
    } catch (e: any) {
      showNotif(e.response?.data?.message || 'Error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async (token: string) => {
    try {
      await Share.share({
        message: `Únete a nuestra organización: ibbscmusica://invite/${token}`,
      });
    } catch {
      // cancelled
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/invitations/${deleteId}`);
      setInvitations(prev => prev.filter(i => i.id !== deleteId));
      showNotif('Invitación eliminada');
    } catch {
      showNotif('Error', 'error');
    }
    setDeleteId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Invitaciones</Text>
        <TouchableOpacity onPress={() => setShowCreate(true)}>
          <Icon name="plus" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {showCreate && (
        <View style={styles.form}>
          <AppInput label="Email" value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" placeholder="email@ejemplo.com" />
          <View style={styles.roleRow}>
            <AppButton title="Miembro" size="sm"
              variant={role === 'member' ? 'primary' : 'secondary'}
              onPress={() => setRole('member')} />
            <AppButton title="Admin" size="sm"
              variant={role === 'admin' ? 'primary' : 'secondary'}
              onPress={() => setRole('admin')} />
          </View>
          <View style={styles.formActions}>
            <AppButton title="Cancelar" variant="secondary" size="sm" onPress={() => setShowCreate(false)} />
            <AppButton title="Invitar" size="sm" onPress={handleCreate} loading={saving} />
          </View>
        </View>
      )}

      <FlatList
        data={invitations}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInvitations} tintColor={colors.accent} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.email}>{item.email}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, item.accepted_at && styles.acceptedBadge]}>
                  <Text style={styles.badgeText}>
                    {item.accepted_at ? 'Aceptada' : 'Pendiente'}
                  </Text>
                </View>
                <Text style={styles.roleLabel}>{item.role}</Text>
              </View>
            </View>
            {!item.accepted_at && (
              <TouchableOpacity onPress={() => handleShare(item.token)} style={{ marginRight: spacing.sm }}>
                <Icon name="share-variant" size={20} color={colors.accent} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setDeleteId(item.id)}>
              <Icon name="trash-can-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ padding: spacing.lg }}
      />

      <ConfirmModal
        visible={!!deleteId}
        title="Eliminar Invitación"
        message="¿Eliminar esta invitación?"
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
  roleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  formActions: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.lg, marginBottom: spacing.sm,
  },
  cardContent: { flex: 1 },
  email: { fontFamily: fonts.sans, fontSize: fontSizes.md, color: colors.text, fontWeight: '500' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  badge: {
    paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4,
    backgroundColor: colors.warning + '20',
  },
  acceptedBadge: { backgroundColor: colors.success + '20' },
  badgeText: { fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.text },
  roleLabel: { fontFamily: fonts.sans, fontSize: fontSizes.xs, color: colors.textMuted },
});
