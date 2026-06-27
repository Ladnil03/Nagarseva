import React, { useState } from 'react';
import { CivicIssue } from '../../types';
import IssueTimeline from '../../components/citizen/IssueTimeline';
import { ArrowLeft, MapPin, Landmark, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';

interface AuthorityIssueDetailProps {
  issue: CivicIssue;
  onBack: () => void;
  onUpdateStatus: (id: string, status: any, comment: string, department?: string) => void;
}

export default function AuthorityIssueDetail({ issue, onBack, onUpdateStatus }: AuthorityIssueDetailProps) {
  const [status, setStatus] = useState(issue.status);
  const [comment, setComment] = useState('');
  const [dept, setDept] = useState(issue.department || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdateStatus(issue.id, status, comment, dept);
      setComment('');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-6 pb-16">
      
      {/* Back to list */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1F3A5F] hover:text-[#B3211E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Console Register
      </button>

      {/* Main ledger file card */}
      <div className="bg-[#FFFBF4] border-2 border-[#1F3A5F] p-6 rounded-[2px] relative card-shadow space-y-6">
        
        {/* Government seal watermark background */}
        <div className="absolute top-4 right-4 opacity-[0.04] pointer-events-none select-none font-black text-6xl font-serif">
          GOVT JURISDICTION
        </div>

        <div className="border-b border-[#1F3A5F]/20 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <span className="font-mono text-[9px] font-bold text-[#1F3A5F]/60 uppercase tracking-widest block">
              MUNICIPAL REPAIR FILE INDEX
            </span>
            <h1 className="text-xl font-serif font-black text-[#1F3A5F] uppercase mt-0.5">
              CASE RECORD: {issue.id}
            </h1>
          </div>

          <div>
            <span className="stamp-seal stamp-red rotate-1">
              STATUS: {issue.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Image & Details */}
          <div className="md:col-span-1 space-y-3">
            <span className="text-[9px] font-mono font-black text-[#1F3A5F]/60 uppercase block">
              Photo Evidence
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
                <span className="text-[10px] text-[#1F3A5F]/60 font-mono">NO IMAGE FILE</span>
              </div>
            )}
          </div>

          {/* Right Column: Case Details & Action form */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#B3211E] bg-[#B3211E]/10 px-1.5 py-0.5 rounded-[1px] font-bold uppercase tracking-wider">
                {issue.category}
              </span>
              <h2 className="text-lg font-serif font-black text-[#1F3A5F] leading-tight">
                {issue.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[#1F3A5F]/85">
                <MapPin className="w-4 h-4 text-[#B3211E]" />
                <span className="font-semibold">{issue.location}</span>
              </div>
            </div>

            <div className="space-y-1 bg-white p-3 border border-[#1F3A5F]/15">
              <span className="text-[9px] font-mono font-black text-[#1F3A5F]/60 uppercase block">
                COMPLAINT ABSTRACT
              </span>
              <p className="text-xs text-[#1F3A5F]/95 leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Officer update action form */}
            <form onSubmit={handleSubmit} className="border-2 border-[#1F3A5F] p-4 bg-white space-y-4">
              <span className="text-[10px] font-mono font-black text-[#1F3A5F] uppercase block border-b border-[#1F3A5F]/15 pb-1.5">
                EXECUTE ACTION TRANSITION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#1F3A5F]/75 uppercase mb-1">
                    State Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-9 border border-[#1F3A5F]/20 text-xs px-2.5 rounded-[1px] font-mono font-bold"
                  >
                    <option value="reported">Reported</option>
                    <option value="verified">Verified</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="disputed">Disputed</option>
                    <option value="falsely_closed">Falsely Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#1F3A5F]/75 uppercase mb-1">
                    Assigned Field Unit Department
                  </label>
                  <input
                    type="text"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="e.g. BBMP Engineering Unit"
                    className="w-full h-9 border border-[#1F3A5F]/20 text-xs px-2.5 rounded-[1px] font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#1F3A5F]/75 uppercase mb-1">
                  Action Audit Comment / Instructions
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Provide audit instructions or closure comments..."
                  required
                  rows={2}
                  className="w-full border border-[#1F3A5F]/20 p-2 text-xs rounded-[1px] font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#1F3A5F] text-[#FFFBF4] py-2 text-xs font-bold uppercase tracking-wider rounded-[1px] hover:bg-[#152842] transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'COMMITING JURISDICTION CHANGE...' : 'Commit Status update'}
              </button>
            </form>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="border-t border-[#1F3A5F]/20 pt-5 space-y-2">
          <span className="text-[10px] font-mono font-black text-[#1F3A5F]/60 uppercase block">
            WARD AUDIT LOG LIST
          </span>
          <div className="bg-white border border-[#1F3A5F]/10 p-4">
            <IssueTimeline timeline={issue.timeline} />
          </div>
        </div>

      </div>

    </div>
  );
}
