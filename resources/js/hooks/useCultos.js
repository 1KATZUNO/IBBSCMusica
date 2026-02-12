import { useState, useCallback } from 'react';
import api from '../api/client';

export function useCultos() {
  const [cultos, setCultos] = useState([]);
  const [cultoDetail, setCultoDetail] = useState(null);
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

  const fetchCultoDetail = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cultos/${id}`);
      setCultoDetail(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCulto = async (cultoData) => {
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

  const deleteCulto = async (id) => {
    await api.delete(`/cultos/${id}`);
    setCultos(prev => prev.filter(c => c.id !== id));
    if (cultoDetail?.id === id) setCultoDetail(null);
  };

  const addProgramItem = async (cultoId, itemData) => {
    const { data } = await api.post(`/cultos/${cultoId}/program-items`, itemData);
    setCultoDetail(prev => prev ? {
      ...prev,
      programa: [...prev.programa, data],
    } : prev);
    return data;
  };

  const updateProgramItem = async (cultoId, itemId, itemData) => {
    const { data } = await api.put(`/cultos/${cultoId}/program-items/${itemId}`, itemData);
    setCultoDetail(prev => prev ? {
      ...prev,
      programa: prev.programa.map(p => p.id === itemId ? data : p),
    } : prev);
    return data;
  };

  const removeProgramItem = async (cultoId, itemId) => {
    await api.delete(`/cultos/${cultoId}/program-items/${itemId}`);
    setCultoDetail(prev => prev ? {
      ...prev,
      programa: prev.programa.filter(p => p.id !== itemId),
    } : prev);
  };

  const reorderProgramItems = async (cultoId, items) => {
    await api.put(`/cultos/${cultoId}/program-items-reorder`, { items });
    setCultoDetail(prev => {
      if (!prev) return prev;
      const reordered = [...prev.programa];
      items.forEach(({ id, orden }) => {
        const item = reordered.find(p => p.id === id);
        if (item) item.orden = orden;
      });
      reordered.sort((a, b) => a.orden - b.orden);
      return { ...prev, programa: reordered };
    });
  };

  const addMusician = async (cultoId, musicianId, roleId) => {
    await api.post(`/cultos/${cultoId}/musicians`, {
      musician_id: musicianId,
      musician_role_id: roleId,
    });
    await fetchCultoDetail(cultoId);
  };

  const removeMusician = async (cultoId, pivotId) => {
    await api.delete(`/cultos/${cultoId}/musicians/${pivotId}`);
    setCultoDetail(prev => prev ? {
      ...prev,
      musicos: prev.musicos.filter(m => m.pivot_id !== pivotId),
    } : prev);
  };

  return {
    cultos, cultoDetail, loading, setCultoDetail,
    fetchCultos, fetchCultoDetail,
    createCulto, deleteCulto,
    addProgramItem, updateProgramItem, removeProgramItem, reorderProgramItems,
    addMusician, removeMusician,
  };
}
