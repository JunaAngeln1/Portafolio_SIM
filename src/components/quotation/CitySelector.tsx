'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { useQuotation } from '@/lib/quotationStore';

export default function CitySelector() {
  const { clinicas } = useApp();
  const { ciudadSeleccionada, setCiudad } = useQuotation();

  const ciudades = useMemo(() => {
    const ciudadMap = new Map<string, number>();
    clinicas.filter(c => c.estado === 'activo').forEach(c => {
      ciudadMap.set(c.ciudad, (ciudadMap.get(c.ciudad) || 0) + 1);
    });
    return Array.from(ciudadMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [clinicas]);

  return (
    <select
      value={ciudadSeleccionada}
      onChange={(e) => setCiudad(e.target.value)}
      className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-sm"
    >
      <option value="">Seleccionar ciudad...</option>
      {ciudades.map(([ciudad, count]) => (
        <option key={ciudad} value={ciudad}>{ciudad} ({count})</option>
      ))}
    </select>
  );
}
