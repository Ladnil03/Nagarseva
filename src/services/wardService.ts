export async function getWardHealthScores() {
  const response = await fetch('/api/public/ward-health');
  if (!response.ok) {
    throw new Error('Failed to load ward health scores');
  }
  return response.json();
}

export async function getWardStats(ward?: string) {
  const url = ward ? `/api/authority/ward-stats?ward=${encodeURIComponent(ward)}` : '/api/authority/ward-stats';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load ward statistics');
  }
  return response.json();
}
