import { useState, useCallback } from 'react';
import api from '../api/client';

export function useUjieres() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchService = useCallback(async (cultoId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cultos/${cultoId}/ujieres`);
      setService(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateService = async (cultoId, serviceData) => {
    const { data } = await api.put(`/cultos/${cultoId}/ujieres`, serviceData);
    setService(data);
    return data;
  };

  // Assignments
  const addAssignment = async (cultoId, assignmentData) => {
    const { data } = await api.post(`/cultos/${cultoId}/ujieres/assignments`, assignmentData);
    setService(prev => prev ? {
      ...prev,
      assignments: [...(prev.assignments || []), data],
    } : prev);
    return data;
  };

  const updateAssignment = async (id, assignmentData) => {
    const { data } = await api.put(`/ujier-assignments/${id}`, assignmentData);
    setService(prev => prev ? {
      ...prev,
      assignments: prev.assignments.map(a => a.id === id ? data : a),
    } : prev);
    return data;
  };

  const removeAssignment = async (id) => {
    await api.delete(`/ujier-assignments/${id}`);
    setService(prev => prev ? {
      ...prev,
      assignments: prev.assignments.filter(a => a.id !== id),
    } : prev);
  };

  // Reuniones
  const addReunion = async (cultoId, reunionData) => {
    const { data } = await api.post(`/cultos/${cultoId}/ujieres/reuniones`, reunionData);
    setService(prev => prev ? {
      ...prev,
      reuniones: [...(prev.reuniones || []), data],
    } : prev);
    return data;
  };

  const updateReunion = async (id, reunionData) => {
    const { data } = await api.put(`/ujier-reuniones/${id}`, reunionData);
    setService(prev => prev ? {
      ...prev,
      reuniones: prev.reuniones.map(r => r.id === id ? data : r),
    } : prev);
    return data;
  };

  const removeReunion = async (id) => {
    await api.delete(`/ujier-reuniones/${id}`);
    setService(prev => prev ? {
      ...prev,
      reuniones: prev.reuniones.filter(r => r.id !== id),
    } : prev);
  };

  return {
    service, loading,
    fetchService, updateService,
    addAssignment, updateAssignment, removeAssignment,
    addReunion, updateReunion, removeReunion,
  };
}
