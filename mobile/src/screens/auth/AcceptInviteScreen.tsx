import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { AppButton } from '../../components/common/AppButton';
import api from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

export function AcceptInviteScreen({ route, navigation }: any) {
  const { token } = route.params || {};
  const { isLoggedIn } = useAuth();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token de invitación inválido');
      setLoading(false);
      return;
    }
    api.get(`/invitations/${token}`)
      .then(({ data }) => { setInvitation(data); setLoading(false); })
      .catch(() => { setError('Invitación no encontrada o expirada'); setLoading(false); });
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await api.post(`/invitations/${token}/accept`);
      setSuccess(true);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al aceptar invitación');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {success ? (
          <>
            <Text style={styles.title}>Invitación aceptada</Text>
            <Text style={styles.desc}>Ya eres parte de la organización.</Text>
            <AppButton
              title={isLoggedIn ? 'Ir al inicio' : 'Iniciar Sesión'}
              onPress={() => navigation.navigate(isLoggedIn ? 'App' : 'Login')}
            />
          </>
        ) : error ? (
          <>
            <Text style={styles.title}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <AppButton
              title="Volver"
              variant="secondary"
              onPress={() => navigation.goBack()}
              style={{ marginTop: spacing.lg }}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Invitación</Text>
            <Text style={styles.desc}>
              Has sido invitado a unirte a{' '}
              <Text style={{ color: colors.accent, fontWeight: '600' }}>
                {invitation?.organization_name}
              </Text>
            </Text>
            <AppButton
              title="Aceptar Invitación"
              onPress={handleAccept}
              loading={accepting}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: 'center', padding: spacing.xxl,
  },
  center: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
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
  errorText: {
    fontFamily: fonts.sans, fontSize: fontSizes.md,
    color: colors.danger, marginBottom: spacing.lg,
  },
});
