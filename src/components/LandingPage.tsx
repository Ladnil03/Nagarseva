import React from 'react';
import { CivicIssue, IssueCategory } from '../types';
import { ShieldCheck, Eye, MapPin, ArrowRight, Activity, Users, Globe, Landmark, AlertTriangle, Trash2, Lightbulb, Droplets, ShieldAlert, FileText, CheckCircle2, Stamp } from 'lucide-react';
import NagarSevaLogo from './NagarSevaLogo';

/* 
========================================================================
TOKEN SYSTEM SPECIFICATION (INDIAN MUNICIPAL STANDARD):
  --postbox-red:     #B3211E   (Indian postbox / RTI stamp ink — primary action, alerts)
  --ledger-blue:      #1F3A5F   (faded municipal ledger ink — headers, primary text)
  --ward-yellow:      #E8B33D   (reflective ward-board yellow — pending/in-progress)
  --notice-buff:      #F2EBDA   (aged government form paper — page background)
  --register-green:   #3F6B4E   (old register-book green — resolved/verified)
  --paper-white:      #FFFBF4   (fresh form paper — cards, surfaces)

TYPOGRAPHY ROLES:
  1. Display/Heads: "Fraunces" serif or "Archivo Black" for titles, official board typography.
  2. Body Text: "Mukta" humanist for official circular text.
  3. Utility/Data: "IBM Plex Mono" for official record indices, codes, and counts.

SIGNATURE TREATMENT:
  - Double hairline borders (border-[#1F3A5F]/20)
  - Layout reads like form sections with hard small offset shadows.
  - No bloated border-radius or gradients of modern SaaS products.
========================================================================
*/

interface LandingPageProps {
  onSignInCitizen: () => void;
  onSignInAuthority: () => void;
  onSelectCategory: (category: IssueCategory) => void;
  issues: CivicIssue[];
  currentCity?: string;
  activeWard?: string;
}

export default function LandingPage({
  onSignInCitizen,
  onSignInAuthority,
  onSelectCategory,
  issues,
  currentCity = 'Bengaluru',
  activeWard = 'HAL 2nd Stage Ward 142',
}: LandingPageProps) {
  const floatingIssues = issues.slice(0, 3);

  const categories: { name: IssueCategory; desc: string; icon: React.ReactNode }[] = [
    { name: 'Road Pothole', icon: <AlertTriangle className="w-5 h-5 text-[#B3211E]" />, desc: 'Asphalt craters, cracks & subsidence' },
    { name: 'Overflowing Garbage', icon: <Trash2 className="w-5 h-5 text-[#1F3A5F]" />, desc: 'Sidewalk dumping, full metal bins & piles' },
    { name: 'Broken Streetlight', icon: <Lightbulb className="w-5 h-5 text-[#E8B33D]" />, desc: 'Dark stretches, shorted bulbs & wires' },
    { name: 'Sewage Leakage', icon: <Droplets className="w-5 h-5 text-[#1F3A5F]" />, desc: 'Open drain overflow, wastewater leakage' },
    { name: 'Damaged Public Property', icon: <ShieldAlert className="w-5 h-5 text-[#B3211E]" />, desc: 'Broken park gates, damaged swings' },
    { name: 'Other', icon: <Globe className="w-5 h-5 text-[#1F3A5F]" />, desc: 'General municipal infrastructure complaints' },
  ];

  return (
    <div id="landing-page" className="min-h-screen bg-[#F2EBDA] text-[#1F3A5F] font-sans">
      {/* Official Bulletin Scroll Wire Stats Ticker */}
      <div className="w-full bg-[#B3211E] border-b border-[#1F3A5F] overflow-hidden py-2 z-30 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <div className="flex whitespace-nowrap animate-ticker text-xs font-mono text-[#FFFBF4] uppercase tracking-wider">
          <span className="mx-6 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#E8B33D] inline-block animate-ping"></span>
            OFFICIAL TELEGRAM WIRE: 2,847 CIVIC FILED COMPLAINTS IN ACTIVE METRO CIRCLE
          </span>
          <span className="mx-6 text-[#E8B33D]">★</span>
          <span className="mx-6 font-bold">✓ 1,203 CASE DISPATCH REPORTS RESOLVED BY BBMP FIELD UNITS</span>
          <span className="mx-6 text-[#E8B33D]">★</span>
          <span className="mx-6">SLA TURNAROUND CAP: 4.2 BUSINESS DAYS</span>
          <span className="mx-6 text-[#E8B33D]">★</span>
          <span className="mx-6">✦ AUTOMATED AUDIT SYSTEM CONFIDENCE: 93.4% GENERAL CORRELATION</span>
        </div>
      </div>

      {/* Hero Notice-Board Section */}
      <section className="relative py-16 border-b-2 border-[#1F3A5F]/20 bg-[#FFFBF4] overflow-hidden">
        {/* Visual Watermark grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1f3a5f 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1F3A5F]/10 text-[#1F3A5F] rounded-[1px] text-[11px] font-mono font-bold uppercase border border-[#1F3A5F]/20 mb-5 shadow-xs">
              <NagarSevaLogo size={18} variant="blue" /> NAGARSEVA CIVIC REGISTER v2.56
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#1F3A5F] mb-6 leading-tight">
              A Swifter, Trustworthy <br />
              <span className="text-[#B3211E] underline decoration-wavy decoration-[#E8B33D] underline-offset-4">Municipal Circular.</span>
            </h1>
            
            <p className="text-[#1F3A5F]/90 text-[14px] md:text-base mb-8 max-w-lg leading-relaxed font-sans">
              Log local grievances directly onto the Ward Register. Powered by instant visual AI verification for direct routing. Track real-time progress of certified public files in <span className="font-bold underline text-[#1F3A5F]">{activeWard}</span>, <span className="font-bold text-[#B3211E]">{currentCity} Municipal Division</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onSignInCitizen}
                style={{ contentVisibility: 'auto' }}
                className="bg-[#B3211E] text-[#FFFBF4] hover:bg-[#971C19] px-6 py-3 rounded-[2px] font-bold text-sm uppercase tracking-wider transition-all duration-150 hard-shadow-red active:scale-97 flex items-center justify-center gap-2 cursor-pointer border border-[#B3211E]"
              >
                File Citizen Report <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSignInAuthority}
                className="bg-transparent border-2 border-[#1F3A5F] text-[#1F3A5F] hover:bg-[#1F3A5F]/5 px-6 py-3 rounded-[2px] font-bold text-sm uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
              >
                Officer Docket Portal
              </button>
            </div>

            <p className="text-[11px] font-mono text-[#1F3A5F]/75 mt-4">
              * STATUTORY PUBLIC GRIEVANCE CONFORMING TO METROPOLITAN ACTS
            </p>
          </div>

          {/* Tactile Municipal Project Blueprint & Image Frame */}
          <div className="hidden lg:flex flex-col relative bg-[#FFFBF4] border-2 border-[#1F3A5F] p-4 rounded-[2px] card-shadow overflow-hidden animate-fade-in group w-full max-w-[460px]">
            {/* Background grid overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid" />
            
            {/* Blueprint Header */}
            <div className="flex justify-between items-center border-b border-[#1F3A5F]/15 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B3211E] animate-pulse" />
                <span className="text-[10px] font-mono font-black text-[#1F3A5F] uppercase tracking-wider">
                  PROJECT PLAT MAP: MODERN WARD MODEL
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#1F3A5F]/50 font-bold">DOCKET #4829-CIVIC</span>
            </div>

            {/* Core Image depicting the problem statement (Modernized, resolved municipal street model) */}
            <div className="relative border-2 border-[#FFFBF4] bg-[#F2EBDA]/45 p-1 rounded-[1px] overflow-hidden shadow-inner group">
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=82"
                alt="NagarSeva Modernized Municipal Street Model"
                className="w-full h-[256px] object-cover rounded-[1px] filter brightness-95 contrast-105 group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Overlay Annotations detailing grievance targets resolved */}
              <div className="absolute top-2 left-2 bg-[#1F3A5F]/95 backdrop-blur-xs text-[#FFFBF4] text-[8px] font-mono px-1.5 py-0.5 rounded-[1px] border border-[#FFFBF4]/15 shadow-sm">
                💡 SMART PATROLLING LIGHTS [OPERATIONAL]
              </div>

              <div className="absolute bottom-2 left-2 bg-[#3F6B4E]/95 backdrop-blur-xs text-[#FFFBF4] text-[8px] font-mono px-1.5 py-0.5 rounded-[1px] border border-[#FFFBF4]/15 shadow-sm">
                🛣️ HIGH-TRACTION ASPHALT (0% POTHOLES)
              </div>

              <div className="absolute bottom-1/3 right-2 bg-[#B3211E]/95 backdrop-blur-xs text-[#FFFBF4] text-[8px] font-mono px-1.5 py-0.5 rounded-[1px] border border-[#FFFBF4]/15 shadow-sm">
                ♻️ SORTED CIVIC RECYCLING DUCT [RESOLVED]
              </div>

              {/* Distressed Red Municipal Stamp */}
              <div className="absolute top-2 right-2 bg-[#FFFBF4]/90 backdrop-blur-xs border-2 border-[#B3211E] text-[#B3211E] px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest rounded-[2px] rotate-[10deg] select-none shadow-sm shadow-[#B3211E]/10 flex items-center gap-1">
                <span>APPROVED</span>
              </div>
            </div>

            {/* Municipal Project Spec Description Form */}
            <div className="mt-3 grid grid-cols-2 gap-3.5 pt-3 border-t border-dashed border-[#1F3A5F]/15">
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#1F3A5F]/60 uppercase">GOVERNMENT AUDIT STATUS:</span>
                <span className="text-[11px] font-serif font-black text-[#3F6B4E] uppercase flex items-center gap-1 mt-0.5">
                  ✓ EXCELLENT (GRADE A)
                </span>
              </div>
              <div>
                <span className="block text-[8px] font-mono font-bold text-[#1F3A5F]/60 uppercase">ACTIVE TARGET DISTRICT:</span>
                <span className="text-[11px] font-mono font-bold text-[#1F3A5F] truncate block mt-0.5">
                  {currentCity.toUpperCase()} • {activeWard.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Subtle disclaimer and footer inside the visual */}
            <div className="mt-4 flex justify-between items-center text-[8.5px] font-mono text-[#1F3A5F]/40 border-t border-[#1F3A5F]/10 pt-2.5">
              <span className="flex items-center gap-1 leading-none">
                <Landmark className="w-3 h-3 text-[#B3211E]" /> SECURE BBMP CIVIC REGISTER
              </span>
              <span className="leading-none">COORDINATES: 12.9716° N, 77.5946° E</span>
            </div>
          </div>
        </div>
      </section>

      {/* Official Complaint Registry Workflow */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <span className="font-mono text-[11px] font-black text-[#B3211E] uppercase tracking-widest block mb-1">
            CIVIC ARBITRAGE STANDARD OPERATING PROCEDURE
          </span>
          <h2 className="text-3xl font-serif font-black text-[#1F3A5F] mb-3">SOP: GRIEVANCE TO RESOLUTION</h2>
          <div className="w-24 h-0.5 bg-[#B3211E] mx-auto mt-2"></div>
        </div>

        {/* 5 columns of steps styled as official sequential dockets */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { nr: '01', title: 'IDENTIFY', icon: <FileText className="w-5 h-5 text-[#B3211E]" />, desc: 'Locate pothole, public water leakage, or broken streetlight.' },
            { nr: '02', title: 'LOG RECORD', icon: <MapPin className="w-5 h-5 text-[#1F3A5F]" />, desc: 'Take clear photos of scene & coordinates for the public record.' },
            { nr: '03', title: 'AI INSPECTION', icon: <Stamp className="w-5 h-5 text-[#E8B33D]" />, desc: 'Core Gemini models classify, severity-score, & tag automatically.' },
            { nr: '04', title: 'CO-SIGN FILE', icon: <Users className="w-5 h-5 text-[#3F6B4E]" />, desc: 'Verified local residents co-sign the docket file to accelerate BBMP priority.' },
            { nr: '05', title: 'RESOLUTION', icon: <CheckCircle2 className="w-5 h-5 text-[#3F6B4E]" />, desc: 'Sub-contractors dispatch with public funds to patch, replace, or repair.' },
          ].map((item, idx) => (
            <div key={item.nr} className="bg-[#FFFBF4] p-5 rounded-[2px] border border-[#1F3A5F]/15 relative z-10 card-shadow">
              <span className="font-mono text-xs font-black text-[#B3211E] opacity-70 block mb-1">
                SECTION {item.nr}
              </span>
              <div className="w-8 h-8 rounded-[1px] bg-[#1F3A5F]/5 border border-[#1F3A5F]/15 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h4 className="text-[13px] font-serif font-black text-[#1F3A5F] uppercase mb-1">{item.title}</h4>
              <p className="text-[11px] text-[#1F3A5F]/85 leading-relaxed font-sans mt-1.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Grid selector of Core Municipal Registers */}
      <section className="bg-[#FFFBF4] border-t border-b border-[#1F3A5F]/15 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="font-mono text-[11px] font-black text-[#B3211E] uppercase tracking-widest block mb-1">
              DIRECT ENTRY REGISTERS
            </span>
            <h2 className="text-3xl font-serif font-black text-[#1F3A5F] mb-3">File an Immediate Notice Draft</h2>
            <p className="text-[#1F3A5F]/80 text-[13px] max-w-md mx-auto font-sans leading-relaxed">
              Select one of the validated municipal sections to instantly launch a pre-populated reporting circular.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="bg-[#F2EBDA]/40 hover:bg-[#FFFBF4] border border-[#1F3A5F]/15 hover:border-[#B3211E] rounded-[2px] p-5 text-center cursor-pointer card-shadow group transition-all duration-150"
              >
                <div className="mx-auto w-10 h-10 rounded-[1px] bg-[#FFFBF4] border border-[#1F3A5F]/10 flex items-center justify-center mb-3 group-hover:border-[#B3211E]/40 group-hover:scale-105 duration-150">
                  {cat.icon}
                </div>
                <p className="text-[12px] font-mono font-bold text-[#1F3A5F] mb-1 leading-tight uppercase">{cat.name}</p>
                <p className="text-[10px] text-[#1F3A5F]/75 group-hover:text-[#B3211E] transition-colors leading-normal font-sans mt-1.5">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Audit Record Stats */}
      <section className="bg-[#1F3A5F] text-[#FFFBF4] py-16 relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <span className="font-mono text-[10px] text-[#E8B33D] tracking-widest uppercase mb-1 font-bold block">
            GOVERNANCE AND ACCOUNTABILITY AUDIT STATS
          </span>
          <h2 className="text-3xl font-serif font-black mb-12">MUNICIPAL PERFORMANCE MATRIX</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-5 border border-[#FFFBF4]/15 rounded-[1px] bg-[#FFFBF4]/5">
              <span className="text-4xl font-display text-[#E8B33D] block mb-1">2,847+</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFFBF4]/60 font-bold block mb-2">RECORDS LOGGED</span>
              <p className="text-[11px] text-[#FFFBF4]/80 font-sans leading-relaxed">Direct certified circular grievances reported by residents of {currentCity}.</p>
            </div>
            
            <div className="p-5 border border-[#FFFBF4]/15 rounded-[1px] bg-[#FFFBF4]/5">
              <span className="text-4xl font-display text-[#E8B33D] block mb-1">1,203</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFFBF4]/60 font-bold block mb-2">SEALED RESOLUTIONS</span>
              <p className="text-[11px] text-[#FFFBF4]/80 font-sans leading-relaxed">Completed works verified through physical co-signs and photo audit trails.</p>
            </div>

            <div className="p-5 border border-[#FFFBF4]/15 rounded-[1px] bg-[#FFFBF4]/5">
              <span className="text-4xl font-display text-[#E8B33D] block mb-1">94.6%</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFFBF4]/60 font-bold block mb-2">SLA CONFORMITY</span>
              <p className="text-[11px] text-[#FFFBF4]/80 font-sans leading-relaxed">Active case dispatches completed within statutory turnaround bounds.</p>
            </div>

            <div className="p-5 border border-[#FFFBF4]/15 rounded-[1px] bg-[#FFFBF4]/5">
              <span className="text-4xl font-display text-[#E8B33D] block mb-1">12</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFFBF4]/60 font-bold block mb-2">INTEGRATED METRO CIRCLES</span>
              <p className="text-[11px] text-[#FFFBF4]/80 font-sans leading-relaxed">Active municipal wards leveraging NagarSeva digital ledger systems.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
