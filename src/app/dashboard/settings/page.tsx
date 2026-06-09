'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/components/AuthProvider';
import { Settings, Users, Shield, ShieldOff, RefreshCw, User, Save, Check } from 'lucide-react';

interface UserProfileAdmin {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'general';
  created_at: string;
}

export default function SettingsPage() {
  const { profile, user, role } = useAuth();
  const [users, setUsers] = useState<UserProfileAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAdmin = role === 'admin';

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (profile?.fullName) {
      setFullName(profile.fullName);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user?.id || !fullName.trim()) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setError('');

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName.trim() }),
      });

      if (!res.ok) throw new Error('Error al guardar');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('No se pudo guardar el nombre');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'general' : 'admin';

    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Error al cambiar rol');

      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole as 'admin' | 'general' } : u
      ));
    } catch (err) {
      setError('No se pudo cambiar el rol del usuario');
    }
  };

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
              <p className="text-gray-600">Administra tu perfil y preferencias del sistema</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
              <p className="text-sm text-gray-500">Edita tu información personal</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">El email no se puede modificar</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || !fullName.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Guardando...' : saveSuccess ? 'Guardado' : 'Guardar'}
              </button>

              {saveSuccess && (
                <span className="text-sm text-green-600">Nombre actualizado correctamente</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Usuarios Registrados</h3>
                <p className="text-sm text-gray-500">
                  {isAdmin ? 'Gestiona los roles de los usuarios' : 'Lista de usuarios de la plataforma'}
                </p>
              </div>
            </div>
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hay usuarios registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Usuario</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Creado</th>
                    {isAdmin && (
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{u.full_name || 'Sin nombre'}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.role === 'admin' ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <ShieldOff className="w-3 h-3" />
                          )}
                          {u.role === 'admin' ? 'Admin' : 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(u.created_at).toLocaleDateString('es-CO')}
                      </td>
                      {isAdmin && (
                        <td className="py-4 px-4 text-right">
                          {u.id !== user?.id ? (
                            <button
                              onClick={() => toggleRole(u.id, u.role)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                u.role === 'admin'
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-primary hover:bg-primary/5'
                              }`}
                            >
                              {u.role === 'admin' ? 'Degradar' : 'Promover'}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">Tú</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-gray-500">Más configuraciones estarán disponibles en futuras actualizaciones</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
