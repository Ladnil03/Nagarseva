import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CivicIssue, IssueCategory } from '../types';
import { ZoomIn, ZoomOut, Compass, Navigation, Eye, MapPin, Layers, Globe, Grid, Landmark } from 'lucide-react';

interface InteractiveMapProps {
  issues: CivicIssue[];
  selectedIssueId: string | null;
  onSelectIssue: (issue: CivicIssue) => void;
  activeFilter: 'all' | 'critical' | 'near_me';
  currentCity?: string;
}

// Coordinate mappings for major Indian cities to center the GIS view perfectly
const CITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Bengaluru': { lat: 12.9716, lng: 77.5946, zoom: 12 },
  'Mumbai': { lat: 19.0760, lng: 72.8777, zoom: 11 },
  'Delhi': { lat: 28.6139, lng: 77.2090, zoom: 11 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, zoom: 12 },
  'Pune': { lat: 18.5204, lng: 73.8567, zoom: 12 },
  'Chennai': { lat: 13.0827, lng: 80.2707, zoom: 12 }
};

export default function InteractiveMap({
  issues,
  selectedIssueId,
  onSelectIssue,
  activeFilter,
  currentCity = 'Bengaluru',
}: InteractiveMapProps) {
  const [mapMode, setMapMode] = useState<'gis' | 'schematic'>('gis');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gisTheme, setGisTheme] = useState<'retro-light' | 'blueprint-dark'>('retro-light');
  
  // Ref elements for standard map container and instance state
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.FeatureGroup | null>(null);
  const activeMarkersMapRef = useRef<Record<string, L.Marker>>({});

  const cityConfig = CITY_CENTERS[currentCity] || CITY_CENTERS['Bengaluru'];

  // ---------------------------------------------------------
  // 1. SCHEMATIC MAP CALCULATIONS (For backward compatibility layout)
  // ---------------------------------------------------------
  const getMapLabel = (type: 'lake1' | 'lake2' | 'park1' | 'park2') => {
    switch(currentCity) {
      case 'Mumbai':
        if (type === 'lake1') return 'Powai Lake';
        if (type === 'lake2') return 'Backbay Coastal Bay';
        if (type === 'park1') return 'Shivaji Park Ground';
        return 'Bandra Promenade';
      case 'Delhi':
        if (type === 'lake1') return 'Sanjay Lake Basin';
        if (type === 'lake2') return 'Okhla Bird Sanctuary';
        if (type === 'park1') return 'Lodhi Ornamental Gardens';
        return 'Deer Park Hauz Khas';
      case 'Hyderabad':
        if (type === 'lake1') return 'Hussain Sagar Lake';
        if (type === 'lake2') return 'Durgam Cheruvu Secret';
        if (type === 'park1') return 'KBR National Park';
        return 'Lumbini Plaza Gardens';
      case 'Pune':
        if (type === 'lake1') return 'Pashan Lake Reservoir';
        if (type === 'lake2') return 'Mutha River Front';
        if (type === 'park1') return 'Saras Baug Grounds';
        return 'Empress Botanical Gardens';
      case 'Chennai':
        if (type === 'lake1') return 'Chembarambakkam Basin';
        if (type === 'lake2') return 'Adyar Estuary Creek';
        if (type === 'park1') return 'Guindy National Reserve';
        return 'Semmozhi Poonga Park';
      default:
        if (type === 'lake1') return 'Ulsoor Lake';
        if (type === 'lake2') return 'Bellandur Lake';
        if (type === 'park1') return 'Defense Colony Park';
        return 'Koramangala Block 3 Park';
    }
  };

  const getSgCoordinates = (lat: number, lng: number) => {
    const latMin = 12.91;
    const latMax = 12.99;
    const lngMin = 77.58;
    const lngMax = 77.69;
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    const y = (1 - (lat - latMin) / (latMax - latMin)) * 100;
    return {
      x: Math.min(Math.max(x, 5), 95),
      y: Math.min(Math.max(y, 10), 90),
    };
  };

  const getPinColor = (category: IssueCategory, risk: string) => {
    if (risk === 'critical') return '#B3211E'; // Solid postbox red
    switch (category) {
      case 'Road Pothole':
        return '#FF6B35';
      case 'Overflowing Garbage':
        return '#6B7280';
      case 'Broken Streetlight':
        return '#E8B33D';
      case 'Sewage Leakage':
        return '#1F3A5F';
      default:
        return '#3F6B4E';
    }
  };

  const filteredIssues = issues.filter((item) => {
    if (activeFilter === 'critical') return item.riskLevel === 'critical';
    if (activeFilter === 'near_me') return ['NS-2026-001', 'NS-2026-003', 'NS-2026-004'].includes(item.id);
    return true;
  });

  // ---------------------------------------------------------
  // 2. REAL GIS LEAFLET ENGINE LIFE CYCLE
  // ---------------------------------------------------------
  useEffect(() => {
    if (mapMode !== 'gis' || !mapContainerRef.current) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        activeMarkersMapRef.current = {};
      }
      return;
    }

    // Initialize map on element container ref
    const map = L.map(mapContainerRef.current, {
      center: [cityConfig.lat, cityConfig.lng],
      zoom: cityConfig.zoom,
      zoomControl: false, // Custom controls implemented downstairs
      attributionControl: false // Minimalist, clean look
    });

    mapInstanceRef.current = map;

    // Standard high-contrast clean tiles selection
    const lightTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
    });

    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
    });

    if (gisTheme === 'retro-light') {
      lightTiles.addTo(map);
    } else {
      darkTiles.addTo(map);
    }

    // Initialize clean layer group for report pins
    const markersLayer = L.featureGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Clean up map instance on destruction/unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        activeMarkersMapRef.current = {};
      }
    };
  }, [mapMode, currentCity]);

  // Adjust Leaflet tile layers when the theme or city changes
  useEffect(() => {
    if (mapInstanceRef.current && mapMode === 'gis') {
      // Clear previous layers to avoid overlaps
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });

      const tilesUrl = gisTheme === 'retro-light' 
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tilesUrl, { maxZoom: 20 }).addTo(mapInstanceRef.current);
    }
  }, [gisTheme, mapMode]);

  // Populate dynamic marker pins on the Leaflet viewport
  useEffect(() => {
    if (mapMode !== 'gis' || !mapInstanceRef.current || !markersLayerRef.current) return;

    // Clear previous marker pointers
    markersLayerRef.current.clearLayers();
    activeMarkersMapRef.current = {};

    filteredIssues.forEach((issue) => {
      const pinHexColor = getPinColor(issue.category, issue.riskLevel);
      const isCritical = issue.riskLevel === 'critical';
      const indicator = issue.category === 'Road Pothole' ? '⚠️' : 
                        issue.category === 'Overflowing Garbage' ? '🗑️' : 
                        issue.category === 'Broken Streetlight' ? '💡' : 
                        issue.category === 'Sewage Leakage' ? '💧' : '🏛️';

      // Advanced L.divIcon avoids typical broken server domain asset links in Leaflet
      const markerHtml = `
        <div class="relative flex items-center justify-center" style="transform: translate(0, -10px);">
          <!-- Radial Pulsating Beacon -->
          <div class="absolute w-8 h-8 rounded-full opacity-35 animate-ping" 
               style="background-color: ${pinHexColor}; animation-duration: ${isCritical ? '1s' : '2s'}"></div>
          
          <!-- Tactile Leaflet Stamp Pin structure -->
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] border shadow-md transition-transform duration-200"
               style="background-color: ${pinHexColor}; border-color: #FFFBF4; color: #FFFBF4;">
            ${indicator}
          </div>
          <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] -mt-[1px]"
               style="border-top-color: ${pinHexColor};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-gis-stamp-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      // Assemble content rich popup matching the Indian stationery look
      const popupHtml = `
        <div class="p-2 font-sans text-ledger-blue bg-paper-white" style="min-width: 200px;">
          <div class="flex items-center justify-between gap-2 border-b border-[#1F3A5F]/10 pb-1 mb-1.5">
            <span class="text-[8px] font-mono font-bold uppercase tracking-wider text-postbox-red">DOCKET ${issue.id}</span>
            <span class="text-[8px] font-mono font-extrabold ${issue.status === 'resolved' ? 'text-register-green' : 'text-ward-yellow'} uppercase">
              ● ${issue.status.toUpperCase()}
            </span>
          </div>
          <h4 class="text-xs font-serif font-black mb-1 line-clamp-1 text-[#1F3A5F]">${issue.title}</h4>
          <p class="text-[10px] text-slate-600 mb-2 line-clamp-2 leading-tight">${issue.description}</p>
          
          ${issue.imageUrl ? `
            <img src="${issue.imageUrl}" class="w-full h-20 object-cover rounded-[1px] mb-2 border border-slate-200" referrerPolicy="no-referrer" />
          ` : ''}

          <div class="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-dashed border-[#1F3A5F]/10">
            <span class="truncate max-w-[110px]">📍 ${issue.location.split(',')[0]}</span>
            <span class="font-extrabold text-postbox-red">${issue.witnessCount} verifies</span>
          </div>
        </div>
      `;

      const marker = L.marker([issue.latitude, issue.longitude], { icon: customIcon });
      
      // Setup Leaflet interaction routines
      marker.bindPopup(popupHtml, {
        closeButton: false,
        className: 'nagar-seva-custom-popup'
      });

      marker.on('click', () => {
        onSelectIssue(issue);
      });

      markersLayerRef.current?.addLayer(marker);
      activeMarkersMapRef.current[issue.id] = marker;
    });

    // Make map auto fit boundary coordinates to highlight issues nicely on start
    if (filteredIssues.length > 0) {
      try {
        const bounds = markersLayerRef.current.getBounds();
        mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
      } catch (err) {
        // Fallback if coordinates are singular
        mapInstanceRef.current.setView([cityConfig.lat, cityConfig.lng], cityConfig.zoom);
      }
    }
  }, [filteredIssues, mapMode]);

  // Handle fly panning & trigger popup automatically when selectedIssueId swaps
  useEffect(() => {
    if (mapMode !== 'gis' || !mapInstanceRef.current || !selectedIssueId) return;

    const targetIssue = issues.find(item => item.id === selectedIssueId);
    if (targetIssue) {
      mapInstanceRef.current.flyTo([targetIssue.latitude, targetIssue.longitude], 15, {
        animate: true,
        duration: 1.2
      });

      // Find marker and trigger open popup
      const targetMarker = activeMarkersMapRef.current[selectedIssueId];
      if (targetMarker) {
        // Open with slight lag after flight transition completes
        setTimeout(() => {
          targetMarker.openPopup();
        }, 800);
      }
    }
  }, [selectedIssueId, mapMode]);

  return (
    <div className="relative w-full h-[400px] md:h-[460px] bg-[#E2E8F0] overflow-hidden rounded-[2px] border-2 border-ledger-blue shadow-sm">
      {/* 1. REAL LIVE GEOGRAPHICAL Map View (GIS mode) */}
      {mapMode === 'gis' ? (
        <div ref={mapContainerRef} className="w-full h-full z-0 relative" id="gis-leaflet-canvas" />
      ) : (
        /* 2. SCHEMATIC DESIGN (Retro grid mode) */
        <div className="absolute inset-0 bg-[#E3E8EE] transition-colors duration-500 z-0">
          <svg className="w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-schematic" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-schematic)" />

            {/* Custom offline schematic lines */}
            <path d="M-10,120 L800,200" stroke="#FFFFFF" strokeWidth="16" fill="none" />
            <path d="M120,-20 L300,500" stroke="#FFFFFF" strokeWidth="12" fill="none" />
            <path d="M40,300 C200,320 400,220 750,280" stroke="#FFFFFF" strokeWidth="14" fill="none" />
            <path d="M350,-20 L350,550" stroke="#FFFFFF" strokeWidth="10" fill="none" />

            {/* Water basins */}
            <ellipse cx="210" cy="140" rx="90" ry="40" fill="#93C5FD" opacity="0.6" />
            <text x="140" y="145" className="fill-blue-600 text-[10px] font-mono font-bold">{getMapLabel('lake1')}</text>

            <ellipse cx="580" cy="385" rx="70" ry="35" fill="#93C5FD" opacity="0.6" />
            <text x="510" y="388" className="fill-blue-600 text-[10px] font-mono font-bold">{getMapLabel('lake2')}</text>

            {/* Green public squares */}
            <rect x="420" y="80" width="120" height="80" rx="2" fill="#BCF0C3" opacity="0.6" />
            <text x="435" y="125" className="fill-green-700 text-[10px] font-mono font-bold">{getMapLabel('park1')}</text>

            <rect x="80" y="220" width="90" height="60" rx="2" fill="#BCF0C3" opacity="0.6" />
            <text x="90" y="250" className="fill-green-700 text-[9px] font-mono font-bold">{getMapLabel('park2')}</text>
          </svg>

          {/* Interactive Schematic pins (Only when layout in non-GIS mode) */}
          <div className="absolute inset-0">
            {filteredIssues.map((item) => {
              const coords = getSgCoordinates(item.latitude, item.longitude);
              const isSelected = selectedIssueId === item.id;
              const pinColor = getPinColor(item.category, item.riskLevel);

              return (
                <div
                  key={item.id}
                  className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-full hover:scale-110 active:scale-95"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  onClick={() => onSelectIssue(item)}
                >
                  <div className={`relative px-2.5 py-1 bg-white border-2 rounded-[2px] text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm ${
                    isSelected ? 'border-postbox-red scale-105' : 'border-ledger-blue'
                  }`} style={{ color: pinColor }}>
                    <span>
                      {item.category === 'Road Pothole' && '⚠️'}
                      {item.category === 'Overflowing Garbage' && '🗑️'}
                      {item.category === 'Broken Streetlight' && '💡'}
                      {item.category === 'Sewage Leakage' && '💧'}
                      {item.category === 'Damaged Public Property' && '🏛️'}
                    </span>
                    <span className="text-[#1F3A5F]">{item.id.replace('NS-2026-', '#')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Control: Toggle Mode (Real GIS vs Schematic Graphic Grid) */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
        <div className="flex bg-white/95 rounded-[1px] border border-ledger-blue/20 shadow-sm overflow-hidden p-0.5 font-mono text-[9px] font-black uppercase">
          <button
            onClick={() => setMapMode('gis')}
            className={`px-2.5 py-1.5 transition-all cursor-pointer flex items-center gap-1 ${
              mapMode === 'gis'
                ? 'bg-ledger-blue text-paper-white'
                : 'text-ledger-blue hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3 h-3" /> Live GIS feeds
          </button>
          <button
            onClick={() => setMapMode('schematic')}
            className={`px-2.5 py-1.5 transition-all cursor-pointer flex items-center gap-1 ${
              mapMode === 'schematic'
                ? 'bg-ledger-blue text-paper-white'
                : 'text-ledger-blue hover:bg-slate-100'
            }`}
          >
            <Grid className="w-3 h-3" /> Schematic Grid
          </button>
        </div>

        {/* Categories reference Legend Box */}
        <div className="p-2.5 bg-paper-white/95 rounded-[1px] shadow-sm border border-ledger-blue/15 text-[8.5px] font-mono font-bold text-ledger-blue flex flex-col gap-1.5 backdrop-blur-xs">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-postbox-red block"></span> RED ALERT / Critical</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] block"></span> ORANGE / Potholes</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6B7280] block"></span> GRAY / Garbage</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-ward-yellow block"></span> YELLOW / Streetlights</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-ledger-blue block"></span> BLUE / Sewage leak</div>
        </div>
      </div>

      {/* Dynamic Theme & Zoom Control panel inside Live status */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000] items-end">
        {mapMode === 'gis' && (
          <div className="flex bg-white/95 rounded-[1px] border border-ledger-blue/25 shadow-sm overflow-hidden p-0.5 font-mono text-[9.5px]">
            <button
              onClick={() => setGisTheme('retro-light')}
              className={`px-2.5 py-1 cursor-pointer font-bold ${
                gisTheme === 'retro-light' ? 'bg-[#1F3A5F] text-white' : 'text-[#1F3A5F] hover:bg-slate-100'
              }`}
            >
              Light Positron
            </button>
            <button
              onClick={() => setGisTheme('blueprint-dark')}
              className={`px-2.5 py-1 cursor-pointer font-bold ${
                gisTheme === 'blueprint-dark' ? 'bg-[#1F3A5F] text-white' : 'text-[#1F3A5F] hover:bg-slate-100'
              }`}
            >
              Dark Blueprint
            </button>
          </div>
        )}

        {/* Manual Precision Zoom Keys (Supporting both SVG Schematic scale & GIS scale coordinates) */}
        <div className="flex bg-white rounded-[1px] border border-ledger-blue/20 shadow-sm overflow-hidden divide-x divide-slate-200">
          <button
            onClick={() => {
              if (mapMode === 'gis' && mapInstanceRef.current) {
                mapInstanceRef.current.zoomIn();
              } else {
                setZoomLevel(Math.min(zoomLevel + 0.2, 1.8));
              }
            }}
            className="p-2 hover:bg-slate-100 text-[#1F3A5F] cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (mapMode === 'gis' && mapInstanceRef.current) {
                mapInstanceRef.current.zoomOut();
              } else {
                setZoomLevel(Math.max(zoomLevel - 0.2, 0.8));
              }
            }}
            className="p-2 hover:bg-slate-100 text-[#1F3A5F] cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating State Banner indicator */}
      <div className="absolute bottom-4 left-4 bg-ledger-blue text-[#FFFBF4] px-3.5 py-1.5 rounded-[1px] text-[9.5px] font-mono font-bold flex items-center gap-2 shadow-md z-[1000] border border-[#FFFBF4]/15">
        <Navigation className="w-3 h-3 text-[#3F6B4E] fill-[#3F6B4E] animate-pulse" />
        GIS MONITORING • {currentCity.toUpperCase()} SECTOR
      </div>
    </div>
  );
}
