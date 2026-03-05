import { useState, useCallback } from 'react';
import api from '../api/client';

export function useReuniones() {
  const [reuniones, setReuniones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReuniones = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reuniones');
      setReuniones(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { reuniones, loading, fetchReuniones };
}
