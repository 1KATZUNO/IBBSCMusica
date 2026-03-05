import React from 'react';
import { AdminListScreen } from './AdminListScreen';
import api from '../../api/client';

export function ServidoresScreen({ navigation }: any) {
  return (
    <AdminListScreen
      navigation={navigation}
      title="Servidores"
      displayField="nombre"
      fields={[
        { key: 'nombre', label: 'Nombre', placeholder: 'Nombre del servidor' },
      ]}
      fetchItems={async () => (await api.get('/servidores')).data}
      createItem={async (data) => (await api.post('/servidores', data)).data}
      updateItem={async (id, data) => (await api.put(`/servidores/${id}`, data)).data}
      deleteItem={async (id) => { await api.delete(`/servidores/${id}`); }}
    />
  );
}
