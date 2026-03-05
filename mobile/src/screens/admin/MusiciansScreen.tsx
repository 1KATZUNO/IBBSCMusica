import React from 'react';
import { AdminListScreen } from './AdminListScreen';
import api from '../../api/client';

export function MusiciansScreen({ navigation }: any) {
  return (
    <AdminListScreen
      navigation={navigation}
      title="Músicos"
      displayField="nombre"
      fields={[
        { key: 'nombre', label: 'Nombre', placeholder: 'Nombre del músico' },
      ]}
      fetchItems={async () => (await api.get('/musicians')).data}
      createItem={async (data) => (await api.post('/musicians', data)).data}
      updateItem={async (id, data) => (await api.put(`/musicians/${id}`, data)).data}
      deleteItem={async (id) => { await api.delete(`/musicians/${id}`); }}
    />
  );
}
