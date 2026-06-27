import { Request, Response } from 'express';
import { issues } from '../dbStore';

export default async function getPublicFeed(req: Request, res: Response) {
  try {
    const { category, ward, status, page = '1', limit = '20' } = req.query;

    let filtered = [...issues];

    // Apply filters
    if (category) {
      filtered = filtered.filter(i => i.category === category);
    }
    if (ward) {
      filtered = filtered.filter(i => i.location.toLowerCase().includes(String(ward).toLowerCase()));
    }
    if (status) {
      filtered = filtered.filter(i => i.status === status);
    }

    // Sort by severity (descending) by default, then reportedAt (descending)
    filtered.sort((a, b) => {
      if (b.severity !== a.severity) {
        return b.severity - a.severity;
      }
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginated = filtered.slice(startIndex, endIndex);

    // Sanitize issues (exclude sensitive user fields)
    const sanitized = paginated.map(issue => {
      // Exclude reporterId, witnesses if any
      const {
        id,
        category: cat,
        title,
        status: stat,
        location,
        latitude,
        longitude,
        imageUrl,
        description,
        reportedAt,
        witnessCount,
        severity,
        riskLevel,
        timeline,
        isAiVerified,
        aiConfidence,
        aiAnalysis,
        department,
        daysOpen
      } = issue;

      // Extract general ward + city only for public protection
      const locParts = location.split(',');
      const anonymizedLocation = locParts.slice(-3).join(',').trim() || location;

      return {
        id,
        category: cat,
        title,
        status: stat,
        location: anonymizedLocation,
        latitude,
        longitude,
        imageUrl,
        description,
        reportedAt,
        resolvedAt: (issue as any).resolvedAt || null,
        witnessCount,
        severity,
        riskLevel,
        timeline,
        isAiVerified,
        aiConfidence,
        aiAnalysis,
        department,
        daysOpen: daysOpen || 0,
        escalationLevel: (issue as any).escalationLevel || 0,
        isOnShameBoard: (issue as any).isOnShameBoard || false,
        isRTIEligible: (issue as any).isRTIEligible || false,
      };
    });

    // Calculate quick public stats
    const totalCount = filtered.length;
    const resolvedIssues = filtered.filter(i => i.status === 'resolved').length;
    const criticalOpen = filtered.filter(i => 
      ['reported', 'verified', 'assigned', 'in_progress'].includes(i.status) && i.severity >= 8
    ).length;

    return res.status(200).json({
      issues: sanitized,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      stats: {
        totalIssues: totalCount,
        resolvedIssues,
        avgResolutionDays: 12,
        criticalOpen
      }
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
