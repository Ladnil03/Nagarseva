import { Request, Response } from 'express';
import { issues } from '../dbStore';

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const dPhi = (lat2 - lat1) * Math.PI / 180;
  const dLambda = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dPhi/2) * Math.sin(dPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dLambda/2) * Math.sin(dLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // distance in meters
}

export default async function checkDuplicate(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lat, lng, category } = req.body;

  if (!lat || !lng || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const RADIUS_METERS = 100;
    let duplicateFound = null;
    let closestDistance = Infinity;

    // Filter open issues of same category
    const openIssues = issues.filter(issue => 
      issue.category === category && 
      ['reported', 'verified', 'assigned', 'in_progress'].includes(issue.status)
    );

    openIssues.forEach(issue => {
      if (!issue.latitude || !issue.longitude) return;
      
      const distance = haversineDistance(
        lat, lng,
        issue.latitude,
        issue.longitude
      );
      
      if (distance <= RADIUS_METERS && distance < closestDistance) {
        closestDistance = distance;
        duplicateFound = {
          id: issue.id,
          title: issue.title,
          category: issue.category,
          status: issue.status,
          severity: issue.severity,
          riskLevel: issue.riskLevel,
          witnessCount: issue.witnessCount,
          reportedAt: issue.reportedAt,
          imageUrl: issue.imageUrl,
          location: issue.location,
          distanceMeters: Math.round(distance)
        };
      }
    });

    if (duplicateFound) {
      return res.status(200).json({
        isDuplicate: true,
        existingIssue: duplicateFound,
        message: `Found existing issue ${Math.round(closestDistance)}m away`
      });
    }

    return res.status(200).json({ isDuplicate: false });

  } catch (error: any) {
    console.error('Duplicate check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
