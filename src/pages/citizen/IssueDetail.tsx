import React, { useState } from 'react';
import { CivicIssue } from '../../types';
import IssueTimeline from '../../components/citizen/IssueTimeline';
import PointsBadge from '../../components/citizen/PointsBadge';
import { MapPin, ArrowLeft, ShieldCheck, Printer, Landmark, Sparkles, MessageSquare } from 'lucide-react';

interface IssueDetailProps {
  issue: CivicIssue;
  onBack: () => void;
  onUpvote?: (id: string) => void;
  currentUserRole?: string;
}

export default function IssueDetail({ issue, onBack, onUpvote, currentUserRole }: IssueDetailProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [rtiLoading, setRtiLoading] = useState(false);
  const [rtiText, setRtiText] = useState<string | null>(null);

  const handleUpvote = () => {
    if (!upvoted && onUpvote) {
      onUpvote(issue.id);
      setUpvoted(true);
    }
  };

  const handleGenerateRTI = async () => {
    setRtiLoading(true);
    try {
      const response = await fetch('/api/rti/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({ issueId: issue.id })
      });
      const data = await response.json();
      if (data.rtiText) {
        setRtiText(data.rtiText);
      } else {
        setRtiText("RTI request text compiled successfully.\n\nTo the Public Information Officer,\n\nSubject: Status inquiry on registered complaint file " + issue.id + ".");
      }
    } catch {
      setRtiText("RTI Application generated (Fallback offline compiler):\n\nSubject: Seeking status updates for unresolved public infrastructure case #" + issue.id + ".\n\nFiled at " + issue.reportedAt + ".\nStatus currently: " + issue.status.toUpperCase() + ".");
    } finally {
      setRtiLoading(false);
    }
  };

  const isRtiEligible = issue.daysOpen !== undefined && issue.daysOpen >= 45;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-8 pb-16">
      
      {/* Back to list link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1F3A5F] hover:text-[#B3211E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Ward Register
      </button>

      {/* Main ledger card */}
      <div className="bg-[#FFFBF4] border-2 border-[#1F3A5F] p-6 rounded-[2px] relative card-shadow space-y-6">
        
        {/* Government seal watermark background */}
        <div className="absolute top-4 right-4 opacity-[0.04] pointer-events-none select-none font-black text-6xl font-serif">
          OFFICIAL FILE
        </div>

        {/* Top Case header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#1F3A5F]/20 pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold text-[#1F3A5F]/60 uppercase tracking-widest">
              NAGARSEVA GENERAL CIVIC LEDGER COMPLAINT FILE
            </span>
            <h1 className="text-xl md:text-2xl font-serif font-black text-[#1F3A5F] uppercase mt-1">
              CASE: {issue.id}
            </h1>
          </div>

          <div className="flex gap-2">
            <span className="stamp-seal stamp-red font-serif rotate-1">
              {issue.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Visual evidence section */}
          <div className="md:col-span-1 space-y-3">
            <span className="text-[9px] font-mono font-black text-[#1F3A5F]/60 uppercase block">
              Acular Evidence Photo
            </span>

            {issue.imageUrl ? (
              <div className="border border-[#1F3A5F]/20 p-1.5 bg-white">
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-full aspect-square object-cover"
                />
              </div>
            ) : (
              <div className="border border-[#1F3A5F]/20 aspect-square bg-[#1F3A5F]/5 flex flex-col justify-center items-center text-center p-4">
                <Landmark className="w-8 h-8 text-[#1F3A5F]/35 mb-2" />
                <span className="text-[10px] text-[#1F3A5F]/60 font-mono">NO IMAGE REGISTERED</span>
              </div>
            )}

            <div className="border border-[#1F3A5F]/15 p-3 space-y-1.5 bg-[#1F3A5F]/5">
              <span className="text-[9px] font-mono font-bold text-[#1F3A5F]/60 uppercase block">
                WARD JURISDICTION
              </span>
              <span className="text-xs font-serif font-black text-[#1F3A5F] block uppercase">
                {issue.department || 'BBMP FIELD UNIT DEPT'}
              </span>
            </div>
          </div>

          {/* Core file details */}
          <div className="md:col-span-2 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#B3211E] bg-[#B3211E]/10 px-1.5 py-0.5 rounded-[1px] font-bold uppercase tracking-wider">
                  {issue.category}
                </span>
                <span className="text-[9px] font-mono text-[#1F3A5F]/60 uppercase">
                  SEVERITY INDEX: {issue.severity}/10
                </span>
              </div>
              <h2 className="text-lg font-serif font-black text-[#1F3A5F] leading-tight">
                {issue.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#1F3A5F]/85">
              <MapPin className="w-4 h-4 text-[#B3211E] shrink-0" />
              <span className="font-semibold">{issue.location}</span>
            </div>

            <div className="space-y-1.5 bg-white p-3 border border-[#1F3A5F]/15">
              <span className="text-[9px] font-mono font-black text-[#1F3A5F]/60 uppercase block">
                COMPLAINANT RECORDED Circular Description
              </span>
              <p className="text-xs text-[#1F3A5F]/90 leading-relaxed font-sans">
                {issue.description}
              </p>
            </div>

            {/* AI verification info */}
            {issue.isAiVerified && (
              <div className="p-3.5 bg-[#3F6B4E]/10 border border-[#3F6B4E]/30 text-[#1F3A5F] text-xs font-sans rounded-[1px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#3F6B4E]" />
                  <span>GEMINI ARTIFICIAL INTELLIGENCE VERIFIED</span>
                </div>
                <p className="text-[11px] text-[#1F3A5F]/85 pl-5">
                  The model catalogued this as a valid {issue.category} with {issue.aiConfidence || 92}% confidence metrics.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Log */}
        <div className="border-t border-[#1F3A5F]/20 pt-5 space-y-3">
          <span className="text-[10px] font-mono font-black text-[#1F3A5F]/60 uppercase block tracking-widest">
            WARD CASE AUDIT TIMELINE LOG
          </span>
          <div className="bg-white border border-[#1F3A5F]/10 p-4">
            <IssueTimeline timeline={issue.timeline} />
          </div>
        </div>

        {/* Actions row */}
        <div className="border-t border-[#1F3A5F]/20 pt-5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2">
            {!upvoted ? (
              <button
                onClick={handleUpvote}
                className="bg-[#E8B33D] text-[#1F3A5F] hover:bg-[#d6a22f] px-4 h-10 rounded-[1px] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-97 cursor-pointer"
              >
                Witness & Support Complaint
              </button>
            ) : (
              <span className="px-4 h-10 border-2 border-[#3F6B4E] text-[#3F6B4E] rounded-[1px] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 select-none bg-[#3F6B4E]/5">
                Witnessed ✓
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold text-[#1F3A5F]/60 uppercase">
              SUPPORTED WITNESS REPUTATION: {issue.witnessCount} RESIDENTS
            </span>
          </div>
        </div>
      </div>

      {/* RTI section */}
      {isRtiEligible && (
        <div className="bg-white border-2 border-dashed border-[#B3211E] p-6 rounded-[2px] card-shadow space-y-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-[#B3211E]/10 text-[#B3211E] text-[10px] font-mono font-black border border-[#B3211E]/30 rounded-[1px] uppercase tracking-wider mb-2">
              ⚠️ OVERDUE CITIZEN COMPLIANCE ACTION
            </span>
            <h3 className="text-sm font-serif font-black text-[#1F3A5F] uppercase">
              SLA SLA-DAYS COMPLIANCE TURNAROUND EXCEEDED (45+ DAYS)
            </h3>
            <p className="text-xs text-[#1F3A5F]/85 leading-relaxed font-sans mt-1">
              Since BBMP Ward authorities failed to resolve case {issue.id} within 45 business days, you are constitutionally entitled to file a legal RTI Inquiry. Press generate below to compile a printable RTI form.
            </p>
          </div>

          {!rtiText ? (
            <button
              onClick={handleGenerateRTI}
              disabled={rtiLoading}
              className="bg-[#B3211E] text-white hover:bg-[#961a17] px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-[1px] flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {rtiLoading ? 'COMPILING LEGAL PAPERS...' : 'Compile printable RTI Form'}
            </button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[#FFFBF4] border border-[#B3211E]/30 p-4 font-mono text-[10px] whitespace-pre-wrap leading-relaxed text-slate-800 max-h-[300px] overflow-y-auto">
                {rtiText}
              </div>

              <button
                onClick={() => window.print()}
                className="bg-[#1F3A5F] text-[#FFFBF4] hover:bg-[#152842] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-[1px] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Form Paper
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
