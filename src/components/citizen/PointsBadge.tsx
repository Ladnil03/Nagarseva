import React from 'react';
import { Award } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
  className?: string;
}

export default function PointsBadge({ points, className = '' }: PointsBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FFE66D]/20 text-[#B3211E] text-[10px] font-black border border-[#FFE66D]/50 rounded-[1px] uppercase tracking-wider font-mono select-none ${className}`}
    >
      <Award className="w-3.5 h-3.5" />
      +{points} PTS
    </span>
  );
}
