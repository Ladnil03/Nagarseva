import React from 'react';

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
  1. Display/Heads: "Archivo Black" or "Fraunces" serif for bold scores, headers, stamps.
  2. Body Text: "Mukta" humanist for official labels & descriptions.
  3. Utility/Data: "IBM Plex Mono" for score percentages, sector IDs, dates.

SIGNATURE TREATMENT:
  - Custom ink gauge ring track, stamp-like framing structure.
  - Hard 2px offset shadows (rgba(31,58,95,0.15)) reflecting stationary pressure.
========================================================================
*/

interface WardHealthGaugeProps {
  score: number; // 0 to 100
  title?: string;
  subtitle?: string;
  size?: number; // default 112
}

export default function WardHealthGauge({
  score,
  title = 'WARD RECTITUDE INDEX',
  subtitle = 'HAL 2ND STAGE WARD 142',
  size = 112,
}: WardHealthGaugeProps) {
  const radius = (size - 12) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStrokeColor = (val: number) => {
    if (val <= 40) return '#B3211E'; // Postbox Red (Hazardous)
    if (val <= 70) return '#E8B33D'; // Ward Yellow (Noticeable)
    return '#3F6B4E'; // Register Green (Compliant)
  };

  const strokeColor = getStrokeColor(score);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#FFFBF4] rounded-[2px] border border-[#1F3A5F]/20 card-shadow text-center">
      <div className="relative mb-2.5" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-[#1F3A5F]/10"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated fill ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.8s ease-out',
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display text-[#1F3A5F] leading-none tracking-tight">{score}%</span>
          <span className="text-[9px] text-[#1F3A5F]/60 font-mono font-bold uppercase leading-none mt-1">OFFICIAL</span>
        </div>
      </div>

      <div className="text-center mt-2.5">
        <h3 className="font-serif font-black text-sm text-[#1F3A5F] uppercase tracking-wide leading-snug">{title}</h3>
        <p className="inline-block text-[10px] bg-[#3F6B4E]/10 text-[#3F6B4E] font-bold mt-1.5 px-2 py-0.5 border border-[#3F6B4E]/20 rounded-[1px] font-mono tracking-wider">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
