import { useState, useCallback } from 'react';
import api from '../api/client';

export function useMusicians() {
  const [musicians, setMusicians] = useState<any[]>([]);
  const [musicianRoles, setMusicianRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMusicians = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/musicians');
      setMusicians(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMusicianRoles = useCallback(async () => {
    const { data } = await api.get('/musician-roles');
    setMusicianRoles(data);
  }, []);

  const createMusician = async (musicianData: any) => {
    const { data } = await api.post('/musicians', musicianData);
    setMusicians(prev => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return data;
  };

  const updateMusician = async (id: number, musicianData: any) => {
    const { data } = await api.put(`/musicians/${id}`, musicianData);
    setMusicians(prev => prev.map(m => m.id === id ? data : m));
    return data;
  };

  const deleteMusician = async (id: number) => {
    await api.delete(`/musicians/${id}`);
    setMusicians(prev => prev.filter(m => m.id !== id));
  };

  return {
    musicians, musicianRoles, loading,
    fetchMusicians, fetchMusicianRoles,
    createMusician, updateMusician, deleteMusician,
  };
}
