import React from 'react';
import { CivicIssue } from '../../types';
import IssueCard from '../../components/IssueCard';
import EmptyState from '../../components/common/EmptyState';
import { FolderHeart } from 'lucide-react';

interface MyIssuesProps {
  issues: CivicIssue[];
  onUpvote?: (id: string) => void;
  onDetailClick?: (issue: CivicIssue) => void;
}

export default function MyIssues({ issues, onUpvote, onDetailClick }: MyIssuesProps) {
  // Simulating "My Issues" - odd numbered IDs or certain status count as user's
  const myIssuesList = issues.filter(issue => issue.id.endsWith('1') || issue.id.endsWith('3'));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-8 py-6 animate-fade-in">
      <div className="border-b border-[#1F3A5F]/15 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#1F3A5F]/60 uppercase block">
          Citizen Ledger Records
        </span>
        <h2 className="text-xl font-serif font-black text-[#1F3A5F] uppercase">
          My Filed Complaints ({myIssuesList.length})
        </h2>
      </div>

      {myIssuesList.length === 0 ? (
        <EmptyState
          title="No issues filed yet"
          description="You have not filed any municipal complaints from this account yet."
          icon={<FolderHeart className="w-6 h-6 text-[#B3211E]" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myIssuesList.map((issue) => (
            <div key={issue.id} className="relative group">
              <IssueCard issue={issue} onUpvote={onUpvote} />
              {onDetailClick && (
                <button
                  onClick={() => onDetailClick(issue)}
                  className="absolute bottom-4 right-4 bg-[#1F3A5F] hover:bg-[#152842] text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-[1px] shadow-sm z-10"
                >
                  LEDGER VIEW
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
