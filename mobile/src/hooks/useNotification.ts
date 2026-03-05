import { useState, useCallback } from 'react';

interface Notification {
  msg: string;
  type: 'success' | 'error' | 'info';
}

export function useNotification() {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotif = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  }, []);

  return { notification, showNotif };
}
