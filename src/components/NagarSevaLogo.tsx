import React from 'react';

interface NagarSevaLogoProps {
  size?: number;
  className?: string;
  variant?: 'red' | 'blue' | 'green' | 'default';
}

export default function NagarSevaLogo({
  size = 48,
  className = '',
  variant = 'default',
}: NagarSevaLogoProps) {
  // Determine color matching our Indian Municipal Standard Color Palette
  const getColor = () => {
    switch (variant) {
      case 'red':
        return '#B3211E'; // Postbox red
      case 'blue':
        return '#1F3A5F'; // Ledger Blue
      case 'green':
        return '#3F6B4E'; // Register Green
      case 'default':
      default:
        return '#B3211E'; // Default to Postbox Red
    }
  };

  const inkColor = getColor();
  const goldColor = '#E8B33D'; // Official Municipal Gold Accent

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id="nagarseva-registry-seal"
    >
      {/* Outer stamp border - Bold Primary Ink */}
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke={inkColor}
        strokeWidth="3"
        fill="transparent"
      />
      
      {/* Middle gold separator ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={goldColor}
        strokeWidth="1.2"
        fill="transparent"
      />

      {/* Inner thin primary ink circle */}
      <circle
        cx="50"
        cy="50"
        r="32.5"
        stroke={inkColor}
        strokeWidth="1"
        fill="transparent"
      />

      {/* Dotted inner gold ring */}
      <circle
        cx="50"
        cy="50"
        r="29.5"
        stroke={goldColor}
        strokeWidth="1.5"
        strokeDasharray="3 3"
        fill="transparent"
      />

      {/* Curved Text Path definitions */}
      <defs>
        {/* Top curved text path */}
        <path
          id="text-path-top"
          d="M 14 50 A 36 36 0 1 1 86 50"
          fill="none"
        />
        {/* Bottom curved text path */}
        <path
          id="text-path-bottom"
          d="M 86 50 A 36 36 0 0 1 14 50"
          fill="none"
        />
        
        {/* Drop shadow filter reflecting fine stationery stamp impression */}
        <filter id="ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.3" result="blur" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 0" />
        </filter>
      </defs>

      {/* TEXT GRP with stamp bleeding effect */}
      <g filter="url(#ink-bleed)">
        {/* Top Text Arc */}
        <text fill={inkColor} fontSize="6.5" fontWeight="900" letterSpacing="1.2" className="font-sans font-black">
          <textPath href="#text-path-top" startOffset="50%" textAnchor="middle">
            NAGARSEVA CIVIC REGISTER
          </textPath>
        </text>

        {/* Bottom Text Arc */}
        <text fill={inkColor} fontSize="6.5" fontWeight="900" letterSpacing="1.2" className="font-sans font-black">
          <textPath href="#text-path-bottom" startOffset="50%" textAnchor="middle">
            STATE OF URBAN WORKS
          </textPath>
        </text>

        {/* Star Separators in Gold */}
        <polygon points="12.5,49 14,50.5 12.5,52 11,50.5" fill={goldColor} />
        <polygon points="87.5,49 89,50.5 87.5,52 86,50.5" fill={goldColor} />

        {/* Central Official Civic Assembly Logo */}
        <g stroke={inkColor} strokeLinecap="round" strokeLinejoin="round">
          {/* Foundation Base */}
          <path d="M 33 64 L 67 64" strokeWidth="2.5" />
          <path d="M 35 61.5 L 65 61.5" strokeWidth="1.2" stroke={goldColor} />
          
          {/* Perfect Vertical Pillars */}
          <line x1="38" y1="61.5" x2="38" y2="49" strokeWidth="1.5" />
          <line x1="44" y1="61.5" x2="44" y2="49" strokeWidth="1.5" />
          <line x1="50" y1="61.5" x2="50" y2="47" strokeWidth="1.5" />
          <line x1="56" y1="61.5" x2="56" y2="49" strokeWidth="1.5" />
          <line x1="62" y1="61.5" x2="62" y2="49" strokeWidth="1.5" />

          {/* Architrave / Lintel */}
          <path d="M 36 49 L 64 49" strokeWidth="2" />

          {/* Majestic Central Dome with Gold Highlight */}
          <path d="M 42 46.5 C 42 36.5, 58 36.5, 58 46.5 Z" fill="transparent" strokeWidth="1.5" stroke={goldColor} />
          
          {/* Spire Flagstaff */}
          <line x1="50" y1="37" x2="50" y2="29" strokeWidth="1" />
          {/* Pennant Flag in shimmering Gold */}
          <path d="M 50 29 L 56 31.5 L 50 34 Z" fill={goldColor} stroke="none" />

          {/* Symmetric Laurel leaves/wheat sprigs surrounding the temple base */}
          <path d="M 27 60 C 26 53, 30 48, 30 48" stroke={goldColor} strokeWidth="1" fill="none" />
          <path d="M 73 60 C 74 53, 70 48, 70 48" stroke={goldColor} strokeWidth="1" fill="none" />
        </g>
      </g>
    </svg>
  );
}
