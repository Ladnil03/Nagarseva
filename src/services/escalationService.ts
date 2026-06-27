export async function checkSLAs(ward?: string) {
  const url = ward ? `/api/escalation/check-sla?ward=${encodeURIComponent(ward)}` : '/api/escalation/check-sla';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to retrieve SLA records');
  }
  return response.json();
}

export async function triggerManualEscalation(issueId: string, reason: string) {
  const response = await fetch('/api/escalation/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueId, reason })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to trigger escalation');
  }
  return response.json();
}

export async function runEscalationCron() {
  const response = await fetch('/api/escalation/cron', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    throw new Error('SLA audit cron execution failed');
  }
  return response.json();
}
