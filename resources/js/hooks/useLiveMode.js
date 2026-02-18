import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/client';

const AUTO_DELETE_SECONDS = 5; // 5 seconds

export function useLiveMode(cultoDetail, setCultoDetail, fetchCultoDetail) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autoDeleteCountdown, setAutoDeleteCountdown] = useState(null);
  const timerRef = useRef(null);
  const autoDeleteRef = useRef(null);

  const isLive = !!cultoDetail?.started_at;
  const allCompleted = isLive && cultoDetail?.programa?.length > 0 &&
    cultoDetail.programa.every(item => item.completed_at);

  // Main timer: counts elapsed seconds since culto started
  useEffect(() => {
    if (!isLive || !cultoDetail?.started_at) {
      setElapsedSeconds(0);
      clearInterval(timerRef.current);
      return;
    }

    const startTime = new Date(cultoDetail.started_at).getTime();
    const tick = () => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    };
    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLive, cultoDetail?.started_at]);

  // Auto-delete countdown when all items completed
  useEffect(() => {
    if (!allCompleted || !isLive) {
      setAutoDeleteCountdown(null);
      clearInterval(autoDeleteRef.current);
      return;
    }

    if (!cultoDetail.completed_all_at) {
      // Mark completed_all_at locally
      setCultoDetail(prev => prev ? { ...prev, completed_all_at: new Date().toISOString() } : prev);
    }

    const completedTime = cultoDetail.completed_all_at
      ? new Date(cultoDetail.completed_all_at).getTime()
      : Date.now();

    const tick = () => {
      const elapsed = Math.floor((Date.now() - completedTime) / 1000);
      const remaining = AUTO_DELETE_SECONDS - elapsed;
      setAutoDeleteCountdown(remaining > 0 ? remaining : 0);
    };
    tick();
    autoDeleteRef.current = setInterval(tick, 1000);

    return () => clearInterval(autoDeleteRef.current);
  }, [allCompleted, isLive, cultoDetail?.completed_all_at]);

  // Find active item (first non-completed item)
  const activeItemId = isLive
    ? cultoDetail?.programa?.find(item => !item.completed_at)?.id || null
    : null;

  // Calculate item elapsed time for the active item
  const getItemElapsedSeconds = useCallback((item) => {
    if (!isLive || !cultoDetail?.started_at) return 0;
    if (item.completed_at) return 0;
    if (item.id !== activeItemId) return 0;

    // Sum durations of all completed items before this one (in seconds)
    const programa = cultoDetail.programa || [];
    let completedDurationSecs = 0;
    for (const p of programa) {
      if (p.id === item.id) break;
      if (p.completed_at) {
        completedDurationSecs += (p.duracion || 0) * 60;
      }
    }

    // Time since culto started minus the duration budget of completed items
    const startTime = new Date(cultoDetail.started_at).getTime();
    const totalElapsed = Math.floor((Date.now() - startTime) / 1000);
    return Math.max(0, totalElapsed - completedDurationSecs);
  }, [isLive, cultoDetail, activeItemId]);

  const startCulto = useCallback(async (cultoId) => {
    const { data } = await api.post(`/cultos/${cultoId}/start`);
    setCultoDetail(prev => prev ? {
      ...prev,
      started_at: data.started_at,
      completed_all_at: null,
      programa: prev.programa.map(p => ({ ...p, completed_at: null })),
    } : prev);
  }, [setCultoDetail]);

  const stopCulto = useCallback(async (cultoId) => {
    await api.post(`/cultos/${cultoId}/stop`);
    setCultoDetail(prev => prev ? {
      ...prev,
      started_at: null,
      completed_all_at: null,
      programa: prev.programa.map(p => ({ ...p, completed_at: null })),
    } : prev);
    setAutoDeleteCountdown(null);
  }, [setCultoDetail]);

  const completeItem = useCallback(async (cultoId, itemId) => {
    const { data } = await api.post(`/cultos/${cultoId}/program-items/${itemId}/complete`);
    setCultoDetail(prev => {
      if (!prev) return prev;
      const newPrograma = prev.programa.map(p =>
        p.id === itemId ? { ...p, completed_at: data.completed_at } : p
      );
      const allDone = newPrograma.every(p => p.completed_at);
      return {
        ...prev,
        programa: newPrograma,
        completed_all_at: allDone ? new Date().toISOString() : prev.completed_all_at,
      };
    });
  }, [setCultoDetail]);

  const uncompleteItem = useCallback(async (cultoId, itemId) => {
    await api.post(`/cultos/${cultoId}/program-items/${itemId}/uncomplete`);
    setCultoDetail(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        programa: prev.programa.map(p =>
          p.id === itemId ? { ...p, completed_at: null } : p
        ),
        completed_all_at: null,
      };
    });
    setAutoDeleteCountdown(null);
  }, [setCultoDetail]);

  const cancelAutoDelete = useCallback(() => {
    setCultoDetail(prev => prev ? { ...prev, completed_all_at: null } : prev);
    setAutoDeleteCountdown(null);
  }, [setCultoDetail]);

  return {
    isLive,
    allCompleted,
    elapsedSeconds,
    autoDeleteCountdown,
    activeItemId,
    getItemElapsedSeconds,
    startCulto,
    stopCulto,
    completeItem,
    uncompleteItem,
    cancelAutoDelete,
  };
}
