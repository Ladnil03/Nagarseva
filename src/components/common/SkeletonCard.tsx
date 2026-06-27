import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm space-y-3 animate-pulse">
      <div className="h-40 bg-slate-200 rounded-md w-full" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-200 rounded w-1/4" />
    </div>
  );
}
