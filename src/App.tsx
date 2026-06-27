import React, { useState, useEffect } from 'react';
import { CivicIssue, UserProfile, AchievementBadge, IssueStatus, IssueCategory, RiskLevel } from './types';
import LandingPage from './components/LandingPage';
import CitizenDashboard from './components/CitizenDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';
import ReportWizard from './components/ReportWizard';
import LoginPage from './components/LoginPage';
import { useAuth } from './context/AuthContext';
import { fetchAllIssues, upvoteIssue as apiUpvoteIssue, updateIssueStatus as apiUpdateIssueStatus } from './services/issueService';
import { ShieldCheck, Eye, MapPin, Bell, Globe, Sparkles, Award, User, LogOut, ArrowRight, Lightbulb, Landmark, Menu, X, Home, FileText, Map, Camera, LayoutDashboard, Briefcase } from 'lucide-react';
import NagarSevaLogo from './components/NagarSevaLogo';

// Phase 2 modular imports
import VerifyIssues from './pages/citizen/VerifyIssues';
import PublicFeed from './pages/PublicFeed';
import OfficialAuthorityDashboard from './pages/authority/AuthorityDashboard';

export interface CityConfig {
  id: string;
  name: string;
  ward: string;
  flag: string;
}

const CITIES_LIST: CityConfig[] = [
  { id: 'blr', name: 'Bengaluru', ward: 'HAL 2nd Stage Ward 142', flag: '🌳' },
  { id: 'bom', name: 'Mumbai', ward: 'Lower Parel Ward 14', flag: '🌊' },
  { id: 'del', name: 'Delhi', ward: 'Saket MCD Ward 4', flag: '🏛️' },
  { id: 'hyd', name: 'Hyderabad', ward: 'Gachibowli GHMC Ward 11', flag: '🏰' },
  { id: 'pune', name: 'Pune', ward: 'Kothrud PMC Ward 28', flag: '🏔️' },
  { id: 'maa', name: 'Chennai', ward: 'GCC Adyar Ward 8', flag: '🏖️' }
];

export default function App() {
  const { userProfile: authProfile, addPoints: authAddPoints, logout: authLogout } = useAuth();

  const [activeView, setActiveView] = useState<'home' | 'login' | 'report' | 'citizen_dashboard' | 'authority_dashboard' | 'transparency_radar' | 'verify_issues'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [currentUserRole, setCurrentUserRole] = useState<'guest' | 'citizen' | 'authority'>('guest');

  const handleNavClick = (view: 'home' | 'login' | 'report' | 'citizen_dashboard' | 'authority_dashboard' | 'transparency_radar' | 'verify_issues') => {
    setActiveView(view);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  const [currentCity, setCurrentCity] = useState<string>('Bengaluru');
  const [activeWard, setActiveWard] = useState<string>('HAL 2nd Stage Ward 142');

  // User notifications banner
  const [notifications, setNotifications] = useState<string[]>([
    'Sri M. Nagaraj dispatched repair unit for Pothole #NS-2026-001',
    'Verify alert near Indiranagar: Is the park lamp solved?',
    '✦ You unlocked the "Citizen Inspector" elite badge!'
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync role and view state on profile loaded
  useEffect(() => {
    if (authProfile) {
      const detectedRole = authProfile.name.toLowerCase().includes('officer') || authProfile.name.toLowerCase().includes('authority') ? 'authority' : 'citizen';
      setCurrentUserRole(detectedRole);
      setActiveView(detectedRole === 'authority' ? 'authority_dashboard' : 'citizen_dashboard');
      setActiveWard(authProfile.wardName || 'HAL 2nd Stage Ward 142');
    } else {
      setCurrentUserRole('guest');
    }
  }, [authProfile]);

  // Read auth profile or fall back to default guest profile
  const userProfile: UserProfile = authProfile ? {
    name: authProfile.name,
    points: authProfile.points,
    level: String(authProfile.level),
    reportedCount: authProfile.reportedCount,
    resolvedCount: authProfile.resolvedCount,
    verificationsCount: authProfile.verificationsCount,
    wardName: activeWard,
    avatarInitials: authProfile.avatarInitials || 'LP',
    rank: authProfile.rank || 12
  } : {
    name: 'Lakshmi Prasad',
    points: 380,
    level: '3',
    reportedCount: 4,
    resolvedCount: 2,
    verificationsCount: 8,
    wardName: activeWard,
    avatarInitials: 'LP',
    rank: 12
  };

  // Action log alerts
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Add points to profile
  const handleAddPoints = async (pts: number, reason: string) => {
    if (authProfile) {
      await authAddPoints(pts, reason);
      showToast(`✨ +${pts} NagarPoints: ${reason}`);
    } else {
      showToast(`✨ +${pts} NagarPoints (local-only): ${reason}`);
    }
    setNotifications((prev) => [`+${pts} PTS: ${reason}`, ...prev]);
  };

  // Preloaded seed issues in Bengaluru Ward 142 sectors
  const [issues, setIssues] = useState<CivicIssue[]>([
    {
      id: 'NS-2026-001',
      title: 'Massive Crater pothole blocking school bus lanes',
      description: 'Extremely deep road subsidence exposing concrete core rebar. Heavy school buses are dodging into ongoing traffic lanes, posing critical children hazards.',
      category: 'Road Pothole',
      status: 'in_progress',
      riskLevel: 'critical',
      severity: 9,
      location: '12th Cross, HAL 2nd Stage, Ward 142, Indiranagar, Bengaluru',
      latitude: 12.9682,
      longitude: 77.6415,
      imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
      isAiVerified: true,
      reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      witnessCount: 45,
      daysOpen: 2,
      department: 'BBMP Engineering Maintenance Cell',
      timeline: [
        { id: 't1', title: 'Incident Registered', timestamp: '2 days ago', status: 'done', meta: 'AI classification verified pothole with 96% confidence.' },
        { id: 't2', title: 'Resident Verification Group Cap', timestamp: 'Yesterday', status: 'done', meta: 'Logged 45 verified backup upvotes from HAL layout.' },
        { id: 't3', title: 'Workorder Dispatched', timestamp: 'Today', status: 'active', meta: 'Sri M. Nagaraj routing sub-contractor Team B for hot-asphalt filling.' },
        { id: 't4', title: 'Grievance Resolved', status: 'pending' },
      ],
    },
    {
      id: 'NS-2026-002',
      title: 'Commercial garbage piling up over sidewalks',
      description: 'Illegal roadside commercial vegetable bins overflowing onto pedestrian trails. Stray dogs and rodents roaming the street grids.',
      category: 'Overflowing Garbage',
      status: 'reported',
      riskLevel: 'high',
      severity: 8,
      location: 'Koramangala 3rd Block main playground perimeter, Bengaluru',
      latitude: 12.9348,
      longitude: 77.6189,
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      isAiVerified: true,
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      witnessCount: 16,
      daysOpen: 3,
      department: 'SWM Joint Commissionerate Division',
      timeline: [
        { id: 'g1', title: 'Incidence Registered', timestamp: '3 days ago', status: 'done', meta: 'AI model catalogued Overflowing Garbage index.' },
        { id: 'g2', title: 'Dispatch Pending Routing', status: 'active', meta: 'Checking vehicle availability grids.' },
      ],
    },
    {
      id: 'NS-2026-003',
      title: 'Dark Stretch - 3 streetlights dead since rainstorm',
      description: 'Overhead high-voltage lamps completely shorted near park gates. Dark corners making it unsafe for evening senior citizen walking routines.',
      category: 'Broken Streetlight',
      status: 'assigned',
      riskLevel: 'medium',
      severity: 6,
      location: '8th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru',
      latitude: 12.9716,
      longitude: 77.6445,
      imageUrl: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=600&q=80',
      isAiVerified: true,
      reportedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      witnessCount: 9,
      daysOpen: 4,
      department: 'BESCOM Electrical Ward Cells',
      timeline: [
        { id: 's1', title: 'Report Registered', timestamp: '4 days ago', status: 'done' },
        { id: 's2', title: 'BESCOM Electrical Assignment', timestamp: '3 days ago', status: 'done', meta: 'Routing overhead wire repair crane.' },
        { id: 't3', title: 'Dispatch active repair crew', status: 'active' },
      ],
    },
    {
      id: 'NS-2026-004',
      title: 'Sewerage black water bubbling out of chambers',
      description: 'Raw black sewage blockaging local storm drainage vents, flooding residential entrances with intolerable odor.',
      category: 'Sewage Leakage',
      status: 'chronic',
      riskLevel: 'critical',
      severity: 10,
      location: '14th Cross, Kalyan Nagar Layout, Bengaluru',
      latitude: 12.9892,
      longitude: 77.6548,
      isAiVerified: false,
      reportedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      witnessCount: 52,
      daysOpen: 11, // Overdue SLA on Accountability Watch-Board!
      department: 'BWSSB Wastewater Management Unit',
      timeline: [
        { id: 'w1', title: 'Awaiting BWSSB Jurisdiction clearance', timestamp: '11 days ago', status: 'done' },
        { id: 'w2', title: 'Chronic Escalation Flagged', timestamp: '10 days ago', status: 'active', meta: 'SLA overdue. Forwarded to Deputy Commissioner.' },
      ],
    }
  ]);

  // Achievement badges mock tracking
  const [badges, setBadges] = useState<AchievementBadge[]>([
    {
      id: 'badge-1',
      name: 'Pothole Knight',
      description: 'File 3 verified Road Pothole incidents with photographic proofs',
      icon: '🛡️',
      progress: 66,
    },
    {
      id: 'badge-2',
      name: 'First Responder',
      description: 'Logged your very first civic ticket inside NagarSeva cells',
      icon: '🚨',
      progress: 100,
      unlockedAt: '2026-06-15T08:00:00Z',
    },
    {
      id: 'badge-3',
      name: 'Eco Warrior',
      description: 'Verify or clean 5 municipal dry wet waste dumps near Hal blocks',
      icon: '🌿',
      progress: 40,
    }
  ]);

  // Fetch issues on mount from Node.js Express server
  useEffect(() => {
    async function loadIssues() {
      try {
        const data = await fetchAllIssues();
        if (data && data.length > 0) {
          setIssues(data);
        }
      } catch (err) {
        console.warn("Failed to load backend issues, keeping fallback initial issues seed:", err);
      }
    }
    loadIssues();
  }, [activeView]);

  // Trigger login roles
  const handleSignInAsCitizen = () => {
    setActiveView('login');
  };

  const handleSignInAsAuthority = () => {
    setActiveView('login');
  };

  const handleLogout = async () => {
    await authLogout();
    setCurrentUserRole('guest');
    setActiveView('home');
    showToast('Logged out of NagarSeva grid safely.');
  };

  // Category select triggered from landing grid
  const handleSelectCategoryFromGrid = (cat: IssueCategory) => {
    if (currentUserRole !== 'citizen') {
      setActiveView('login');
    } else {
      setActiveView('report');
    }
  };

  // Add issue payload to state
  const handleAddIssuePayloadState = (newIssue: CivicIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
  };

  // Handle support verification clicks (Upvotes)
  const handleUpvoteIssue = async (id: string) => {
    try {
      const updatedFromServer = await apiUpvoteIssue(id);
      setIssues((prev) =>
        prev.map((item) => (item.id === id ? updatedFromServer : item))
      );
      showToast(`✓ Checked & Verified Ticket ${id}! Witness count is now ${updatedFromServer.witnessCount}.`);
      await handleAddPoints(25, `Verified incident #${id}`);
    } catch (err) {
      console.warn("Express backend upvote failed, falling back to local state increase.");
      // Local fallback
      setIssues((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const nextWitnessCount = item.witnessCount + 1;
            handleAddPoints(25, `Verified incident #${id}`);
            return {
              ...item,
              witnessCount: nextWitnessCount,
            };
          }
          return item;
        })
      );
    }
  };

  // Manage administrative updates from authority cell
  const handleUpdateIssueStatus = async (
    id: string,
    status: IssueStatus,
    comment: string,
    department?: string
  ) => {
    try {
      const updatedFromServer = await apiUpdateIssueStatus(id, status, comment, department);
      setIssues((prev) =>
        prev.map((item) => (item.id === id ? updatedFromServer : item))
      );
      showToast(`🏛️ Ticket ${id} updated to ${status.toUpperCase()} successfully!`);
    } catch (err) {
      console.warn("Express backend status update failed, falling back to local simulation.");
      setIssues((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const formattedTimestamp = 'Just Now';
            const newStep = {
              id: `ts-${Date.now()}`,
              title: `Audit Update: ${status.replace('_', ' ')}`,
              timestamp: formattedTimestamp,
              status: 'done' as const,
              meta: `${comment} (Dept: ${department || 'General Grid'})`,
            };

            const oldTimeline = item.timeline || [];
            const updatedTimeline = [
              ...oldTimeline.map((step) => ({ ...step, status: 'done' as const })),
              newStep,
            ];

            showToast(`🏛️ Ticket ${id} updated to ${status.toUpperCase()} successfully!`);

            return {
              ...item,
              status,
              department: department || item.department,
              timeline: updatedTimeline,
            };
          }
          return item;
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F2EBDA] selection:bg-[#B3211E]/10 selection:text-[#B3211E]">
      
      {/* Mobile Backdrop Overlay for Sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Sticky on desktop, floating slide-in drawer on mobile) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#1F3A5F] text-[#FFFBF4] border-r border-[#FFFBF4]/15 transition-all duration-300 ease-in-out md:sticky md:top-0 md:h-screen shrink-0 ${
          sidebarOpen 
            ? 'w-72 p-6 translate-x-0 opacity-100' 
            : 'w-0 p-0 -translate-x-full md:translate-x-0 opacity-0 overflow-hidden border-r-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-8 overflow-y-auto">
          {/* Logo & Close Button Row */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer leading-tight group select-none"
            >
              <div className="relative shrink-0">
                <NagarSevaLogo size={42} variant="red" className="bg-[#FFFBF4] rounded-full p-0.5 border border-[#B3211E]/40 hover:scale-105 active:scale-95 duration-200 shadow-sm" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#E8B33D] rounded-full border border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-serif font-black tracking-widest text-[#FFFBF4] uppercase leading-none">NagarSeva</span>
                  <span className="text-[8px] bg-[#E8B33D]/15 text-[#E8B33D] font-mono font-black border border-[#E8B33D]/30 px-1 py-0.5 rounded-[1px] uppercase tracking-wider select-none leading-none">SEALED</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#E8B33D] tracking-wider mt-0.5">WARD SYSTEM</span>
              </div>
            </div>

            {/* Collapse Sidebar Button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full text-[#FFFBF4] transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* City Hub Selection */}
          <div className="bg-[#FFFBF4]/5 border border-[#FFFBF4]/10 rounded-[1px] p-3">
            <span className="block text-[9px] font-mono text-[#FFFBF4]/50 uppercase tracking-widest mb-1.5 font-bold">MUNICIPAL HUB</span>
            <div className="relative inline-block w-full">
              <select
                value={currentCity}
                onChange={(e) => {
                  const foundCity = CITIES_LIST.find(c => c.name === e.target.value);
                  if (foundCity) {
                    setCurrentCity(foundCity.name);
                    setActiveWard(foundCity.ward);
                    showToast(`📍 Switched City Hub to ${foundCity.name} (${foundCity.ward})`);
                  }
                }}
                className="w-full bg-[#152943] text-[12px] font-extrabold text-[#E8B33D] hover:text-white uppercase tracking-wider cursor-pointer outline-none border border-[#FFFBF4]/15 py-2 px-3 rounded-[1px] appearance-none font-sans"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%23E8B33D'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'/></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '12px'
                }}
              >
                {CITIES_LIST.map((city) => (
                  <option key={city.id} value={city.name} className="bg-[#1F3A5F] text-white py-1">
                    {city.flag} {city.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[10px] text-[#FFFBF4]/65 font-mono mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E8B33D] shrink-0" />
              <span className="truncate">{activeWard}</span>
            </p>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-mono text-[#FFFBF4]/40 uppercase tracking-widest font-black px-3 mb-2">CIVIC COMMANDS</span>
            
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full hover:bg-white/10 hover:text-white rounded-[1px] px-3 py-2.5 duration-200 transition-all flex items-center gap-3 text-xs uppercase tracking-wider text-left font-bold ${
                activeView === 'home' ? 'bg-[#E8B33D]/10 text-[#E8B33D] border-l-2 border-[#E8B33D]' : 'text-[#FFFBF4]/85'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                if (currentUserRole !== 'citizen') setCurrentUserRole('citizen');
                handleNavClick('report');
              }}
              className={`w-full hover:bg-white/10 hover:text-white rounded-[1px] px-3 py-2.5 duration-200 transition-all flex items-center gap-3 text-xs uppercase tracking-wider text-left font-bold ${
                activeView === 'report' ? 'bg-[#E8B33D]/10 text-[#E8B33D] border-l-2 border-[#E8B33D]' : 'text-[#FFFBF4]/85'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Report Grievance</span>
            </button>

            <button
              onClick={() => handleNavClick('transparency_radar')}
              className={`w-full hover:bg-white/10 hover:text-white rounded-[1px] px-3 py-2.5 duration-200 transition-all flex items-center gap-3 text-xs uppercase tracking-wider text-left font-bold ${
                activeView === 'transparency_radar' ? 'bg-[#E8B33D]/10 text-[#E8B33D] border-l-2 border-[#E8B33D]' : 'text-[#FFFBF4]/85'
              }`}
            >
              <Map className="w-4 h-4 shrink-0" />
              <span>Radar Map Feed</span>
            </button>

            {currentUserRole === 'citizen' && (
              <>
                <button
                  onClick={() => handleNavClick('verify_issues')}
                  className={`w-full hover:bg-white/10 hover:text-white rounded-[1px] px-3 py-2.5 duration-200 transition-all flex items-center gap-3 text-xs uppercase tracking-wider text-left font-bold ${
                    activeView === 'verify_issues' ? 'bg-[#E8B33D]/10 text-[#E8B33D] border-l-2 border-[#E8B33D]' : 'text-[#FFFBF4]/85'
                  }`}
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span className="flex items-center justify-between w-full">
                    <span>Verify Beat</span>
                    <span className="text-[10px]">📸</span>
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('citizen_dashboard')}
                  className={`w-full hover:bg-white/10 hover:text-white rounded-[1px] px-3 py-2.5 duration-200 transition-all flex items-center gap-3 text-xs uppercase tracking-wider text-left font-bold ${
                    activeView === 'citizen_dashboard' ? 'bg-[#E8B33D]/10 text-[#E8B33D] border-l-2 border-[#E8B33D]' : 'text-[#FFFBF4]/85'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>My Dashboard</span>
                </button>
              </>
            )}

            {currentUserRole === 'authority' && (
              <button
                onClick={() => handleNavClick('authority_dashboard')}
                className={`w-full hover:bg-white/10 hover:text-white rounded-[1px] px-3 py-2.5 duration-200 transition-all flex items-center gap-3 text-xs uppercase tracking-wider text-left font-bold ${
                  activeView === 'authority_dashboard' ? 'bg-[#E8B33D]/10 text-[#E8B33D] border-l-2 border-[#E8B33D]' : 'text-[#FFFBF4]/85'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Officer Desk</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Footer Section (User profile/sign-in status) */}
        <div className="pt-6 border-t border-[#FFFBF4]/15 mt-auto">
          {currentUserRole === 'guest' ? (
            <button
              onClick={() => {
                handleSignInAsCitizen();
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className="w-full px-4 py-3 bg-[#B3211E] hover:bg-[#971C19] text-[#FFFBF4] text-[11px] font-bold uppercase tracking-wider rounded-[1px] shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-[#B3211E]"
            >
              <User className="w-4 h-4" /> SIGN IN TO SYSTEM
            </button>
          ) : (
            <div className="flex flex-col gap-4">
              {currentUserRole === 'citizen' && (
                <div className="bg-[#FFFBF4]/5 border border-[#FFFBF4]/10 rounded-[1px] p-3 text-xs font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#FFFBF4]/50 uppercase text-[9px] font-bold">CIVIC DIVIDEND</span>
                    <span className="text-[#E8B33D] font-black">{userProfile.points} PTS</span>
                  </div>
                  <div className="w-full bg-[#152943] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#E8B33D] h-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-[10px] text-[#FFFBF4]/60 mt-1.5 text-right uppercase">
                    Level: {String(userProfile.level) === '3' ? 'SEVAK' : `LVL ${userProfile.level}`}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-2.5 bg-[#FFFBF4]/5 p-2 rounded-[1px]">
                <div className="flex items-center gap-2.5 min-w-0">
                  {currentUserRole === 'citizen' ? (
                    <div className="w-8 h-8 shrink-0 bg-[#E8B33D] text-[#1F3A5F] rounded-full flex items-center justify-center font-bold border border-[#1F3A5F]/20 text-xs">
                      LP
                    </div>
                  ) : (
                    <div className="w-8 h-8 shrink-0 bg-[#3F6B4E] text-[#FFFBF4] rounded-full flex items-center justify-center font-bold border border-white/20 text-xs">
                      OD
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-mono font-bold text-[#FFFBF4] truncate uppercase bg-transparent border-none p-0 focus:ring-0 leading-tight">
                      {currentUserRole === 'citizen' ? 'L. Prasad' : 'Officer Desk'}
                    </p>
                    <p className="text-[8px] font-mono text-[#FFFBF4]/50 uppercase tracking-wider mt-0.5">
                      {currentUserRole.toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT SIDE MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        
        {/* TOP BAR / DESKTOP SUBHEADER (Sticky header with minimal info) */}
        <header className="sticky top-0 bg-[#1F3A5F] text-[#FFFBF4] border-b border-[#FFFBF4]/15 z-30 shadow-sm">
          <div className="px-4 md:px-8 h-16 flex items-center justify-between">
            
            {/* Title representing current active view */}
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle Button for Desktop and Mobile */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 -ml-2 hover:bg-white/10 rounded-full text-[#FFFBF4] focus:outline-none cursor-pointer transition-colors"
                title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#E8B33D]" />
                <span className="text-[12.5px] font-serif font-black tracking-widest text-[#FFFBF4] uppercase md:inline-block">
                  {activeView === 'home' && 'Overview Hub'}
                  {activeView === 'report' && 'Report Grievance'}
                  {activeView === 'transparency_radar' && 'Transparency Radar'}
                  {activeView === 'verify_issues' && 'Verify Beat Verification'}
                  {activeView === 'citizen_dashboard' && 'Citizen Command Center'}
                  {activeView === 'authority_dashboard' && 'Officer Administrative Desk'}
                  {activeView === 'login' && 'System Authentication'}
                </span>
                <span className="hidden sm:inline-block text-[8px] bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 px-1 py-0.5 rounded-[1px] uppercase tracking-wider ml-2">
                  SECURED
                </span>
              </div>
            </div>

            {/* Quick Status / Notifications controls */}
            <div className="flex items-center gap-3">
              
              {/* Live Status indicator */}
              <div className="hidden lg:flex items-center gap-1.5 bg-[#152943] px-2.5 py-1 rounded-[1px] border border-[#FFFBF4]/10 text-[10px] font-mono text-[#E8B33D]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Ward Grid</span>
              </div>

              {/* Notification system alert */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8B33D] animate-ping" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8B33D]" />
                  <Bell className="w-4 h-4" />
                </button>

                {/* Notification dropdown float list */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-72 bg-[#FFFBF4] text-[#1F3A5F] border border-[#1F3A5F]/20 rounded-[1.5px] shadow-lg overflow-hidden py-2 z-50 animate-fade-in text-xs font-mono">
                    <div className="p-3 border-b border-[#1F3A5F]/15 flex justify-between items-center bg-[#F2EBDA]">
                      <span className="font-bold text-[#1F3A5F] text-[10px] uppercase">Grievance Circulars</span>
                      <button onClick={() => setNotifications([])} className="text-[#B3211E] text-[9px] hover:underline uppercase font-bold">Clear all</button>
                    </div>
                    <div className="divide-y divide-[#1F3A5F]/10 max-h-56 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif, idx) => (
                          <div key={idx} className="p-3 text-[#1F3A5F]/85 hover:bg-[#F2EBDA]/20 transition-colors leading-relaxed">
                            {notif}
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-[#1F3A5F]/60 font-medium text-[10px]">No circular updates!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick points badge for desktop if logged in as citizen */}
              {currentUserRole === 'citizen' && (
                <div className="hidden sm:flex bg-[#FFFBF4]/10 border border-[#FFFBF4]/25 rounded-[1px] px-3 py-1 items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-[#E8B33D] font-bold">{userProfile.points} PTS</span>
                </div>
              )}
            </div>

          </div>
        </header>

      {/* LIVE INTER-GRID TICKER */}
      <div className="h-9 bg-[#E8B33D]/10 flex items-center px-4 md:px-8 border-b border-[#1F3A5F]/15 overflow-hidden shrink-0 select-none z-40">
        <div className="flex items-center gap-4 whitespace-nowrap animate-ticker">
          <span className="text-[#B3211E] text-xs font-mono font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#B3211E] animate-ping"></span> MUNICIPAL TICKER:
          </span>
          <span className="text-[#1F3A5F]/90 text-[11px] font-mono font-bold uppercase">
            {issues.length * 347 || 2847} CIRCULAR DOCKETS LOGGED IN METRO ARCHIVE • {issues.filter(i => i.status === 'resolved').length + 9} SEALED RESOLUTIONS IN THIS ENVELOPE CIRCLE • {userProfile.wardName} REPORT CARD: GRADE EXCELLENT • CO-SIGN FILED CASES TO REGAIN CIVIL DIVIDEND!
          </span>
        </div>
      </div>

      {/* Floating Action Toasts */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#1F3A5F] text-[#FFFBF4] px-5 py-3.5 rounded-[1px] shadow-md max-w-sm flex items-center gap-3 z-50 border border-[#B3211E]/40 animate-slide-in">
          <div className="w-6 h-6 rounded-full bg-[#E8B33D]/20 flex items-center justify-center font-bold text-xs text-[#E8B33D] shrink-0 border border-[#E8B33D]/30">
            ★
          </div>
          <span className="text-[10px] font-mono uppercase font-bold leading-normal text-[#FFFBF4]">{toastMessage}</span>
        </div>
      )}

      {/* Main Container Views Router */}
      <div className="flex-1">
        {activeView === 'home' && (
          <LandingPage
            onSignInCitizen={handleSignInAsCitizen}
            onSignInAuthority={handleSignInAsAuthority}
            onSelectCategory={handleSelectCategoryFromGrid}
            issues={issues}
            currentCity={currentCity}
            activeWard={userProfile.wardName}
          />
        )}

        {activeView === 'login' && (
          <LoginPage
            onBack={() => setActiveView('home')}
            onSuccess={(role) => {
              // Role loaded successfully, AuthContext sync will automatically handle view/role routing
              showToast(`👋 Authenticated Securely: Role verified as ${role.toUpperCase()} Desk.`);
            }}
          />
        )}

        {activeView === 'report' && (
          <ReportWizard
            onBackToDashboard={() => setActiveView(currentUserRole === 'citizen' ? 'citizen_dashboard' : 'home')}
            onSubmitIssue={handleAddIssuePayloadState}
            onAddPoints={handleAddPoints}
            currentCity={currentCity}
            activeWard={userProfile.wardName}
          />
        )}

        {activeView === 'citizen_dashboard' && (
          <CitizenDashboard
            user={userProfile}
            badges={badges}
            issues={issues}
            onReportClick={() => setActiveView('report')}
            onUpvoteIssue={handleUpvoteIssue}
            onAddPoints={handleAddPoints}
          />
        )}

        {activeView === 'authority_dashboard' && (
          <OfficialAuthorityDashboard />
        )}

        {activeView === 'transparency_radar' && (
          <PublicFeed />
        )}

        {activeView === 'verify_issues' && (
          <VerifyIssues />
        )}
      </div>

      {/* Global Footer (Styled like an official notice bottom banner) */}
      <footer className="bg-[#1F2D3D] text-[#FFFBF4]/80 border-t border-[#1F3A5F]/40 py-10 text-xs font-mono select-none shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏛️</span>
            <div>
              <p className="font-bold text-[#FFFBF4] uppercase tracking-wide">NagarSeva Grievance Register Engine</p>
              <p className="text-[10px] text-[#FFFBF4]/60 mt-0.5 font-sans">Government compliance platform for real-time Digital Ward governance</p>
            </div>
          </div>

          <div className="flex gap-6 max-w-full text-[10.5px]">
            <span className="cursor-pointer hover:text-white" onClick={() => setActiveView('home')}>HOME CIRCULAR</span>
            <span className="cursor-pointer hover:text-white" onClick={() => setActiveView('transparency_radar')}>RADAR DISPATCH</span>
            <span className="cursor-pointer text-[#E8B33D] font-extrabold uppercase" onClick={handleSignInAsAuthority}>OFFICIAL ADMINISTRATIVE CONTROL</span>
          </div>

          <p className="text-[10px] text-[#FFFBF4]/50">
            © 2026 NAGARSEVA CORPORATION. SECURED BY VERIFIED AUDIT ENGINES.
          </p>
        </div>
      </footer>

      </div>
    </div>
  );
}
