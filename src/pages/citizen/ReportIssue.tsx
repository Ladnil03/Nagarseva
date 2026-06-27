import React from 'react';
import ReportWizard from '../../components/ReportWizard';

interface ReportIssueProps {
  onBackToDashboard: () => void;
  onSubmitIssue: (issuePayload: any) => void;
  onAddPoints: (pts: number, reason: string) => void;
  currentCity?: string;
  activeWard?: string;
}

export default function ReportIssuePage(props: ReportIssueProps) {
  return <ReportWizard {...props} />;
}
