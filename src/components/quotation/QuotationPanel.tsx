'use client';

import React from 'react';
import { useQuotation } from '@/lib/quotationStore';
import { useApp } from '@/lib/store';
import QuotationItemRow from './QuotationItemRow';
import { Trash2, Sparkles } from 'lucide-react';

export default function QuotationPanel() {
  const {
    ciudadSeleccionada,
    clinicaSeleccionada, setClinica,
    clienteNombre, setClienteNombre,
    fecha, setFecha,
    comentarios, setComentarios,
    beneficioPlus, setBeneficioPlus,
    items, limpiarCotizacion,
  } = useQuotation();
  const { clinicas } = useApp();

  const clinicasEnCiudad = clinicas.filter(
    c => c.ciudad === ciudadSeleccionada && c.estado === 'activo'
  );

  if (!ciudadSeleccionada) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-card h-full flex items-center justify-center">
        <p className="text-gray-400 text-sm">Selecciona una ciudad para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="p-3 border-b border-border bg-gray-50 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <select
            value={clinicaSeleccionada}
            onChange={(e) => setClinica(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
          >
            <option value="">Veterinaria...</option>
            {clinicasEnCiudad.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {items.length > 0 && (
            <button
              onClick={limpiarCotizacion}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              title="Limpiar todo"
            >
              <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
            placeholder="Cliente"
            className="px-3 py-1.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <input
            type="text"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            placeholder="dd/mm/aaaa"
            className="px-3 py-1.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <button
          onClick={() => setBeneficioPlus(!beneficioPlus)}
          className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            beneficioPlus
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Beneficio Plus
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Agrega servicios desde el panel izquierdo</p>
          </div>
        ) : (
          items.map(item => (
            <QuotationItemRow key={item.id} item={item} />
          ))
        )}
      </div>

      <div className="border-t border-border p-3 bg-gray-50">
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          placeholder="Comentarios..."
          rows={2}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
        />
      </div>
    </div>
  );
}
