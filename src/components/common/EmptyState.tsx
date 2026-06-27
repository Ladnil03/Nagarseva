import React from 'react';
import { Landmark } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No records found',
  description = 'There are no items matching the query at the moment.',
  icon
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-lg text-center shadow-sm">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        {icon || <Landmark className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}
