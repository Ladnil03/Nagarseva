import { Request, Response } from 'express';
import { issues } from '../dbStore';

export default async function checkSLA(req: Request, res: Response) {
  try {
    const wardFilter = req.query.ward as string;

    const overdueIssues = issues.filter(issue => {
      if (['resolved'].includes(issue.status)) return false;
      if (wardFilter && !issue.location.includes(wardFilter)) return false;

      const reportedDate = new Date(issue.reportedAt);
      const daysOpen = Math.floor((Date.now() - reportedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysOpen >= 7 || (issue as any).escalationLevel !== undefined;
    });

    const breaches = overdueIssues.map(issue => {
      const reportedDate = new Date(issue.reportedAt);
      const daysSinceReport = Math.floor((Date.now() - reportedDate.getTime()) / (1000 * 60 * 60 * 24));
      const escalationLevel = (issue as any).escalationLevel !== undefined ? (issue as any).escalationLevel : -1;

      const levelNames = ['Ward Officer Warning', 'Commissioner Level', 'Collector Level (Public Shame)', 'RTI Eligible'];
      const escalationLevelName = escalationLevel >= 0 ? levelNames[escalationLevel] || 'Overdue' : 'Ward Overdue';

      return {
        issueId: issue.id,
        title: issue.title,
        category: issue.category,
        location: issue.location,
        daysSinceReport,
        escalationLevel,
        escalationLevelName,
        severity: issue.severity,
        reporterName: 'Resident Voter'
      };
    });

    const criticalCount = breaches.filter(b => b.escalationLevel >= 1).length;

    return res.status(200).json({
      breaches,
      totalBreaches: breaches.length,
      criticalCount
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
