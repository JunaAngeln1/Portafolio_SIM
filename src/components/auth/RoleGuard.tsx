'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { UserRole } from '@/lib/types';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  fallback?: ReactNode;
  showFallback?: boolean;
}

export default function RoleGuard({
  children,
  requiredRole = 'admin',
  fallback,
  showFallback = true,
}: RoleGuardProps) {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (role !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showFallback) {
      return null;
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl">
        <ShieldAlert className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">
          No tienes permisos para realizar esta acción.
        </p>
        <p className="text-gray-400 text-sm text-center mt-1">
          Se requiere rol de Administrador.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
