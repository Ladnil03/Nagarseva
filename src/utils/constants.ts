export const ISSUE_CATEGORIES = {
  pothole: { label: "Pothole / Damaged Road", icon: "🕳️", color: "#FF6B35" },
  water_leakage: { label: "Water Leakage", icon: "💧", color: "#4ECDC4" },
  streetlight: { label: "Streetlight Issue", icon: "💡", color: "#FFE66D" },
  garbage: { label: "Garbage / Waste", icon: "🗑️", color: "#6BCB77" },
  vandalism: { label: "Vandalism / Property Damage", icon: "🔨", color: "#FF4858" },
  other: { label: "Other Infrastructure", icon: "🏗️", color: "#A8A8A8" }
};

export const SEVERITY_LABELS = {
  1: "Negligible", 2: "Very Low", 3: "Low", 4: "Moderate",
  5: "Significant", 6: "High", 7: "Very High", 8: "Severe",
  9: "Critical", 10: "Emergency"
};

export const RISK_LEVELS = {
  low: { label: "Low Risk", color: "#6BCB77", bgColor: "#E8F8EA" },
  medium: { label: "Medium Risk", color: "#FFE66D", bgColor: "#FFFDE7" },
  high: { label: "High Risk", color: "#FF6B35", bgColor: "#FFF0EB" },
  critical: { label: "CRITICAL", color: "#FF4858", bgColor: "#FFE8EA" }
};

export const ISSUE_STATUS = {
  reported: { label: "Reported", color: "#4ECDC4", step: 1 },
  verified: { label: "Community Verified", color: "#6BCB77", step: 2 },
  assigned: { label: "Assigned to Worker", color: "#FFE66D", step: 3 },
  in_progress: { label: "Work In Progress", color: "#FF6B35", step: 4 },
  resolved: { label: "Resolved", color: "#6BCB77", step: 5 },
  disputed: { label: "Resolution Disputed", color: "#FF4858", step: 5 },
  falsely_closed: { label: "Falsely Closed ⚠️", color: "#FF4858", step: 5 },
  chronic: { label: "Chronic Zone 🔴", color: "#8B0000", step: 0 }
};

export const NAGAR_POINTS = {
  FIRST_REPORT: 100,
  REPORT_VERIFIED_BY_COMMUNITY: 50,
  WITNESS_ON_ISSUE: 20,
  DISPUTE_FALSE_CLOSURE_WIN: 150,
  ISSUE_RESOLVED: 75,
  REGRESSION_REPORT: 200,
  QUALITY_PHOTO_BONUS: 25,
  VERIFICATION_SUBMITTED: 30
};

export const NAGAR_LEVELS = [
  { name: "Nagar Naagrik", minPoints: 0, icon: "🌱" },
  { name: "Nagar Sevak", minPoints: 500, icon: "⭐" },
  { name: "Nagar Rakshak", minPoints: 2000, icon: "🛡️" },
  { name: "Nagar Hero", minPoints: 5000, icon: "🏆" }
];

export const SLA_DAYS = {
  ward_officer: 7,
  commissioner: 15,
  collector: 30,
  public_shame: 45,
  rti_eligible: 45
};

export const GEO_CLUSTER_RADIUS_METERS = 100;
export const PHOTO_MAX_AGE_HOURS = 48;
export const MIN_VERIFICATIONS_REQUIRED = 3;
export const VERIFICATION_WINDOW_HOURS = 24;
export const DISPUTE_WINDOW_HOURS = 72;
