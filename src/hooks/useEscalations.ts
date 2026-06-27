import { useState, useEffect } from 'react';
import { checkSLAs, triggerManualEscalation, runEscalationCron } from '../services/escalationService';

export function useEscalations(ward?: string) {
  const [breaches, setBreaches] = useState<any[]>([]);
  const [totalBreaches, setTotalBreaches] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchSLAs = async () => {
    setLoading(true);
    try {
      const data = await checkSLAs(ward);
      setBreaches(data.breaches || []);
      setTotalBreaches(data.totalBreaches || 0);
      setCriticalCount(data.criticalCount || 0);
    } catch (err) {
      console.error('Error fetching SLAs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSLAs();
  }, [ward]);

  const escalateIssue = async (issueId: string, reason: string) => {
    await triggerManualEscalation(issueId, reason);
    await fetchSLAs();
  };

  const triggerSlaCron = async () => {
    await runEscalationCron();
    await fetchSLAs();
  };

  return {
    breaches,
    totalBreaches,
    criticalCount,
    loading,
    escalateIssue,
    triggerSlaCron,
    refreshBreaches: fetchSLAs
  };
}
