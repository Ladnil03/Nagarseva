import React, { useState, useEffect } from 'react';
import { CivicIssue } from '../../types';
import IssueQueueTable from '../../components/authority/IssueQueueTable';
import EscalationAlert from '../../components/authority/EscalationAlert';
import StatusUpdateModal from '../../components/authority/StatusUpdateModal';
import ComparisonView from '../../components/verification/ComparisonView';
import { useEscalations } from '../../hooks/useEscalations';
import { ShieldAlert, Award, FolderOpen, RefreshCw, Star, Info, Flame, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthorityDashboard() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [stats, setStats] = useState({
    openIssues: 0,
    resolvedIssues: 0,
    totalIssues: 0,
    resolutionRate: '100%',
    avgResolutionDays: '12 days',
    slaBreaches: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queue' | 'sla' | 'disputes'>('queue');
  
  // Modal controllers
  const [selectedIssueForAction, setSelectedIssueForAction] = useState<CivicIssue | null>(null);
  const [auditedDispute, setAuditedDispute] = useState<CivicIssue | null>(null);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const { breaches, triggerSlaCron, refreshBreaches } = useEscalations(selectedWard === 'All' ? undefined : selectedWard);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch ward KPIs
      const wardParam = selectedWard === 'All' ? '' : `?ward=${encodeURIComponent(selectedWard)}`;
      const statsRes = await fetch(`/api/authority/ward-stats${wardParam}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch all raw issues
      const issuesRes = await fetch('/api/issues');
      if (issuesRes.ok) {
        const issuesData = await issuesRes.json();
        // Filter by ward if necessary
        const filtered = selectedWard === 'All' 
          ? issuesData 
          : issuesData.filter((i: CivicIssue) => i.location.includes(selectedWard));
        setIssues(filtered);
      }
    } catch (err) {
      console.error('Error fetching authority dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedWard]);

  const handleUpdateStatus = async (payload: any) => {
    const res = await fetch('/api/authority/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update failed');
    }
    await fetchDashboardData();
    await refreshBreaches();
  };

  const handleTriggerSlaCronSimulate = async () => {
    setLoading(true);
    try {
      await triggerSlaCron();
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to run SLA Cron:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDisputeAudit = async (issue: CivicIssue) => {
    setAuditedDispute(issue);
    setAuditLoading(true);
    setAuditResult(null);
    try {
      // Trigger visual audit comparison with Gemini Vision API route
      const auditRes = await fetch('/api/verification/compare-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPhotoURL: issue.imageUrl,
          // Simulated dispute photo representing citizen uploaded proof of active failure
          newPhotoURL: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?auto=format&fit=crop&w=400&q=80',
          comparisonType: 'closure_audit'
        })
      });

      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditResult(auditData);
      }
    } catch (err) {
      console.error('Dispute photo audit failing:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  // Lists filtered by tab
  const activeQueue = issues.filter(i => !['resolved'].includes(i.status));
  const activeDisputes = issues.filter(i => ['disputed', 'falsely_closed'].includes(i.status));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-800 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1F3A5F] p-6 rounded-lg text-white shadow-md border border-[#1F3A5F]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-400/15 text-sky-300 rounded text-[9px] font-bold font-mono tracking-wider">
            🏛️ OFFICIAL BBMP WARD MANAGEMENT PANEL
          </div>
          <h2 className="text-xl font-bold font-sans tracking-tight">
            NagarSeva Authority Command Console
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Authorize state transitions, allocate ground units, perform statutory SLA audits, and conduct AI-assisted visual dispute closure reviews.
          </p>
        </div>

        {/* Ward filter selector and SLA Cron simulation button */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={selectedWard}
            onChange={e => setSelectedWard(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none"
          >
            <option value="All">All Operational Wards</option>
            <option value="Ward 93">Ward 93 (Kalyan Nagar)</option>
            <option value="Ward 142">Ward 142 (Defence Colony)</option>
            <option value="Ward 150">Ward 150 (Sarjapur / Bellandur)</option>
            <option value="Ward 151">Ward 151 (Koramangala)</option>
          </select>

          <button
            onClick={handleTriggerSlaCronSimulate}
            className="px-3 py-1.5 bg-[#FFE66D] hover:bg-[#FFE66D]/80 text-[#0F1C2E] text-xs font-bold font-mono rounded flex items-center gap-1 transition-colors"
            title="Simulate Cron"
          >
            <RefreshCw className="w-3.5 h-3.5" /> SLA Audit Cron
          </button>
        </div>
      </div>

      {/* KPI stats metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-md text-sm font-bold font-mono">
            {stats.openIssues}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Pending Actions</div>
            <div className="text-sm font-extrabold text-slate-800">Open Tickets</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-md text-sm font-bold font-mono">
            {stats.slaBreaches}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">SLA Warnings</div>
            <div className="text-sm font-extrabold text-slate-800">Escalated Records</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-md text-sm font-bold font-mono">
            {stats.resolutionRate}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">SLA Performance</div>
            <div className="text-sm font-extrabold text-slate-800">Resolution Speed</div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-md text-sm font-bold font-mono">
            {stats.avgResolutionDays}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Historical Metric</div>
            <div className="text-sm font-extrabold text-slate-800">Avg Resolution Speed</div>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'queue' ? 'border-[#1F3A5F] text-[#1F3A5F]' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          📋 Active Tickets Queue ({activeQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'sla' ? 'border-[#1F3A5F] text-[#1F3A5F]' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🚨 SLA Escalations ({breaches.length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'disputes' ? 'border-[#1F3A5F] text-[#1F3A5F]' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          ⚠️ Resident Disputes ({activeDisputes.length})
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center text-xs text-slate-500 font-mono flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-t-transparent border-[#1F3A5F] rounded-full animate-spin" />
          <span>Synchronizing with Bruhat Bengaluru backend databases...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'queue' && (
            <IssueQueueTable
              issues={activeQueue}
              onActionClick={setSelectedIssueForAction}
            />
          )}

          {activeTab === 'sla' && (
            <EscalationAlert
              breaches={breaches}
              onResolveOverdue={issueId => {
                const matched = issues.find(i => i.id === issueId);
                if (matched) setSelectedIssueForAction(matched);
              }}
            />
          )}

          {activeTab === 'disputes' && (
            <div className="space-y-6">
              {activeDisputes.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg text-emerald-800 text-xs font-medium text-center">
                  ✓ Outstanding Disputes Clean Sheet: No citizen disputes active on resolved tickets.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Disputes List */}
                  <div className="space-y-4">
                    {activeDisputes.map(issue => (
                      <div 
                        key={issue.id}
                        className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center"
                        onClick={() => handleOpenDisputeAudit(issue)}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-bold rounded border border-rose-100 font-mono">
                              #{issue.id}
                            </span>
                            <span className="text-[10px] text-[#FF4858] font-bold font-mono">
                              ⚠️ DISPUTED RESOLUTION
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800">{issue.title}</h4>
                          <p className="text-[10px] text-slate-500">📍 {issue.location}</p>
                        </div>
                        <div className="text-[11px] font-bold font-mono text-slate-400">
                          Inspect &rarr;
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Audit Visualizer (Side-by-Side Comparison using Gemini Vision) */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col justify-center min-h-[300px]">
                    {auditedDispute ? (
                      auditLoading ? (
                        <div className="text-center space-y-3 font-mono text-xs text-slate-500 py-12">
                          <div className="w-6 h-6 border-2 border-t-transparent border-[#1F3A5F] rounded-full animate-spin mx-auto" />
                          <span>Gemini Vision parsing before/after visual pixels...</span>
                        </div>
                      ) : auditResult ? (
                        <div className="space-y-4">
                          <ComparisonView
                            originalPhoto={auditedDispute.imageUrl || ''}
                            newPhoto="https://images.unsplash.com/photo-1596422846543-75c6fc18a523?auto=format&fit=crop&w=400&q=80"
                            auditResult={auditResult}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                handleUpdateStatus({ id: auditedDispute.id, status: 'assigned', workerName: 'Senior Auditor Team', expectedDate: 'Within 2 days', actionComment: 'Re-assigned to priority inspection after citizen visual dispute audit.' });
                                setAuditedDispute(null);
                              }}
                              className="flex-1 py-2 bg-slate-900 text-white rounded text-xs font-mono font-bold hover:bg-slate-800 transition-colors"
                            >
                              ✓ Accept Dispute (Re-Open)
                            </button>
                            <button
                              onClick={() => {
                                setAuditedDispute(null);
                              }}
                              className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded text-xs font-mono font-bold hover:bg-slate-50 transition-colors"
                            >
                              Reject Dispute
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-slate-400 font-mono py-12">
                          Failed to perform visual photo audit. Select a ticket.
                        </div>
                      )
                    ) : (
                      <div className="text-center text-xs text-slate-400 font-mono py-12 flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <span>Select a disputed ticket from the left panel to execute an automatic Gemini Vision Visual Audit.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Status Update Modal popup */}
      {selectedIssueForAction && (
        <StatusUpdateModal
          issue={selectedIssueForAction}
          onClose={() => setSelectedIssueForAction(null)}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
}
