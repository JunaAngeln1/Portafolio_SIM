'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useApp } from '@/lib/store';
import { VeterinaryClinic } from '@/lib/types';
import { Plus, Edit, ToggleLeft, ToggleRight, Trash2, X, Building2, MapPin, Home, Upload } from 'lucide-react';
import ImportModal from '@/components/import/ImportModal';

const statusColors = {
  activo: 'bg-emerald-100 text-emerald-700',
  inactivo: 'bg-gray-100 text-gray-600',
};

interface ClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clinica: Partial<VeterinaryClinic>) => void;
  clinica?: VeterinaryClinic | null;
}

function ClinicModal({ isOpen, onClose, onSave, clinica }: ClinicModalProps) {
  const [formData, setFormData] = useState({
    nombre: clinica?.nombre || '',
    ciudad: clinica?.ciudad || '',
    direccion: clinica?.direccion || '',
    servicioDomicilio: clinica?.servicioDomicilio ?? true,
    estado: clinica?.estado || 'activo' as 'activo' | 'inactivo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-modal">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {clinica ? 'Editar Veterinaria' : 'Agregar Nueva Veterinaria'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Veterinaria</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
            <input
              type="text"
              value={formData.ciudad}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.servicioDomicilio}
                onChange={(e) => setFormData({ ...formData, servicioDomicilio: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Ofrece servicio a domicilio</span>
              </div>
            </label>
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
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              {clinica ? 'Guardar Cambios' : 'Agregar Veterinaria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClinicsPage() {
  const { clinicas, servicios, agregarClinica, actualizarClinica, eliminarClinica } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [clinicaEditando, setClinicaEditando] = useState<VeterinaryClinic | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSaveClinica = (data: Partial<VeterinaryClinic>) => {
    if (clinicaEditando) {
      actualizarClinica(clinicaEditando.id, data);
    } else {
      const nuevaClinica: VeterinaryClinic = {
        id: `vet_${Date.now()}`,
        nombre: data.nombre || '',
        ciudad: data.ciudad || '',
        direccion: data.direccion || '',
        servicioDomicilio: data.servicioDomicilio ?? true,
        estado: (data.estado as 'activo' | 'inactivo') || 'activo',
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
      agregarClinica(nuevaClinica);
    }
    setIsModalOpen(false);
    setClinicaEditando(null);
  };

  const handleDelete = (id: string) => {
    eliminarClinica(id);
    setConfirmDelete(null);
  };

  const getServiceCount = (clinicaId: string) => {
    return servicios.filter(s => s.clinicaId === clinicaId).length;
  };

  return (
    <DashboardLayout titulo="Veterinarias">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              Gestiona tu red de veterinarias. <span className="font-semibold">{clinicas.length}</span> veterinarias registradas.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImportOpen(true)}
              className="px-4 py-2 border border-border rounded-xl text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Importar JSON
            </button>
            <button
              onClick={() => { setClinicaEditando(null); setIsModalOpen(true); }}
              className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Veterinaria
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicas.map(clinica => (
            <div key={clinica.id} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[clinica.estado]}`}>
                  {clinica.estado}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{clinica.nombre}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{clinica.ciudad}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{clinica.direccion || 'Sin dirección'}</span>
                </div>
                {clinica.servicioDomicilio && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Servicio a domicilio</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-gray-500">
                  {getServiceCount(clinica.id)} servicios
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setClinicaEditando(clinica); setIsModalOpen(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => actualizarClinica(clinica.id, { estado: clinica.estado === 'activo' ? 'inactivo' : 'activo' })}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {clinica.estado === 'activo' ? (
                      <ToggleRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(clinica.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {clinicas.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay veterinarias aún</h3>
            <p className="text-gray-500 mb-6">Agrega tu primera veterinaria o importa datos desde un archivo JSON.</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsImportOpen(true)}
                className="px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors"
              >
                Importar JSON
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                Agregar Primera Veterinaria
              </button>
            </div>
          </div>
        )}
      </div>

      <ClinicModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setClinicaEditando(null); }}
        onSave={handleSaveClinica}
        clinica={clinicaEditando}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-modal">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar Veterinaria</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar esta veterinaria? Todos los servicios asociados también serán eliminados.</p>
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
    </DashboardLayout>
  );
}