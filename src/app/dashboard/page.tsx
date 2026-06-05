'use client';

import { ElementType } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/lib/store';
import { Building2, FolderOpen, Activity, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function StatCard({ icon: Icon, titulo, valor, subtitulo, color }: { 
  icon: ElementType; 
  titulo: string; 
  valor: string | number;
  subtitulo: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{titulo}</h3>
      <p className="text-3xl font-bold text-gray-900">{valor}</p>
      <p className="text-gray-400 text-sm mt-1">{subtitulo}</p>
    </div>
  );
}

function ServicioReciente({ nombre, clinica, fecha, estado }: { nombre: string; clinica: string; fecha: string; estado: 'activo' | 'inactivo' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${estado === 'activo' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
        <div>
          <p className="font-medium text-gray-900">{nombre}</p>
          <p className="text-sm text-gray-500">{clinica}</p>
        </div>
      </div>
      <span className="text-sm text-gray-400">{fecha}</span>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}

export default function DashboardPage() {
  const { clinicas, servicios } = useApp();
  const serviciosActivos = servicios.filter(s => s.estado === 'activo').length;
  const clinicasActivas = clinicas.filter(c => c.estado === 'activo').length;

  return (
    <DashboardLayout titulo="Panel Principal">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Building2}
            titulo="Veterinarias"
            valor={clinicas.length}
            subtitulo={`${clinicasActivas} activas`}
            color="bg-primary"
          />
          <StatCard 
            icon={FolderOpen}
            titulo="Total Servicios"
            valor={servicios.length}
            subtitulo="En todos los portafolios"
            color="bg-emerald-500"
          />
          <StatCard 
            icon={Activity}
            titulo="Servicios Activos"
            valor={serviciosActivos}
            subtitulo="Actualmente disponibles"
            color="bg-blue-500"
          />
          <StatCard 
            icon={AlertCircle}
            titulo="Servicios Inactivos"
            valor={servicios.length - serviciosActivos}
            subtitulo="Ocultos actualmente"
            color="bg-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link 
                href="/dashboard/portfolios"
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <FolderOpen className="w-5 h-5 text-primary" />
                <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">Gestionar Portafolios</span>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-primary transition-colors" />
              </Link>
              <Link 
                href="/dashboard/clinics"
                className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors group"
              >
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">Agregar Veterinaria</span>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </Link>
              <Link 
                href="/dashboard/quotation"
                className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 transition-colors group"
              >
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Sistema de Cotizaciones</span>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Servicios Recientes</h3>
              <Link href="/dashboard/portfolios" className="text-sm text-primary hover:underline">Ver todos</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {servicios.slice(0, 5).map(servicio => (
                <ServicioReciente 
                  key={servicio.id}
                  nombre={servicio.nombre}
                  clinica={servicio.proveedor}
                  fecha={servicio.fechaActualizacion}
                  estado={servicio.estado}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios por Categoría</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS'].map(categoria => {
              const count = servicios.filter(s => s.categoria === categoria).length;
              const labels: Record<string, string> = {
                CONSULTA: 'Consulta',
                CIRUGIA: 'Cirugía',
                LABORATORIO: 'Laboratorio',
                IMAGENES: 'Imágenes',
                VACUNAS: 'Vacunas',
                PROCEDIMIENTOS: 'Procedimientos',
              };
              return (
                <div key={categoria} className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-500">{labels[categoria]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}