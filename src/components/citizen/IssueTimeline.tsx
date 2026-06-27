import React from 'react';
import { TimelineStep } from '../../types';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface IssueTimelineProps {
  timeline: TimelineStep[];
}

export default function IssueTimeline({ timeline }: IssueTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 font-mono border border-[#1F3A5F]/10 rounded-[1px] bg-slate-50">
        No progress logs logged for this file yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2 pl-2">
      {timeline.map((step, index) => {
        const isDone = step.status === 'done';
        const isActive = step.status === 'active';

        return (
          <div key={step.id || index} className="flex gap-4 relative">
            {index < timeline.length - 1 && (
              <div
                className={`absolute left-2.5 top-6 bottom-0 w-0.5 ${
                  isDone ? 'bg-[#3F6B4E]' : 'bg-[#1F3A5F]/10'
                }`}
              />
            )}

            <div className="shrink-0 mt-0.5">
              {isDone ? (
                <CheckCircle className="w-5 h-5 text-[#3F6B4E]" />
              ) : isActive ? (
                <Clock className="w-5 h-5 text-[#E8B33D] animate-pulse" />
              ) : (
                <Circle className="w-5 h-5 text-[#1F3A5F]/20" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-[#1F3A5F]">{step.title}</span>
                {step.timestamp && (
                  <span className="text-[9px] font-mono font-bold text-[#1F3A5F]/55 uppercase">
                    {step.timestamp}
                  </span>
                )}
              </div>
              {step.meta && (
                <p className="text-[11px] text-[#1F3A5F]/75 font-serif leading-snug">
                  {step.meta}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
