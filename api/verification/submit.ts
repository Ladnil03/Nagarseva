import { Request, Response } from 'express';
import { issues, addNotification } from '../dbStore';

// In-memory collections
const verificationsList: any[] = [];
const reputationTracker: Record<string, number> = {}; // { [userId]: reputation }

export default async function submitVerification(req: Request, res: Response) {
  const { issueId, photoURL, verdict, userId } = req.body;

  if (!issueId || !userId) {
    return res.status(400).json({ error: 'Missing issueId or userId' });
  }

  if (!photoURL) {
    return res.status(400).json({ error: 'Photo evidence required for verification' });
  }

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ error: 'Civic issue not found' });
  }

  // 1. Validation checks
  if (['resolved', 'chronic', 'falsely_closed'].includes(issue.status)) {
    return res.status(400).json({ error: 'This issue is no longer in a status that allows community verification.' });
  }

  // Check if verifier is already listed in the verifications list
  const alreadyVerified = verificationsList.some(v => v.issueId === issueId && v.userId === userId);
  if (alreadyVerified) {
    return res.status(409).json({ error: 'You have already submitted verification for this issue.' });
  }

  // 2. Mock reputation score check (reputation between 0-100, default 50)
  if (reputationTracker[userId] === undefined) {
    reputationTracker[userId] = 50;
  }
  const reputation = reputationTracker[userId];
  const weight = reputation / 100;

  // 3. Simulated Gemini verification comparison
  const isCorrectVerdict = (verdict === 'confirmed'); // Assuming confirmed is correct for seed data
  
  // Update reputation based on verdict accuracy
  if (isCorrectVerdict) {
    reputationTracker[userId] = Math.min(100, reputation + 2);
  } else {
    reputationTracker[userId] = Math.max(0, reputation - 1);
  }

  // 4. Save verification record
  const newVerification = {
    id: `ver-${Date.now()}`,
    issueId,
    userId,
    photoURL,
    verdict,
    weight,
    createdAt: new Date().toISOString()
  };
  verificationsList.push(newVerification);

  // 5. Update issue results
  if (!issue.timeline) issue.timeline = [];
  
  // Track verification results on the issue object
  if (!(issue as any).verificationResults) {
    (issue as any).verificationResults = { confirmed: 0, disputed: 0, totalResponses: 0 };
  }
  const results = (issue as any).verificationResults;
  
  if (verdict === 'confirmed') {
    results.confirmed += 1;
  } else {
    results.disputed += 1;
  }
  results.totalResponses += 1;

  // Append a timeline log
  issue.timeline.push({
    id: `ver-step-${Date.now()}`,
    title: `Community Verify: ${verdict.toUpperCase()}`,
    status: 'done',
    meta: `Verified by Citizen (Reputation weight: ${weight.toFixed(1)})`,
    timestamp: 'Just Now'
  });

  let message = 'Verification registered. Thank you for making your ward safer!';
  let verifiedTransition = false;

  // Minimum 3 confirmed verifications to upgrade to 'verified'
  if (results.confirmed >= 3 && issue.status === 'reported') {
    issue.status = 'verified';
    (issue as any).communityVerifiedAt = new Date().toISOString();
    verifiedTransition = true;
    message = '🎉 SUCCESS: 3+ Community verifications received. Ticket status upgraded to VERIFIED!';
    
    // Notify original reporter
    addNotification({
      userId: 'reporter', // Mock original reporter
      type: 'issue_resolved',
      issueId: issue.id,
      title: '✓ Issue Verified!',
      body: `Your reported issue "${issue.title}" has been verified by the community and routed to BBMP prioritised queue.`,
      actionUrl: '/citizen_dashboard',
      isRead: false
    });

    // Notify all verifiers they earned points
    addNotification({
      userId,
      type: 'points_earned',
      issueId: issue.id,
      title: '🏆 Verification Success +50 PTS',
      body: `Your verified issue was confirmed by the collective grid. Earned 50 points!`,
      actionUrl: '/citizen_dashboard',
      isRead: false
    });
  } else {
    // Single verification points
    addNotification({
      userId,
      type: 'points_earned',
      issueId: issue.id,
      title: '✨ Verify Points Earned',
      body: `Submitted community verification for #${issue.id}. +30 NagarPoints added.`,
      actionUrl: '/citizen_dashboard',
      isRead: false
    });
  }

  return res.status(200).json({
    success: true,
    message,
    verifiedTransition,
    verificationId: newVerification.id,
    newReputation: reputationTracker[userId],
    pointsAwarded: verifiedTransition ? 50 : 30
  });
}
