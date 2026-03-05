import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { fonts, fontSizes, fontWeights } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { useAuth } from '../hooks/useAuth';
import { CultoCard } from '../components/culto/CultoCard';

interface DrawerContentProps {
  navigation: any;
  cultos: any[];
  loading: boolean;
  selectedCultoId: number | null;
  onSelectCulto: (id: number) => void;
  onDeleteCulto: (id: number) => void;
  onCreateCulto: () => void;
  fetchCultos: () => void;
}

export function DrawerContent({
  navigation, cultos, loading, selectedCultoId,
  onSelectCulto, onDeleteCulto, onCreateCulto, fetchCultos,
}: DrawerContentProps) {
  const { user, isAdmin, logout, leaveOrganization } = useAuth();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    fetchCultos();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.orgName}>{user?.organization?.name || 'IBBSC'}</Text>
        <Text style={styles.userName}>{user?.name}</Text>
      </View>

      {/* Cultos list */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cultos</Text>
          {isAdmin && (
            <TouchableOpacity onPress={onCreateCulto} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="plus" size={22} color={colors.accent} />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.lg }} />
        ) : cultos.length === 0 ? (
          <Text style={styles.empty}>No hay cultos programados</Text>
        ) : (
          <FlatList
            data={cultos}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <CultoCard
                culto={item}
                selected={item.id === selectedCultoId}
                onPress={() => {
                  onSelectCulto(item.id);
                  navigation.closeDrawer();
                }}
                onDelete={() => onDeleteCulto(item.id)}
                isAdmin={isAdmin}
              />
            )}
            style={styles.list}
          />
        )}
      </View>

      {/* Nav links */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => { navigation.navigate('EnsayosList'); navigation.closeDrawer(); }}>
          <Icon name="music-note-eighth" size={20} color={colors.textSecondary} />
          <Text style={styles.navText}>Ensayos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => { navigation.navigate('ReunionesList'); navigation.closeDrawer(); }}>
          <Icon name="account-group" size={20} color={colors.textSecondary} />
          <Text style={styles.navText}>Reuniones</Text>
        </TouchableOpacity>

        {isAdmin && (
          <>
            <View style={styles.divider} />
            <Text style={styles.adminLabel}>Administración</Text>
            {[
              { route: 'CantosAdmin', icon: 'music', label: 'Cantos' },
              { route: 'MusiciansAdmin', icon: 'account-music', label: 'Músicos' },
              { route: 'DirectorsAdmin', icon: 'account-tie', label: 'Directores' },
              { route: 'ProgramTypesAdmin', icon: 'format-list-bulleted-type', label: 'Tipos de Programa' },
              { route: 'ServidoresAdmin', icon: 'account-group', label: 'Servidores' },
              { route: 'MembersAdmin', icon: 'account-multiple', label: 'Miembros' },
              { route: 'InvitationsAdmin', icon: 'email-outline', label: 'Invitaciones' },
            ].map(item => (
              <TouchableOpacity
                key={item.route}
                style={styles.navItem}
                onPress={() => { navigation.navigate(item.route); navigation.closeDrawer(); }}>
                <Icon name={item.icon} size={20} color={colors.textSecondary} />
                <Text style={styles.navText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>

      {/* Leave org + Logout */}
      <View style={styles.bottomActions}>
        {user?.organization_id && (
          <TouchableOpacity
            style={styles.leaveBtn}
            onPress={() => {
              Alert.alert(
                'Salir de organización',
                '¿Seguro que quieres salir? Podrás crear tu propia iglesia después.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: () => leaveOrganization(),
                  },
                ],
              );
            }}>
            <Icon name="exit-run" size={18} color={colors.warning} />
            <Text style={[styles.navText, { color: colors.warning, fontSize: 13 }]}>Salir de organización</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Icon name="logout" size={20} color={colors.danger} />
          <Text style={[styles.navText, { color: colors.danger }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xxxl,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orgName: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  userName: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  list: {
    flex: 1,
  },
  empty: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  nav: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  navText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  adminLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  bottomActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  leaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
});
