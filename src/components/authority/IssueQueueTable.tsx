import React, { useState } from 'react';
import { CivicIssue } from '../../types';
import { ShieldCheck, Calendar, ArrowUpDown, ChevronRight, AlertTriangle, Hammer, Users } from 'lucide-react';

interface IssueQueueTableProps {
  issues: CivicIssue[];
  onActionClick: (issue: CivicIssue) => void;
}

export default function IssueQueueTable({ issues, onActionClick }: IssueQueueTableProps) {
  const [sortField, setSortField] = useState<string>('severity');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    let valA: any = a[sortField as keyof CivicIssue] || '';
    let valB: any = b[sortField as keyof CivicIssue] || '';

    if (sortField === 'daysOpen') {
      const dateA = new Date(a.reportedAt).getTime();
      const dateB = new Date(b.reportedAt).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA; // reverse for days open
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden text-slate-800 font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-mono border-b border-slate-200">
              <th className="p-3.5 font-bold cursor-pointer hover:text-slate-600" onClick={() => handleSort('id')}>
                ID <ArrowUpDown className="w-3 h-3 inline ml-0.5" />
              </th>
              <th className="p-3.5 font-bold">Category</th>
              <th className="p-3.5 font-bold">Locus (Title/Area)</th>
              <th className="p-3.5 font-bold cursor-pointer hover:text-slate-600" onClick={() => handleSort('severity')}>
                Severity <ArrowUpDown className="w-3 h-3 inline ml-0.5" />
              </th>
              <th className="p-3.5 font-bold cursor-pointer hover:text-slate-600" onClick={() => handleSort('witnessCount')}>
                Witnesses <ArrowUpDown className="w-3 h-3 inline ml-0.5" />
              </th>
              <th className="p-3.5 font-bold">Status</th>
              <th className="p-3.5 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedIssues.map(issue => {
              const reportedDate = new Date(issue.reportedAt);
              const daysOpen = Math.floor((Date.now() - reportedDate.getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysOpen >= 7 && issue.status !== 'resolved';

              return (
                <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Ticket ID */}
                  <td className="p-3.5 font-mono font-bold text-[#1F3A5F]">
                    {issue.id}
                  </td>

                  {/* Category */}
                  <td className="p-3.5 font-medium">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                      {issue.category}
                    </span>
                  </td>

                  {/* Title & Ward details */}
                  <td className="p-3.5 space-y-1 max-w-xs md:max-w-md">
                    <div className="font-bold text-slate-900 leading-snug truncate">
                      {issue.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 font-mono">
                      <span>📍 Ward: {issue.location.split(',').slice(-3)[0]?.trim() || issue.location}</span>
                      {isOverdue && (
                        <span className="text-rose-500 font-bold flex items-center gap-0.5 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> OVERDUE {daysOpen} DAYS
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                      issue.severity >= 8 ? 'bg-[#FF4858]' : issue.severity >= 5 ? 'bg-[#FF6B35]' : 'bg-[#4ECDC4]'
                    }`}>
                      {issue.severity}/10
                    </span>
                  </td>

                  {/* Witnesses */}
                  <td className="p-3.5 font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {issue.witnessCount}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="p-3.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white ${
                      issue.status === 'resolved' ? 'bg-[#1B5E20]' : 'bg-[#FF6B35]'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="p-3.5">
                    {issue.status === 'resolved' ? (
                      <span className="text-slate-400 font-bold flex items-center gap-0.5 text-[10px]">
                        ✓ RESOLVED
                      </span>
                    ) : (
                      <button
                        onClick={() => onActionClick(issue)}
                        className="px-2.5 py-1 bg-[#1F3A5F] hover:bg-[#152840] text-white text-[10px] font-bold uppercase rounded font-mono transition-colors flex items-center gap-0.5"
                      >
                        <Hammer className="w-3 h-3" /> Action <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
