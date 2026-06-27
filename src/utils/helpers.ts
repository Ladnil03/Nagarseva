/**
 * Calculates the distance between two geo-coordinates using the Haversine formula.
 * @param {number} lat1 Latitude of point 1
 * @param {number} lon1 Longitude of point 1
 * @param {number} lat2 Latitude of point 2
 * @param {number} lon2 Longitude of point 2
 * @returns {number} Distance in meters
 */
export function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Returns a human-readable duration string since a date.
 * @param {string} dateString ISO date string
 * @returns {string} e.g. "2 days ago", "just now"
 */
export function timeSince(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

/**
 * Recalculates user level based on cumulative NagarPoints.
 * @param {number} points Cumulative points
 * @returns {{ name: string, icon: string }} Level object details
 */
export function calculateUserLevel(points: number): { name: string; icon: string } {
  if (points >= 5000) return { name: "Nagar Hero", icon: "🏆" };
  if (points >= 2000) return { name: "Nagar Rakshak", icon: "🛡️" };
  if (points >= 500) return { name: "Nagar Sevak", icon: "⭐" };
  return { name: "Nagar Naagrik", icon: "🌱" };
}
