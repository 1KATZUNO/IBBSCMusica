import { useState, useCallback } from 'react';
import api from '../api/client';

export function useUjieres() {
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchService = useCallback(async (cultoId: number) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cultos/${cultoId}/ujieres`);
      setService(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateService = async (cultoId: number, serviceData: any) => {
    const { data } = await api.put(`/cultos/${cultoId}/ujieres`, serviceData);
    setService(data);
    return data;
  };

  const addAssignment = async (cultoId: number, assignmentData: any) => {
    const { data } = await api.post(`/cultos/${cultoId}/ujieres/assignments`, assignmentData);
    setService((prev: any) => prev ? {
      ...prev,
      assignments: [...(prev.assignments || []), data],
    } : prev);
    return data;
  };

  const updateAssignment = async (id: number, assignmentData: any) => {
    const { data } = await api.put(`/ujier-assignments/${id}`, assignmentData);
    setService((prev: any) => prev ? {
      ...prev,
      assignments: prev.assignments.map((a: any) => a.id === id ? data : a),
    } : prev);
    return data;
  };

  const removeAssignment = async (id: number) => {
    await api.delete(`/ujier-assignments/${id}`);
    setService((prev: any) => prev ? {
      ...prev,
      assignments: prev.assignments.filter((a: any) => a.id !== id),
    } : prev);
  };

  const addReunion = async (cultoId: number, reunionData: any) => {
    const { data } = await api.post(`/cultos/${cultoId}/ujieres/reuniones`, reunionData);
    setService((prev: any) => prev ? {
      ...prev,
      reuniones: [...(prev.reuniones || []), data],
    } : prev);
    return data;
  };

  const updateReunion = async (id: number, reunionData: any) => {
    const { data } = await api.put(`/ujier-reuniones/${id}`, reunionData);
    setService((prev: any) => prev ? {
      ...prev,
      reuniones: prev.reuniones.map((r: any) => r.id === id ? data : r),
    } : prev);
    return data;
  };

  const removeReunion = async (id: number) => {
    await api.delete(`/ujier-reuniones/${id}`);
    setService((prev: any) => prev ? {
      ...prev,
      reuniones: prev.reuniones.filter((r: any) => r.id !== id),
    } : prev);
  };

  return {
    service, loading,
    fetchService, updateService,
    addAssignment, updateAssignment, removeAssignment,
    addReunion, updateReunion, removeReunion,
  };
}
