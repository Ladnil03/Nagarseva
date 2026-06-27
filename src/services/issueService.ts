import { CivicIssue, IssueStatus, IssueCategory, RiskLevel } from "../types";

/**
 * Retreives civic issues from the full-stack Express API backend.
 * @returns {Promise<CivicIssue[]>} Array of registered civic tickets
 */
export async function fetchAllIssues(): Promise<CivicIssue[]> {
  try {
    const res = await fetch("/api/issues");
    if (!res.ok) throw new Error("Backend service returned error code.");
    const data = await res.ok ? await res.json() : [];
    return data;
  } catch (err) {
    console.warn("Express backend offline. Falling back to local state.", err);
    throw err;
  }
}

/**
 * Registers a new citizen grievance on the backend registry.
 * @param {Omit<CivicIssue, 'id' | 'reportedAt' | 'witnessCount' | 'status' | 'timeline'>} issueData Incident details
 * @returns {Promise<CivicIssue>} Created issue payload
 */
export async function createIssue(issueData: {
  category: IssueCategory;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  description: string;
  severity: number;
  riskLevel: RiskLevel;
}): Promise<CivicIssue> {
  const res = await fetch("/api/issues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issueData),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Grievance filing failed on server.");
  }

  return res.json();
}

/**
 * Upvotes or co-signs an active grievance ticket.
 * @param {string} id Ticket identifier
 * @returns {Promise<CivicIssue>} Updated issue payload
 */
export async function upvoteIssue(id: string): Promise<CivicIssue> {
  const res = await fetch(`/api/issues/${id}/upvote`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Unable to record your verification stamp on this ticket.");
  }

  return res.json();
}

/**
 * Updates the administrative status of a civic ticket (officials only).
 * @param {string} id Ticket ID
 * @param {IssueStatus} status Designated status state
 * @param {string} comment Audit action log comment
 * @param {string} department Handover department
 * @returns {Promise<CivicIssue>} Updated ticket
 */
export async function updateIssueStatus(
  id: string,
  status: IssueStatus,
  comment: string,
  department?: string
): Promise<CivicIssue> {
  const res = await fetch(`/api/issues/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, comment, department }),
  });

  if (!res.ok) {
    throw new Error("Could not apply administrative update to this ticket.");
  }

  return res.json();
}

/**
 * Triggers a Gemini AI scan for an uploaded base64 photo proof.
 * @param {string} imageBase64 Base64 string of the target image
 * @returns {Promise<any>} Gemini AI classification report
 */
export async function analyzeIssuePhotoWithAi(imageBase64: string): Promise<any> {
  const res = await fetch("/api/gemini/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!res.ok) {
    throw new Error("Gemini AI service analysis timed out.");
  }

  return res.json();
}
