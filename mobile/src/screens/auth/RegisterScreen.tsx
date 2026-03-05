import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAuth } from '../../hooks/useAuth';

export function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e: any) {
      const msg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat().join('\n')
        : e.response?.data?.message || 'Error al registrarse';
      setError(msg);
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
        <View style={styles.header}>
          <Text style={styles.logo}>IBBSC</Text>
          <Text style={styles.subtitle}>Música</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Crear Cuenta</Text>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <AppInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
          />

          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="tu@email.com"
          />

          <AppInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Mínimo 8 caracteres"
          />

          <AppButton
            title="Registrarse"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.linkRow}>
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.linkBold}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },
  header: { alignItems: 'center', marginBottom: spacing.xxxl },
  logo: {
    fontFamily: fonts.serif, fontSize: 48,
    fontWeight: fontWeights.extrabold, color: colors.text, letterSpacing: 2,
  },
  subtitle: {
    fontFamily: fonts.sans, fontSize: fontSizes.lg,
    color: colors.accent, fontWeight: fontWeights.medium, marginTop: -4,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, padding: spacing.xxl,
  },
  title: {
    fontFamily: fonts.sans, fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold, color: colors.text, marginBottom: spacing.xxl,
  },
  errorBox: {
    backgroundColor: 'rgba(225,112,85,0.15)',
    borderRadius: borderRadius.sm, padding: spacing.md, marginBottom: spacing.lg,
  },
  errorText: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.danger },
  linkRow: { marginTop: spacing.xl, alignItems: 'center' },
  linkText: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textSecondary },
  linkBold: { color: colors.accent, fontWeight: fontWeights.semibold },
});
