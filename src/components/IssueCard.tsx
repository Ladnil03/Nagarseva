import React, { useState } from 'react';
import { CivicIssue, IssueStatus, RiskLevel } from '../types';
import { MapPin, Eye, Clock, AlertTriangle, Trash2, Lightbulb, Droplets, ShieldCheck, ShieldAlert, CheckCircle, HelpCircle, AlertOctagon } from 'lucide-react';

/* 
========================================================================
TOKEN SYSTEM SPECIFICATION (INDIAN MUNICIPAL STANDARD):
  --postbox-red:     #B3211E   (Indian postbox / RTI stamp ink — primary action, alerts)
  --ledger-blue:      #1F3A5F   (faded municipal ledger ink — headers, primary text)
  --ward-yellow:      #E8B33D   (reflective ward-board yellow — pending/in-progress)
  --notice-buff:      #F2EBDA   (aged government form paper — page background)
  --register-green:   #3F6B4E   (old register-book green — resolved/verified)
  --paper-white:      #FFFBF4   (fresh form paper — cards, surfaces)

TYPOGRAPHY ROLES:
  1. Display/Heads: "Archivo Black" or "Fraunces" serif for file numbers, heavy titles, and stamps.
  2. Body Text: "Mukta" humanist for readability & official clarity.
  3. Utility/Data: "IBM Plex Mono" for coordinates, timestamps, and case file numbers.

SIGNATURE TREATMENT:
  - Official rotating rubber stamp (.stamp-seal) for status representation.
  - Card shape is strictly flat, sharp corners (rounded-[2px]), heavy hairline borders (border-[#1F3A5F]/15).
  - Hard 2px offset shadows (rgba(31,58,95,0.15)) reflecting stationary pressure.
========================================================================
*/

interface IssueCardProps {
  key?: string | number;
  issue: CivicIssue;
  onUpvote?: (id: string) => void;
  onClickToggleTimeline?: (id: string) => void;
  showDetailsButton?: boolean;
}

export default function IssueCard({
  issue,
  onUpvote,
  onClickToggleTimeline,
  showDetailsButton = true,
}: IssueCardProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // Material-aligned status stamp stylings
  const statusStampClasses: Record<IssueStatus, string> = {
    reported: 'stamp-seal stamp-red',
    disputed: 'stamp-seal stamp-red',
    falsely_closed: 'stamp-seal stamp-red',
    chronic: 'stamp-seal stamp-red',
    assigned: 'stamp-seal stamp-yellow',
    in_progress: 'stamp-seal stamp-yellow',
    verified: 'stamp-seal stamp-green',
    resolved: 'stamp-seal stamp-green',
  };

  const statusLabels: Record<IssueStatus, string> = {
    reported: 'REPORTED',
    verified: 'VERIFIED',
    assigned: 'ASSIGNED',
    in_progress: 'IN PROGRESS',
    resolved: 'RESOLVED',
    disputed: 'DISPUTED',
    falsely_closed: 'FALSE CIVIL DISMISSAL ⚠️',
    chronic: 'CHRONIC RECIDIVISM 🔴',
  };

  const riskLeftBarColor: Record<RiskLevel, string> = {
    critical: 'border-l-[#B3211E]',
    high: 'border-l-[#E8B33D]',
    medium: 'border-l-[#1F3A5F]',
    low: 'border-l-[#3F6B4E]',
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Road Pothole':
        return <AlertTriangle className="w-4 h-4 text-[#B3211E]" />;
      case 'Overflowing Garbage':
        return <Trash2 className="w-4 h-4 text-[#1F3A5F]" />;
      case 'Broken Streetlight':
        return <Lightbulb className="w-4 h-4 text-[#E8B33D]" />;
      case 'Sewage Leakage':
        return <Droplets className="w-4 h-4 text-[#1F3A5F]" />;
      case 'Damaged Public Property':
        return <ShieldAlert className="w-4 h-4 text-[#B3211E]" />;
      default:
        return <HelpCircle className="w-4 h-4 text-[#1F3A5F]" />;
    }
  };

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!upvoted && onUpvote) {
      onUpvote(issue.id);
      setUpvoted(true);
    }
  };

  const getRelativeTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days === 0) return 'FILED TODAY';
    if (days === 1) return 'FILED 1 DAY AGO';
    return `FILED ${days} DAYS AGO`;
  };

  return (
    <div
      id={`issue-card-${issue.id}`}
      className={`bg-[#FFFBF4] border border-[#1F3A5F]/20 border-l-4 ${riskLeftBarColor[issue.riskLevel]} rounded-[2px] p-4 card-shadow relative`}
    >
      {/* Registry File Number Stamped Label */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="font-mono text-[10px] font-bold text-[#1F3A5F]/60 tracking-wider">
          CASE FILE: <span className="text-[#1F3A5F]">{issue.id}</span>
        </span>
        <span className="font-mono text-[9px] text-[#2F593E] bg-[#2F593E]/10 px-1.5 py-0.5 rounded-[1px] uppercase font-bold">
          {issue.riskLevel} RISK
        </span>
      </div>

      {/* Main row: Category icon, Title, Stamp Seal */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-[1px] bg-[#1F3A5F]/5 border border-[#1F3A5F]/15 flex items-center justify-center shrink-0 mt-0.5">
            {getCategoryIcon(issue.category)}
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#1F3A5F]/65 uppercase tracking-wide font-mono block leading-none">
              {issue.category}
            </span>
            <h4 className="text-[14px] font-serif font-black text-[#1F3A5F] line-clamp-1 leading-snug mt-1">
              {issue.title}
            </h4>
          </div>
        </div>
        
        {/* Real Dynamic Stationery Rubber Stamp replacement */}
        <div className="shrink-0 -mt-2">
          <span className={statusStampClasses[issue.status] || 'stamp-seal stamp-red'}>
            {statusLabels[issue.status] || 'FILED'}
          </span>
        </div>
      </div>

      {/* Location: 📍 small gray text */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#1F3A5F]/85 font-sans mb-3 pb-2 border-b border-dashed border-[#1F3A5F]/15">
        <MapPin className="w-3.5 h-3.5 text-[#B3211E] shrink-0" />
        <span className="truncate tracking-tight font-medium">{issue.location}</span>
      </div>

      {/* Photo thumbnail */}
      {issue.imageUrl ? (
        <div className="relative w-full h-[115px] rounded-[1px] overflow-hidden mb-3 border border-[#1F3A5F]/15 bg-[#F2EBDA]/40 p-1">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.98]"
            referrerPolicy="no-referrer"
          />
          {issue.isAiVerified && (
            <div className="absolute top-2 left-2 bg-[#1F3A5F] text-[#FFFBF4] px-2 py-0.5 rounded-[1px] text-[9px] font-mono font-bold flex items-center gap-1 shadow">
              <ShieldCheck className="w-3 h-3 text-[#E8B33D]" />
              AI AUDIT: VERIFIED
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[65px] rounded-[1px] bg-[#F2EBDA]/40 border border-[#1F3A5F]/15 border-dashed flex items-center justify-center text-[11px] font-mono font-semibold text-[#1F3A5F]/70 mb-3">
          NO MEDIA ATTACHED • MUNICIPAL FIELD BACKUP ONLY
        </div>
      )}

      {/* Details text preview if present */}
      <p className="text-[12px] text-[#1F3A5F]/90 mb-3 line-clamp-2 leading-relaxed font-sans">{issue.description}</p>

      {/* Severity Indicator */}
      <div className="mb-4 bg-[#F2EBDA]/30 p-2 border border-[#1F3A5F]/10 rounded-[1px]">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-bold text-[#1F3A5F]/75 uppercase tracking-wider font-mono">CIVIC PRIORITY RISK:</span>
          <span className="font-mono font-bold text-[#B3211E] bg-[#B3211E]/10 px-1.5 py-0.2">SCORE {issue.severity}/10</span>
        </div>
        <div className="relative w-full h-1.5 bg-[#1F3A5F]/10 rounded-[1px] overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3F6B4E] via-[#E8B33D] to-[#B3211E] transition-all duration-700 ease-out"
            style={{ width: `${(issue.severity / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom row: [Time ago] [Witness count 👁] [Action Buttons] */}
      <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#1F3A5F]/15 text-[11px] font-mono text-[#1F3A5F]/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold">
            <Clock className="w-3.5 h-3.5 text-[#1F3A5F]/50" />
            {getRelativeTime(issue.reportedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#1F3A5F]/50" />
            {issue.witnessCount} WITNESSES
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUpvoteClick}
            disabled={upvoted}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-[1px] border text-[11px] font-bold uppercase transition-all duration-150 ${
              upvoted
                ? 'bg-[#3F6B4E]/15 border-[#3F6B4E] text-[#3F6B4E] cursor-default'
                : 'bg-[#FFFBF4] border-[#B3211E] text-[#B3211E] hover:bg-[#B3211E] hover:text-[#FFFBF4] active:scale-95'
            }`}
          >
            {upvoted ? 'VERIFIED ✓' : 'CO-REGISTER'}
          </button>
          
          {showDetailsButton && (
            <button
              onClick={() => {
                setShowTimeline(!showTimeline);
                if (onClickToggleTimeline) onClickToggleTimeline(issue.id);
              }}
              className="px-2.5 py-1 bg-[#1F3A5F]/10 border border-[#1F3A5F]/20 text-[#1F3A5F] rounded-[1px] text-[11px] font-bold uppercase hover:bg-[#1F3A5F] hover:text-[#FFFBF4] transition-colors"
            >
              {showTimeline ? 'HIDE LEDGER' : 'VIEW AUDIT LOGS'}
            </button>
          )}
        </div>
      </div>

      {/* Embedded Timeline Slider if "showTimeline" state is toggled */}
      {showTimeline && issue.timeline && (
        <div className="mt-4 pt-4 border-t border-dashed border-[#1F3A5F]/15 space-y-3 bg-[#F2EBDA]/45 p-3 rounded-[1px] border border-[#1F3A5F]/10">
          <h5 className="text-[10px] font-bold text-[#1F3A5F] tracking-wider uppercase mb-2 font-mono">
            MUNICIPAL REGISTER OF ACTION LOGS
          </h5>
          <div className="relative pl-4 border-l-2 border-[#1F3A5F]/15 space-y-4">
            {issue.timeline.map((step, idx) => {
              const isLast = idx === issue.timeline.length - 1;
              return (
                <div key={step.id} className="relative pl-3">
                  {/* Circle state decorator */}
                  <span
                    className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-[1px] border flex items-center justify-center ${
                      step.status === 'done'
                        ? 'bg-[#3F6B4E] border-[#3F6B4E]'
                        : step.status === 'active'
                        ? 'bg-[#B3211E] border-[#B3211E] animate-pulse'
                        : 'bg-white border-[#1F3A5F]/30'
                    }`}
                  >
                    {step.status === 'done' && <span className="text-[7px] text-white font-black">✓</span>}
                    {step.status === 'active' && <span className="text-[7px] text-white font-black">•</span>}
                  </span>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-[12px] font-bold leading-tight uppercase font-mono ${step.status === 'pending' ? 'text-[#1F3A5F]/40' : 'text-[#1F3A5F]'}`}>
                        {step.title}
                      </p>
                      {step.meta && (
                        <p className="text-[11px] text-[#1F3A5F]/80 mt-0.5 leading-tight">{step.meta}</p>
                      )}
                    </div>
                    {step.timestamp && (
                      <span className="text-[9px] font-mono text-[#1F3A5F]/60 bg-[#FFFBF4] px-1.5 py-0.5 border border-[#1F3A5F]/15 rounded-[1px] whitespace-nowrap ml-2">
                        {step.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
