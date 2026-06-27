import React, { useState } from 'react';
import { CivicIssue } from '../types';
import InteractiveMap from './InteractiveMap';
import IssueCard from './IssueCard';
import { MapPin, Filter, Layers, AlertCircle, ThumbsUp, Calendar, ChevronRight } from 'lucide-react';

interface PublicTransparencyFeedProps {
  issues: CivicIssue[];
  onUpvoteIssue: (id: string) => void;
  currentCity?: string;
  activeWard?: string;
}

export default function PublicTransparencyFeed({
  issues,
  onUpvoteIssue,
  currentCity = 'Bengaluru',
  activeWard = 'HAL 2nd Stage Ward 142',
}: PublicTransparencyFeedProps) {
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(issues[0] || null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'near_me'>('all');

  // Filter issues according to tab
  const filteredIssues = issues.filter((item) => {
    if (activeFilter === 'critical') return item.riskLevel === 'critical';
    if (activeFilter === 'near_me') return ['NS-2026-001', 'NS-2026-003', 'NS-2026-004'].includes(item.id);
    return true;
  });

  // Extract extremely unresolved issues for transparency "Shame Board" (Simulated > 14 days open)
  const shameIssues = issues.filter(
    (item) => item.status !== 'resolved' && (item.daysOpen || 0) >= 10
  );

  return (
    <div id="transparency-feed" className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header briefing */}
      <div className="select-none">
        <h1 className="text-xl md:text-2xl font-extrabold text-ns-text-1">Public Transparency Feed & Radar Map</h1>
        <p className="text-xs text-ns-text-2 mt-1">
          Explore real-time reports validated by citizens and verified by AI in <span className="text-ns-orange font-bold font-sans">{activeWard}</span> layout. Hover or tap map pins to audit timeline logs.
        </p>
      </div>

      {/* Grid of Map and Bottom lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Map (takes 2/3 space on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <InteractiveMap
            issues={issues}
            selectedIssueId={selectedIssue?.id || null}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            activeFilter={activeFilter}
            currentCity={currentCity}
          />

          {/* Map metadata ticker details */}
          <div className="bg-white border border-[#E8EAF0] p-4 rounded-lg-custom flex items-center justify-between text-xs font-semibold card-shadow">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ns-orange shrink-0 animate-bounce" />
              <span>Visible grid: Active Ward Sectors, {currentCity}</span>
            </div>
            <div className="text-slate-400">
              Showing {filteredIssues.length} incidents on live overlay
            </div>
          </div>
        </div>

        {/* Slide-up lists of issues (takes 1/3 space) */}
        <div className="bg-white border border-[#E8EAF0] rounded-lg-custom overflow-hidden flex flex-col h-[480px] lg:h-[515px] card-shadow">
          
          {/* Header filter tabs */}
          <div className="p-4 bg-slate-50 border-b border-[#E8EAF0] select-none shrink-0">
            <h3 className="text-xs font-black text-ns-text-1 uppercase tracking-wider mb-3">Community Watch board</h3>
            
            <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-md text-[11px] font-bold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-1 py-1.5 rounded transition-all cursor-pointer ${
                  activeFilter === 'all' ? 'bg-white text-ns-orange shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('critical')}
                className={`flex-1 py-1.5 rounded transition-all cursor-pointer ${
                  activeFilter === 'critical' ? 'bg-white text-ns-red shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔴 Critical
              </button>
              <button
                onClick={() => setActiveFilter('near_me')}
                className={`flex-1 py-1.5 rounded transition-all cursor-pointer ${
                  activeFilter === 'near_me' ? 'bg-white text-ns-orange shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📍 Nearby
              </button>
            </div>
          </div>

          {/* List flow containers */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-4 space-y-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedIssue(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedIssue?.id === item.id
                      ? 'border-ns-orange bg-ns-orange-10/10'
                      : 'border-slate-150 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[9px] font-bold uppercase text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.5 rounded">
                      {item.id}
                    </span>
                    <span className="text-[9px] font-bold text-ns-text-2">{item.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-ns-text-1 line-clamp-1 leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-[#718096] truncate mt-0.5">{item.location}</p>
                  
                  <div className="flex justify-between items-center text-[9px] text-[#A0AEC0] pt-2 mt-2 border-t border-dashed border-slate-100">
                    <span className="font-semibold text-ns-text-1">Severity: {item.severity}/10</span>
                    <span className="text-ns-dark font-extrabold">{item.witnessCount} Votes</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 font-semibold text-xs">
                No active issues on watch-list.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Selected Incident detailed Audit steps summary (Desktop/Mobile overlay card) */}
      {selectedIssue && (
        <div className="bg-white border border-[#E8EAF0] p-6 rounded-lg-custom shadow-md animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Thumbnail */}
            {selectedIssue.imageUrl && (
              <div className="w-full md:w-[200px] h-[130px] rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                <img
                  src={selectedIssue.imageUrl}
                  alt={selectedIssue.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Detailed descriptions auditing */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded tracking-wider uppercase">
                  {selectedIssue.id} INCIDENT AUDIT
                </span>
                <span className="text-xs font-semibold text-slate-400">·</span>
                <span className="text-xs font-bold text-ns-text-2">{selectedIssue.category}</span>
              </div>

              <h3 className="text-base font-extrabold text-ns-text-1">{selectedIssue.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedIssue.description}</p>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex gap-4">
                  <span className="font-semibold text-slate-500">
                    Assigned Unit: <span className="font-bold text-ns-text-1">{selectedIssue.department || 'Awaiting Routing'}</span>
                  </span>
                  <span className="font-semibold text-slate-500">
                    SLA Age: <span className="font-bold text-ns-text-1">{selectedIssue.daysOpen || 0} Days</span>
                  </span>
                </div>

                <button
                  onClick={() => onUpvoteIssue(selectedIssue.id)}
                  className="px-4 py-1.5 bg-ns-orange text-white hover:bg-[#E5602F] font-bold rounded text-xs transition-transform active:scale-95 cursor-pointer"
                >
                  Verify Incident (+25 pts)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shame board section (Holding authorities accountable!) */}
      <section className="bg-[#1A1A2E] border border-ns-red/20 rounded-lg-custom p-6 text-white space-y-6">
        <div className="border-b border-white/10 pb-4 select-none">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">⚠️</span>
            <h4 className="text-sm font-extrabold tracking-wider text-ns-red uppercase">Official Accountability Watch-Board</h4>
          </div>
          <p className="text-xs text-slate-400">
            Wards and items exceeding statutory 10-day SLA limits. Highlighted transparently for citizen review.
          </p>
        </div>

        {shameIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shameIssues.map((item) => (
              <div
                key={item.id}
                className="bg-[#131326] border border-ns-red/30 p-4 rounded-lg flex justify-between items-center transition-all duration-200 hover:border-ns-red/50"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-[10px]">
                    <span className="font-extrabold text-ns-red">OVERDUE BY {item.daysOpen ? item.daysOpen - 7 : 3} DAYS</span>
                    <span className="text-[#A0AEC0]">·</span>
                    <span className="text-slate-400">{item.id}</span>
                  </div>
                  <h5 className="text-xs font-bold truncate max-w-[200px] text-white">{item.title}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.location.split(',')[0]} (Ward 142)</p>
                  
                  <div className="mt-2.5 text-[10px] text-slate-400">
                    Dept: <strong className="text-slate-200 font-semibold">{item.department || 'In Dispute'}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="w-14 h-14 rounded-full bg-ns-red/10 border border-ns-red/45 flex flex-col items-center justify-center font-black text-xs text-ns-red">
                    <span>{item.daysOpen || 10}</span>
                    <span className="text-[7px] font-bold tracking-widest text-slate-300 uppercase">DAYS</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs font-semibold">
            Outstanding workroom efficiency! No tickets currently exceeding limits 👍
          </div>
        )}
      </section>

    </div>
  );
}
