import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface TransparencyStatsProps {
  stats: {
    totalIssues: number;
    resolvedIssues: number;
    avgResolutionDays: number;
    criticalOpen: number;
  };
}

export default function TransparencyStats({ stats }: TransparencyStatsProps) {
  const resolutionPct = stats.totalIssues > 0 
    ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100) 
    : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-800">
      {/* KPI 1 */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
        <div className="p-2.5 bg-indigo-50 text-[#1F3A5F] rounded-md">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-400">Total Grievances</div>
          <div className="text-xl font-bold font-sans tracking-tight text-slate-900">{stats.totalIssues}</div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-md">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-400">Resolved Cases</div>
          <div className="text-xl font-bold font-sans tracking-tight text-emerald-700">
            {stats.resolvedIssues} <span className="text-xs text-slate-400">({resolutionPct}%)</span>
          </div>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-md">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-400">Avg Resolution</div>
          <div className="text-xl font-bold font-sans tracking-tight text-slate-900">{stats.avgResolutionDays} Days</div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
        <div className="p-2.5 bg-rose-50 text-[#FF4858] rounded-md">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-400">Critical Open</div>
          <div className="text-xl font-bold font-sans tracking-tight text-[#FF4858]">{stats.criticalOpen}</div>
        </div>
      </div>
    </div>
  );
}
