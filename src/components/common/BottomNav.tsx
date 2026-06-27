import React from 'react';
import { Home, AlertTriangle, ShieldCheck, Globe, User } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  onViewChange: (view: any) => void;
  userRole: 'guest' | 'citizen' | 'authority';
}

export default function BottomNav({ activeView, onViewChange, userRole }: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1F3A5F] text-[#FFFBF4] border-t border-[#FFFBF4]/15 h-16 flex items-center justify-around z-40 px-2">
      <button
        onClick={() => onViewChange('home')}
        className={`flex flex-col items-center justify-center w-12 ${activeView === 'home' ? 'text-[#E8B33D]' : 'text-slate-400'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px] mt-0.5">Home</span>
      </button>

      {userRole === 'citizen' && (
        <>
          <button
            onClick={() => onViewChange('report')}
            className={`flex flex-col items-center justify-center w-12 ${activeView === 'report' ? 'text-[#E8B33D]' : 'text-slate-400'}`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Report</span>
          </button>
          <button
            onClick={() => onViewChange('verify_issues')}
            className={`flex flex-col items-center justify-center w-12 ${activeView === 'verify_issues' ? 'text-[#E8B33D]' : 'text-slate-400'}`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Verify</span>
          </button>
        </>
      )}

      <button
        onClick={() => onViewChange('transparency_radar')}
        className={`flex flex-col items-center justify-center w-12 ${activeView === 'transparency_radar' ? 'text-[#E8B33D]' : 'text-slate-400'}`}
      >
        <Globe className="w-5 h-5" />
        <span className="text-[9px] mt-0.5">Feed</span>
      </button>

      {userRole !== 'guest' ? (
        <button
          onClick={() => onViewChange(userRole === 'authority' ? 'authority_dashboard' : 'citizen_dashboard')}
          className={`flex flex-col items-center justify-center w-12 ${['citizen_dashboard', 'authority_dashboard'].includes(activeView) ? 'text-[#E8B33D]' : 'text-slate-400'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Portal</span>
        </button>
      ) : (
        <button
          onClick={() => onViewChange('login')}
          className={`flex flex-col items-center justify-center w-12 ${activeView === 'login' ? 'text-[#E8B33D]' : 'text-slate-400'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Login</span>
        </button>
      )}
    </div>
  );
}
