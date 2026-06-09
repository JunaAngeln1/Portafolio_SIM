'use client';

import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { VeterinaryClinic, Service, FilterState, ImportData } from './types';
import { mockClinics, mockServices } from './data';
import { normalizeClinic, normalizeService } from './normalizers';
import { getSupabaseBrowser } from './supabase-browser';
// API-based CRUD functions for server-side auth
async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

interface AppState {
  clinicas: VeterinaryClinic[];
  servicios: Service[];
  filtros: FilterState;
  sidebarAbierto: boolean;
  datosCargados: boolean;
  busquedaRealizada: boolean;
}

interface AppContextType extends AppState {
  setSidebarAbierto: (abierto: boolean) => void;
  setFiltros: (filtros: Partial<FilterState>) => void;
  limpiarFiltros: () => void;
  agregarClinica: (clinica: VeterinaryClinic) => void;
  actualizarClinica: (id: string, clinica: Partial<VeterinaryClinic>) => void;
  eliminarClinica: (id: string) => void;
  agregarServicio: (servicio: Service) => void;
  actualizarServicio: (id: string, servicio: Partial<Service>) => void;
  eliminarServicio: (id: string) => void;
  duplicarServicio: (id: string) => void;
  importarDatos: (data: ImportData) => Promise<{ clinicasImportadas: number; serviciosImportados: number }>;
  limpiarTodosLosDatos: () => Promise<void>;
  obtenerServiciosFiltrados: () => Service[];
  obtenerCiudades: () => string[];
  obtenerProveedores: () => string[];
  busquedaRealizada: boolean;
}

const filtrosPorDefecto: FilterState = {
  clinicaId: 'TODAS',
  ciudad: 'TODAS',
  categoria: 'TODAS',
  proveedor: 'TODAS',
  modoServicio: 'TODOS',
  estado: 'TODOS',
  busqueda: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseBrowser();
  const [clinicas, setClinicas] = useState<VeterinaryClinic[]>([]);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [filtros, setFiltrosState] = useState<FilterState>(filtrosPorDefecto);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [datosCargados, setDatosCargados] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  useEffect(() => {
    let cancelled = false;

    // Cargar datos iniciales desde Supabase
    const loadInitialData = async () => {
      try {
        const { data: clinicasData, error: clinicasError } = await supabase
          .from('clinics')
          .select('id, nombre, ciudad, direccion, servicio_domicilio, estado, fecha_creacion, fecha_actualizacion');

        const { data: serviciosData, error: serviciosError } = await supabase
          .from('services')
          .select('id, categoria, nombre, descripcion, precio, precio_descuento, proveedor, clinica_id, ciudad, modo_servicio, estado, fecha_creacion, fecha_actualizacion');

        if (!cancelled) {
          if (!clinicasError) setClinicas((clinicasData || []).map(normalizeClinic));
          if (!serviciosError) setServicios((serviciosData || []).map(normalizeService));
          setDatosCargados(true);
        }
      } catch (error) {
        if (!cancelled) {
          setClinicas(mockClinics);
          setServicios(mockServices);
          setDatosCargados(true);
        }
      }
    };

    loadInitialData();

    // Deferred: subscribe to realtime changes after initial load
    // This lazy-loads the realtime-js and phoenix packages (~1.1 MB)
    const setupRealtime = async () => {
      await new Promise(resolve => setTimeout(resolve, 0));

      if (cancelled) return;

      const clinicsSubscription = supabase
        .channel('clinicas-realtime')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'clinics' }, 
          payload => {
            if (cancelled) return;
            const normalizedClinic = normalizeClinic(payload.new);

            if (payload.eventType === 'INSERT') {
              setClinicas(prev => [...prev, normalizedClinic]);
            } else if (payload.eventType === 'UPDATE') {
              setClinicas(prev => prev.map(c => 
                c.id === normalizedClinic.id ? normalizedClinic : c
              ));
            } else if (payload.eventType === 'DELETE') {
              setClinicas(prev => prev.filter(c => c.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      const servicesSubscription = supabase
        .channel('servicios-realtime')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'services' }, 
          payload => {
            if (cancelled) return;

          if (payload.eventType === 'INSERT') {
            const normalizedService = normalizeService(payload.new);
            setServicios(prev => [...prev, normalizedService]);
          } else if (payload.eventType === 'UPDATE') {
            const normalizedService = normalizeService(payload.new);
            setServicios(prev => prev.map(s => 
              s.id === normalizedService.id ? normalizedService : s
            ));
          } else if (payload.eventType === 'DELETE') {
            setServicios(prev => prev.filter(s => s.id !== payload.old.id));
          }
        }
      )
      .subscribe();

      return { clinicsSubscription, servicesSubscription };
    };

    let cleanup: { clinicsSubscription: ReturnType<typeof supabase.channel>; servicesSubscription: ReturnType<typeof supabase.channel> } | null = null;

    setupRealtime().then(result => {
      if (!cancelled && result) {
        cleanup = result;
      }
    });

    return () => {
      cancelled = true;
      if (cleanup) {
        supabase.removeChannel(cleanup.clinicsSubscription);
        supabase.removeChannel(cleanup.servicesSubscription);
      }
    };
  }, [supabase]);

  // Funciones CRUD que operan directamente contra Supabase
  const setFiltros = useCallback((nuevosFiltros: Partial<FilterState>) => {
    setFiltrosState(prev => ({ ...prev, ...nuevosFiltros }));
    setBusquedaRealizada(true);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltrosState(filtrosPorDefecto);
    setBusquedaRealizada(false);
  }, []);

  const agregarClinica = useCallback(async (clinica: VeterinaryClinic) => {
    try {
      await apiPost('/api/clinics', clinica);
    } catch (error) {
      console.error('[STORE] Error al agregar clínica:', error);
      throw error;
    }
  }, []);

  const actualizarClinica = useCallback(async (id: string, actualizaciones: Partial<VeterinaryClinic>) => {
    try {
      await apiPut(`/api/clinics/${id}`, actualizaciones);
    } catch (error) {
      console.error('[STORE] Error al actualizar clínica:', error);
      throw error;
    }
  }, []);

  const eliminarClinica = useCallback(async (id: string) => {
    try {
      await apiDelete(`/api/clinics/${id}`);
    } catch (error) {
      console.error('[STORE] Error al eliminar clínica:', error);
      throw error;
    }
  }, []);

  const agregarServicio = useCallback(async (servicio: Service) => {
    try {
      await apiPost('/api/services', servicio);
    } catch (error) {
      console.error('[STORE] Error al agregar servicio:', error);
      throw error;
    }
  }, []);

  const actualizarServicio = useCallback(async (id: string, actualizaciones: Partial<Service>) => {
    try {
      await apiPut(`/api/services/${id}`, actualizaciones);
    } catch (error) {
      console.error('[STORE] Error al actualizar servicio:', error);
      throw error;
    }
  }, []);

  const eliminarServicio = useCallback(async (id: string) => {
    try {
      await apiDelete(`/api/services/${id}`);
    } catch (error) {
      console.error('[STORE] Error al eliminar servicio:', error);
      throw error;
    }
  }, []);

  const duplicarServicio = useCallback(async (id: string) => {
    try {
      await apiPost(`/api/services/${id}/duplicate`);
    } catch (error) {
      console.error('[STORE] Error al duplicar servicio:', error);
      throw error;
    }
  }, []);

  const importarDatos = useCallback(async (data: ImportData): Promise<{ clinicasImportadas: number; serviciosImportados: number }> => {
    try {
      const result = await apiPost<{ clinicasImportadas: number; serviciosImportados: number }>('/api/clinics/import', data);
      return result;
    } catch (error) {
      console.error('[STORE] Error al importar datos:', error);
      throw error;
    }
  }, []);

  const limpiarTodosLosDatos = useCallback(async () => {
    try {
      await apiPost('/api/clear');
    } catch (error) {
      console.error('[STORE] Error al limpiar datos:', error);
      throw error;
    }
  }, []);

  const serviciosFiltrados = useMemo(() => {
    if (!busquedaRealizada) return [];
    
    return servicios.filter(servicio => {
      if (filtros.clinicaId !== 'TODAS' && servicio.clinicaId !== filtros.clinicaId) return false;
      if (filtros.ciudad !== 'TODAS' && servicio.ciudad !== filtros.ciudad) return false;
      if (filtros.categoria !== 'TODAS' && servicio.categoria !== filtros.categoria) return false;
      if (filtros.proveedor !== 'TODAS' && servicio.proveedor !== filtros.proveedor) return false;
      if (filtros.modoServicio !== 'TODOS' && servicio.modoServicio !== filtros.modoServicio) return false;
      if (filtros.estado !== 'TODOS' && servicio.estado !== filtros.estado) return false;
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        if (!servicio.nombre.toLowerCase().includes(busqueda) && 
            !servicio.descripcion.toLowerCase().includes(busqueda) &&
            !servicio.categoria.toLowerCase().includes(busqueda) &&
            !servicio.proveedor.toLowerCase().includes(busqueda) &&
            !servicio.ciudad.toLowerCase().includes(busqueda)) return false;
      }
      return true;
    });
  }, [servicios, filtros, busquedaRealizada]);

  const ciudades = useMemo(() => {
    return [...new Set(clinicas.map(c => c.ciudad))];
  }, [clinicas]);

  const proveedores = useMemo(() => {
    return [...new Set(servicios.map(s => s.proveedor))];
  }, [servicios]);

  const obtenerServiciosFiltrados = useCallback(() => serviciosFiltrados, [serviciosFiltrados]);
  const obtenerCiudades = useCallback(() => ciudades, [ciudades]);
  const obtenerProveedores = useCallback(() => proveedores, [proveedores]);

  const contextValue = useMemo(() => ({
    clinicas,
    servicios,
    filtros,
    sidebarAbierto,
    datosCargados,
    busquedaRealizada,
    setSidebarAbierto,
    setFiltros,
    limpiarFiltros,
    agregarClinica,
    actualizarClinica,
    eliminarClinica,
    agregarServicio,
    actualizarServicio,
    eliminarServicio,
    duplicarServicio,
    importarDatos,
    limpiarTodosLosDatos,
    obtenerServiciosFiltrados,
    obtenerCiudades,
    obtenerProveedores,
  }), [
    clinicas, servicios, filtros, sidebarAbierto, datosCargados, busquedaRealizada,
    setSidebarAbierto, setFiltros, limpiarFiltros,
    agregarClinica, actualizarClinica, eliminarClinica,
    agregarServicio, actualizarServicio, eliminarServicio, duplicarServicio,
    importarDatos, limpiarTodosLosDatos,
    obtenerServiciosFiltrados, obtenerCiudades, obtenerProveedores,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}