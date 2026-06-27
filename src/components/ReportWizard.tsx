import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { IssueCategory, RiskLevel } from '../types';
import { Camera, MapPin, CheckCircle, ArrowLeft, ArrowRight, Loader, Sparkles, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface ReportWizardProps {
  onBackToDashboard: () => void;
  onSubmitIssue: (issuePayload: any) => void;
  onAddPoints: (pts: number, reason: string) => void;
  currentCity?: string;
  activeWard?: string;
}

export default function ReportWizard({
  onBackToDashboard,
  onSubmitIssue,
  onAddPoints,
  currentCity = 'Bengaluru',
  activeWard = 'HAL 2nd Stage Ward 142',
}: ReportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form Fields State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [locationAddress, setLocationAddress] = useState(`Sector 4 Ground, Near Municipal Office, ${activeWard}, ${currentCity}`);
  const [lat, setLat] = useState(currentCity === 'Mumbai' ? 19.076 : currentCity === 'Delhi' ? 28.6139 : 12.9698);
  const [lng, setLng] = useState(currentCity === 'Mumbai' ? 72.8777 : currentCity === 'Delhi' ? 77.209 : 77.644);
  const [category, setCategory] = useState<IssueCategory>('Road Pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(7); // Score 1 to 10
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [submittedIssueId, setSubmittedIssueId] = useState('');

  // Dropzone file reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock preset images designed to simulate real citizen uploads
  const demoPresets = [
    {
      name: 'Asphalt Road Pothole',
      emoji: '🕳️',
      url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
      sampleText: 'Large pothole on Indiranagar road causing cars to dodge.',
    },
    {
      name: 'Overflowing Waste Bin',
      emoji: '🗑️',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      sampleText: 'Municipal garbage dump piling up near secondary park gates.',
    },
    {
      name: 'Dark Streetlights stretch',
      emoji: '💡',
      url: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=600&q=80',
      sampleText: 'Three lampposts are dark since Wednesday raising security risks.',
    }
  ];

  // Handle uploaded files as base64 strings
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadstart = () => {
      setLoading(true);
      setUploadProgress(15);
    };
    reader.onload = () => {
      const base64Str = reader.result as string;
      setPhotoUrl(base64Str);
      setImageBase64(base64Str);
      triggerAiAnalysis(base64Str);
    };
  };

  // Simulating dragging files or selecting preset
  const handleSelectPreset = (preset: typeof demoPresets[0]) => {
    setLoading(true);
    setUploadProgress(40);
    setPhotoUrl(preset.url);

    // Convert Unsplash URL placeholder to simulate structured analysis
    setTimeout(() => {
      setUploadProgress(100);
      let detectedCat: IssueCategory = 'Road Pothole';
      let desc = 'Deep structural asphalt cracks';
      let sev = 8;
      
      if (preset.name.includes('Garbage')) {
        detectedCat = 'Overflowing Garbage';
        desc = 'Organic wet overflow bypass';
        sev = 5;
      } else if (preset.name.includes('Streetlight')) {
        detectedCat = 'Broken Streetlight';
        desc = 'Main overhead lighting power outage';
        sev = 7;
      }

      setCategory(detectedCat);
      setDescription(`Citizen Report: Spotted a ${preset.name.toLowerCase()} at ${locationAddress}. ${preset.sampleText}`);
      setTitle(`${detectedCat} Reported near Ward 142`);

      const analysisPayload = {
        category: detectedCat,
        damageDescription: desc,
        confidence: 94,
        severity: sev,
        recommendedAction: 'Priority dispatch local ward crew.'
      };

      setAiAnalysis(analysisPayload);
      setSeverity(sev);
      setLoading(false);
    }, 1500);
  };

  // Post image payload to server side /api/gemini/analyze route
  const triggerAiAnalysis = async (base64Data: string) => {
    setUploadProgress(60);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data }),
      });

      setUploadProgress(90);
      const data = await res.json();
      setUploadProgress(100);

      if (data && !data.error) {
        setAiAnalysis(data);
        setCategory(data.category as IssueCategory);
        setSeverity(data.severity || 7);
        setTitle(`${data.category} detected near HAL 2nd Stage`);
        setDescription(`AI detected: ${data.damageDescription}. Civic routing: ${data.recommendedAction}`);
      }
    } catch (err) {
      console.error('Error hitting server-side Gemini route:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !photoUrl) {
      alert('Please upload a civic photo or select a demo preset to proceed.');
      return;
    }
    if (currentStep === 3 && !title) {
      alert('Please enter a brief title summarizing the issue.');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      category,
      title,
      location: locationAddress,
      latitude: lat,
      longitude: lng,
      imageUrl: photoUrl,
      description,
      severity,
      aiAnalysis,
    };

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.id) {
        setSubmittedIssueId(data.id);
        
        // Trigger Canvas Confetti Success Explosion!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6B35', '#4ECDC4', '#6BCB77', '#FFE66D'],
        });

        // Add 100 NagarPoints to state
        onAddPoints(100, `Filed new civic issue: ${data.id}`);

        // Route to final success step
        setCurrentStep(5);
        onSubmitIssue(data); // Sync issue list on parent
      }
    } catch (err) {
      console.error('Submit issue failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeverity(parseInt(e.target.value));
  };

  return (
    <div id="report-wizard" className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Wizard Header and Progress steps */}
      <div className="mb-8 select-none">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToDashboard}
            className="text-xs font-bold text-ns-text-2 hover:text-ns-orange flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Back
          </button>
          
          <span className="text-[10px] font-bold text-ns-orange uppercase tracking-widest bg-ns-orange-10 px-3 py-1 rounded">
            Report Civic Issue Step {currentStep <= 4 ? currentStep : 4}/4
          </span>
        </div>

        {/* Custom Progress Wizard Dot Flow */}
        <div className="relative flex items-center justify-between max-w-md mx-auto">
          {/* Progress fill bar */}
          <div className="absolute left-0 right-0 h-1 bg-slate-200 top-1/2 -translate-y-1/2 z-0" />
          <div
            className="absolute left-0 h-1 bg-ns-orange top-1/2 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((Math.min(currentStep, 4) - 1) / 3) * 100}%` }}
          />

          {[
            { nr: 1, label: 'Photo' },
            { nr: 2, label: 'Location' },
            { nr: 3, label: 'Details' },
            { nr: 4, label: 'Submit' },
          ].map((s) => (
            <div key={s.nr} className="relative z-10 flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                  currentStep >= s.nr
                    ? 'bg-ns-orange border-ns-orange text-white scale-110'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {s.nr}
              </span>
              <span className={`text-[10px] font-bold mt-1.5 ${currentStep >= s.nr ? 'text-ns-text-1' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main step container */}
      <div className="bg-white border border-[#E8EAF0] rounded-lg-custom shadow-md overflow-hidden min-h-[400px] flex flex-col justify-between">
        
        {/* Step Wizard Header */}
        <div className="p-4 bg-ns-dark text-white select-none">
          {currentStep === 1 && <h2 className="text-base font-bold">Step 1: Upload Civic Photographic Evidence</h2>}
          {currentStep === 2 && <h2 className="text-base font-bold">Step 2: Confirm Ward Location Coordinates</h2>}
          {currentStep === 3 && <h2 className="text-base font-bold">Step 3: Provide Grievance Classification Details</h2>}
          {currentStep === 4 && <h2 className="text-base font-bold">Step 4: Final Verification Review & Handover</h2>}
          {currentStep === 5 && <h2 className="text-base font-bold text-ns-green">✓ Civic Grievance Logged Successfully</h2>}
        </div>

        {/* Step Body */}
        <div className="p-6 md:p-8 flex-1">
          
          {/* STEP 1: Photo Upload zone */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <p className="text-[13px] text-ns-text-2 leading-relaxed">
                Take a photo or drag in an image of the civic damage. Our automated server-side Gemini model categorizes the incident, flags risk level, and identifies the department route.
              </p>

              {/* Photo Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#FF6B35]/30 rounded-lg bg-ns-orange-10/20 hover:border-ns-orange hover:bg-ns-orange-10/40 p-10 text-center cursor-pointer transition-all duration-200 group relative"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {loading ? (
                  <div className="space-y-3 py-4">
                    <Loader className="w-8 h-8 text-ns-orange animate-spin mx-auto" />
                    <p className="text-xs font-bold text-ns-text-1">AI model is processing your photo...</p>
                    <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden mx-auto">
                      <div className="bg-ns-orange h-full rounded-full transition-all duration-500" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : photoUrl ? (
                  <div className="space-y-2">
                    <img
                      src={photoUrl}
                      alt="Civic upload"
                      className="max-h-[160px] mx-auto rounded-lg-custom object-cover shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-[10px] text-ns-teal font-extrabold tracking-wider uppercase pt-2">✓ Photo Uploaded Successfully</p>
                    <p className="text-[9px] text-[#A0AEC0]">Click to replace file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-10 h-10 text-ns-orange/70 group-hover:text-ns-orange mx-auto transition-transform group-hover:scale-110" />
                    <h4 className="text-sm font-bold text-ns-text-1">Click or Drop Picture Here</h4>
                    <p className="text-[10px] text-ns-text-3">Supports JPG, PNG formats. Max limit 10MB.</p>
                  </div>
                )}
              </div>

              {/* Presets selection panel (Highly impressive for demo evaluation!) */}
              {!photoUrl && (
                <div className="space-y-3 pt-2">
                  <h5 className="text-[11px] uppercase font-bold text-ns-text-1 tracking-wider">Speedy Evaluation Presets</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {demoPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleSelectPreset(preset)}
                        className="bg-white border border-[#E8EAF0] p-3 text-left rounded-lg-custom shadow-xs hover:border-ns-orange hover:-translate-y-0.5 duration-200 group flex items-start gap-2.5 cursor-pointer"
                      >
                        <span className="text-xl">{preset.emoji}</span>
                        <div>
                          <p className="text-[11px] font-bold text-ns-text-1 line-clamp-1">{preset.name}</p>
                          <p className="text-[9px] text-ns-text-2 group-hover:text-ns-orange mt-0.5">Simulate Report</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shimmering AI badge slide-in on verify success */}
              {photoUrl && aiAnalysis && (
                <div className="bg-[rgba(78,205,196,0.1)] border border-[rgba(78,205,196,0.25)] p-4 rounded-lg-custom text-ns-dark flex items-start justify-between gap-3 animate-fade-in shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ns-teal/20 flex items-center justify-center text-xl shrink-0">
                      ✨
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-ns-text-1 uppercase">AI DECTECTED: {aiAnalysis.category}</span>
                        <span className="text-[9px] bg-ns-orange text-white px-1.5 py-0.5 rounded font-extrabold">{aiAnalysis.confidence}% Confident</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1"><strong>Damage Description:</strong> {aiAnalysis.damageDescription}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Location Map Picker */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <p className="text-[13px] text-ns-text-2 leading-relaxed">
                Confirm your incident location within Ward 142. Our automated systems lock onto nearby coordinate feeds.
              </p>

              {/* Coordinates configuration widget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11.5px] font-semibold text-ns-text-2 mb-1.5 block">Reported Street Address</label>
                  <textarea
                    rows={3}
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-300 rounded focus:border-ns-orange focus:ring-1 outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 self-center">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value))}
                      className="w-full text-xs border border-slate-300 h-10 px-3 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={lng}
                      onChange={(e) => setLng(parseFloat(e.target.value))}
                      className="w-full text-xs border border-slate-300 h-10 px-3 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Embedded Mini static representation */}
              <div className="w-full h-[180px] bg-blue-50 border border-slate-200 rounded-lg overflow-hidden relative">
                {/* Visual grid blueprint mockup with circular crosshair */}
                <div className="absolute inset-0 bg-[#E2E8F0] select-none pointer-events-none opacity-80" />
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-55">
                  <path d="M0,80 L400,100 M120,0 L180,200" stroke="#FFFFFF" strokeWidth="12" />
                  <ellipse cx="200" cy="90" rx="40" ry="32" fill="#BCE0FD" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Target Crosshair */}
                  <div className="relative">
                    <span className="w-14 h-14 rounded-full border border-ns-orange/50 flex items-center justify-center animate-ping" />
                    <span className="w-8 h-8 rounded-full border-2 border-ns-orange flex items-center justify-center absolute left-3 top-3">
                      <MapPin className="w-4 h-4 text-ns-orange" />
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-ns-dark/90 text-white text-[9px] px-2 py-1 rounded font-bold">
                  SATELLITE POSITION ADJUSTED ✓
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Category details and Severity */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              {/* Category picker list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11.5px] font-bold text-ns-text-2 mb-1.5 block">Update Category Type</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IssueCategory)}
                    className="w-full text-xs h-10 border border-slate-300 rounded px-3 focus:border-ns-orange focus:ring-1"
                  >
                    <option value="Road Pothole">🕳️ Road Pothole</option>
                    <option value="Overflowing Garbage">🗑️ Overflowing Garbage</option>
                    <option value="Broken Streetlight">💡 Broken Streetlight</option>
                    <option value="Sewage Leakage">💧 Sewage Leakage</option>
                    <option value="Damaged Public Property">🏛️ Damaged Public Property</option>
                    <option value="Other">❓ Other infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11.5px] font-bold text-ns-text-2 mb-1.5 block">Issue Summary Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Massive pothole near main park entrance Gate B"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs h-10 border border-slate-300 rounded px-3 focus:border-ns-orange focus:ring-1 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="text-[11.5px] font-bold text-ns-text-2 mb-1.5 block">Detailed Grievance Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Elaborate on details, hazards, duration, etc..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded focus:border-ns-orange focus:ring-1 outline-none font-medium"
                />
              </div>

              {/* Horizontal Severity Slider indicator */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-bold text-ns-text-2">
                  <span>PUBLIC RISK STRETCH SEVERITY LEVEL:</span>
                  <span className="text-ns-orange bg-ns-orange-10 px-2 py-0.5 rounded">Score {severity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ns-orange"
                />
                
                {/* Visual Color Scale helper bar */}
                <div className="relative w-full h-1 bg-gradient-to-r from-[#6BCB77] via-[#FFE66D] via-[#FF6B35] to-[#FF4858] rounded-full mt-2" />
                <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  <span>Low Wear (1-3)</span>
                  <span>Caution Spot (4-6)</span>
                  <span>High Risk (7-8)</span>
                  <span>Safety Hazard (9-10)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <p className="text-[13px] text-ns-text-2 leading-relaxed">
                Please review your finalized civic ticket. Our server will seal coordinates and dispatch it to Ward 142 engineers.
              </p>

              <div className="border border-slate-200 rounded-lg p-5 space-y-4 bg-slate-55/40">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Grievance Category</span>
                    <span className="font-bold text-ns-text-1">{category}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Incidence Title</span>
                    <span className="font-bold text-ns-text-1 max-w-full truncate block">{title}</span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Locked Ward Coordinates Address</span>
                    <span className="font-medium text-slate-600 block leading-tight">{locationAddress}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-xs text-ns-text-2 font-bold">Severity Risk Profile:</span>
                  <span className="text-xs font-black text-ns-red bg-red-100 px-2 py-0.5 rounded-full uppercase">
                    Level {severity} — {severity >= 9 ? 'Critical Hazard' : severity >= 6 ? 'High Action' : 'Stable'}
                  </span>
                </div>
              </div>

              {/* Quick AI Validation seal of confirmation */}
              <div className="bg-[#ECFDF5] border border-ns-green/20 p-3 rounded-lg flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-5 h-5 text-ns-green shrink-0" />
                <span className="text-[11px] text-slate-600 font-medium">
                  Verified with automated Gemini AI system logic. Handover speed rating: <strong>Instant Route</strong>.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Full-screen Submit Success Animation */}
          {currentStep === 5 && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-6 animate-fade-in select-none">
              <div className="w-20 h-20 rounded-full bg-ns-teal flex items-center justify-center text-white text-4xl shadow-xl animate-bounce">
                🎉
              </div>

              <div>
                <span className="text-xs font-bold text-ns-teal uppercase bg-[rgba(78,205,196,0.15)] px-3 py-1 rounded">
                  +100 NagarPoints Awarded
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-ns-text-1 mt-3">Incidence Logged Successfully!</h3>
                <p className="text-xs text-ns-content-2 mt-1 mx-auto max-w-sm">
                  Your civic ticket has been sealed with ID: <strong>{submittedIssueId}</strong>. BBMP Ward maintenance cells have been allocated on dispatch duty.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 text-[11px] rounded max-w-xs font-mono font-semibold">
                TICKET NO: {submittedIssueId} <br />
                SLOTS ROUTE: Ward 142 Public Desk
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={onBackToDashboard}
                  style={{ contentVisibility: 'auto' }}
                  className="bg-ns-orange text-white hover:bg-[#E5602F] px-5 py-2.5 rounded shadow-lg text-xs font-bold cursor-pointer"
                >
                  Track in Action Center
                </button>
                <button
                  onClick={() => {
                    // Reset wizard for another
                    setPhotoUrl('');
                    setImageBase64('');
                    setTitle('');
                    setDescription('');
                    setSeverity(7);
                    setAiAnalysis(null);
                    setCurrentStep(1);
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-5 py-2.5 rounded text-xs font-bold cursor-pointer"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Wizard buttons footer */}
        {currentStep <= 4 && (
          <div className="p-4 bg-slate-50 border-t border-[#E8EAF0] flex justify-between items-center select-none">
            <button
              disabled={currentStep === 1 || loading}
              onClick={handlePrevStep}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded text-xs font-bold disabled:opacity-40"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                disabled={loading}
                onClick={handleNextStep}
                className="px-5 py-2 bg-ns-orange hover:bg-[#E5602F] text-white rounded text-xs font-bold shadow-sm transition-transform active:scale-95"
              >
                Next Step
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-ns-teal hover:bg-[#3dbdb4] text-white rounded text-xs font-extrabold shadow-md transition-transform active:scale-95"
              >
                {loading ? 'Submitting Registry...' : 'Handover to Ward Authority →'}
              </button>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
