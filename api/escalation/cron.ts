import { Request, Response } from 'express';
import { issues, addNotification, addEscalation, recalculateWardScores } from '../dbStore';

export default async function escalationCron(req: Request, res: Response) {
  // Let this be callable freely in sandbox, or verify a Bearer secret
  const now = new Date();
  let escalationCount = 0;

  try {
    const openIssues = issues.filter(issue => 
      ['reported', 'verified', 'assigned', 'in_progress', 'disputed'].includes(issue.status)
    );

    openIssues.forEach(issue => {
      const reportedAt = new Date(issue.reportedAt);
      const daysSinceReport = Math.floor(
        (now.getTime() - reportedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Keep issue daysOpen updated
      issue.daysOpen = daysSinceReport;
      
      let currentLevel = (issue as any).escalationLevel || 0;
      let newEscalationLevel = currentLevel;
      let shouldEscalate = false;
      let escalationReason = '';

      if (daysSinceReport >= 45 && currentLevel < 3) {
        newEscalationLevel = 3;
        shouldEscalate = true;
        escalationReason = `Issue unresolved for ${daysSinceReport} days — RTI eligible`;
        (issue as any).isRTIEligible = true;
      } else if (daysSinceReport >= 30 && currentLevel < 2) {
        newEscalationLevel = 2;
        shouldEscalate = true;
        escalationReason = `Issue unresolved for ${daysSinceReport} days — Public shame board`;
        (issue as any).isOnShameBoard = true;
      } else if (daysSinceReport >= 15 && currentLevel < 1) {
        newEscalationLevel = 1;
        shouldEscalate = true;
        escalationReason = `Issue unresolved for ${daysSinceReport} days — Commissioner level`;
      } else if (daysSinceReport >= 7 && currentLevel < 0) {
        newEscalationLevel = 0; // Reminded
        shouldEscalate = true;
        escalationReason = `Issue unresolved for ${daysSinceReport} days — Ward officer reminded`;
      }

      if (shouldEscalate) {
        escalationCount++;
        (issue as any).escalationLevel = newEscalationLevel;
        (issue as any).updatedAt = now.toISOString();

        // Create escalation record
        addEscalation({
          issueId: issue.id,
          issueTitle: issue.title,
          fromLevel: currentLevel,
          toLevel: newEscalationLevel,
          daysSinceReport,
          reason: escalationReason,
          ward: issue.location,
          category: issue.category,
          severity: issue.severity
        });

        // Notify reporter
        addNotification({
          userId: 'reporter',
          type: 'escalation',
          issueId: issue.id,
          title: '📢 Grievance Escalated!',
          body: escalationReason,
          actionUrl: '/citizen_dashboard',
          isRead: false
        });

        // Update issue timeline
        if (!issue.timeline) issue.timeline = [];
        issue.timeline.push({
          id: `esc-step-${Date.now()}`,
          title: `SLA Breach: Level ${newEscalationLevel}`,
          status: 'active',
          meta: escalationReason,
          timestamp: 'Just Now'
        });
      }
    });

    // Recalculate ward scores
    recalculateWardScores();

    return res.status(200).json({
      success: true,
      escalationsTriggered: escalationCount,
      processedAt: now.toISOString()
    });

  } catch (error: any) {
    console.error('Escalation cron error:', error);
    return res.status(500).json({ error: error.message });
  }
}
