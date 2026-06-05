'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, FileText, Building2, Settings, PawPrint, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/store';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
  { href: '/dashboard/portfolios', icon: FolderOpen, label: 'Portafolios' },
  { href: '/dashboard/quotation', icon: FileText, label: 'Cotizaciones' },
  { href: '/dashboard/clinics', icon: Building2, label: 'Veterinarias' },
  { href: '/dashboard/settings', icon: Settings, label: 'Configuración' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarAbierto, setSidebarAbierto } = useApp();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-primary-dark flex flex-col z-40 transition-all duration-300 ${
        sidebarAbierto ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        {sidebarAbierto && (
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
                  title={!sidebarAbierto ? item.label : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  } ${!sidebarAbierto ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarAbierto && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        {sidebarAbierto && (
          <div className="bg-white/10 rounded-xl p-4 mb-3">
            <p className="text-white/60 text-xs mb-1">Versión</p>
            <p className="text-white font-semibold">Fase 1 - 2026</p>
          </div>
        )}
        <button
          onClick={() => setSidebarAbierto(!sidebarAbierto)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white/70 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200"
          title={sidebarAbierto ? 'Colapsar menú' : 'Expandir menú'}
        >
          {sidebarAbierto ? (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Colapsar</span>
            </>
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
