'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { categories, serviceModes } from '@/lib/data';
import CategoryBadge from './CategoryBadge';
import ServiceModal from './ServiceModal';
import { Service } from '@/lib/types';
import { Search, Plus, Copy, ToggleLeft, ToggleRight, Trash2, X, Download, Upload, FileJson } from 'lucide-react';

const statusColors = {
  activo: 'bg-emerald-100 text-emerald-700',
  inactivo: 'bg-gray-100 text-gray-600',
};

const modeLabels: Record<string, string> = {
  EN_SEDE: 'En Sede',
  A_DOMICILIO: 'A Domicilio',
  AMBOS: 'Ambos',
};

export default function PortfolioTable() {
  const { 
    servicios, 
    clinicas, 
    filtros, 
    busquedaRealizada,
    setFiltros, 
    limpiarFiltros,
    agregarServicio, 
    actualizarServicio, 
    eliminarServicio, 
    duplicarServicio,
    obtenerServiciosFiltrados,
    obtenerCiudades,
    obtenerProveedores,
    importarDatos,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicioEditando, setServicioEditando] = useState<Service | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const serviciosFiltrados = obtenerServiciosFiltrados();
  const ciudades = obtenerCiudades();
  const proveedores = obtenerProveedores();

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(precio);
  };

  const handleSaveServicio = (data: Partial<Service>) => {
    if (servicioEditando) {
      actualizarServicio(servicioEditando.id, data);
    } else {
      const clinica = clinicas.find(c => c.id === data.clinicaId);
      const nuevoServicio: Service = {
        id: `srv_${Date.now()}`,
        categoria: data.categoria as Service['categoria'],
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        precio: data.precio || 0,
        precioDescuento: data.precioDescuento || null,
        proveedor: data.proveedor || clinica?.nombre || '',
        clinicaId: data.clinicaId || '',
        ciudad: data.ciudad || clinica?.ciudad || '',
        modoServicio: data.modoServicio as Service['modoServicio'],
        estado: (data.estado as 'activo' | 'inactivo') || 'activo',
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
      agregarServicio(nuevoServicio);
    }
    setIsModalOpen(false);
    setServicioEditando(null);
  };

  const handleDelete = (id: string) => {
    eliminarServicio(id);
    setConfirmDelete(null);
  };

  const handleExportar = () => {
    const data = serviciosFiltrados.map(s => ({
      nombre: s.nombre,
      categoria: s.categoria,
      descripcion: s.descripcion,
      precio: s.precio,
      precio_descuento: s.precioDescuento,
      proveedor: s.proveedor,
      ciudad: s.ciudad,
      modo_servicio: s.modoServicio,
      estado: s.estado,
    }));
    
    const blob = new Blob([JSON.stringify({ servicios: data }, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portafolio_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ busqueda: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          
          <select
            value={filtros.clinicaId}
            onChange={(e) => setFiltros({ clinicaId: e.target.value })}
            className="px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white min-w-[180px]"
          >
            <option value="TODAS">Todas las Veterinarias</option>
            {clinicas.map(clinica => (
              <option key={clinica.id} value={clinica.id}>{clinica.nombre}</option>
            ))}
          </select>

          <select
            value={filtros.ciudad}
            onChange={(e) => setFiltros({ ciudad: e.target.value })}
            className="px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white min-w-[150px]"
          >
            <option value="TODAS">Todas las Ciudades</option>
            {ciudades.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>

          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros({ categoria: e.target.value })}
            className="px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white min-w-[180px]"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={filtros.modoServicio}
            onChange={(e) => setFiltros({ modoServicio: e.target.value })}
            className="px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white min-w-[160px]"
          >
            {serviceModes.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>

          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ estado: e.target.value })}
            className="px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white min-w-[120px]"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          {Object.values(filtros).some(f => f !== 'TODOS' && f !== '') && (
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500">Filtros rápidos:</span>
          {['Activo', 'Inactivo'].map(filter => (
            <button
              key={filter}
              onClick={() => setFiltros({ estado: filter.toLowerCase() })}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filtros.estado === filter.toLowerCase()
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold">{serviciosFiltrados.length}</span> servicios
        </p>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportar}
            className="px-4 py-2 border border-border rounded-xl text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => { setServicioEditando(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Servicio
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Servicio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Veterinaria</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ciudad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actualizado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!busquedaRealizada ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-300" />
                      <p>Use los filtros o el buscador para encontrar servicios</p>
                    </div>
                  </td>
                </tr>
              ) : serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron servicios con los criterios seleccionados
                  </td>
                </tr>
              ) : (
                serviciosFiltrados.map(servicio => (
                  <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <CategoryBadge categoria={servicio.categoria} />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{servicio.nombre}</p>
                        <div 
                          className="relative"
                          onMouseEnter={() => setHoveredRow(servicio.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <p className="text-sm text-gray-500 truncate max-w-[200px] cursor-default">
                            {servicio.descripcion}
                          </p>
                          {hoveredRow === servicio.id && servicio.descripcion && (
                            <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg animate-fade-in">
                              <p className="whitespace-normal">{servicio.descripcion}</p>
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{servicio.proveedor}</td>
                    <td className="px-6 py-4 text-gray-700">{servicio.ciudad}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{modeLabels[servicio.modoServicio]}</span>
                    </td>
                    <td className="px-6 py-4">
                      {servicio.precioDescuento ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 line-through">{formatearPrecio(servicio.precio)}</span>
                          <span className="font-semibold text-emerald-600">{formatearPrecio(servicio.precioDescuento)}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">{formatearPrecio(servicio.precio)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[servicio.estado]}`}>
                        {servicio.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{servicio.fechaActualizacion}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setServicioEditando(servicio); setIsModalOpen(true); }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => duplicarServicio(servicio.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => actualizarServicio(servicio.id, { estado: servicio.estado === 'activo' ? 'inactivo' : 'activo' })}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={servicio.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        >
                          {servicio.estado === 'activo' ? (
                            <ToggleRight className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button 
                          onClick={() => setConfirmDelete(servicio.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setServicioEditando(null); }}
        onSave={handleSaveServicio}
        servicio={servicioEditando}
        clinicas={clinicas}
      />

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-modal">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar Servicio</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}