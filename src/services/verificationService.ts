import { CivicIssue } from '../types';

export async function submitVerification(issueId: string, photoURL: string, verdict: 'confirmed' | 'disputed', userId: string) {
  const response = await fetch('/api/verification/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueId, photoURL, verdict, userId })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to submit verification');
  }
  return response.json();
}

export async function disputeClosure(issueId: string, disputePhotoURL: string, userId: string) {
  const response = await fetch('/api/verification/dispute-closure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueId, disputePhotoURL, userId })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to submit dispute');
  }
  return response.json();
}

export async function comparePhotos(originalPhotoURL: string, newPhotoURL: string, comparisonType: 'verification' | 'closure_audit') {
  const response = await fetch('/api/verification/compare-photos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalPhotoURL, newPhotoURL, comparisonType })
  });
  if (!response.ok) {
    throw new Error('Photo analysis comparison failed');
  }
  return response.json();
}
