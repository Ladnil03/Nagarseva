import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { CivicIssue, IssueCategory } from '../../types';
import { ISSUE_CATEGORIES } from '../../utils/constants';

interface IssueMapProps {
  issues: CivicIssue[];
  filterCategory?: string | null;
  filterRiskLevel?: string | null;
  showHeatmap?: boolean;
  onIssueSelect?: (issue: CivicIssue) => void;
  userCoords?: { latitude: number; longitude: number } | null;
}

export default function IssueMap({
  issues,
  filterCategory = null,
  filterRiskLevel = null,
  showHeatmap = false,
  onIssueSelect = () => {},
  userCoords = null
}: IssueMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [googleMapsError, setGoogleMapsError] = useState(false);
  
  const googleMapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Filter issues based on props
  const filteredIssues = issues.filter(issue => {
    if (filterCategory && issue.category !== filterCategory) return false;
    if (filterRiskLevel && issue.riskLevel !== filterRiskLevel) return false;
    return true;
  });

  useEffect(() => {
    if (!apiKey) {
      setGoogleMapsError(true);
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['visualization']
    }) as any;

    loader.load()
      .then(() => {
        setGoogleMapsLoaded(true);
      })
      .catch((err) => {
        console.warn("Failed to load Google Maps API:", err);
        setGoogleMapsError(true);
      });
  }, [apiKey]);

  // Handle Google Map Initialization and updates
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current) return;

    const defaultCenter = userCoords 
      ? { lat: userCoords.latitude, lng: userCoords.longitude }
      : { lat: 12.9716, lng: 77.5946 }; // Default Bengaluru

    const darkStyle: google.maps.MapTypeStyle[] = [
      { elementType: "geometry", stylers: [{ color: "#0D1B2A" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#9CA3AF" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#0D1B2A" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#1F3A52" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0D1B2A" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#041628" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] }
    ];

    const map = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      styles: darkStyle,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    googleMapInstance.current = map;

    return () => {
      googleMapInstance.current = null;
    };
  }, [googleMapsLoaded, userCoords]);

  // Update Markers & Heatmap on Google Map
  useEffect(() => {
    const map = googleMapInstance.current;
    if (!map || !googleMapsLoaded) return;

    // Clear previous markers
    if (markersRef.current) {
      markersRef.current.forEach(m => m.setMap(null));
    }
    (markersRef as any).current = [];

    // Clear previous heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }
    heatmapRef.current = null;

    // 1. Add markers
    const markers: google.maps.Marker[] = [];
    const heatmapPoints: google.maps.LatLng[] = [];

    filteredIssues.forEach(issue => {
      const lat = issue.latitude;
      const lng = issue.longitude;
      if (!lat || !lng) return;

      const position = new google.maps.LatLng(lat, lng);
      heatmapPoints.push(position);

      // Category color mapping
      const categoryColors: Record<string, string> = {
        'Road Pothole': '#FF6B35',
        'Overflowing Garbage': '#6BCB77',
        'Broken Streetlight': '#FFE66D',
        'Sewage Leakage': '#4ECDC4',
        'Damaged Public Property': '#FF4858',
        'Other': '#9CA3AF'
      };
      const color = categoryColors[issue.category] || '#9CA3AF';

      // Marker sizing by severity
      let size = 16;
      if (issue.severity >= 10) size = 32;
      else if (issue.severity >= 7) size = 26;
      else if (issue.severity >= 4) size = 20;

      // Custom marker icon using SVG
      const svgIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 0.9,
        scale: size / 2,
        strokeColor: issue.riskLevel === 'critical' ? '#FF4858' : '#FFFFFF',
        strokeWeight: issue.riskLevel === 'critical' ? 3 : 1.5,
      };

      const marker = new google.maps.Marker({
        position,
        map,
        icon: svgIcon,
        title: issue.title
      });

      marker.addListener('click', () => {
        onIssueSelect(issue);
      });

      markers.push(marker);
    });

    (markersRef as any).current = markers;

    // 2. Add heatmap layer if requested
    if (showHeatmap && heatmapPoints.length > 0) {
      heatmapRef.current = new (google.maps.visualization as any).HeatmapLayer({
        data: heatmapPoints,
        map: map,
        radius: 40,
        gradient: [
          'rgba(255, 72, 88, 0)',
          'rgba(255, 107, 53, 0.6)',
          'rgba(255, 72, 88, 1)'
        ]
      });
    }

  }, [googleMapsLoaded, filteredIssues, showHeatmap]);

  // If there's an error loading Google Maps (e.g. no API Key), render Leaflet
  if (googleMapsError) {
    return (
      <div className="relative w-full h-[400px] bg-[#0D1B2A] rounded-lg border-2 border-[#1F3A5F] overflow-hidden flex flex-col justify-end">
        {/* Fallback Leaflet Map Overlay */}
        <div className="absolute inset-0 z-0 bg-[#0F2236] p-4 flex flex-col items-center justify-center text-center">
          <div className="max-w-md space-y-4">
            <span className="text-3xl">🗺️</span>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Interactive Grid Visualizer
            </h4>
            <p className="text-xs text-slate-400">
              Showing {filteredIssues.length} active grievance locations in this ward territory. Clicking a hub opens its full regulatory log.
            </p>
          </div>
          
          {/* Custom Simulated Interactive Grid / Map */}
          <div className="mt-6 w-full max-w-sm h-48 border border-slate-700 rounded bg-[#0A1622] relative overflow-hidden flex items-center justify-center">
            {/* Visual Grid Lines */}
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute inset-0 bg-radial-gradient opacity-45" />

            {/* Displaying issues as interactive nodes */}
            {filteredIssues.map((issue, index) => {
              const categoryColors: Record<string, string> = {
                'Road Pothole': '#FF6B35',
                'Overflowing Garbage': '#6BCB77',
                'Broken Streetlight': '#FFE66D',
                'Sewage Leakage': '#4ECDC4',
                'Damaged Public Property': '#FF4858',
                'Other': '#9CA3AF'
              };
              const color = categoryColors[issue.category] || '#9CA3AF';
              
              // Seed pseudo-random placement inside our box
              const x = 10 + ((issue.latitude * 1000) % 80);
              const y = 10 + ((issue.longitude * 1000) % 80);

              return (
                <button
                  key={issue.id}
                  onClick={() => onIssueSelect(issue)}
                  style={{ left: `${x}%`, top: `${y}%`, backgroundColor: color }}
                  className={`absolute w-3 h-3 rounded-full border border-white cursor-pointer hover:scale-125 transition-transform duration-200 ${
                    issue.riskLevel === 'critical' ? 'animate-ping border-red-500' : ''
                  }`}
                  title={`${issue.title} (${issue.category})`}
                />
              );
            })}
          </div>
        </div>

        {/* Floating control bar */}
        <div className="relative z-10 p-3 bg-slate-900/90 border-t border-slate-700 text-[10px] font-mono text-slate-400 flex justify-between items-center select-none">
          <span>Active Grid System</span>
          <span className="text-[#FFE66D]">{filteredIssues.length} issue nodes loaded</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border-2 border-[#1F3A5F]">
      <div ref={mapRef} className="w-full h-full" />
      {/* Floating Info */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 p-2.5 rounded border border-slate-700 text-[10px] font-mono text-slate-300 pointer-events-none z-10 space-y-1">
        <div>📍 CENTERED WARD 142 HUB</div>
        <div>🔍 SHOWING {filteredIssues.length} UNIQUE TARGETS</div>
      </div>
    </div>
  );
}
