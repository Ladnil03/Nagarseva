import { useAuth as useContextAuth } from "../context/AuthContext";

/**
 * Custom hook to access authentication context in sub-components.
 * @returns Authentication context values
 */
export function useAuth() {
  return useContextAuth();
}
