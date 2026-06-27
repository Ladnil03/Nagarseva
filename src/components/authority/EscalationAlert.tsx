import React from 'react';
import { Skull, AlertOctagon, Flame, FileText, ChevronRight } from 'lucide-react';

interface EscalationAlertProps {
  breaches: {
    issueId: string;
    title: string;
    category: string;
    location: string;
    daysSinceReport: number;
    escalationLevel: number;
    escalationLevelName: string;
    severity: number;
    reporterName: string;
  }[];
  onResolveOverdue: (issueId: string) => void;
}

export default function EscalationAlert({ breaches, onResolveOverdue }: EscalationAlertProps) {
  if (breaches.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg text-emerald-800 text-xs font-medium text-center font-sans">
        ✓ Pristine Record: No active SLA breaches or escalated tickets recorded in your ward division.
      </div>
    );
  }

  // Group by level name
  return (
    <div className="space-y-4 font-sans text-slate-800">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <AlertOctagon className="w-5 h-5 text-rose-500 animate-bounce" />
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">
          Urgent Action Queue: SLA Breach Records ({breaches.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {breaches.map(breach => {
          const isShame = breach.escalationLevel >= 2;
          const isRti = breach.escalationLevel >= 3;

          return (
            <div 
              key={breach.issueId}
              className={`p-4 rounded-lg border shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                isRti ? 'bg-red-950/20 border-red-900/60' :
                isShame ? 'bg-rose-950/10 border-rose-900/40' :
                'bg-amber-50/40 border-amber-200/60'
              }`}
            >
              {/* Header Details */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 bg-slate-900 text-white font-mono text-[9px] font-bold rounded">
                    #{breach.issueId}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wide flex items-center gap-0.5 ${
                    isRti ? 'bg-red-800 text-white animate-pulse' :
                    isShame ? 'bg-[#FF4858] text-white' :
                    'bg-[#FF6B35] text-white'
                  }`}>
                    {isRti ? <FileText className="w-3 h-3" /> : isShame ? <Skull className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
                    {breach.escalationLevelName.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                  {breach.title}
                </h4>

                <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
                  <div>🏢 Area: {breach.location}</div>
                  <div>🚨 Unresolved for: <span className="text-[#FF4858] font-bold">{breach.daysSinceReport} Days</span> (SLA Limit: 7 days)</div>
                </div>
              </div>

              {/* Responsible official statement */}
              <div className="bg-slate-900/5 p-2 rounded text-[10px] font-mono text-slate-500 italic">
                {breach.escalationLevel === 3 ? (
                  <span>⚠️ Citizen is legally eligible to submit a statutory RTI notice against the BBMP.</span>
                ) : breach.escalationLevel === 2 ? (
                  <span>⚠️ Issue added to the Public Shame Board. Department reputation is actively degrading.</span>
                ) : breach.escalationLevel === 1 ? (
                  <span>⚠️ Complaint escalated to BBMP Commissioner level review. Explanations required.</span>
                ) : (
                  <span>⚠️ Ward Officer reminder warning logged. Initial SLA window exceeded.</span>
                )}
              </div>

              {/* Resolve action */}
              <button
                onClick={() => onResolveOverdue(breach.issueId)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase rounded font-mono flex items-center justify-center gap-1 transition-colors"
              >
                Inspect & Resolve <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
