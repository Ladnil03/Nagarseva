import { useState, useCallback } from "react";

interface Coords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Custom hook to manage HTML5 Geolocation API interactions.
 * Fetches user coordinate grids with fallback support.
 */
export function useLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(async (): Promise<Coords> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const fallback = { latitude: 12.9698, longitude: 77.644 }; // Bengaluru coordinates
        setCoords(fallback);
        setLoading(false);
        const errMsg = "Geolocation is not supported by your browser.";
        setError(errMsg);
        resolve(fallback);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const matchedCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setCoords(matchedCoords);
          setLoading(false);
          resolve(matchedCoords);
        },
        (err) => {
          console.warn("Geolocation permission blocked or timed out. Falling back to default Bengaluru coords.", err);
          const fallback = { latitude: 12.9698, longitude: 77.644 };
          setCoords(fallback);
          setLoading(false);
          
          let friendlyError = "Unable to retrieve your location.";
          if (err.code === err.PERMISSION_DENIED) {
            friendlyError = "Location access denied. Using city central coordinates.";
          }
          setError(friendlyError);
          resolve(fallback); // Always resolve with fallback so the form is never blocked!
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 10000 }
      );
    });
  }, []);

  return { coords, loading, error, getLocation };
}
