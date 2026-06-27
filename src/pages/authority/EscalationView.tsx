import React from 'react';
import { CivicIssue } from '../../types';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

interface EscalationViewProps {
  issues: CivicIssue[];
  onDetailClick?: (issue: CivicIssue) => void;
}

export default function EscalationView({ issues, onDetailClick }: EscalationViewProps) {
  // Simulating SLA escalated issues: risk critical/high or daysOpen over SLA threshold
  const escalatedList = issues.filter(issue => issue.riskLevel === 'critical' || issue.status === 'chronic');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-fade-in">
      <div className="border-b border-[#1F3A5F]/15 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#B3211E] uppercase block font-bold">
          ⚠️ ACCOUNTABILITY WATCH-BOARD CELL
        </span>
        <h2 className="text-xl font-serif font-black text-[#1F3A5F] uppercase">
          Escalated Grievance File Queues ({escalatedList.length})
        </h2>
      </div>

      {escalatedList.length === 0 ? (
        <EmptyState
          title="No critical escalations flagged"
          description="Excellent! There are no unresolved complaints violating active SLA targets."
          icon={<ShieldAlert className="w-6 h-6 text-emerald-600" />}
        />
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-[#B3211E]/10 border border-[#B3211E]/20 rounded-[1px] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B3211E] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#1F3A5F] block">
                SLA BREACH PROTOCOL INITIATED
              </span>
              <p className="text-[11px] text-[#1F3A5F]/85 font-sans leading-relaxed">
                The complaints below have crossed active resolution SLA caps. Under state protocols, these issues have been automatically escalated to the Ward Deputy Commissioner for immediate field allocation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escalatedList.map((issue) => (
              <div
                key={issue.id}
                className="bg-[#FFFBF4] border border-[#B3211E]/30 rounded-[2px] p-4 relative card-shadow space-y-3"
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[9px] font-bold text-[#B3211E] bg-[#B3211E]/10 px-1.5 py-0.5 uppercase">
                    ESCALATION LEVEL 2 (COMMISSIONER)
                  </span>
                  <span className="font-mono text-[9px] font-bold text-[#1F3A5F]/60">
                    ID: {issue.id}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold text-[#1F3A5F]/55 uppercase block">
                    {issue.category}
                  </span>
                  <h4 className="font-serif font-black text-sm text-[#1F3A5F] line-clamp-1">
                    {issue.title}
                  </h4>
                  <p className="text-[10px] text-[#1F3A5F]/75 line-clamp-2 mt-1">
                    {issue.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-dashed border-[#1F3A5F]/15 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-[#B3211E] font-black uppercase">
                    {issue.daysOpen || 10} Days Unresolved
                  </span>

                  {onDetailClick && (
                    <button
                      onClick={() => onDetailClick(issue)}
                      className="bg-[#1F3A5F] text-[#FFFBF4] hover:bg-[#152842] text-[9px] font-bold px-2.5 py-1.5 uppercase tracking-wider rounded-[1px] flex items-center gap-1 cursor-pointer"
                    >
                      Audit File <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
