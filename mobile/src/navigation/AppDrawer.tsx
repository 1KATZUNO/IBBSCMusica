import React, { useState, useCallback } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContent } from './DrawerContent';
import { CultoDetailScreen } from '../screens/culto/CultoDetailScreen';
import { EnsayosListScreen } from '../screens/ensayos/EnsayosListScreen';
import { EnsayoDetailScreen } from '../screens/ensayos/EnsayoDetailScreen';
import { CantosScreen } from '../screens/admin/CantosScreen';
import { MusiciansScreen } from '../screens/admin/MusiciansScreen';
import { DirectorsScreen } from '../screens/admin/DirectorsScreen';
import { ProgramTypesScreen } from '../screens/admin/ProgramTypesScreen';
import { ServidoresScreen } from '../screens/admin/ServidoresScreen';
import { MembersScreen } from '../screens/admin/MembersScreen';
import { InvitationsScreen } from '../screens/admin/InvitationsScreen';
import { ReunionesListScreen } from '../screens/reuniones/ReunionesListScreen';
import { CreateCultoModal } from '../components/modals/CreateCultoModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Toast } from '../components/common/Toast';
import { useCultos } from '../hooks/useCultos';
import { useNotification } from '../hooks/useNotification';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/typography';

const Drawer = createDrawerNavigator();

function PlaceholderScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Selecciona un culto del menú</Text>
    </View>
  );
}

export function AppDrawer() {
  const cultosHook = useCultos();
  const { notification, showNotif } = useNotification();
  const [selectedCultoId, setSelectedCultoId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleSelectCulto = useCallback((id: number) => {
    setSelectedCultoId(id);
  }, []);

  const handleDeleteCulto = async () => {
    if (!deleteTarget) return;
    try {
      await cultosHook.deleteCulto(deleteTarget);
      if (selectedCultoId === deleteTarget) setSelectedCultoId(null);
      showNotif('Culto eliminado');
    } catch {
      showNotif('Error al eliminar', 'error');
    }
    setDeleteTarget(null);
  };

  const handleCreateCulto = async (data: any) => {
    try {
      const newCulto = await cultosHook.createCulto(data);
      setSelectedCultoId(newCulto.id);
      setShowCreateModal(false);
      showNotif('Culto creado');
    } catch {
      showNotif('Error al crear culto', 'error');
    }
  };

  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => (
          <DrawerContent
            {...props}
            cultos={cultosHook.cultos}
            loading={cultosHook.loading}
            selectedCultoId={selectedCultoId}
            onSelectCulto={handleSelectCulto}
            onDeleteCulto={(id) => setDeleteTarget(id)}
            onCreateCulto={() => setShowCreateModal(true)}
            fetchCultos={cultosHook.fetchCultos}
          />
        )}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: { width: 300, backgroundColor: colors.background },
          sceneStyle: { backgroundColor: colors.background },
        }}>
        <Drawer.Screen name="Home">
          {(props) =>
            selectedCultoId ? (
              <CultoDetailScreen
                {...props}
                cultoId={selectedCultoId}
                cultosHook={cultosHook}
                showNotif={showNotif}
              />
            ) : (
              <PlaceholderScreen />
            )
          }
        </Drawer.Screen>
        <Drawer.Screen name="EnsayosList" component={EnsayosListScreen} />
        <Drawer.Screen name="ReunionesList" component={ReunionesListScreen} />
        <Drawer.Screen name="EnsayoDetail" component={EnsayoDetailScreen} />
        <Drawer.Screen name="CantosAdmin" component={CantosScreen} />
        <Drawer.Screen name="MusiciansAdmin" component={MusiciansScreen} />
        <Drawer.Screen name="DirectorsAdmin" component={DirectorsScreen} />
        <Drawer.Screen name="ProgramTypesAdmin" component={ProgramTypesScreen} />
        <Drawer.Screen name="ServidoresAdmin" component={ServidoresScreen} />
        <Drawer.Screen name="MembersAdmin" component={MembersScreen} />
        <Drawer.Screen name="InvitationsAdmin" component={InvitationsScreen} />
      </Drawer.Navigator>

      <CreateCultoModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCulto}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Eliminar Culto"
        message="¿Estás seguro de que quieres eliminar este culto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDeleteCulto}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast notification={notification} />
    </>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    color: colors.textMuted,
  },
});
