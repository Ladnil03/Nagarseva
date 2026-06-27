import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'citizen' | 'authority';
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, allowedRole, fallback }: ProtectedRouteProps) {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-6 text-center text-slate-500 font-mono">
        Access Denied. Please authenticate first.
      </div>
    );
  }

  if (allowedRole) {
    const isOfficer = userProfile.name.toLowerCase().includes('officer') || userProfile.name.toLowerCase().includes('authority');
    const detectedRole = isOfficer ? 'authority' : 'citizen';
    if (detectedRole !== allowedRole) {
      return (
        <div className="p-6 text-center text-rose-600 font-mono">
          Unauthorized. This section requires {allowedRole} clearance.
        </div>
      );
    }
  }

  return <>{children}</>;
}
