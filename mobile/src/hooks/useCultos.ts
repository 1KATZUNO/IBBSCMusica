import { useState, useCallback } from 'react';
import api from '../api/client';

export function useCultos() {
  const [cultos, setCultos] = useState<any[]>([]);
  const [cultoDetail, setCultoDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCultos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cultos');
      setCultos(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCultoDetail = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cultos/${id}`);
      setCultoDetail(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCulto = async (cultoData: any) => {
    const { data } = await api.post('/cultos', cultoData);
    setCultos(prev => [...prev, {
      id: data.id,
      tipo: data.tipo,
      fecha: data.fecha,
      hora: data.hora,
      color: data.color,
      programa_count: 0,
    }]);
    return data;
  };

  const updateCulto = async (id: number, cultoData: any) => {
    const { data } = await api.put(`/cultos/${id}`, cultoData);
    setCultos(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    if (cultoDetail?.id === id) setCultoDetail((prev: any) => prev ? { ...prev, ...data } : prev);
    return data;
  };

  const deleteCulto = async (id: number) => {
    await api.delete(`/cultos/${id}`);
    setCultos(prev => prev.filter(c => c.id !== id));
    if (cultoDetail?.id === id) setCultoDetail(null);
  };

  const addProgramItem = async (cultoId: number, itemData: any) => {
    const { data } = await api.post(`/cultos/${cultoId}/program-items`, itemData);
    setCultoDetail((prev: any) => prev ? {
      ...prev,
      programa: [...prev.programa, data],
    } : prev);
    return data;
  };

  const updateProgramItem = async (cultoId: number, itemId: number, itemData: any) => {
    const { data } = await api.put(`/cultos/${cultoId}/program-items/${itemId}`, itemData);
    setCultoDetail((prev: any) => prev ? {
      ...prev,
      programa: prev.programa.map((p: any) => p.id === itemId ? data : p),
    } : prev);
    return data;
  };

  const removeProgramItem = async (cultoId: number, itemId: number) => {
    await api.delete(`/cultos/${cultoId}/program-items/${itemId}`);
    setCultoDetail((prev: any) => prev ? {
      ...prev,
      programa: prev.programa.filter((p: any) => p.id !== itemId),
    } : prev);
  };

  const reorderProgramItems = async (cultoId: number, items: { id: number; orden: number }[]) => {
    await api.put(`/cultos/${cultoId}/program-items-reorder`, { items });
    setCultoDetail((prev: any) => {
      if (!prev) return prev;
      const reordered = [...prev.programa];
      items.forEach(({ id, orden }) => {
        const item = reordered.find((p: any) => p.id === id);
        if (item) item.orden = orden;
      });
      reordered.sort((a: any, b: any) => a.orden - b.orden);
      return { ...prev, programa: reordered };
    });
  };

  const addMusician = async (cultoId: number, musicianId: number, roleId: number) => {
    await api.post(`/cultos/${cultoId}/musicians`, {
      musician_id: musicianId,
      musician_role_id: roleId,
    });
    await fetchCultoDetail(cultoId);
  };

  const removeMusician = async (cultoId: number, pivotId: number) => {
    await api.delete(`/cultos/${cultoId}/musicians/${pivotId}`);
    setCultoDetail((prev: any) => prev ? {
      ...prev,
      musicos: prev.musicos.filter((m: any) => m.pivot_id !== pivotId),
    } : prev);
  };

  return {
    cultos, cultoDetail, loading, setCultoDetail,
    fetchCultos, fetchCultoDetail,
    createCulto, updateCulto, deleteCulto,
    addProgramItem, updateProgramItem, removeProgramItem, reorderProgramItems,
    addMusician, removeMusician,
  };
}
