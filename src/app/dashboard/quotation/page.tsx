'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Calculator, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Calculator,
    title: 'Motor de Cotización',
    description: 'Crear cotizaciones detalladas para servicios veterinarios',
    color: 'bg-primary',
    coming: false,
  },
  {
    icon: Clock,
    title: 'Historial de Cotizaciones',
    description: 'Rastrear todas las cotizaciones generadas',
    color: 'bg-emerald-500',
    coming: true,
  },
  {
    icon: AlertCircle,
    title: 'Validación de Cobertura',
    description: 'Validar reglas de cobertura de servicios',
    color: 'bg-blue-500',
    coming: true,
  },
  {
    icon: FileText,
    title: 'Opciones de Exportación',
    description: 'Generar cotizaciones en PDF y Excel',
    color: 'bg-purple-500',
    coming: true,
  },
];

export default function QuotationPage() {
  return (
    <DashboardLayout titulo="Sistema de Cotizaciones">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema Inteligente de Cotización</h2>
              <p className="text-gray-600 max-w-2xl">
                El motor de cotización estará disponible en la Fase 2. Este módulo proporcionará precios inteligentes, 
                validación de cobertura y generación completa de cotizaciones para servicios veterinarios.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-6 shadow-card relative ${
                feature.coming ? 'opacity-70' : ''
              }`}
            >
              {feature.coming && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Próximamente
                </span>
              )}
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Preparación</h3>
          <div className="space-y-4">
            {[
              { task: 'Estructura de Portafolio de Servicios', status: 'complete' },
              { task: 'Base de Datos de Veterinarias', status: 'complete' },
              { task: 'Organización por Categorías', status: 'complete' },
              { task: 'Marco de Precios', status: 'complete' },
              { task: 'Reglas de Precios Geográficos', status: 'pending' },
              { task: 'Motor de Validación de Cobertura', status: 'pending' },
              { task: 'Lógica de Generación de Cotizaciones', status: 'pending' },
              { task: 'Integración de Exportación', status: 'pending' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{item.task}</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  item.status === 'complete' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.status === 'complete' ? 'Completo' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">¿Listo para la Fase 2?</h3>
              <p className="text-white/80">El motor de cotización se está preparando basado en tus datos actuales de portafolio.</p>
            </div>
            <Link 
              href="/dashboard/portfolios"
              className="px-6 py-3 bg-white text-primary rounded-xl font-medium hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              Gestionar Portafolios
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}