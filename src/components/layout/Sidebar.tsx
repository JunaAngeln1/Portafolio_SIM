'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, FileText, Building2, Settings, PawPrint } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
  { href: '/dashboard/portfolios', icon: FolderOpen, label: 'Portafolios' },
  { href: '/dashboard/quotation', icon: FileText, label: 'Cotizaciones' },
  { href: '/dashboard/clinics', icon: Building2, label: 'Veterinarias' },
  { href: '/dashboard/settings', icon: Settings, label: 'Configuración' },
];

interface SidebarProps {
  abierto: boolean;
}

export default function Sidebar({ abierto }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-primary-dark flex flex-col z-40 transition-all duration-300 ${abierto ? 'w-64' : 'w-20'}`}>
      <div className={`p-4 flex items-center border-b border-white/10 ${abierto ? 'gap-3 px-6' : 'justify-center'}`}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        {abierto && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg">SIM</h1>
            <p className="text-white/60 text-xs">Sistema Integral de Mascotas</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={!abierto ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    abierto ? 'justify-start' : 'justify-center'
                  } ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {abierto && (
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={`p-3 border-t border-white/10 ${abierto ? '' : 'hidden'}`}>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-white/60 text-xs mb-1">Versión</p>
          <p className="text-white font-semibold">Fase 1 - 2026</p>
        </div>
      </div>
    </aside>
  );
}
