import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/apiService';

export function usePoints() {
  const { userProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const awardPoints = async (pts: number, reason: string) => {
    setLoading(true);
    try {
      await apiRequest('/api/points/award', 'POST', { points: pts, reason });
      await refreshProfile();
    } catch (err) {
      console.warn('Backend points submission failed, simulating offline:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    points: userProfile?.points || 0,
    level: userProfile?.level || 'Nagar Naagrik',
    awardPoints,
    loading
  };
}
