import { getAuth } from 'firebase/auth';

/**
 * Perform server-side fetch with optional authentication headers
 */
export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const auth = getAuth();
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('API Service: User is not authenticated or Firebase Auth uninitialized', err);
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errText = await response.text();
    let parsedErr;
    try {
      parsedErr = JSON.parse(errText);
    } catch {
      parsedErr = { error: errText };
    }
    throw new Error(parsedErr.error || `HTTP request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
