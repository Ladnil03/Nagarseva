import React from 'react';
import { ShieldAlert, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';

interface WardHealthCardProps {
  wardName: string;
  healthScore: number;
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
}

export default function WardHealthCard({
  wardName,
  healthScore,
  totalIssues,
  openIssues,
  resolvedIssues,
}: WardHealthCardProps) {
  // Determine color based on health score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#3F6B4E] bg-[#3F6B4E]/10 border-[#3F6B4E]/30';
    if (score >= 50) return 'text-[#E8B33D] bg-[#E8B33D]/10 border-[#E8B33D]/30';
    return 'text-[#B3211E] bg-[#B3211E]/10 border-[#B3211E]/30';
  };

  return (
    <div className="bg-[#FFFBF4] border border-[#1F3A5F]/15 p-5 rounded-[2px] card-shadow space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-[#1F3A5F]/60 uppercase block">
            Ward Territory Analytics
          </span>
          <h3 className="text-sm font-serif font-black text-[#1F3A5F] uppercase mt-0.5">
            {wardName || 'HAL 2nd Stage Ward 142'}
          </h3>
        </div>

        <div className={`px-2.5 py-1.5 border rounded-[1px] text-center shrink-0 ${getScoreColor(healthScore)}`}>
          <span className="text-[8px] font-mono font-bold tracking-widest block uppercase">
            Health Score
          </span>
          <span className="text-xl font-serif font-black leading-none block mt-0.5">
            {healthScore}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="border border-[#1F3A5F]/10 p-2.5 text-center bg-white">
          <span className="text-[18px] font-serif font-black text-[#1F3A5F] block">
            {totalIssues}
          </span>
          <span className="text-[8px] font-mono font-bold text-[#1F3A5F]/55 block uppercase">
            Total Filed
          </span>
        </div>

        <div className="border border-[#1F3A5F]/10 p-2.5 text-center bg-white">
          <span className="text-[18px] font-serif font-black text-[#B3211E] block">
            {openIssues}
          </span>
          <span className="text-[8px] font-mono font-bold text-[#1F3A5F]/55 block uppercase">
            Active Cases
          </span>
        </div>

        <div className="border border-[#1F3A5F]/10 p-2.5 text-center bg-white">
          <span className="text-[18px] font-serif font-black text-[#3F6B4E] block">
            {resolvedIssues}
          </span>
          <span className="text-[8px] font-mono font-bold text-[#1F3A5F]/55 block uppercase">
            Resolved
          </span>
        </div>
      </div>

      {healthScore < 60 && (
        <div className="p-2.5 bg-[#B3211E]/5 border border-[#B3211E]/20 text-[#B3211E] rounded-[1px] text-[10px] font-mono flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>SLA INCIDENTS ESCALATING. CRITICAL ACTION SUGGESTED.</span>
        </div>
      )}
    </div>
  );
}
