'use client';

import { Bell, Menu, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface TopBarProps {
  titulo: string;
  onMenuClick?: () => void;
  onToggleSidebar?: () => void;
  sidebarAbierto?: boolean;
}

export default function TopBar({ titulo, onMenuClick, onToggleSidebar, sidebarAbierto }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <button 
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={sidebarAbierto ? 'Colapsar menú' : 'Expandir menú'}
        >
          {sidebarAbierto ? (
            <PanelLeftClose className="w-5 h-5 text-gray-600" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <h2 className="text-xl font-semibold text-gray-900">{titulo}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>
    </header>
  );
}
