'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { useQuotation } from '@/lib/quotationStore';
import CategoryBadge from '@/components/portfolio/CategoryBadge';
import { Search, Plus, Check, Building2, MapPin } from 'lucide-react';
import { formatearPrecio } from '@/lib/format';

const categoryFilters = [
  { value: 'TODAS', label: 'Todas' },
  { value: 'CONSULTA', label: 'Consulta' },
  { value: 'CIRUGIA', label: 'Cirugía' },
  { value: 'LABORATORIO', label: 'Laboratorio' },
  { value: 'IMAGENES', label: 'Imágenes' },
  { value: 'VACUNAS', label: 'Vacunas' },
  { value: 'PROCEDIMIENTOS', label: 'Procedimientos' },
];

export default function ServiceSelector() {
  const { clinicas, servicios } = useApp();
  const { ciudadSeleccionada, setCiudad, items, agregarItem } = useQuotation();
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [filtroClinica, setFiltroClinica] = useState('TODAS');

  const ciudades = useMemo(() => {
    const ciudadMap = new Map<string, number>();
    clinicas.filter(c => c.estado === 'activo').forEach(c => {
      ciudadMap.set(c.ciudad, (ciudadMap.get(c.ciudad) || 0) + 1);
    });
    return Array.from(ciudadMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [clinicas]);

  const clinicasEnCiudad = useMemo(() => {
    if (!ciudadSeleccionada) return [];
    return clinicas.filter(c => c.ciudad === ciudadSeleccionada && c.estado === 'activo');
  }, [clinicas, ciudadSeleccionada]);

  const serviciosDisponibles = useMemo(() => {
    if (!ciudadSeleccionada) return [];
    const clinicaIds = new Set(clinicasEnCiudad.map(c => c.id));
    return servicios.filter(s => clinicaIds.has(s.clinicaId) && s.estado === 'activo');
  }, [servicios, clinicasEnCiudad, ciudadSeleccionada]);

  const serviciosFiltrados = useMemo(() => {
    return serviciosDisponibles.filter(s => {
      const matchBusqueda = !busqueda ||
        s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = filtroCategoria === 'TODAS' || s.categoria === filtroCategoria;
      const matchClinica = filtroClinica === 'TODAS' || s.clinicaId === filtroClinica;
      return matchBusqueda && matchCategoria && matchClinica;
    });
  }, [serviciosDisponibles, busqueda, filtroCategoria, filtroClinica]);

  const itemsAgregados = useMemo(() => {
    return new Set(items.map(i => i.servicioId));
  }, [items]);

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="p-3 border-b border-border space-y-2 flex-shrink-0">
        <select
          value={ciudadSeleccionada}
          onChange={(e) => {
            setCiudad(e.target.value);
            setFiltroClinica('TODAS');
          }}
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-sm"
        >
          <option value="">Seleccionar ciudad...</option>
          {ciudades.map(([ciudad, count]) => (
            <option key={ciudad} value={ciudad}>{ciudad} ({count})</option>
          ))}
        </select>

        {ciudadSeleccionada && clinicasEnCiudad.length > 1 && (
          <select
            value={filtroClinica}
            onChange={(e) => setFiltroClinica(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-sm"
          >
            <option value="TODAS">Todas las veterinarias ({clinicasEnCiudad.length})</option>
            {clinicasEnCiudad.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categoryFilters.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFiltroCategoria(cat.value)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                filtroCategoria === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!ciudadSeleccionada ? (
          <div className="p-6 text-center">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Selecciona una ciudad para ver servicios</p>
          </div>
        ) : serviciosFiltrados.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-400 text-sm">No se encontraron servicios</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {serviciosFiltrados.map(servicio => {
              const agregado = itemsAgregados.has(servicio.id);
              const clinica = clinicas.find(c => c.id === servicio.clinicaId);
              return (
                <div
                  key={servicio.id}
                  className="group relative px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CategoryBadge categoria={servicio.categoria} size="sm" />
                        <span className="font-medium text-gray-900 text-sm">{servicio.nombre}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{servicio.descripcion}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{clinica?.nombre}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-gray-900">{formatearPrecio(servicio.precio)}</span>
                        {servicio.precioDescuento && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            SIM: {formatearPrecio(servicio.precioDescuento)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => agregarItem(servicio.id)}
                      disabled={agregado}
                      className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors mt-0.5 ${
                        agregado
                          ? 'bg-emerald-100 text-emerald-600 cursor-default'
                          : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {agregado ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {servicio.descripcion && (
                    <div className="absolute left-0 right-0 top-full z-10 hidden group-hover:block">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 mx-3 shadow-lg">
                        <span className="font-medium">{servicio.nombre}</span>
                        <p className="text-gray-300 mt-0.5">{servicio.descripcion}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
