'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al dashboard (el middleware se encarga de la autenticación)
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PawPrint className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SIM Platform</h1>
        <p className="text-gray-500">Cargando...</p>
        <div className="mt-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
}