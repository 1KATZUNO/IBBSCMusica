import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAuth } from '../../hooks/useAuth';

const WEB_CLIENT_ID = '562324914151-vus056jqrh4o5otjmbhjkmt21fg6fb0p.apps.googleusercontent.com';
// TODO: Once you create the iOS OAuth Client ID in Google Cloud Console, put it here:
// const IOS_CLIENT_ID = 'xxx.apps.googleusercontent.com';

export function LoginScreen({ navigation }: any) {
  const { login, loginWithGoogleToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      // iosClientId: IOS_CLIENT_ID, // uncomment when you have the iOS Client ID
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) {
        setError('No se pudo obtener el token de Google');
        return;
      }
      await loginWithGoogleToken(idToken);
    } catch (e: any) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled
      } else if (e.code === statusCodes.IN_PROGRESS) {
        // already in progress
      } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Google Play Services no disponible');
      } else {
        setError(e.response?.data?.message || 'Error con Google Sign-In');
      }
    } finally {
      setGoogleLoading(false);
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
          <Text style={styles.title}>Iniciar Sesión</Text>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

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
            placeholder="••••••••"
          />

          <AppButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In */}
          <AppButton
            title="Continuar con Google"
            onPress={handleGoogleSignIn}
            loading={googleLoading}
            variant="secondary"
            style={styles.googleBtn}
            textStyle={{ color: colors.text }}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.linkRow}>
            <Text style={styles.linkText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.linkBold}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    fontFamily: fonts.serif,
    fontSize: 48,
    fontWeight: fontWeights.extrabold,
    color: colors.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    color: colors.accent,
    fontWeight: fontWeights.medium,
    marginTop: -4,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xxl,
  },
  errorBox: {
    backgroundColor: 'rgba(225,112,85,0.15)',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.danger,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  googleBtn: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkRow: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  linkBold: {
    color: colors.accent,
    fontWeight: fontWeights.semibold,
  },
});
