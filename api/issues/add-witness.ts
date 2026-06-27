import { Request, Response } from 'express';
import { issues, addNotification } from '../dbStore';

// In-memory tracker for witness logs: { [issueId]: [userIds] }
const witnessTracker: Record<string, string[]> = {};

export default async function addWitness(req: Request, res: Response) {
  const { issueId, userId } = req.body;

  if (!issueId || !userId) {
    return res.status(400).json({ error: 'Missing issueId or userId' });
  }

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ error: 'Civic issue not found' });
  }

  // Ensure tracker initialized for this issue
  if (!witnessTracker[issueId]) {
    witnessTracker[issueId] = [];
  }

  const witnessesList = witnessTracker[issueId];

  // Check if user already witnessed
  if (witnessesList.includes(userId)) {
    return res.status(409).json({ error: 'User has already witnessed this issue.' });
  }

  // Simple check for self witnessing
  if (userId === 'self-reporter-id') {
    return res.status(400).json({ error: "You cannot co-sign or witness your own reported issue." });
  }

  // Register witness
  witnessesList.push(userId);
  issue.witnessCount += 1;

  // Track if issue crosses 5 witnesses → mark verification eligible
  const isEligibleNow = issue.witnessCount >= 5;
  const isVerificationEligible = (issue as any).verificationEligible;

  if (isEligibleNow && !isVerificationEligible) {
    (issue as any).verificationEligible = true;
    (issue as any).verificationRequestedAt = new Date().toISOString();
    
    // Create notifications for nearby active users
    addNotification({
      userId: 'all',
      type: 'verification_needed',
      issueId: issue.id,
      title: '🔍 Verification Required',
      body: `Issue "${issue.title}" has reached 5 witnesses and requires community photo verification.`,
      actionUrl: '/citizen/verify',
      isRead: false
    });
  }

  // Award points notification
  addNotification({
    userId,
    type: 'points_earned',
    issueId: issue.id,
    title: '✨ NagarPoints Awarded',
    body: `You received 20 points for co-signing and witnessing ticket #${issue.id}.`,
    actionUrl: '/citizen_dashboard',
    isRead: false
  });

  return res.status(200).json({
    success: true,
    witnessCount: issue.witnessCount,
    verificationEligible: (issue as any).verificationEligible || false,
    pointsAwarded: 20
  });
}
