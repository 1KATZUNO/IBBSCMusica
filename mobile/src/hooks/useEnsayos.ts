import { useState, useCallback } from 'react';
import api from '../api/client';

export function useEnsayos() {
  const [ensayos, setEnsayos] = useState<any[]>([]);
  const [ensayoDetail, setEnsayoDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchEnsayos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/ensayos');
      setEnsayos(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnsayoDetail = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/ensayos/${id}`);
      setEnsayoDetail(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEnsayo = async (ensayoData: any) => {
    const { data } = await api.post('/ensayos', ensayoData);
    setEnsayos(prev => [...prev, data]);
    return data;
  };

  const updateEnsayo = async (id: number, ensayoData: any) => {
    const { data } = await api.put(`/ensayos/${id}`, ensayoData);
    setEnsayos(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    if (ensayoDetail?.id === id) setEnsayoDetail((prev: any) => prev ? { ...prev, ...data } : prev);
    return data;
  };

  const deleteEnsayo = async (id: number) => {
    await api.delete(`/ensayos/${id}`);
    setEnsayos(prev => prev.filter(e => e.id !== id));
    if (ensayoDetail?.id === id) setEnsayoDetail(null);
  };

  const addCanto = async (ensayoId: number, cantoId: number) => {
    const { data } = await api.post(`/ensayos/${ensayoId}/cantos`, { canto_id: cantoId });
    await fetchEnsayoDetail(ensayoId);
    return data;
  };

  const removeCanto = async (ensayoId: number, cantoId: number) => {
    await api.delete(`/ensayos/${ensayoId}/cantos/${cantoId}`);
    setEnsayoDetail((prev: any) => prev ? {
      ...prev,
      cantos: prev.cantos.filter((c: any) => c.id !== cantoId),
    } : prev);
  };

  const addAsistente = async (ensayoId: number, musicianId: number) => {
    const { data } = await api.post(`/ensayos/${ensayoId}/asistentes`, { musician_id: musicianId });
    await fetchEnsayoDetail(ensayoId);
    return data;
  };

  const removeAsistente = async (ensayoId: number, asistenteId: number) => {
    await api.delete(`/ensayo-asistentes/${asistenteId}`);
    setEnsayoDetail((prev: any) => prev ? {
      ...prev,
      asistentes: prev.asistentes.filter((a: any) => a.id !== asistenteId),
    } : prev);
  };

  return {
    ensayos, ensayoDetail, loading,
    fetchEnsayos, fetchEnsayoDetail,
    createEnsayo, updateEnsayo, deleteEnsayo,
    addCanto, removeCanto, addAsistente, removeAsistente,
  };
}
