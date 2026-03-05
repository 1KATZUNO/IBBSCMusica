import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CultoHeader } from '../../components/culto/CultoHeader';
import { NowPlayingBar } from '../../components/culto/NowPlayingBar';
import { ProgramaTab } from './ProgramaTab';
import { UjieresTab } from './UjieresTab';
import { ReunionesTab } from './ReunionesTab';
import { useLiveMode } from '../../hooks/useLiveMode';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { fonts, fontSizes } from '../../theme/typography';

const Tab = createMaterialTopTabNavigator();

interface CultoDetailScreenProps {
  navigation: any;
  cultoId: number;
  cultosHook: any;
  showNotif: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function CultoDetailScreen({ navigation, cultoId, cultosHook, showNotif }: CultoDetailScreenProps) {
  const { isAdmin } = useAuth();
  const { cultoDetail, setCultoDetail, fetchCultoDetail } = cultosHook;

  const liveMode = useLiveMode(cultoDetail, setCultoDetail, fetchCultoDetail);

  useEffect(() => {
    fetchCultoDetail(cultoId);
  }, [cultoId]);

  if (!cultoDetail) return <View style={styles.container} />;

  const activeItem = liveMode.isLive
    ? cultoDetail.programa?.find((item: any) => !item.completed_at) || null
    : null;

  return (
    <View style={styles.container}>
      <CultoHeader
        culto={cultoDetail}
        isLive={liveMode.isLive}
        elapsedSeconds={liveMode.elapsedSeconds}
        isAdmin={isAdmin}
        onStart={() => liveMode.startCulto(cultoDetail.id)}
        onStop={() => liveMode.stopCulto(cultoDetail.id)}
        onOpenDrawer={() => navigation.openDrawer()}
      />

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.surface },
          tabBarLabelStyle: {
            fontFamily: fonts.sans,
            fontSize: fontSizes.sm,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIndicatorStyle: { backgroundColor: colors.accent, height: 2 },
          swipeEnabled: false,
        }}>
        <Tab.Screen name="Programa">
          {() => (
            <ProgramaTab
              cultoDetail={cultoDetail}
              cultosHook={cultosHook}
              liveMode={liveMode}
              isAdmin={isAdmin}
              showNotif={showNotif}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Ujieres">
          {() => (
            <UjieresTab
              cultoId={cultoDetail.id}
              isAdmin={isAdmin}
              showNotif={showNotif}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Reuniones">
          {() => (
            <ReunionesTab
              cultoId={cultoDetail.id}
              isAdmin={isAdmin}
              showNotif={showNotif}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

      {liveMode.isLive && (
        <NowPlayingBar
          item={activeItem}
          elapsedSeconds={activeItem ? liveMode.getItemElapsedSeconds(activeItem) : 0}
          autoDeleteCountdown={liveMode.autoDeleteCountdown}
          allCompleted={liveMode.allCompleted}
          isAdmin={isAdmin}
          onComplete={() => activeItem && liveMode.completeItem(cultoDetail.id, activeItem.id)}
          onCancelAutoDelete={liveMode.cancelAutoDelete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
