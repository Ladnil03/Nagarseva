import React, { useState, useEffect } from 'react';
import { CivicIssue } from '../types';
import TransparencyStats from '../components/public/TransparencyStats';
import ShameBoard from '../components/public/ShameBoard';
import IssueMap from '../components/map/IssueMap';
import { ShieldCheck, MapPin, Search, Grid, Eye, Activity, ChevronRight, MessageSquare, Flame } from 'lucide-react';

export default function PublicFeed() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [wardHealth, setWardHealth] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    avgResolutionDays: 12,
    criticalOpen: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Load public data
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch public feed
      const feedRes = await fetch('/api/public/feed');
      if (feedRes.ok) {
        const feedData = await feedRes.json();
        setIssues(feedData.issues || []);
        setStats(feedData.stats);
      }

      // 2. Fetch ward health list
      const healthRes = await fetch('/api/public/ward-health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setWardHealth(healthData || []);
      }
    } catch (err) {
      console.error('Error loading public feed data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateRTI = async (issueId: string): Promise<string> => {
    const response = await fetch('/api/rti/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issueId })
    });
    if (!response.ok) throw new Error('RTI failed');
    const data = await response.json();
    return data.rtiText || '';
  };

  // Categories
  const categories = ['All', 'Road Pothole', 'Overflowing Garbage', 'Broken Streetlight', 'Sewage Leakage', 'Damaged Public Property'];

  // Filtering
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || issue.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-800 font-sans">
      {/* Hero Banner */}
      <div className="bg-[#0F1C2E] rounded-xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#1F3A5F]">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FFE66D]/10 text-[#FFE66D] rounded text-xs font-mono font-bold">
            <Activity className="w-4 h-4 animate-pulse" /> NAGARSEVA TRANSPARENCY PORTAL
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Bruhat Bengaluru Civic Integrity Ledger
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Uncensored real-time civic analytics ledger showing open hazardous tickets, ward health scores, SLA escalations, and community audits.
          </p>
        </div>
        <div className="flex gap-3 z-10 flex-shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-xs font-bold font-mono rounded flex items-center gap-1.5 transition-colors ${
              viewMode === 'list' ? 'bg-[#FFE66D] text-[#0F1C2E]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Grid className="w-4 h-4" /> Ledger Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 text-xs font-bold font-mono rounded flex items-center gap-1.5 transition-colors ${
              viewMode === 'map' ? 'bg-[#FFE66D] text-[#0F1C2E]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4" /> Live Map
          </button>
        </div>
      </div>

      {/* Transparency Stats */}
      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-20 bg-slate-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <TransparencyStats stats={stats} />
      )}

      {/* Main Split (Map or List View) */}
      {viewMode === 'map' ? (
        <div className="h-[550px] border border-slate-200 rounded-lg overflow-hidden shadow-md bg-slate-50 relative">
          <IssueMap issues={issues} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3): Issues ledger list */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filtering Controls */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search the civic ledger by keywords, ticket IDs, or locality..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-3 text-xs focus:ring-1 focus:ring-[#1F3A5F] focus:border-[#1F3A5F] focus:outline-none"
                />
              </div>

              {/* Category selector */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all font-mono ${
                      activeCategory === cat
                        ? 'bg-[#1F3A5F] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Issues list */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => <div key={n} className="h-28 bg-slate-50 rounded-lg animate-pulse border border-slate-100" />)}
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-500">No records found matching filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredIssues.map(issue => (
                  <div 
                    key={issue.id}
                    className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md p-4 transition-all flex flex-col sm:flex-row gap-4"
                  >
                    {/* Photo thumbnail */}
                    {issue.imageUrl && (
                      <div className="w-full sm:w-24 h-24 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={issue.imageUrl} 
                          alt={issue.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Details block */}
                    <div className="flex-1 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-bold font-mono rounded">
                            #{issue.id}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white ${
                            issue.status === 'resolved' ? 'bg-[#1B5E20]' : 'bg-[#FF6B35]'
                          }`}>
                            {issue.status.replace('_', ' ')}
                          </span>
                          {issue.isOnShameBoard && (
                            <span className="bg-[#1A1115] border border-rose-950 text-[#FF4858] text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Flame className="w-3 h-3 text-[#FF4858]" /> SHAME BOARD
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-extrabold text-slate-900 leading-snug pt-1">
                          {issue.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                          {issue.description}
                        </p>
                      </div>

                      {/* Footer detail indicators */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-2">
                        <span>🕒 Logged: {new Date(issue.reportedAt).toLocaleDateString()}</span>
                        <span>🏢 Division: {issue.department || 'Awaiting Routing'}</span>
                        <span>📍 Ward: {issue.location.split(',').slice(-3)[0]?.trim() || issue.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (1/3): Shame board and Ward Health rankings */}
          <div className="space-y-8">
            {/* Shame board */}
            <ShameBoard 
              issues={issues} 
              onGenerateRTI={handleGenerateRTI} 
            />

            {/* Ward Health Board Rankings */}
            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-4 shadow-sm">
              <h3 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
                📊 BBMP Ward Integrity League
              </h3>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Wards scored by resolution rates, SLA breaches, and verified citizen complaints (worst-performing listed first).
              </p>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(n => <div key={n} className="h-10 bg-slate-50 rounded animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {wardHealth.map((ward, idx) => (
                    <div 
                      key={ward.wardName}
                      className="flex items-center justify-between p-2.5 border border-slate-100 rounded bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-400">Rank #{idx + 1}</span>
                        <div className="text-xs font-bold text-slate-800">{ward.wardName}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold font-mono px-2 py-1 rounded text-white ${
                          ward.healthScore >= 80 ? 'bg-[#1B5E20]' : ward.healthScore >= 50 ? 'bg-[#FF6B35]' : 'bg-[#FF4858]'
                        }`}>
                          {ward.healthScore} PTS
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
