import { Request, Response } from 'express';
import { wardScores } from '../dbStore';

export default async function getWardHealth(req: Request, res: Response) {
  try {
    // Sort worst first (health score ASC)
    const sortedScores = [...wardScores].sort((a, b) => a.healthScore - b.healthScore);
    return res.status(200).json(sortedScores);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
