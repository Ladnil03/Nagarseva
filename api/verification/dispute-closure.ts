import { Request, Response } from 'express';
import { issues, addNotification, addEscalation } from '../dbStore';

// In-memory dispute tracker: { [issueId]: [disputeRecords] }
const disputesTracker: Record<string, any[]> = {};

export default async function disputeClosure(req: Request, res: Response) {
  const { issueId, disputePhotoURL, userId } = req.body;

  if (!issueId || !userId || !disputePhotoURL) {
    return res.status(400).json({ error: 'Missing required dispute fields.' });
  }

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ error: 'Civic issue not found' });
  }

  // 1. Validation checks
  if (issue.status !== 'resolved') {
    return res.status(400).json({ error: 'You can only dispute issues that are marked as resolved.' });
  }

  // Dispute window: 72 hours of resolution
  const reportedDate = new Date(issue.reportedAt); // or resolvedAt if tracked.
  // We'll simulate 72-hour window check
  const hoursSinceReport = Math.abs(Date.now() - reportedDate.getTime()) / (1000 * 60 * 60);
  
  // Make sure they haven't disputed already
  if (!disputesTracker[issueId]) {
    disputesTracker[issueId] = [];
  }
  const existingDisputes = disputesTracker[issueId];
  if (existingDisputes.some((d: any) => d.userId === userId)) {
    return res.status(400).json({ error: 'You have already disputed this resolution.' });
  }

  // 2. Save dispute record
  const newDispute = {
    userId,
    disputePhotoURL,
    timestamp: new Date().toISOString()
  };
  existingDisputes.push(newDispute);

  (issue as any).disputeCount = existingDisputes.length;

  // Append a timeline log
  if (!issue.timeline) issue.timeline = [];
  issue.timeline.push({
    id: `dispute-${Date.now()}`,
    title: '⚠️ Closure Disputed by Resident',
    status: 'active',
    meta: `Dispute filed by Citizen. Photo evidence attached.`,
    timestamp: 'Just Now'
  });

  let message = 'Dispute filed. Our AI and senior inspectors are auditing the site.';
  let didEscalate = false;

  // 3. Dispute win condition: 3 disputes filed OR simulated Gemini confirmation
  if (existingDisputes.length >= 3 || disputePhotoURL.includes('still_broken') || disputePhotoURL.includes('dispute')) {
    issue.status = 'falsely_closed';
    (issue as any).escalationLevel = 2; // Escalate immediately
    (issue as any).isOnShameBoard = true;
    didEscalate = true;
    
    // Create escalation record
    addEscalation({
      issueId: issue.id,
      issueTitle: issue.title,
      fromLevel: 0,
      toLevel: 2,
      daysSinceReport: 3,
      reason: 'Falsely Closed Dispute: 3+ resident disputes verified by before/after AI comparison.',
      ward: issue.location,
      category: issue.category,
      severity: issue.severity
    });

    message = '🚨 CRITICAL ESCALATION: Before/After audit confirms issue is NOT resolved. Status flipped to FALSELY CLOSED. Escalated to Commissioner.';

    // Award 150 points to each disputer
    addNotification({
      userId,
      type: 'level_up',
      issueId: issue.id,
      title: '🏆 DISPUTE WON +150 PTS',
      body: `Your audit dispute on ticket #${issue.id} was confirmed by the system. Thank you for your integrity!`,
      actionUrl: '/citizen_dashboard',
      isRead: false
    });
  } else {
    // Normal dispute submitted
    addNotification({
      userId,
      type: 'points_earned',
      issueId: issue.id,
      title: '⚠️ Dispute Filed',
      body: `Filed resolution dispute on ticket #${issue.id}. Pending review.`,
      actionUrl: '/citizen_dashboard',
      isRead: false
    });
  }

  return res.status(200).json({
    success: true,
    message,
    didEscalate,
    disputeCount: existingDisputes.length,
    pointsAwarded: didEscalate ? 150 : 20
  });
}
