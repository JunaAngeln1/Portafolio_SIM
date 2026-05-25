'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, PawPrint, FolderOpen, Building2, FileText, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full animate-float" />
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-white/5 rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-20 left-40 w-24 h-24 bg-white/5 rounded-full animate-float-delayed" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-8">
            <PawPrint className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">SIM</h1>
          <p className="text-xl text-white/80 mb-8 text-center">Sistema Integral de Mascotas</p>
          
          <p className="text-white/70 text-center mb-12 max-w-md leading-relaxed">
            Plataforma profesional para la gestión y digitalización de portafolios veterinarios.
          </p>
          
          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-white/90">Gestión de portafolios</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-white/90">Organización de servicios veterinarios</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-white/90">Listo para sistema de cotizaciones</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-white/90">Escalabilidad multi-veterinaria</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary">SIM</h1>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bienvenido</h2>
            <p className="text-gray-600 text-lg">
              Sistema centralizado de administración de portafolios veterinarios.
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <span>Comenzar</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Fase 1 - Gestión de Portafolios</span>
          </div>
        </div>
      </div>
    </div>
  );
}