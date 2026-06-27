import { Request, Response } from 'express';
import { issues, recalculateWardScores } from '../dbStore';

export default async function assignIssue(req: Request, res: Response) {
  const { issueId, department, workerName } = req.body;

  if (!issueId || !department) {
    return res.status(400).json({ error: 'Missing required assignment fields' });
  }

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  issue.department = department;
  issue.status = 'assigned';

  if (!issue.timeline) issue.timeline = [];
  issue.timeline.forEach(step => {
    if (step.status === 'active') step.status = 'done';
  });

  issue.timeline.push({
    id: `assign-${Date.now()}`,
    title: 'Assigned to Ward Division',
    status: 'active',
    meta: `Routed to ${department}. assigned to ${workerName || 'Ground Unit'}.`,
    timestamp: 'Just Now'
  });

  recalculateWardScores();

  return res.status(200).json(issue);
}
