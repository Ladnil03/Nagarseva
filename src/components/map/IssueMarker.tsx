import React from 'react';
import { CivicIssue } from '../../types';

interface IssueMarkerProps {
  issue: CivicIssue;
  onClick?: (issue: CivicIssue) => void;
}

export default function IssueMarker({ issue, onClick }: IssueMarkerProps) {
  return (
    <div
      onClick={() => onClick && onClick(issue)}
      className="cursor-pointer p-1 rounded-full bg-[#B3211E] text-white flex items-center justify-center shadow-md border-2 border-white hover:scale-110 transition-transform"
    >
      <span className="text-[10px] font-bold px-1">{issue.id}</span>
    </div>
  );
}
