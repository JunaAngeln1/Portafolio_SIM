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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary-dark flex flex-col z-40">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">SIM</h1>
          <p className="text-white/60 text-xs">Sistema Integral de Mascotas</p>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-white/60 text-xs mb-1">Versión</p>
          <p className="text-white font-semibold">Fase 1 - 2026</p>
        </div>
      </div>
    </aside>
  );
}