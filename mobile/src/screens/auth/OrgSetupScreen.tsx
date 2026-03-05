import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAuth } from '../../hooks/useAuth';

export function OrgSetupScreen() {
  const { setupOrganization, logout } = useAuth();
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!orgName.trim()) {
      setError('Ingresa el nombre de tu iglesia');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await setupOrganization(orgName.trim());
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al crear organización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Configurar Iglesia</Text>
          <Text style={styles.desc}>
            Crea tu organización para comenzar a gestionar la música de tu iglesia.
          </Text>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <AppInput
            label="Nombre de la iglesia"
            value={orgName}
            onChangeText={setOrgName}
            placeholder="Ej: Iglesia Bautista..."
          />

          <AppButton
            title="Crear Organización"
            onPress={handleSetup}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />

          <AppButton
            title="Cerrar Sesión"
            onPress={logout}
            variant="ghost"
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, padding: spacing.xxl,
  },
  title: {
    fontFamily: fonts.sans, fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold, color: colors.text, marginBottom: spacing.sm,
  },
  desc: {
    fontFamily: fonts.sans, fontSize: fontSizes.md,
    color: colors.textSecondary, marginBottom: spacing.xxl, lineHeight: 22,
  },
  errorBox: {
    backgroundColor: 'rgba(225,112,85,0.15)',
    borderRadius: borderRadius.sm, padding: spacing.md, marginBottom: spacing.lg,
  },
  errorText: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.danger },
});
