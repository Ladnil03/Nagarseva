import React from 'react';
import { AchievementBadge } from '../../types';
import { CheckCircle2, Lock } from 'lucide-react';

interface BadgeCardProps {
  badge: AchievementBadge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const isUnlocked = badge.progress !== undefined && badge.progress >= 100;

  return (
    <div
      className={`bg-[#FFFBF4] border border-[#1F3A5F]/15 p-4 rounded-[2px] relative card-shadow flex gap-3 items-center ${
        isUnlocked ? 'border-[#3F6B4E]/40' : 'opacity-85'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-[#1F3A5F]/5 border border-[#1F3A5F]/10 flex items-center justify-center shrink-0 text-2xl">
        {badge.icon}
      </div>

      <div className="space-y-1 w-full min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-serif font-black text-[#1F3A5F] truncate">
            {badge.name}
          </span>
          {isUnlocked ? (
            <CheckCircle2 className="w-4 h-4 text-[#3F6B4E] shrink-0" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-[#1F3A5F]/40 shrink-0" />
          )}
        </div>

        <p className="text-[10px] text-[#1F3A5F]/75 font-sans leading-snug line-clamp-2">
          {badge.description}
        </p>

        {badge.progress !== undefined && badge.progress < 100 && (
          <div className="pt-1.5 space-y-1">
            <div className="flex justify-between text-[8px] font-mono font-bold text-[#1F3A5F]/60">
              <span>PROGRESS</span>
              <span>{badge.progress}%</span>
            </div>
            <div className="w-full h-1 bg-[#1F3A5F]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E8B33D]"
                style={{ width: `${badge.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
