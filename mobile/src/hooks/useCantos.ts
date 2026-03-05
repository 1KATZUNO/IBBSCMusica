import { useState, useCallback } from 'react';
import api from '../api/client';

export function useCantos() {
  const [cantos, setCantos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCantos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cantos');
      setCantos(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCanto = async (cantoData: any) => {
    const { data } = await api.post('/cantos', cantoData);
    setCantos(prev => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return data;
  };

  const updateCanto = async (id: number, cantoData: any) => {
    const { data } = await api.put(`/cantos/${id}`, cantoData);
    setCantos(prev => prev.map(c => c.id === id ? data : c));
    return data;
  };

  const deleteCanto = async (id: number) => {
    await api.delete(`/cantos/${id}`);
    setCantos(prev => prev.filter(c => c.id !== id));
  };

  return { cantos, loading, fetchCantos, createCanto, updateCanto, deleteCanto };
}
