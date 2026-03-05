import React from 'react';
import { AdminListScreen } from './AdminListScreen';
import api from '../../api/client';

export function DirectorsScreen({ navigation }: any) {
  return (
    <AdminListScreen
      navigation={navigation}
      title="Directores"
      displayField="nombre"
      fields={[
        { key: 'nombre', label: 'Nombre', placeholder: 'Nombre del director' },
      ]}
      fetchItems={async () => (await api.get('/directors')).data}
      createItem={async (data) => (await api.post('/directors', data)).data}
      updateItem={async (id, data) => (await api.put(`/directors/${id}`, data)).data}
      deleteItem={async (id) => { await api.delete(`/directors/${id}`); }}
    />
  );
}
