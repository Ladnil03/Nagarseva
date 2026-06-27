/**
 * Validates the civic issue reporting form data.
 * @param {{ title: string, description: string, latitude: number, longitude: number, imageUrl?: string }} data Form input parameters
 * @returns {{ isValid: boolean, error?: string }} Result validation object
 */
export function validateIssueReport(data: {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}): { isValid: boolean; error?: string } {
  if (!data.title || data.title.trim().length < 5) {
    return { isValid: false, error: "Title must be at least 5 characters long." };
  }
  if (!data.description || data.description.trim().length < 15) {
    return { isValid: false, error: "Please write a comprehensive description (minimum 15 characters)." };
  }
  if (!data.latitude || !data.longitude) {
    return { isValid: false, error: "Valid location coordinates must be locked." };
  }
  // India lat bounds roughly 8 to 38, lng bounds roughly 68 to 98
  if (data.latitude < 5 || data.latitude > 40 || data.longitude < 60 || data.longitude > 100) {
    return { isValid: false, error: "Please lock a location within India ward territories." };
  }
  if (!data.imageUrl) {
    return { isValid: false, error: "Visual photographic proof is mandatory." };
  }
  return { isValid: true };
}
