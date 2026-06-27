import React from 'react';
import { Award, Sparkles, X } from 'lucide-react';

interface LevelUpModalProps {
  levelName: string;
  points: number;
  onClose: () => void;
}

export default function LevelUpModal({ levelName, points, onClose }: LevelUpModalProps) {
  return (
    <div className="fixed inset-0 bg-[#1F3A5F]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFBF4] border-2 border-[#1F3A5F] max-w-md w-full p-6 text-center relative card-shadow rounded-[2px] animate-scale-up">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#1F3A5F]/60 hover:text-[#1F3A5F]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Level Up stamp effect */}
        <div className="mb-4 inline-block relative">
          <div className="stamp-seal stamp-green rotate-3 scale-125 select-none font-black text-xs">
            PROMOTED
          </div>
        </div>

        {/* Visual award badge */}
        <div className="w-16 h-16 rounded-full bg-[#FFE66D]/20 border-2 border-[#E8B33D] flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Award className="w-8 h-8 text-[#B3211E]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-serif font-black text-[#1F3A5F] mb-1.5">
          CONGRATULATIONS CITIZEN!
        </h2>
        
        <p className="text-xs text-[#1F3A5F]/85 font-sans mb-4">
          You have achieved higher standing inside the municipality ledger cells.
        </p>

        {/* Level Info card */}
        <div className="bg-[#1F3A5F] text-white p-4 border border-[#FFE66D]/30 rounded-[1px] mb-5">
          <span className="text-[9px] font-mono tracking-widest text-[#E8B33D] block uppercase mb-1">
            New Official Designation
          </span>
          <span className="text-lg font-serif font-black tracking-wide text-white uppercase block">
            {levelName}
          </span>
          <span className="text-[10px] font-mono text-slate-300 block mt-1.5">
            LOGGED ACCOUNT BALANCE: {points} NAGARPOINTS
          </span>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#B3211E] text-white py-2.5 font-bold text-xs uppercase tracking-wider rounded-[1px] hover:bg-[#961a17] transition-colors shadow-sm"
        >
          Acknowledge Promotion
        </button>
      </div>
    </div>
  );
}
