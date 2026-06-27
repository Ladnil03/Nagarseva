import { useState } from 'react';
import { submitVerification, disputeClosure } from '../services/verificationService';

export function useVerifications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyIssue = async (issueId: string, photoURL: string, verdict: 'confirmed' | 'disputed', userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitVerification(issueId, photoURL, verdict, userId);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Verification submission failed');
      throw err;
    }
  };

  const fileDispute = async (issueId: string, disputePhotoURL: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await disputeClosure(issueId, disputePhotoURL, userId);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Dispute filing failed');
      throw err;
    }
  };

  return {
    verifyIssue,
    fileDispute,
    loading,
    error
  };
}
