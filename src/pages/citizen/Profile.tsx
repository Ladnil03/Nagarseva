import React from 'react';
import { UserProfile, AchievementBadge } from '../../types';
import BadgeCard from '../../components/citizen/BadgeCard';
import PointsBadge from '../../components/citizen/PointsBadge';
import { calculateUserLevel } from '../../utils/helpers';
import { Award, Landmark, User, ShieldCheck } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  badges: AchievementBadge[];
  onLogoutClick: () => void;
}

export default function Profile({ user, badges, onLogoutClick }: ProfileProps) {
  const currentLevelObj = calculateUserLevel(user.points);
  
  const getNextLevelSim = (pts: number) => {
    if (pts < 500) return { name: "Nagar Sevak", minPoints: 500 };
    if (pts < 2000) return { name: "Nagar Rakshak", minPoints: 2000 };
    if (pts < 5000) return { name: "Nagar Hero", minPoints: 5000 };
    return null;
  };

  const getProgressSim = (pts: number) => {
    if (pts < 500) return Math.round((pts / 500) * 100);
    if (pts < 2000) return Math.round(((pts - 500) / 1500) * 100);
    if (pts < 5000) return Math.round(((pts - 2000) / 3000) * 100);
    return 100;
  };

  const nextLevelObj = getNextLevelSim(user.points);
  const progressPercent = getProgressSim(user.points);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-8 pb-16">
      
      {/* Profile summary card */}
      <div className="bg-[#FFFBF4] border-2 border-[#1F3A5F] p-6 rounded-[2px] relative card-shadow space-y-6">
        
        {/* Title */}
        <div className="border-b border-[#1F3A5F]/20 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="font-mono text-[9px] font-bold text-[#1F3A5F]/60 uppercase tracking-widest block">
              NagarSeva Verified Citizen Profile
            </span>
            <h1 className="text-xl font-serif font-black text-[#1F3A5F] uppercase mt-0.5">
              {user.name}
            </h1>
          </div>

          <button
            onClick={onLogoutClick}
            className="text-xs text-[#B3211E] hover:underline font-bold uppercase tracking-wider self-start"
          >
            Sign Out / Exit Register
          </button>
        </div>

        {/* Content rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Avatar and tier */}
          <div className="md:col-span-1 border border-[#1F3A5F]/15 p-4 bg-[#1F3A5F]/5 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center text-xl font-serif font-black select-none">
              {user.avatarInitials}
            </div>

            <div className="space-y-1">
              <span className="bg-[#FFE66D]/20 text-[#B3211E] text-[10px] font-mono font-black border border-[#FFE66D]/50 px-2 py-0.5 rounded-[1px] uppercase tracking-wider select-none inline-block">
                Level {user.level} {currentLevelObj.name}
              </span>
              <p className="text-[10px] text-[#1F3A5F]/60 font-mono">
                WARD MEMBER INDICES
              </p>
            </div>
          </div>

          {/* Stats details */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Level up progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-serif font-black text-[#1F3A5F] uppercase tracking-wide">
                  Promotion Standing Progress
                </span>
                {nextLevelObj ? (
                  <span className="text-[9px] font-mono text-[#1F3A5F]/70">
                    {user.points} / {nextLevelObj.minPoints || 500} PTS TO NEXT TIER
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-[#3F6B4E] font-bold">
                    MAX PROMOTION REACHED 🏆
                  </span>
                )}
              </div>

              <div className="w-full h-3 bg-[#1F3A5F]/15 rounded-full overflow-hidden p-0.5 border border-[#1F3A5F]/10">
                <div
                  className="h-full bg-[#E8B33D] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[8px] font-mono text-[#1F3A5F]/55">
                <span>{currentLevelObj.name}</span>
                {nextLevelObj && <span>{nextLevelObj.name}</span>}
              </div>
            </div>

            {/* Quick counters */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="border border-[#1F3A5F]/10 p-2.5 text-center bg-white">
                <span className="text-sm font-serif font-black text-[#1F3A5F] block">
                  {user.reportedCount}
                </span>
                <span className="text-[8px] font-mono font-bold text-[#1F3A5F]/55 block uppercase">
                  COMPLAINTS
                </span>
              </div>

              <div className="border border-[#1F3A5F]/10 p-2.5 text-center bg-white">
                <span className="text-sm font-serif font-black text-[#1F3A5F] block">
                  {user.resolvedCount}
                </span>
                <span className="text-[8px] font-mono font-bold text-[#1F3A5F]/55 block uppercase">
                  RESOLVED
                </span>
              </div>

              <div className="border border-[#1F3A5F]/10 p-2.5 text-center bg-white">
                <span className="text-sm font-serif font-black text-[#1F3A5F] block">
                  {user.verificationsCount}
                </span>
                <span className="text-[8px] font-mono font-bold text-[#1F3A5F]/55 block uppercase">
                  VERIFIED
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Unlocked badges list */}
      <div className="space-y-4">
        <div className="border-b border-[#1F3A5F]/15 pb-2">
          <h2 className="text-sm font-serif font-black text-[#1F3A5F] uppercase tracking-wider">
            Unveiled Achievement Badges ({badges.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div key={badge.id}>
              <BadgeCard badge={badge} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
