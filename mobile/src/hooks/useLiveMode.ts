import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/client';

const AUTO_DELETE_SECONDS = 5;

export function useLiveMode(
  cultoDetail: any,
  setCultoDetail: (fn: (prev: any) => any) => void,
  fetchCultoDetail: (id: number) => Promise<void>,
) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autoDeleteCountdown, setAutoDeleteCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoDeleteRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLive = !!cultoDetail?.started_at;
  const allCompleted = isLive && cultoDetail?.programa?.length > 0 &&
    cultoDetail.programa.every((item: any) => item.completed_at);

  // Main timer
  useEffect(() => {
    if (!isLive || !cultoDetail?.started_at) {
      setElapsedSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const startTime = new Date(cultoDetail.started_at).getTime();
    const tick = () => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    };
    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isLive, cultoDetail?.started_at]);

  // Auto-delete countdown
  useEffect(() => {
    if (!allCompleted || !isLive) {
      setAutoDeleteCountdown(null);
      if (autoDeleteRef.current) clearInterval(autoDeleteRef.current);
      return;
    }

    if (!cultoDetail.completed_all_at) {
      setCultoDetail((prev: any) => prev ? { ...prev, completed_all_at: new Date().toISOString() } : prev);
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

    return () => { if (autoDeleteRef.current) clearInterval(autoDeleteRef.current); };
  }, [allCompleted, isLive, cultoDetail?.completed_all_at]);

  const activeItemId = isLive
    ? cultoDetail?.programa?.find((item: any) => !item.completed_at)?.id || null
    : null;

  const getItemElapsedSeconds = useCallback((item: any) => {
    if (!isLive || !cultoDetail?.started_at) return 0;
    if (item.completed_at) return 0;
    if (item.id !== activeItemId) return 0;

    const programa = cultoDetail.programa || [];
    let itemStartTime = new Date(cultoDetail.started_at).getTime();
    for (const p of programa) {
      if (p.id === item.id) break;
      if (p.completed_at) {
        itemStartTime = new Date(p.completed_at).getTime();
      }
    }

    return Math.max(0, Math.floor((Date.now() - itemStartTime) / 1000));
  }, [isLive, cultoDetail, activeItemId]);

  const startCulto = useCallback(async (cultoId: number) => {
    const { data } = await api.post(`/cultos/${cultoId}/start`);
    setCultoDetail((prev: any) => prev ? {
      ...prev,
      started_at: data.started_at,
      completed_all_at: null,
      programa: prev.programa.map((p: any) => ({ ...p, completed_at: null })),
    } : prev);
  }, [setCultoDetail]);

  const stopCulto = useCallback(async (cultoId: number) => {
    await api.post(`/cultos/${cultoId}/stop`);
    setCultoDetail((prev: any) => prev ? {
      ...prev,
      started_at: null,
      completed_all_at: null,
      programa: prev.programa.map((p: any) => ({ ...p, completed_at: null })),
    } : prev);
    setAutoDeleteCountdown(null);
  }, [setCultoDetail]);

  const completeItem = useCallback(async (cultoId: number, itemId: number) => {
    const { data } = await api.post(`/cultos/${cultoId}/program-items/${itemId}/complete`);
    setCultoDetail((prev: any) => {
      if (!prev) return prev;
      const newPrograma = prev.programa.map((p: any) =>
        p.id === itemId ? { ...p, completed_at: data.completed_at } : p,
      );
      const allDone = newPrograma.every((p: any) => p.completed_at);
      return {
        ...prev,
        programa: newPrograma,
        completed_all_at: allDone ? new Date().toISOString() : prev.completed_all_at,
      };
    });
  }, [setCultoDetail]);

  const uncompleteItem = useCallback(async (cultoId: number, itemId: number) => {
    await api.post(`/cultos/${cultoId}/program-items/${itemId}/uncomplete`);
    setCultoDetail((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        programa: prev.programa.map((p: any) =>
          p.id === itemId ? { ...p, completed_at: null } : p,
        ),
        completed_all_at: null,
      };
    });
    setAutoDeleteCountdown(null);
  }, [setCultoDetail]);

  const cancelAutoDelete = useCallback(() => {
    setCultoDetail((prev: any) => prev ? { ...prev, completed_all_at: null } : prev);
    setAutoDeleteCountdown(null);
  }, [setCultoDetail]);

  return {
    isLive, allCompleted, elapsedSeconds, autoDeleteCountdown,
    activeItemId, getItemElapsedSeconds,
    startCulto, stopCulto, completeItem, uncompleteItem, cancelAutoDelete,
  };
}
