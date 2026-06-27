import { Request, Response } from 'express';
import { issues, addNotification, recalculateWardScores } from '../dbStore';

export default async function updateStatus(req: Request, res: Response) {
  const { id, status, workerName, expectedDate, imageUrl, actionComment, department } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'Missing required issue ID or new status.' });
  }

  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  // Enforce validation state machine: reported -> verified -> assigned -> in_progress -> resolved
  // Cannot skip steps or go backwards except for custom flags
  const allowedTransitions: Record<string, string[]> = {
    reported: ['verified', 'assigned'],
    verified: ['assigned'],
    assigned: ['in_progress'],
    in_progress: ['resolved'],
    disputed: ['assigned', 'in_progress'],
    falsely_closed: ['assigned', 'in_progress'],
    chronic: ['assigned', 'in_progress'],
    resolved: ['disputed'] // Citizen can dispute a resolved ticket
  };

  const allowed = allowedTransitions[issue.status] || [];
  if (!allowed.includes(status) && status !== issue.status) {
    return res.status(400).json({ 
      error: `Invalid status transition. Status '${issue.status}' cannot move directly to '${status}'.` 
    });
  }

  // Enforce evidence requirements
  if (status === 'assigned') {
    if (!workerName || !expectedDate) {
      return res.status(400).json({ error: 'Assignment requires a Worker Name and Expected Resolution Date.' });
    }
  } else if (status === 'in_progress') {
    if (!imageUrl) {
      return res.status(400).json({ error: 'Entering In-Progress repairs requires uploading photo evidence of work started.' });
    }
  } else if (status === 'resolved') {
    if (!imageUrl) {
      return res.status(400).json({ error: 'Closing a grievance as RESOLVED requires uploading a final photo of completed repair.' });
    }
  }

  // Apply changes
  const oldStatus = issue.status;
  issue.status = status;
  if (department) {
    issue.department = department;
  }
  if (imageUrl) {
    issue.imageUrl = imageUrl;
  }

  // Create timeline record
  if (!issue.timeline) issue.timeline = [];
  issue.timeline.forEach(step => {
    if (step.status === 'active') step.status = 'done';
  });

  const stepId = `step-${Date.now()}`;
  let stepTitle = 'Status Updated';
  let metaInfo = actionComment || `Status upgraded from ${oldStatus} to ${status}`;

  if (status === 'assigned') {
    stepTitle = 'Assigned to Ground Crew';
    metaInfo = `Worker: ${workerName}. Expected completion: ${expectedDate}.`;
    (issue as any).assignedWorker = workerName;
    (issue as any).expectedCompletionDate = expectedDate;
  } else if (status === 'in_progress') {
    stepTitle = 'Repairs Commenced';
    metaInfo = actionComment || 'Maintenance team has dispatched and initiated work operations.';
  } else if (status === 'resolved') {
    stepTitle = 'Repairs Completed ✓';
    metaInfo = actionComment || 'Ground crew completed tasks and posted verified structural visual proof.';
    (issue as any).resolvedAt = new Date().toISOString();
    
    // Add citizen notification of resolution
    addNotification({
      userId: 'reporter',
      type: 'issue_resolved',
      issueId: issue.id,
      title: '✓ Your issue has been resolved',
      body: `The municipal team has reported ticket #${issue.id} as resolved. You have 72 hours to audit or raise a dispute if it is still broken.`,
      actionUrl: '/citizen_dashboard',
      isRead: false
    });
  }

  issue.timeline.push({
    id: stepId,
    title: stepTitle,
    status: 'active',
    meta: metaInfo,
    timestamp: 'Just Now'
  });

  recalculateWardScores();

  return res.status(200).json(issue);
}
