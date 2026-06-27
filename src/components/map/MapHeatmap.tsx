import React from 'react';
import { CivicIssue } from '../../types';

interface MapHeatmapProps {
  issues: CivicIssue[];
  visible: boolean;
}

export default function MapHeatmap({ issues, visible }: MapHeatmapProps) {
  if (!visible) return null;

  return (
    <div className="absolute top-4 right-4 bg-[#1F3A5F] text-[#FFFBF4] border border-[#FFFBF4]/15 px-3 py-2 rounded-[2px] font-mono text-[9px] shadow-md z-10 uppercase tracking-widest font-bold">
      🔥 HEATMAP VIEW ACTIVE: {issues.length} POINTS
    </div>
  );
}
