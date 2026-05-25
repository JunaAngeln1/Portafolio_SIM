'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings, Bell, Shield, Database, Palette } from 'lucide-react';

const settingsSections = [
  {
    icon: Palette,
    title: 'Apariencia',
    description: 'Personaliza el aspecto de tu plataforma',
    items: ['Tema', 'Colores', 'Tipografía', 'Diseño'],
  },
  {
    icon: Bell,
    title: 'Notificaciones',
    description: 'Configura alertas y preferencias de notificación',
    items: ['Alertas por Email', 'Notificaciones del Sistema', 'Alertas de Actualización'],
  },
  {
    icon: Shield,
    title: 'Seguridad',
    description: 'Administra la configuración de seguridad y accesos',
    items: ['Contraseña', 'Autenticación de Dos Factores', 'Gestión de Sesiones'],
  },
  {
    icon: Database,
    title: 'Gestión de Datos',
    description: 'Importa, exporta y respalda tus datos',
    items: ['Exportar Datos', 'Importar Datos', 'Respaldo y Restauración'],
  },
];

export default function SettingsPage() {
  return (
    <DashboardLayout titulo="Configuración">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configuración de la Plataforma</h2>
              <p className="text-gray-600">Configura las preferencias de tu plataforma SIM</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <span className="text-gray-700">{item}</span>
                    <span className="text-gray-400 text-sm">Configurar →</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-gray-500">Más configuraciones estarán disponibles en futuras actualizaciones</p>
        </div>
      </div>
    </DashboardLayout>
  );
}