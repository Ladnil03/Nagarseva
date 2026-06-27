import { Request, Response } from 'express';
import { issues, addEscalation, addNotification, recalculateWardScores } from '../dbStore';

export default async function manualTriggerEscalation(req: Request, res: Response) {
  const { issueId, reason } = req.body;

  if (!issueId) {
    return res.status(400).json({ error: 'Missing issueId' });
  }

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const currentLevel = (issue as any).escalationLevel || 0;
  const nextLevel = Math.min(3, currentLevel + 1);

  (issue as any).escalationLevel = nextLevel;
  if (nextLevel >= 2) (issue as any).isOnShameBoard = true;
  if (nextLevel >= 3) (issue as any).isRTIEligible = true;

  addEscalation({
    issueId: issue.id,
    issueTitle: issue.title,
    fromLevel: currentLevel,
    toLevel: nextLevel,
    daysSinceReport: (issue as any).daysOpen || 12,
    reason: reason || 'Manual Admin Overriding Action Triggered.',
    ward: issue.location,
    category: issue.category,
    severity: issue.severity
  });

  addNotification({
    userId: 'reporter',
    type: 'escalation',
    issueId: issue.id,
    title: '📢 Escalation Triggered',
    body: `Grievance #${issue.id} manually escalated to level ${nextLevel} by system override.`,
    actionUrl: '/citizen_dashboard',
    isRead: false
  });

  if (!issue.timeline) issue.timeline = [];
  issue.timeline.push({
    id: `man-esc-${Date.now()}`,
    title: `Administrative Escalation Level ${nextLevel}`,
    status: 'active',
    meta: reason || 'Escalation triggered by supervisor review.',
    timestamp: 'Just Now'
  });

  recalculateWardScores();

  return res.status(200).json({
    success: true,
    newLevel: nextLevel,
    message: `Issue escalated successfully to Level ${nextLevel}`
  });
}
