import React, { useState } from 'react';
import { CivicIssue, UserProfile, AchievementBadge, IssueCategory } from '../types';
import IssueCard from './IssueCard';
import WardHealthGauge from './WardHealthGauge';
import { Award, Zap, CheckCircle2, TrendingUp, Sparkles, MapPin, Search, PlusCircle, AlertTriangle, MessageSquare, ThumbsUp } from 'lucide-react';

interface CitizenDashboardProps {
  user: UserProfile;
  badges: AchievementBadge[];
  issues: CivicIssue[];
  onReportClick: () => void;
  onUpvoteIssue: (id: string) => void;
  onAddPoints: (pts: number, reason: string) => void;
}

export default function CitizenDashboard({
  user,
  badges,
  issues,
  onReportClick,
  onUpvoteIssue,
  onAddPoints,
}: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Filter issues based on choices
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
    
    // Simulating "My Issues" - odd numbered IDs count as user reported
    const matchesTab = activeTab === 'all' || issue.id.endsWith('1') || issue.id.endsWith('3');

    return matchesSearch && matchesCategory && matchesTab;
  });

  const [verifyRequests, setVerifyRequests] = useState([
    {
      id: 'VR-1',
      title: 'Pothole repairs completed at Hal 1st Stage?',
      reporter: 'Amit S.',
      distance: '350m near you',
      pointsReward: 25,
      type: 'Road Pothole',
    },
    {
      id: 'VR-2',
      title: 'Is the Koramangala park main light resolved?',
      reporter: 'Aditi M.',
      distance: '620m near you',
      pointsReward: 25,
      type: 'Broken Streetlight',
    }
  ]);

  const handleVerifyResolution = (vrId: string, title: string) => {
    // Remove verified request from lists
    setVerifyRequests(verifyRequests.filter((v) => v.id !== vrId));
    onAddPoints(25, `Nearby verification verified: "${title}"`);
  };

  const categories = ['All', 'Road Pothole', 'Overflowing Garbage', 'Broken Streetlight', 'Sewage Leakage', 'Damaged Public Property'];

  return (
    <div id="citizen-dashboard" className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      
      {/* Dynamic greeting banner */}
      <div className="bg-white border border-[#E8EAF0] p-6 rounded-lg-custom mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 card-shadow">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">👋</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-ns-text-1">Namaste, {user.name}</h1>
            <span className="ml-1 px-2.5 py-0.5 bg-ns-orange-10 text-ns-orange text-[10px] font-bold rounded-full border border-ns-orange/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-ns-orange" /> Level {user.level} Citizen Inspector
            </span>
          </div>
          <p className="text-sm text-ns-text-2">
            Your contributions help keep <span className="font-semibold text-ns-dark">{user.wardName}</span> clean and functional. Use your points to unlock special badges!
          </p>
        </div>

        {/* NagarPoints Count Widget */}
        <div className="bg-[#111A24] text-white px-5 py-4 rounded-xl shadow-lg border border-slate-700 md:self-stretch flex items-center gap-4 shrink-0 transition-all duration-300 transform hover:scale-102">
          <div className="w-10 h-10 rounded-full bg-ns-orange/20 flex items-center justify-center border border-ns-orange/35 shrink-0">
            <Award className="w-5 h-5 text-ns-orange" />
          </div>
          <div>
            <span className="text-[10px] tracking-wider font-semibold text-slate-400 block uppercase">NagarPoints Balance</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{user.points}</span>
              <span className="text-xs text-ns-orange font-bold">PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Take 2/3 space) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main User Statistics metrics Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-[#E8EAF0] p-4 rounded-lg-custom text-center card-shadow">
              <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-2 text-indigo-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-ns-text-1 block">{user.reportedCount}</span>
              <span className="text-[10px] text-ns-text-2 font-bold uppercase tracking-widest">Reported</span>
            </div>

            <div className="bg-white border border-[#E8EAF0] p-4 rounded-lg-custom text-center card-shadow">
              <div className="w-9 h-9 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-2 text-ns-green">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-ns-text-1 block">{user.resolvedCount}</span>
              <span className="text-[10px] text-ns-text-2 font-bold uppercase tracking-widest">Resolved</span>
            </div>

            <div className="bg-white border border-[#E8EAF0] p-4 rounded-lg-custom text-center card-shadow">
              <div className="w-9 h-9 rounded-full bg-ns-orange-10 flex items-center justify-center mx-auto mb-2 text-ns-orange">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-ns-text-1 block">{user.verificationsCount}</span>
              <span className="text-[10px] text-ns-text-2 font-bold uppercase tracking-widest">Citizen Rank</span>
            </div>
          </div>

          {/* Quick Active/All issues directory feed */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8EAF0] pb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`text-[14px] font-bold pb-2 border-b-2 transition-all ${
                    activeTab === 'all'
                      ? 'border-ns-orange text-ns-orange'
                      : 'border-transparent text-ns-text-2 hover:text-ns-text-1'
                  }`}
                >
                  All Ward Issues ({issues.length})
                </button>
                <button
                  onClick={() => setActiveTab('my')}
                  className={`text-[14px] font-bold pb-2 border-b-2 transition-all ${
                    activeTab === 'my'
                      ? 'border-ns-orange text-ns-orange'
                      : 'border-transparent text-ns-text-2 hover:text-ns-text-1'
                  }`}
                >
                  My Submissions ({user.reportedCount})
                </button>
              </div>

              {/* Header CTA button */}
              <button
                onClick={onReportClick}
                className="bg-ns-orange text-white hover:bg-[#E5602F] px-4 py-2 rounded-md-custom font-bold text-xs tracking-wide transition-all active:scale-95 cursor-pointer self-start flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> File New Grievance
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-ns-text-3 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reports by title, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs h-10 pl-9 pr-4 rounded-md-custom border border-[#E8EAF0] focus:border-ns-orange focus:ring-1 focus:ring-ns-orange/20 outline-none bg-white font-medium"
                />
              </div>

              {/* Horizontal Category selector */}
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors select-none ${
                      categoryFilter === cat
                        ? 'bg-ns-orange text-white'
                        : 'bg-white border border-[#E8EAF0] text-ns-text-2 hover:bg-slate-55'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Issues Cards List */}
            {filteredIssues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onUpvote={onUpvoteIssue}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E8EAF0] rounded-lg-custom p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-ns-orange-10 flex items-center justify-center text-4xl mb-4">🌻</div>
                <h4 className="text-base font-bold text-ns-text-1 mb-1">Your area is clean!</h4>
                <p className="text-xs text-ns-text-2 max-w-sm mb-6">
                  No issues matches your filter criteria. Be the first to file a report if you spot infrastructure problems nearby.
                </p>
                <button
                  onClick={onReportClick}
                  className="bg-ns-orange text-white hover:bg-[#E5602F] px-5 py-2.5 rounded-md-custom font-bold text-xs"
                >
                  File Your Report →
                </button>
              </div>
            )}
          </div>

          {/* Badges system */}
          <div className="bg-white border border-[#E8EAF0] p-6 rounded-lg-custom card-shadow">
            <h3 className="text-sm font-bold text-ns-text-1 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-ns-orange" /> Unlocked Nagar Badges ({badges.filter(b => b.unlockedAt).length}/{badges.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {badges.map((badge) => {
                const isUnlocked = !!badge.unlockedAt;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border text-center relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-white to-ns-orange-10/40 border-ns-orange/20 shadow-xs'
                        : 'bg-white border-[#E8EAF0] opacity-70'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{badge.icon}</span>
                    <h5 className="text-[12px] font-bold text-ns-text-1 mb-1">{badge.name}</h5>
                    <p className="text-[10px] text-ns-text-2 leading-relaxed mb-3">{badge.description}</p>
                    {isUnlocked ? (
                      <span className="inline-block px-2 py-0.5 bg-ns-green/10 text-ns-green text-[9px] font-bold rounded">
                        ✓ UNLOCKED
                      </span>
                    ) : (
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-ns-orange h-full rounded-full"
                          style={{ width: `${badge.progress || 0}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Columns (Ward Score, Leaderboards, Neighbor Tasks; desktop only) */}
        <div className="space-y-8">
          
          {/* Circular Ward score gauge */}
          <WardHealthGauge score={79} title="Outer Circle Ward 142 Score" subtitle="BBMP Bengaluru health evaluation index" />

          {/* Neighborhood verification tasks - highly active gamification */}
          <div className="bg-white border border-[#E8EAF0] p-5 rounded-lg-custom card-shadow space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-ns-orange tracking-widest block mb-0.5">Nearby tasks needing backup</span>
              <h4 className="text-sm font-extrabold text-ns-text-1">Earn NagarPoints Nearby</h4>
            </div>

            {verifyRequests.length > 0 ? (
              <div className="space-y-4 divide-y divide-[#E8EAF0]">
                {verifyRequests.map((vr, idx) => (
                  <div key={vr.id} className={`pt-3 ${idx === 0 ? 'pt-0' : ''} space-y-2`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-ns-text-1 leading-snug line-clamp-2">{vr.title}</span>
                      <span className="text-[10px] text-ns-orange font-bold whitespace-nowrap shrink-0 ml-2 bg-ns-orange-10 px-1.5 py-0.5 rounded">
                        +{vr.pointsReward} PTS
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-ns-text-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-ns-text-3" /> {vr.distance}
                      </span>
                      <span>By {vr.reporter}</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleVerifyResolution(vr.id, vr.title)}
                        className="flex-1 bg-ns-teal text-white hover:bg-[#3dbdb4] text-[10px] font-bold py-1.5 rounded transition-colors"
                      >
                        Yes, I verified ✓
                      </button>
                      <button
                        onClick={() => setVerifyRequests(verifyRequests.filter((v) => v.id !== vr.id))}
                        className="bg-white hover:bg-slate-50 text-[10px] text-ns-text-2 font-bold px-3 py-1.5 rounded border border-[#E8EAF0] transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-ns-text-3 font-semibold text-[11px]">
                 No pending verifications nearby! <br />
                Your ward is pristine 🌿
              </div>
            )}
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-white border border-[#E8EAF0] p-5 rounded-lg-custom card-shadow space-y-4">
            <h4 className="text-sm font-extrabold text-ns-text-1 flex items-center gap-1.5">
              👑 Ward 142 Leaderboard
            </h4>
            
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Srinivas Murthy', points: 2450, avatar: 'SM', medal: '🥇' },
                { rank: 2, name: 'Radhika Sen', points: 1980, avatar: 'RS', medal: '🥈' },
                { rank: 3, name: 'Rajesh Nair', points: 1540, avatar: 'RN', medal: '🥉' },
                { rank: 14, name: user.name + ' (You)', points: user.points, avatar: 'L', highlight: true }
              ].map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-2 rounded ${
                    item.highlight ? 'bg-ns-orange-10 border border-ns-orange/20' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-ns-text-2 w-4">
                      {item.medal ? item.medal : `${item.rank}.`}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] font-bold text-ns-dark flex items-center justify-center shrink-0">
                      {item.avatar}
                    </div>
                    <span className="text-xs font-semibold text-ns-text-1 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-ns-dark whitespace-nowrap">{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
