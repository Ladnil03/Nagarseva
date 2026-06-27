import React, { useState } from 'react';
import { CivicIssue } from '../../types';
import { Skull, Twitter, FileText, ChevronRight, AlertTriangle, Printer, Copy, Check } from 'lucide-react';

interface ShameBoardProps {
  issues: CivicIssue[];
  onGenerateRTI: (issueId: string) => Promise<string>;
}

export default function ShameBoard({ issues, onGenerateRTI }: ShameBoardProps) {
  const [selectedIssueForRti, setSelectedIssueForRti] = useState<CivicIssue | null>(null);
  const [rtiText, setRtiText] = useState<string>('');
  const [rtiLoading, setRtiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filter chronic issues (30+ days open)
  const chronicIssues = issues.filter(issue => {
    const reportedDate = new Date(issue.reportedAt);
    const daysOpen = Math.floor((Date.now() - reportedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysOpen >= 30 || (issue as any).isOnShameBoard === true;
  });

  const handleOpenRtiModal = async (issue: CivicIssue) => {
    setSelectedIssueForRti(issue);
    setRtiLoading(true);
    setRtiText('');
    try {
      const text = await onGenerateRTI(issue.id);
      setRtiText(text);
    } catch (err) {
      setRtiText('Failed to generate formal RTI application. Please try again.');
    } finally {
      setRtiLoading(false);
    }
  };

  const handleCopyRti = () => {
    navigator.clipboard.writeText(rtiText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = (issue: CivicIssue) => {
    const daysOpen = issue.daysOpen || 30;
    const tweet = `Complaint #${issue.id} ("${issue.title}") in ${issue.location} is unresolved for ${daysOpen} days! Responsible: ${issue.department || 'BBMP'}. Where is our tax money going? @BBMPCOMM @NagarSeva #NagarSeva #CivicShame`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <div className="bg-[#1A1115] border border-rose-950/60 p-5 rounded-lg space-y-5 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-rose-950 pb-3">
        <div className="p-2 bg-rose-950/80 rounded text-rose-500 animate-pulse">
          <Skull className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wider uppercase text-rose-400 font-mono">
            Ward Accountability Shame Board
          </h3>
          <p className="text-[11px] text-rose-300/80 font-sans">
            SLA breached issues (30+ days unresolved) compiled automatically for citizen scrutiny.
          </p>
        </div>
      </div>

      {/* Issues list */}
      {chronicIssues.length === 0 ? (
        <div className="text-center py-8 text-xs text-rose-400/60 font-mono">
          ✓ Clean Sheet: No issues in this ward have breached the 30-day resolution limit!
        </div>
      ) : (
        <div className="space-y-3">
          {chronicIssues.map(issue => {
            const reportedDate = new Date(issue.reportedAt);
            const daysOpen = issue.daysOpen || Math.floor((Date.now() - reportedDate.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div 
                key={issue.id}
                className="bg-stone-900/60 border border-rose-950/40 rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-rose-950 transition-colors"
              >
                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-rose-950/80 border border-rose-900 text-rose-400 text-[9px] font-bold rounded font-mono">
                      #{issue.id}
                    </span>
                    <span className="text-rose-500 font-mono text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" /> OVERDUE BY {daysOpen} DAYS
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-200 line-clamp-1">{issue.title}</h4>
                  <div className="text-[10px] text-stone-400 flex flex-wrap gap-x-2 font-mono">
                    <span>🏢 Dept: {issue.department || 'Pending Routing'}</span>
                    <span>📍 {issue.location}</span>
                  </div>
                </div>

                {/* Accountability Actions */}
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleShareTwitter(issue)}
                    className="flex-1 md:flex-none px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-400 border border-sky-900/50 rounded text-[11px] font-bold font-mono flex items-center justify-center gap-1 transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" /> Tweet Shame
                  </button>
                  <button
                    onClick={() => handleOpenRtiModal(issue)}
                    className="flex-1 md:flex-none px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-900/50 rounded text-[11px] font-bold font-mono flex items-center justify-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> Generate RTI
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RTI Modal Popup */}
      {selectedIssueForRti && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in text-slate-800">
          <div className="bg-white border border-slate-200 p-6 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-bold text-sm uppercase text-slate-900 font-mono">
                  RTI Application Generator
                </h4>
                <p className="text-[10px] text-slate-500">
                  Citizen notice drafted under Sec 6(1) of the RTI Act, 2005.
                </p>
              </div>
              <button 
                onClick={() => setSelectedIssueForRti(null)}
                className="text-slate-400 hover:text-slate-600 font-mono text-sm p-1"
              >
                [Close]
              </button>
            </div>

            {/* Document display */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded p-4 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto relative">
              {rtiLoading ? (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-t-transparent border-[#1F3A5F] rounded-full animate-spin" />
                  <span className="text-xs text-slate-500">Gemini drafting formal municipal application...</span>
                </div>
              ) : null}
              {rtiText}
            </div>

            {/* Action Row */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                onClick={handleCopyRti}
                disabled={rtiLoading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold font-mono flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              <button
                onClick={() => window.print()}
                disabled={rtiLoading}
                className="px-4 py-2 bg-[#1F3A5F] hover:bg-[#152840] text-white rounded text-xs font-bold font-mono flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
