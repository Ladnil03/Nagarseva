import React, { useState } from 'react';
import { CivicIssue, IssueStatus } from '../types';
import { AlertCircle, Shield, Briefcase, Users, CheckSquare, Clock, Filter, ChevronRight, Check, AlertTriangle, ArrowUpDown, ChevronDown } from 'lucide-react';

interface AuthorityDashboardProps {
  issues: CivicIssue[];
  onUpdateIssueStatus: (
    id: string,
    status: IssueStatus,
    comment: string,
    department?: string
  ) => void;
}

export default function AuthorityDashboard({
  issues,
  onUpdateIssueStatus,
}: AuthorityDashboardProps) {
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [newStatus, setNewStatus] = useState<IssueStatus>('assigned');
  const [officerComment, setOfficerComment] = useState('');
  const [routingDept, setRoutingDept] = useState('');
  const [sortField, setSortField] = useState<'severity' | 'reportedAt' | 'daysOpen'>('severity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sidebarTab, setSidebarTab] = useState<'queue' | 'escalations'>('queue');

  // Filter issues escalations (> 7 days open without resolution)
  const escalationIssues = issues.filter(
    (item) => item.status !== 'resolved' && (item.daysOpen || 0) >= 7
  );

  // Compute stats
  const openIssuesCount = issues.filter((i) => i.status !== 'resolved').length;
  const resolvedIssuesCount = issues.filter((i) => i.status === 'resolved').length;
  const totalInQueue = issues.length;
  const resolutionRate = totalInQueue ? Math.round((resolvedIssuesCount / totalInQueue) * 100) : 0;

  // Handle sorting
  const sortedIssues = [...issues].sort((a, b) => {
    let aVal = a[sortField] || 0;
    let bVal = b[sortField] || 0;

    if (sortField === 'reportedAt') {
      aVal = new Date(a.reportedAt as string).getTime();
      bVal = new Date(b.reportedAt as string).getTime();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: 'severity' | 'reportedAt' | 'daysOpen') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    
    onUpdateIssueStatus(selectedIssue.id, newStatus, officerComment, routingDept);
    setSelectedIssue(null); // Clear selected drawer
    setOfficerComment('');
    setRoutingDept('');
  };

  // Status mapping visual colors
  const statusLabels: Record<IssueStatus, string> = {
    reported: 'bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded-full',
    verified: 'bg-[#E0F2FE] text-[#0369A1] text-[10px] font-bold px-2 py-0.5 rounded-full',
    assigned: 'bg-[#FFF7ED] text-[#C2410C] text-[10px] font-bold px-2 py-0.5 rounded-full',
    in_progress: 'bg-ns-orange-10 text-[#EA580C] text-[10px] font-bold px-2 py-0.5 rounded-full',
    resolved: 'bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold px-2 py-0.5 rounded-full',
    disputed: 'bg-[#FEF2F2] text-[#FF4858] text-[10px] font-bold px-2 py-0.5 rounded-full',
    falsely_closed: 'bg-[#FEF2F2] text-[#FF4858] text-[10px] font-bold px-2 py-0.5 rounded-full',
    chronic: 'bg-[#1A1A2E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full',
  };

  const severityBorders: Record<string, string> = {
    critical: 'border-l-[#FF4858]',
    high: 'border-l-[#FF6B35]',
    medium: 'border-l-[#FFE66D]',
    low: 'border-l-[#6BCB77]',
  };

  return (
    <div id="authority-dashboard" className="flex min-h-screen bg-ns-bg text-ns-dark">
      
      {/* Sidebar navigation (hidden mobile) */}
      <aside className="hidden lg:flex w-[240px] bg-ns-dark text-white flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🏛️</span>
            <span className="text-[17px] font-extrabold tracking-tight">Authority Panel</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ward 142 • BBMP Office</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setSidebarTab('queue')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-xs font-semibold tracking-wide cursor-pointer text-left transition-all ${
              sidebarTab === 'queue' ? 'bg-[#1e2a38] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Active Issue Queue
            </span>
            <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full text-[9px]">
              {sortedIssues.length}
            </span>
          </button>

          <button
            onClick={() => setSidebarTab('escalations')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-xs font-semibold tracking-wide cursor-pointer text-left transition-all ${
              sidebarTab === 'escalations' ? 'bg-[#1e2a38] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <AlertSquareWrapper /> SLA Escalations
            </span>
            <span className="bg-ns-red text-white px-2 py-0.5 rounded-full text-[9px] animate-pulse">
              {escalationIssues.length}
            </span>
          </button>
        </nav>

        {/* Bottom Officer sign tag */}
        <div className="p-4 border-t border-white/10 bg-[#0B1522]">
          <p className="text-xs font-bold leading-tight">Sri M. Nagaraj</p>
          <p className="text-[10px] text-slate-400">Chief Municipal Commissioner</p>
          <div className="mt-2 text-[9px] bg-ns-green/10 text-ns-green inline-block px-1.5 py-0.5 rounded font-extrabold uppercase">
            ● Server Connected
          </div>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 max-w-full">
        
        {/* Top KPI Metric Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8EAF0] p-4 rounded-lg-custom shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ns-orange-10 text-ns-orange flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-ns-text-2 font-bold uppercase tracking-wider block">Open Issues</span>
              <span className="text-xl font-extrabold text-ns-text-1">{openIssuesCount}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8EAF0] p-4 rounded-lg-custom shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ns-teal-10 text-ns-teal flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-ns-text-2 font-bold uppercase tracking-wider block">Resolved SLA</span>
              <span className="text-xl font-extrabold text-ns-text-1">{resolvedIssuesCount}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8EAF0] p-4 rounded-lg-custom shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 opacity-95 rounded-full bg-red-50 text-ns-red flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-ns-text-2 font-bold uppercase tracking-wider block">SLA Breaches</span>
              <span className="text-xl font-extrabold text-ns-red">{escalationIssues.length}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8EAF0] p-4 rounded-lg-custom shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-ns-text-2 font-bold uppercase tracking-wider block">Resolution Rate</span>
              <span className="text-xl font-extrabold text-ns-text-1">{resolutionRate}%</span>
            </div>
          </div>
        </div>

        {/* Alerts section */}
        {escalationIssues.length > 0 && (
          <div className="bg-[#FEF2F2] border border-ns-red/20 p-4 rounded-lg-custom flex items-start gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-ns-red shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-ns-red uppercase tracking-wider">Escalation Alert — Underperformance Watch</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                You have <strong>{escalationIssues.length} issues</strong> that have remained unresolved for over 7 days. These will trigger Ward performance deductions on the citizen leaderboard feed in 12 hours.
              </p>
            </div>
          </div>
        )}

        {/* Active queue table summary */}
        <div className="bg-white border border-[#E8EAF0] rounded-lg-custom shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-[#E8EAF0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-ns-text-1 uppercase tracking-wider">
                {sidebarTab === 'escalations' ? 'Breached SLA Escalations' : 'Core Municipal Issue Queue'}
              </h3>
              <p className="text-[10px] text-ns-text-2 mt-0.5">Click any row to trigger formal status updates and work-orders.</p>
            </div>

            {/* Sorters and search filter indicators */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => toggleSort('severity')}
                className={`px-3 py-1.5 rounded flex items-center gap-1 font-semibold ${
                  sortField === 'severity' ? 'bg-ns-orange/10 text-ns-orange' : 'bg-white border border-slate-200'
                }`}
              >
                Sort: Severity <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleSort('reportedAt')}
                className={`px-3 py-1.5 rounded flex items-center gap-1 font-semibold ${
                  sortField === 'reportedAt' ? 'bg-ns-orange/10 text-ns-orange' : 'bg-white border border-slate-200'
                }`}
              >
                Sort: Age <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tab lists */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Grievance Category</th>
                  <th className="p-4">Street / Location</th>
                  <th className="p-4 text-center">Risk</th>
                  <th className="p-4 text-center">Age (Days)</th>
                  <th className="p-4">Assigned Unit</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right pr-6">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {(sidebarTab === 'escalations' ? escalationIssues : sortedIssues).map((issue) => {
                  return (
                    <tr
                      key={issue.id}
                      className={`hover:bg-slate-50 transition-colors border-l-4 ${
                        severityBorders[issue.riskLevel]
                      } ${issue.daysOpen && issue.daysOpen >= 7 && issue.status !== 'resolved' ? 'bg-red-50/30' : ''}`}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-ns-text-1">{issue.category}</span>
                          <span className="text-[10px] text-slate-400 font-bold select-none">{issue.id}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold line-clamp-1 mt-0.5">{issue.title}</div>
                      </td>
                      <td className="p-4 max-w-[200px] truncate leading-relaxed">
                        <span className="font-semibold text-slate-700">{issue.location}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            issue.riskLevel === 'critical'
                              ? 'bg-ns-red'
                              : issue.riskLevel === 'high'
                              ? 'bg-ns-orange'
                              : 'bg-ns-yellow'
                          }`}
                        />
                        <span className="text-[10px] ml-1.5 font-bold uppercase">{issue.riskLevel}</span>
                      </td>
                      <td className="p-4 text-center font-semibold text-ns-text-1">{issue.daysOpen || 0}d</td>
                      <td className="p-4 text-slate-500 font-medium">{issue.department || 'Awaiting Desk Routing'}</td>
                      <td className="p-4">
                        <span className={statusLabels[issue.status]}>{issue.status.replace('_', ' ')}</span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setNewStatus(issue.status);
                            setRoutingDept(issue.department || '');
                          }}
                          className="px-3 py-1.5 bg-ns-orange text-white hover:bg-[#E5602F] rounded text-[11px] font-bold tracking-wide cursor-pointer transition-all active:scale-95 flex items-center gap-1 ml-auto"
                        >
                          Update Status <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Slide-out Status Update Drawer Overlay */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] text-[#4F46E5] font-bold bg-[#EEF2FF] px-2 py-0.5 rounded tracking-wide">
                    TICKET {selectedIssue.id}
                  </span>
                  <h3 className="text-base font-extrabold text-ns-text-1 mt-1">Audit Status Update</h3>
                </div>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="rounded-full w-8 h-8 hover:bg-slate-100 font-bold text-slate-400 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Selected Issue Preview Mini-Card */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedIssue.category}</span>
                <h4 className="text-xs font-bold text-ns-text-1 leading-snug line-clamp-1">{selectedIssue.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{selectedIssue.description}</p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-ns-text-2 uppercase block mb-1.5">Action Status Route</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                    className="w-full text-xs h-10 border border-slate-300 rounded px-3 focus:border-ns-orange focus:ring-1 focus:ring-ns-orange/20"
                  >
                    <option value="assigned">Assumed jurisdictional assignment (assigned)</option>
                    <option value="in_progress">Dispatched active repair crew (in_progress)</option>
                    <option value="resolved">Issue resolved successfully (resolved)</option>
                    <option value="chronic">Mark as persistent repeat issue (chronic)</option>
                    <option value="disputed">Jurisdiction dispute with National Agencies (disputed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ns-text-2 uppercase block mb-1.5">Department Assignment</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BESCOM Phase-3 Maintenance Grid"
                    value={routingDept}
                    onChange={(e) => setRoutingDept(e.target.value)}
                    className="w-full text-xs h-10 border border-slate-300 rounded px-3 focus:border-ns-orange focus:ring-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ns-text-2 uppercase block mb-1.5">Audit Action Comment</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter official briefing for citizen review log..."
                    value={officerComment}
                    onChange={(e) => setOfficerComment(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-3 focus:border-ns-orange focus:ring-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-ns-orange text-white hover:bg-[#E5602F] text-xs font-bold py-2.5 rounded shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Save Dispatch Log
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIssue(null)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline helper for AlertIcon which wraps AlertCircle
function AlertSquareWrapper() {
  return <AlertCircle className="w-4 h-4 text-ns-red" />;
}
