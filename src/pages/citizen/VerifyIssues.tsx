import React, { useState, useEffect } from 'react';
import { useVerifications } from '../../hooks/useVerifications';
import { CivicIssue } from '../../types';
import VerificationCard from '../../components/verification/VerificationCard';
import VerificationPhoto from '../../components/verification/VerificationPhoto';
import { ShieldAlert, Award, Star, Search, RefreshCw, Compass } from 'lucide-react';

export default function VerifyIssues() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<'confirmed' | 'disputed'>('confirmed');
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { verifyIssue, fileDispute, loading: submitLoading } = useVerifications();

  const fetchEligibleIssues = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/issues');
      if (response.ok) {
        const data = await response.json();
        // Eligible for verification if witnessCount >= 5 or if currently reported/verified/disputed
        const eligible = data.filter((i: CivicIssue) => 
          i.witnessCount >= 5 || 
          ['reported', 'verified', 'disputed'].includes(i.status)
        );
        setIssues(eligible);
      }
    } catch (err) {
      console.error('Error fetching verification issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibleIssues();
  }, []);

  const handleLaunchCapture = (issue: CivicIssue, verdict: 'confirmed' | 'disputed') => {
    setSelectedIssue(issue);
    setSelectedVerdict(verdict);
    setShowPhotoCapture(true);
  };

  const handlePhotoSubmitted = async (photoURL: string) => {
    if (!selectedIssue) return;

    try {
      if (selectedVerdict === 'confirmed') {
        const res = await verifyIssue(selectedIssue.id, photoURL, 'confirmed', 'current-citizen-id');
        setFeedback(`✓ Verification submitted successfully! Earned ${res.pointsAwarded} NagarPoints. Reputation is now ${res.newReputation}.`);
      } else {
        // Dispute
        const res = await fileDispute(selectedIssue.id, photoURL, 'current-citizen-id');
        setFeedback(`✓ Resolution Dispute filed. Gemini is auditing. Earned ${res.pointsAwarded} NagarPoints.`);
      }
      
      setShowPhotoCapture(false);
      setSelectedIssue(null);
      await fetchEligibleIssues();

      // Clear feedback after 5 seconds
      setTimeout(() => setFeedback(null), 6000);

    } catch (err: any) {
      alert(err.message || 'Verification failed');
    }
  };

  const filtered = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 to-[#1F3A5F] p-6 rounded-lg text-white shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400 animate-spin-slow" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-sky-300">NAGARSEVA COLLABORATIVE GRID</span>
          </div>
          <h2 className="text-xl font-bold font-sans tracking-tight">
            Community Verification Beat
          </h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Verify nearby infrastructure hazards, capture photo evidence, and co-sign tickets to help fast-track municipality responses.
          </p>
        </div>

        {/* Reward Stats */}
        <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3 border border-white/10 flex-shrink-0 self-stretch sm:self-auto">
          <Award className="w-8 h-8 text-[#FFE66D]" />
          <div>
            <div className="text-[10px] font-mono text-slate-300 uppercase">Verification reward</div>
            <div className="text-sm font-bold text-white flex items-center gap-1">+30 to +150 Points</div>
          </div>
        </div>
      </div>

      {/* Alert feedback */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg shadow-sm animate-fade-in flex items-center gap-2">
          <Star className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-pulse" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Grid split */}
      {showPhotoCapture && selectedIssue ? (
        <div className="flex justify-center items-center py-4">
          <VerificationPhoto
            issueTitle={selectedIssue.title}
            verdict={selectedVerdict}
            onPhotoSubmitted={handlePhotoSubmitted}
            onCancel={() => {
              setShowPhotoCapture(false);
              setSelectedIssue(null);
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search local eligible tickets by title, area, or category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md pl-10 pr-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1F3A5F] focus:border-[#1F3A5F] focus:outline-none shadow-sm"
              />
            </div>
            <button
              onClick={fetchEligibleIssues}
              className="px-3 bg-white border border-slate-200 rounded-md flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* List display */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="bg-slate-50 border border-slate-200 rounded-lg p-5 h-32 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-lg space-y-2">
              <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No verification requests available in your ward</p>
              <p className="text-[11px] text-slate-400">All reports are fully verified, or awaiting new reporter flags.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map(issue => {
                const Card = VerificationCard as any;
                return (
                  <Card
                    key={issue.id}
                    issue={issue}
                    onVerify={handleLaunchCapture}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
