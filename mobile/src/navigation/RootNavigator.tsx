import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthStack } from './AuthStack';
import { AppDrawer } from './AppDrawer';
import { OrgSetupScreen } from '../screens/auth/OrgSetupScreen';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';

const linking = {
  prefixes: ['ibbscmusica://'],
  config: {
    screens: {
      AcceptInvite: 'invite/:token',
    },
  },
};

export function RootNavigator() {
  const { isLoggedIn, needsOrganization, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {!isLoggedIn ? (
        <AuthStack />
      ) : needsOrganization ? (
        <OrgSetupScreen />
      ) : (
        <AppDrawer />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
