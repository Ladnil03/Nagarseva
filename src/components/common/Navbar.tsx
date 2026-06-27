import React from 'react';
import NagarSevaLogo from '../NagarSevaLogo';

interface NavbarProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  onHomeClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  userRole: 'guest' | 'citizen' | 'authority';
}

export default function Navbar({
  currentCity,
  onCityChange,
  onHomeClick,
  onLoginClick,
  onLogoutClick,
  userRole
}: NavbarProps) {
  return (
    <nav className="bg-[#1F3A5F] text-[#FFFBF4] px-4 py-3 flex items-center justify-between border-b border-[#FFFBF4]/15 shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
        <NagarSevaLogo size={36} variant="red" className="bg-[#FFFBF4] rounded-full p-0.5" />
        <span className="font-serif font-black tracking-widest text-lg">NAGARSEVA</span>
      </div>
      
      <div className="flex items-center gap-4">
        <select
          value={currentCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="bg-transparent text-[11px] font-extrabold text-[#E8B33D] uppercase outline-none border-none cursor-pointer"
        >
          <option value="Bengaluru" className="bg-[#1F3A5F]">🌳 Bengaluru</option>
          <option value="Mumbai" className="bg-[#1F3A5F]">🌊 Mumbai</option>
          <option value="Delhi" className="bg-[#1F3A5F]">🏛️ Delhi</option>
        </select>

        {userRole === 'guest' ? (
          <button
            onClick={onLoginClick}
            className="text-xs bg-[#E8B33D] text-[#1F3A5F] font-bold px-3 py-1.5 rounded-md hover:bg-opacity-95"
          >
            LOGIN
          </button>
        ) : (
          <button
            onClick={onLogoutClick}
            className="text-xs text-[#FFFBF4]/80 hover:text-white font-bold"
          >
            LOGOUT
          </button>
        )}
      </div>
    </nav>
  );
}
