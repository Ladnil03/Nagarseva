import React from 'react';
import { CivicIssue } from '../../types';
import { MapPin, ArrowRight } from 'lucide-react';

interface IssueMapPopupProps {
  issue: CivicIssue;
  onClose: () => void;
  onDetailClick?: (issue: CivicIssue) => void;
}

export default function IssueMapPopup({ issue, onClose, onDetailClick }: IssueMapPopupProps) {
  return (
    <div className="bg-[#FFFBF4] border-2 border-[#1F3A5F] rounded-[2px] p-3 max-w-[260px] shadow-lg animate-fade-in space-y-2">
      <div className="flex justify-between items-start gap-2">
        <span className="font-mono text-[9px] font-bold text-[#1F3A5F]/70 tracking-wider">
          {issue.id}
        </span>
        <button onClick={onClose} className="text-[#1F3A5F]/60 hover:text-[#1F3A5F] text-[11px] font-bold">
          ✕
        </button>
      </div>

      <h4 className="font-serif font-black text-xs text-[#1F3A5F] uppercase tracking-wide leading-snug">
        {issue.title}
      </h4>

      <p className="text-[10px] text-[#1F3A5F]/80 line-clamp-2 leading-relaxed">
        {issue.description}
      </p>

      <div className="flex items-center gap-1 text-[9px] text-[#1F3A5F]/60">
        <MapPin className="w-3 h-3 text-[#B3211E]" />
        <span className="truncate">{issue.location}</span>
      </div>

      {onDetailClick && (
        <button
          onClick={() => onDetailClick(issue)}
          className="w-full bg-[#1F3A5F] text-[#FFFBF4] py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-[1px] flex items-center justify-center gap-1 hover:bg-[#152842] transition-colors"
        >
          View Case Ledger <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
