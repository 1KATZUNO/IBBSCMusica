import React from 'react';
import { AdminListScreen } from './AdminListScreen';
import api from '../../api/client';

export function ProgramTypesScreen({ navigation }: any) {
  return (
    <AdminListScreen
      navigation={navigation}
      title="Tipos de Programa"
      displayField="label"
      secondaryField="emoji"
      fields={[
        { key: 'label', label: 'Nombre', placeholder: 'Ej: Canto, Oración...' },
        { key: 'slug', label: 'Slug', placeholder: 'canto' },
        { key: 'emoji', label: 'Emoji', placeholder: '🎵' },
        { key: 'bg_color', label: 'Color de fondo', placeholder: '#1a1a2e' },
      ]}
      fetchItems={async () => (await api.get('/program-item-types')).data}
      createItem={async (data) => (await api.post('/program-item-types', data)).data}
      updateItem={async (id, data) => (await api.put(`/program-item-types/${id}`, data)).data}
      deleteItem={async (id) => { await api.delete(`/program-item-types/${id}`); }}
    />
  );
}
