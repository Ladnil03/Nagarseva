import { CivicIssue } from '../src/types';

// In-memory data store for Phase 2 full-stack operations
export let issues: CivicIssue[] = [
  {
    id: 'NS-2026-001',
    category: 'Road Pothole',
    title: 'Crater-sized pothole near main traffic junction',
    status: 'in_progress',
    location: '10th Main Rd, Kalyan Nagar, Ward 93, Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    description: 'A deep pothole of about 1.5 feet width has formed right in the middle of the road. It accumulates dirty water and forces two-wheelers to swerve dangerously into oncoming heavy traffic.',
    reportedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    witnessCount: 42,
    severity: 8,
    riskLevel: 'high',
    timeline: [
      { id: '1', title: 'Issue Reported', status: 'done', meta: 'Reported by Ladnil M.', timestamp: '4 days ago' },
      { id: '2', title: 'AI Verification Success', status: 'done', meta: 'Level 4 severity verified', timestamp: '4 days ago' },
      { id: '3', title: 'Assigned to Ward Engineer', status: 'done', meta: 'M. S. Kumar (BBMP Public Works)', timestamp: '3 days ago' },
      { id: '4', title: 'Work-order Dispatched', status: 'active', meta: 'Asphalt patching schedule', timestamp: 'Today' },
      { id: '5', title: 'Citizen Verification', status: 'pending', meta: 'Awaiting repair photos' }
    ],
    isAiVerified: true,
    aiConfidence: 94,
    aiAnalysis: {
      category: 'Road Pothole',
      damageDescription: 'Severe crack and asphalt subsidence causing structural crater hazard.',
      confidence: 94,
      recommendedAction: 'Immediate asphalt filling and structural level compaction.'
    },
    department: 'BBMP Public Works Division',
    daysOpen: 4
  },
  {
    id: 'NS-2026-002',
    category: 'Overflowing Garbage',
    title: 'Garbage dumping point overflowing on sidewalk',
    status: 'reported',
    location: 'Koramangala 3rd Block, Near State Bank, Ward 151, Bengaluru',
    latitude: 12.9279,
    longitude: 77.6271,
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    description: 'Standard municipal garbage bins are completely full. Pigs and stray dogs are tearing sacks open, spreading medical waste and wet kitchen wastes on the walking footpath.',
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    witnessCount: 18,
    severity: 6,
    riskLevel: 'medium',
    timeline: [
      { id: '1', title: 'Issue Reported', status: 'done', meta: 'Reported by Rajesh K.', timestamp: '1 day ago' },
      { id: '2', title: 'Awaiting Ward Verification', status: 'active', meta: 'Authority inspection pending', timestamp: 'Active' },
      { id: '3', title: 'Waste Allocation Dispatch', status: 'pending', meta: 'Sanitation contractor scheduling' }
    ],
    isAiVerified: true,
    aiConfidence: 89,
    aiAnalysis: {
      category: 'Overflowing Garbage',
      damageDescription: 'Excess organic waste leakage bypassing containment units.',
      confidence: 89,
      recommendedAction: 'Dispatch hydraulic waste collection vehicle and sanitize the perimeter.'
    },
    department: 'Solid Waste Management Cell',
    daysOpen: 1
  },
  {
    id: 'NS-2026-003',
    category: 'Broken Streetlight',
    title: 'Three consecutive streetlights dark since last week',
    status: 'chronic',
    location: 'Indiranagar 100 Ft Road, Block B, Bengaluru',
    latitude: 12.9784,
    longitude: 77.6408,
    imageUrl: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=600&q=80',
    description: 'The street is completely dark from 8th cross to 10th cross. It makes the sidewalk extremely unsafe for women at night and hampers security cameras.',
    reportedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    witnessCount: 84,
    severity: 9,
    riskLevel: 'critical',
    timeline: [
      { id: '1', title: 'Issue Reported', status: 'done', meta: 'Reported by Sarah J.', timestamp: '15 days ago' },
      { id: '2', title: 'SLA Breach Warning', status: 'done', meta: 'Escalated above Ward level', timestamp: '8 days ago' },
      { id: '3', title: 'Marked as Chronic Issue', status: 'active', meta: 'Frequent copper wire theft reported', timestamp: '4 days ago' },
      { id: '4', title: 'Cable Laying Project', status: 'pending', meta: 'BESCOM underground pipe laying' }
    ],
    isAiVerified: true,
    aiConfidence: 96,
    aiAnalysis: {
      category: 'Broken Streetlight',
      damageDescription: 'Total dark stretch visual confirmation, power feed malfunction.',
      confidence: 96,
      recommendedAction: 'Rewire local secondary distribution box and replace standard HID lamps with smart LED devices.'
    },
    department: 'BESCOM Electrical Dept',
    daysOpen: 15
  },
  {
    id: 'NS-2026-004',
    category: 'Sewage Leakage',
    title: 'Open drain overflow causing black water pools',
    status: 'assigned',
    location: 'Sarjapur Main Road, Bellandur, Ward 150, Bengaluru',
    latitude: 12.9304,
    longitude: 77.6784,
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?auto=format&fit=crop&w=600&q=80',
    description: 'A sewer line blockage has pushed raw dark water containing feces onto the highway slip road, producing toxic smells and mosquitoes.',
    reportedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    witnessCount: 112,
    severity: 10,
    riskLevel: 'critical',
    timeline: [
      { id: '1', title: 'Issue Reported', status: 'done', meta: 'Reported by Ward Association', timestamp: '6 days ago' },
      { id: '2', title: 'AI Verification Approved', status: 'done', meta: 'Biochemical hazard visual matching', timestamp: '6 days ago' },
      { id: '3', title: 'Assigned to BWSSB Team', status: 'done', meta: 'Heavy de-silting unit assigned', timestamp: '5 days ago' },
      { id: '4', title: 'Jetting Operation Scheduling', status: 'active', meta: 'High-pressure water jetting unit dispatched', timestamp: 'Active' },
      { id: '5', title: 'Resolution Post', status: 'pending' }
    ],
    isAiVerified: true,
    aiConfidence: 91,
    aiAnalysis: {
      category: 'Sewage Leakage',
      damageDescription: 'Black wastewater stagnation representing infectious biological effluent.',
      confidence: 91,
      recommendedAction: 'Deploy high-velocity Jetting and Suction tanker to extract blockages.'
    },
    department: 'BWSSB Sanitation Dept',
    daysOpen: 6
  },
  {
    id: 'NS-2026-005',
    category: 'Damaged Public Property',
    title: 'Completely smashed park fence and children swings',
    status: 'resolved',
    location: 'Defence Colony Park, Hal 2nd Stage, Indiranagar',
    latitude: 12.9698,
    longitude: 77.644,
    imageUrl: 'https://images.unsplash.com/photo-1570129476815-ba368ac77011?auto=format&fit=crop&w=600&q=80',
    description: 'The steel chainlink fence of the main entrance is broken, allowing cows to wander in. Two swings used by boys are completely rusted off structural joints.',
    reportedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    witnessCount: 5,
    severity: 3,
    riskLevel: 'low',
    timeline: [
      { id: '1', title: 'Issue Reported', status: 'done', meta: 'Reported by Aditi M.', timestamp: '30 days ago' },
      { id: '2', title: 'Assigned to Horticulture', status: 'done', meta: 'BBMP Parks Department', timestamp: '22 days ago' },
      { id: '3', title: 'Repairs Completed', status: 'done', meta: 'Installed new joints and painted swing set', timestamp: '15 days ago' },
      { id: '4', title: 'Citizen Verified Closed', status: 'done', meta: 'Resident confirmed repair is sturdy', timestamp: '14 days ago' }
    ],
    isAiVerified: true,
    aiConfidence: 87,
    aiAnalysis: {
      category: 'Damaged Public Property',
      damageDescription: 'Metal structure fracture causing risk of collapse on public park turf.',
      confidence: 87,
      recommendedAction: 'Structural welding and application of lead-free outdoor weather paint.'
    },
    department: 'BBMP Horticulture & Parks',
    daysOpen: 15
  },
  {
    id: 'NS-2026-006',
    category: 'Road Pothole',
    title: 'Multiple small potholes causing traffic slowdowns',
    status: 'disputed',
    location: 'HAL Road, Near ESI Hospital, Bengaluru',
    latitude: 12.9622,
    longitude: 77.6321,
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    description: 'Series of continuous small potholes along HAL road causing heavy bottleneck during office peak rush hours.',
    reportedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    witnessCount: 22,
    severity: 5,
    riskLevel: 'medium',
    timeline: [
      { id: '1', title: 'Issue Reported', status: 'done', meta: 'Reported by Amit S.', timestamp: '8 days ago' },
      { id: '2', title: 'Contractor Dispute Raised', status: 'active', meta: 'Road is under NHAI jurisdiction, not BBMP', timestamp: '3 days ago' },
      { id: '3', title: 'Jurisdiction Assignment Review', status: 'pending', meta: 'Inter-agency handover' }
    ],
    isAiVerified: true,
    aiConfidence: 90,
    aiAnalysis: {
      category: 'Road Pothole',
      damageDescription: 'Surface wear on dense asphalt, minor structural cracks forming.',
      confidence: 90,
      recommendedAction: 'Surface mill patch operations.'
    },
    department: 'NHAI Highway Dept',
    daysOpen: 8
  }
];

export interface Notification {
  id: string;
  userId: string;
  type: 'escalation' | 'verification_needed' | 'issue_resolved' | 'dispute_opened' | 'points_earned' | 'level_up' | 'witness_needed';
  issueId: string;
  title: string;
  body: string;
  actionUrl: string;
  isRead: boolean;
  createdAt: string;
}

export interface EscalationRecord {
  id: string;
  issueId: string;
  issueTitle: string;
  fromLevel: number;
  toLevel: number;
  daysSinceReport: number;
  reason: string;
  triggeredAt: string;
  ward: string;
  category: string;
  severity: number;
}

export interface WardScore {
  wardName: string;
  city: string;
  healthScore: number;
  openIssues: number;
  resolvedIssues: number;
  totalIssues: number;
  resolutionRate: number;
  avgResolutionDays: number;
  slaBreaches: number;
  authorityResponseRate: number;
  lastUpdated: string;
}

export let notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'any',
    type: 'points_earned',
    issueId: 'NS-2026-001',
    title: '✨ Welcome Points Active!',
    body: 'You received 50 points for signing up on NagarSeva ledger.',
    actionUrl: '/citizen_dashboard',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

export let escalations: EscalationRecord[] = [];

export let wardScores: WardScore[] = [
  {
    wardName: 'HAL 2nd Stage Ward 142',
    city: 'Bengaluru',
    healthScore: 82,
    openIssues: 3,
    resolvedIssues: 12,
    totalIssues: 15,
    resolutionRate: 80,
    avgResolutionDays: 6,
    slaBreaches: 0,
    authorityResponseRate: 94,
    lastUpdated: new Date().toISOString()
  },
  {
    wardName: 'Ward 93 Kalyan Nagar',
    city: 'Bengaluru',
    healthScore: 58,
    openIssues: 5,
    resolvedIssues: 4,
    totalIssues: 9,
    resolutionRate: 44,
    avgResolutionDays: 14,
    slaBreaches: 2,
    authorityResponseRate: 65,
    lastUpdated: new Date().toISOString()
  },
  {
    wardName: 'Ward 151 Koramangala',
    city: 'Bengaluru',
    healthScore: 71,
    openIssues: 2,
    resolvedIssues: 8,
    totalIssues: 10,
    resolutionRate: 80,
    avgResolutionDays: 8,
    slaBreaches: 1,
    authorityResponseRate: 78,
    lastUpdated: new Date().toISOString()
  }
];

export function updateIssues(newIssues: CivicIssue[]) {
  issues = newIssues;
}

export function addNotification(notif: Omit<Notification, 'id' | 'createdAt'>) {
  const newNotif: Notification = {
    ...notif,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  notifications.unshift(newNotif);
  return newNotif;
}

export function addEscalation(record: Omit<EscalationRecord, 'id' | 'triggeredAt'>) {
  const newRecord: EscalationRecord = {
    ...record,
    id: `esc-${Date.now()}`,
    triggeredAt: new Date().toISOString()
  };
  escalations.unshift(newRecord);
  return newRecord;
}

export function recalculateWardScores() {
  // Simple calculation
  wardScores = wardScores.map(w => {
    const wardIssues = issues.filter(i => i.location.includes(w.wardName));
    const openCount = wardIssues.filter(i => i.status !== 'resolved').length;
    const resolvedCount = wardIssues.filter(i => i.status === 'resolved').length;
    const slaBreaches = wardIssues.filter(i => i.status === 'chronic' || (i.daysOpen && i.daysOpen >= 7)).length;
    const totalIssues = openCount + resolvedCount;
    const resolutionRate = totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 100;
    
    const healthScore = Math.max(10, Math.min(100, 
      100 - (openCount * 5) - (slaBreaches * 10) + (resolutionRate * 0.2)
    ));

    return {
      ...w,
      openIssues: openCount,
      resolvedIssues: resolvedCount,
      totalIssues,
      resolutionRate,
      slaBreaches,
      healthScore: Math.round(healthScore),
      lastUpdated: new Date().toISOString()
    };
  });
}
