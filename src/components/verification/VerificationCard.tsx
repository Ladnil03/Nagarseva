import React from 'react';
import { CivicIssue } from '../../types';
import { ShieldCheck, MapPin, AlertTriangle, Users } from 'lucide-react';

interface VerificationCardProps {
  issue: CivicIssue;
  onVerify: (issue: CivicIssue, verdict: 'confirmed' | 'disputed') => void;
}

export default function VerificationCard({ issue, onVerify }: VerificationCardProps) {
  const distanceSim = Math.round(150 + (issue.latitude * 100000) % 350); // Simulated distance inside the ward territory

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col md:flex-row p-4 gap-4 text-slate-800">
      {/* Photo Column */}
      <div className="w-full md:w-28 h-28 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 relative">
        <img 
          src={issue.imageUrl || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=300&q=80'} 
          alt={issue.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-1 left-1 bg-[#1F3A5F] text-white px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase font-mono">
          ORIGINAL
        </div>
      </div>

      {/* Info Column */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-600 rounded">
              {issue.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-0.5 ${
              issue.severity >= 8 ? 'bg-[#FF4858]' : issue.severity >= 5 ? 'bg-[#FF6B35]' : 'bg-[#4ECDC4]'
            }`}>
              SEV {issue.severity}/10
            </span>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5 ml-auto">
              <MapPin className="w-3 h-3 text-slate-400" /> {distanceSim}m away
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
            {issue.title}
          </h4>

          {/* Subtext */}
          <p className="text-xs text-slate-500 line-clamp-1">
            📌 {issue.location}
          </p>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Users className="w-3.5 h-3.5" />
            <span>{issue.witnessCount} witnesses co-signed</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onVerify(issue, 'confirmed')}
              className="px-3 py-1.5 text-xs font-bold bg-[#1B5E20] hover:bg-[#154618] text-white rounded flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Confirm Active
            </button>
            <button
              onClick={() => onVerify(issue, 'disputed')}
              className="px-3 py-1.5 text-xs font-bold border border-[#FF4858] text-[#FF4858] hover:bg-rose-50 rounded flex items-center gap-1 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Dispute Fix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
