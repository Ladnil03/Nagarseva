import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../hooks/useLocation';
import { ShieldCheck, User, Mail, Lock, MapPin, ArrowRight, Loader, Landmark } from 'lucide-react';
import NagarSevaLogo from './NagarSevaLogo';

interface LoginPageProps {
  onBack: () => void;
  onSuccess: (role: 'citizen' | 'authority') => void;
}

export default function LoginPage({ onBack, onSuccess }: LoginPageProps) {
  const { signIn, signUp } = useAuth();
  const { getLocation, coords, loading: geoLoading } = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'citizen' | 'authority'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ward, setWard] = useState('HAL 2nd Stage Ward 142');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeoDetect = async () => {
    const loc = await getLocation();
    if (loc) {
      setWard(`MCD Ward GPS Locked (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)})`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (email.trim() === '' || password.trim() === '' || name.trim() === '') {
          throw new Error("Please fill out all ledger credentials.");
        }
        await signUp(email, password, name, ward, role);
      } else {
        if (email.trim() === '' || password.trim() === '') {
          throw new Error("Please provide both email and secret code.");
        }
        await signIn(email, password);
      }
      onSuccess(role);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Credential authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page" className="max-w-md mx-auto my-12 px-4 animate-fade-in">
      <div className="bg-[#FFFBF4] border-2 border-[#1F3A5F] rounded-[2px] card-shadow overflow-hidden relative">
        {/* Background grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid" />
        
        {/* Desk Header */}
        <div className="p-4 bg-[#1F3A5F] text-white border-b border-[#FFFBF4]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#E8B33D]" />
            <span className="text-[11px] font-mono font-black uppercase tracking-wider">
              {isSignUp ? "GRIEVANCE REGISTRATION DESK" : "SECURE PORTAL DESK"}
            </span>
          </div>
          <button 
            onClick={onBack}
            className="text-[10px] text-slate-300 hover:text-white uppercase font-bold"
          >
            ← Cancel
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 relative z-10">
          <div className="text-center space-y-2">
            <NagarSevaLogo size={50} variant="red" className="mx-auto" />
            <h3 className="text-lg font-serif font-black text-[#1F3A5F] uppercase">
              {isSignUp ? "Create Citizen Ledger" : "Sign In to Grid"}
            </h3>
            <p className="text-[11px] text-[#1F3A5F]/70 max-w-xs mx-auto">
              Please declare your local municipal credentials for authorized ledger co-signing operations.
            </p>
          </div>

          {error && (
            <div className="bg-[#FFE8EA] border border-[#FF4858]/30 p-3 rounded-[1px] text-[#FF4858] text-[10px] font-mono leading-relaxed">
              ⚠️ AUTH_FAILURE: {error}
            </div>
          )}

          {/* Toggle Role (citizen / authority) */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1">
            <button
              type="button"
              onClick={() => setRole('citizen')}
              className={`py-2 text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                role === 'citizen'
                  ? 'bg-[#B3211E] text-white border-[#B3211E]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Citizen Account
            </button>
            <button
              type="button"
              onClick={() => setRole('authority')}
              className={`py-2 text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                role === 'authority'
                  ? 'bg-[#1F3A5F] text-white border-[#1F3A5F]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Officer Desk
            </button>
          </div>

          {/* Demo Accounts Quick Fill */}
          <div className="bg-[#E8B33D]/10 border border-[#E8B33D]/30 p-3 rounded-[2px] space-y-1.5">
            <span className="block text-[9px] font-mono font-bold text-[#1F3A5F] uppercase tracking-wider">
              ⚡ DEMO ACCESS LEDGERS (TEST ACCOUNTS)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole('citizen');
                  setIsSignUp(false);
                  setEmail('citizen@nagarseva.org');
                  setPassword('citizen123');
                }}
                className="bg-white border border-[#B3211E]/20 text-[#B3211E] hover:border-[#B3211E]/50 text-[10px] font-bold py-1.5 px-2 rounded hover:bg-[#B3211E]/5 transition-all uppercase font-mono text-left cursor-pointer flex items-center justify-between"
              >
                <span>👤 Citizen Demo</span>
                <span className="text-[8px] opacity-60">FILL</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('authority');
                  setIsSignUp(false);
                  setEmail('officer@nagarseva.gov.in');
                  setPassword('officer123');
                }}
                className="bg-white border border-[#1F3A5F]/20 text-[#1F3A5F] hover:border-[#1F3A5F]/50 text-[10px] font-bold py-1.5 px-2 rounded hover:bg-[#1F3A5F]/5 transition-all uppercase font-mono text-left cursor-pointer flex items-center justify-between"
              >
                <span>👮 Officer Demo</span>
                <span className="text-[8px] opacity-60">FILL</span>
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Full Registered Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Lakshmi Prasad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs h-10 border border-slate-300 rounded px-3 pl-9 focus:border-[#B3211E] focus:ring-1 outline-none font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Secure Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="e.g. lakshmi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs h-10 border border-slate-300 rounded px-3 pl-9 focus:border-[#B3211E] focus:ring-1 outline-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Secret Password Access</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs h-10 border border-slate-300 rounded px-3 pl-9 focus:border-[#B3211E] focus:ring-1 outline-none font-medium"
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Assigned Ward Location</label>
                <button
                  type="button"
                  onClick={handleGeoDetect}
                  className="text-[9px] font-extrabold text-[#B3211E] hover:underline uppercase flex items-center gap-0.5"
                >
                  <MapPin className="w-2.5 h-2.5" /> GPS Detect
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. HAL 2nd Stage Ward 142"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full text-xs h-10 border border-slate-300 rounded px-3 focus:border-[#B3211E] focus:ring-1 outline-none font-medium"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#B3211E] text-white hover:bg-[#971C19] rounded-[1px] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" /> Verifying Seals...
              </>
            ) : (
              <>
                {isSignUp ? "Register Entry" : "Establish Secure Session"} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[11px] font-semibold text-[#1F3A5F] hover:text-[#B3211E] hover:underline transition-colors"
            >
              {isSignUp ? "Already registered? Sign In to Desk" : "First time citizen? Create Ledger Record"}
            </button>
          </div>
        </form>

        {/* Desk Footing */}
        <div className="bg-[#F2EBDA] px-4 py-3 border-t border-[#1F3A5F]/15 flex items-center justify-between text-[8px] font-mono text-slate-500 select-none">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3F6B4E]" /> SSL SEALED SYSTEM
          </span>
          <span>COMPLIANCE LEVEL: SECURED</span>
        </div>
      </div>
    </div>
  );
}
