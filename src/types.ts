export type IssueCategory =
  | 'Road Pothole'
  | 'Overflowing Garbage'
  | 'Broken Streetlight'
  | 'Sewage Leakage'
  | 'Damaged Public Property'
  | 'Other';

export type IssueStatus =
  | 'reported'
  | 'verified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'disputed'
  | 'falsely_closed'
  | 'chronic';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface TimelineStep {
  id: string;
  title: string;
  status: 'done' | 'active' | 'pending';
  meta?: string;
  timestamp?: string;
}

export interface CivicIssue {
  id: string;
  category: IssueCategory;
  title: string;
  status: IssueStatus;
  location: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  description: string;
  reportedAt: string;
  witnessCount: number;
  severity: number; // 1 to 10
  riskLevel: RiskLevel;
  timeline: TimelineStep[];
  isAiVerified: boolean;
  aiConfidence?: number;
  aiAnalysis?: {
    category: string;
    damageDescription: string;
    confidence: number;
    recommendedAction: string;
  };
  department?: string;
  daysOpen?: number;
}

export interface UserProfile {
  name: string;
  points: number;
  level: string;
  avatarInitials: string;
  rank: number;
  wardName: string;
  resolvedCount: number;
  reportedCount: number;
  verificationsCount: number;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number; // percentage
}
