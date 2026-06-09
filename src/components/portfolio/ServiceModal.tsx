'use client';

import { useState, useEffect } from 'react';
import { Service, ServiceCategory, ServiceMode } from '@/lib/types';
import { categories, serviceModes } from '@/lib/data';
import { X } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (servicio: Partial<Service>) => void;
  servicio?: Service | null;
  clinicas: { id: string; nombre: string; ciudad: string }[];
}

export default function ServiceModal({ isOpen, onClose, onSave, servicio, clinicas }: ServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    categoria: 'CONSULTA' as ServiceCategory,
    nombre: '',
    descripcion: '',
    precio: 0,
    precioDescuento: null as number | null,
    clinicaId: '',
    modoServicio: 'EN_SEDE' as ServiceMode,
    estado: 'activo' as 'activo' | 'inactivo',
  });

  useEffect(() => {
    if (servicio) {
      setFormData({
        categoria: servicio.categoria,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        precio: servicio.precio,
        precioDescuento: servicio.precioDescuento,
        clinicaId: servicio.clinicaId,
        modoServicio: servicio.modoServicio,
        estado: servicio.estado,
      });
    } else {
      setFormData({
        categoria: 'CONSULTA',
        nombre: '',
        descripcion: '',
        precio: 0,
        precioDescuento: null,
        clinicaId: clinicas[0]?.id || '',
        modoServicio: 'EN_SEDE',
        estado: 'activo',
      });
    }
  }, [servicio, clinicas]);

  const clinicaSeleccionada = clinicas.find(c => c.id === formData.clinicaId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSave({
      ...formData,
      proveedor: clinicaSeleccionada?.nombre || '',
      ciudad: clinicaSeleccionada?.ciudad || '',
    });
    setTimeout(() => setIsSubmitting(false), 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 id="service-modal-title" className="text-xl font-semibold text-gray-900">
            {servicio ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="svc-categoria" className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              id="svc-categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value as ServiceCategory })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              {categories.filter(c => c.value !== 'TODAS').map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="svc-nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre del Servicio</label>
            <input
              id="svc-nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="svc-descripcion" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              id="svc-descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="svc-precio" className="block text-sm font-medium text-gray-700 mb-2">Precio Particular (COP)</label>
            <input
              id="svc-precio"
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="svc-precio-sim" className="block text-sm font-medium text-gray-700 mb-2">Precio SIM (COP) <span className="text-gray-400 font-normal">— opcional</span></label>
            <input
              id="svc-precio-sim"
              type="number"
              value={formData.precioDescuento ?? ''}
              onChange={(e) => setFormData({ ...formData, precioDescuento: e.target.value ? Number(e.target.value) : null })}
              placeholder="Dejar vacío si no aplica descuento"
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Precio con descuento especial para la veterinaria</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Veterinaria</label>
            <select
              value={formData.clinicaId}
              onChange={(e) => setFormData({ ...formData, clinicaId: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              {clinicas.map(clinica => (
                <option key={clinica.id} value={clinica.id}>{clinica.nombre} - {clinica.ciudad}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modo de Servicio</label>
            <select
              value={formData.modoServicio}
              onChange={(e) => setFormData({ ...formData, modoServicio: e.target.value as ServiceMode })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              {serviceModes.filter(m => m.value !== 'TODOS').map(mode => (
                <option key={mode.value} value={mode.value}>{mode.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'activo' | 'inactivo' })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : servicio ? 'Guardar Cambios' : 'Agregar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}