import React from 'react';
import CitizenDashboard from '../../components/CitizenDashboard';
import { UserProfile, AchievementBadge, CivicIssue } from '../../types';

interface DashboardPageProps {
  user: UserProfile;
  badges: AchievementBadge[];
  issues: CivicIssue[];
  onReportClick: () => void;
  onUpvoteIssue: (id: string) => void;
  onAddPoints: (pts: number, reason: string) => void;
}

export default function DashboardPage(props: DashboardPageProps) {
  return <CitizenDashboard {...props} />;
}
