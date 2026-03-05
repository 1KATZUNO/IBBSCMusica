import React from 'react';
import { AdminListScreen } from './AdminListScreen';
import api from '../../api/client';

export function CantosScreen({ navigation }: any) {
  return (
    <AdminListScreen
      navigation={navigation}
      title="Cantos"
      displayField="nombre"
      secondaryField="youtube_url"
      fields={[
        { key: 'nombre', label: 'Nombre', placeholder: 'Nombre del canto' },
        { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
      ]}
      fetchItems={async () => (await api.get('/cantos')).data}
      createItem={async (data) => (await api.post('/cantos', data)).data}
      updateItem={async (id, data) => (await api.put(`/cantos/${id}`, data)).data}
      deleteItem={async (id) => { await api.delete(`/cantos/${id}`); }}
    />
  );
}
