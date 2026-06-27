import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiService';

export function useNotifications() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      try {
        const list = await apiRequest<any[]>('/api/notifications');
        if (list && list.length > 0) {
          setNotifications(list.map(n => n.body || n.title));
        }
      } catch (err) {
        console.warn('Failed to load notifications from API, using fallback logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev]);
  };

  return { notifications, loading, addNotification };
}
