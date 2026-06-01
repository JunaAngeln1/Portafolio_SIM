'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { VeterinaryClinic, Service, FilterState, ImportData, StoredData } from './types';
import { mockClinics, mockServices } from './data';
import { supabase } from './supabase';
import { normalizeClinic, normalizeService } from './normalizers';
import { agregarClinica as agregarClinicaService, actualizarClinica as actualizarClinicaService, eliminarClinica as eliminarClinicaService } from './clinicService';
import { agregarServicio as agregarServicioService, actualizarServicio as actualizarServicioService, eliminarServicio as eliminarServicioService, duplicarServicio as duplicarServicioService } from './serviceService';

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
  limpiarTodosLosDatos: () => void;
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
  rangoFechas: { desde: '', hasta: '' },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [clinicas, setClinicas] = useState<VeterinaryClinic[]>([]);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [filtros, setFiltrosState] = useState<FilterState>(filtrosPorDefecto);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [datosCargados, setDatosCargados] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  useEffect(() => {
    // Cargar datos iniciales desde Supabase
    const loadInitialData = async () => {
      try {
        const { data: clinicasData, error: clinicasError } = await supabase
          .from('clinics')
          .select('id, nombre, ciudad, direccion, servicio_domicilio, estado, fecha_creacion, fecha_actualizacion');

        const { data: serviciosData, error: serviciosError } = await supabase
          .from('services')
          .select('id, categoria, nombre, descripcion, precio, proveedor, clinica_id, ciudad, modo_servicio, estado, fecha_creacion, fecha_actualizacion');

        if (!clinicasError) setClinicas((clinicasData || []).map(normalizeClinic));
        if (!serviciosError) setServicios((serviciosData || []).map(normalizeService));
        setDatosCargados(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback a datos mock si hay error
        setClinicas(mockClinics);
        setServicios(mockServices);
        setDatosCargados(true);
      }
    };

    loadInitialData();

    // Suscribirse a cambios en tiempo real
    const clinicsSubscription = supabase
      .channel('clinicas-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clinics' }, 
        payload => {
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
      .channel('servicios-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'services' }, 
        payload => {
          const normalizedService = normalizeService(payload.new);

          if (payload.eventType === 'INSERT') {
            setServicios(prev => [...prev, normalizedService]);
          } else if (payload.eventType === 'UPDATE') {
            setServicios(prev => prev.map(s => 
              s.id === normalizedService.id ? normalizedService : s
            ));
          } else if (payload.eventType === 'DELETE') {
            setServicios(prev => prev.filter(s => s.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Limpiar suscripciones al desmontar
    return () => {
      supabase.removeChannel(clinicsSubscription);
      supabase.removeChannel(servicesSubscription);
    };
  }, []);

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
    await agregarClinicaService(clinica);
  }, []);

  const actualizarClinica = useCallback(async (id: string, actualizaciones: Partial<VeterinaryClinic>) => {
    await actualizarClinicaService(id, actualizaciones);
  }, []);

  const eliminarClinica = useCallback(async (id: string) => {
    await eliminarClinicaService(id);
  }, []);

  const agregarServicio = useCallback(async (servicio: Service) => {
    await agregarServicioService(servicio);
  }, []);

  const actualizarServicio = useCallback(async (id: string, actualizaciones: Partial<Service>) => {
    await actualizarServicioService(id, actualizaciones);
  }, []);

  const eliminarServicio = useCallback(async (id: string) => {
    await eliminarServicioService(id);
  }, []);

  const duplicarServicio = useCallback(async (id: string) => {
    await duplicarServicioService(id);
  }, []);

  const importarDatos = useCallback(async (data: ImportData): Promise<{ clinicasImportadas: number; serviciosImportados: number }> => {
    let clinicasCount = 0;
    let serviciosCount = 0;

    try {
      for (const vet of data.veterinarias) {
        const fechaActual = new Date().toISOString().split('T')[0];

        // Insertamos la clínica
        const clinicaData = {
          nombre: vet.nombre,
          ciudad: vet.ciudad,
          direccion: vet.direccion || '',
          servicio_domicilio: vet.servicio_domicilio ?? true,
          estado: 'activo',
          fecha_creacion: fechaActual,
          fecha_actualizacion: fechaActual,
        };

        const { data: clinicaResult, error: clinicaError } = await supabase
          .from('clinics')
          .insert([clinicaData])
          .select()
          .single();

        if (clinicaError) throw clinicaError;
        clinicasCount++;

        // Insertamos los servicios de esta clínica
        for (const srv of vet.servicios) {
          const validCategories = ['CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS'];
          const categoria = validCategories.includes(srv.categoria) ? srv.categoria : 'CONSULTA';

          const modoServicio = srv.modo_servicio === 'EN_SEDE' ? 'EN_SEDE' 
            : srv.modo_servicio === 'A_DOMICILIO' ? 'A_DOMICILIO' 
            : 'AMBOS';

          const servicioData = {
            categoria: categoria as Service['categoria'],
            nombre: srv.nombre,
            descripcion: srv.descripcion || '',
            precio: srv.precio || 0,
            proveedor: vet.nombre,
            clinica_id: clinicaResult.id,
            ciudad: vet.ciudad,
            modo_servicio: modoServicio as Service['modoServicio'],
            estado: 'activo',
            fecha_creacion: fechaActual,
            fecha_actualizacion: fechaActual,
          };

          const { error: servicioError } = await supabase
            .from('services')
            .insert([servicioData]);

          if (servicioError) throw servicioError;
          serviciosCount++;
        }
      }

      return { clinicasImportadas: clinicasCount, serviciosImportados: serviciosCount };
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }, []);

  const limpiarTodosLosDatos = useCallback(async () => {
    try {
      // Eliminamos en orden correcto debido a las foreign keys
      await supabase.from('services').delete().neq('id', ''); // Eliminar todos los servicios
      await supabase.from('clinics').delete().neq('id', '');  // Eliminar todas las clínicas
      // No actualizamos estado local - las suscripciones se encargarán
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }, []);

  const obtenerServiciosFiltrados = useCallback(() => {
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

  const obtenerCiudades = useCallback(() => {
    const ciudades = [...new Set(clinicas.map(c => c.ciudad))];
    return ciudades;
  }, [clinicas]);

  const obtenerProveedores = useCallback(() => {
    const proveedores = [...new Set(servicios.map(s => s.proveedor))];
    return proveedores;
  }, [servicios]);

  return (
    <AppContext.Provider value={{
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}