'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useApp } from '@/lib/store';

interface DashboardLayoutProps {
  children: React.ReactNode;
  titulo: string;
}

export default function DashboardLayout({ children, titulo }: DashboardLayoutProps) {
  const { sidebarAbierto } = useApp();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {menuMovilAbierto && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMenuMovilAbierto(false)}
        />
      )}

      <div className={`transition-all duration-300 ${sidebarAbierto ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <TopBar
          titulo={titulo}
          onMenuClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
          sidebarAbierto={sidebarAbierto}
        />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
