import React from 'react';
import { Eye, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface ComparisonViewProps {
  originalPhoto: string;
  newPhoto: string;
  auditResult: {
    isSameLocation: boolean;
    issueStillPresent?: boolean;
    isGenuinelyResolved?: boolean;
    locationConfidence: number;
    issueMatchConfidence?: number;
    confidenceScore?: number;
    resolutionQuality?: 'excellent' | 'good' | 'partial' | 'none';
    reasoning: string;
    suggestedVerdict?: string;
    remainingIssues?: string | null;
  };
}

export default function ComparisonView({
  originalPhoto,
  newPhoto,
  auditResult
}: ComparisonViewProps) {
  const matchPct = auditResult.locationConfidence || auditResult.confidenceScore || 90;
  const isOk = auditResult.isSameLocation;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md p-5 space-y-5 text-slate-800">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="font-bold text-sm tracking-tight text-slate-900 uppercase flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#1F3A5F]" /> Before / After Visual Audit
        </h4>
        <div className="flex items-center gap-1 text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5" /> GEMINI VISION POWERED
        </div>
      </div>

      {/* Side-by-Side Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left: Original Before */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
            🚨 Before (Original Report)
          </div>
          <div className="h-44 bg-slate-100 rounded overflow-hidden border border-slate-200 relative">
            <img 
              src={originalPhoto || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80'} 
              alt="Before Repair" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[10px] font-mono">
              PRE-FIX
            </div>
          </div>
        </div>

        {/* Right: New Proof */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
            📸 After (Verification Photo)
          </div>
          <div className="h-44 bg-slate-100 rounded overflow-hidden border border-slate-200 relative">
            <img 
              src={newPhoto || 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80'} 
              alt="After Repair" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 bg-[#1B5E20] text-white px-2 py-0.5 rounded text-[10px] font-mono">
              POST-FIX
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Metrics */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3 border-b border-slate-200/60 pb-3">
          <div>
            <div className="text-slate-400 font-mono text-[9px] uppercase">Location Match</div>
            <div className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              {isOk ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Matches Site
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-500" /> Location Conflict
                </>
              )}
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-mono text-[9px] uppercase">Audit Verdict</div>
            <div className="font-bold text-slate-800 mt-0.5">
              {auditResult.isGenuinelyResolved ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase text-[10px]">
                  ✓ Genuine Fix
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase text-[10px]">
                  ⚠️ Still Active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Confidence Dial */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>Visual Match Confidence</span>
            <span className="font-bold text-slate-800">{matchPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1F3A5F]" 
              style={{ width: `${matchPct}%` }}
            />
          </div>
        </div>

        {/* Reasoning Report */}
        <div className="space-y-1 pt-1.5">
          <div className="text-slate-400 font-mono text-[9px] uppercase">Gemini Evaluation Summary</div>
          <p className="text-slate-700 font-sans italic leading-relaxed bg-white p-2.5 rounded border border-slate-200/50">
            "{auditResult.reasoning}"
          </p>
        </div>

        {/* Resolution details */}
        {auditResult.resolutionQuality && (
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
            <span>Resolution Quality Rating:</span>
            <span className="font-bold text-slate-700 uppercase font-mono">{auditResult.resolutionQuality}</span>
          </div>
        )}
      </div>
    </div>
  );
}
