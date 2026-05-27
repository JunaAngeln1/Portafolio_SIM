'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { VeterinaryClinic, Service, FilterState, ImportData, StoredData } from './types';
import { mockClinics, mockServices } from './data';
import { supabase } from './supabase';

interface AppState {
  clinicas: VeterinaryClinic[];
  servicios: Service[];
  filtros: FilterState;
  sidebarAbierto: boolean;
  datosCargados: boolean;
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
  importarDatos: (data: ImportData) => { clinicasImportadas: number; serviciosImportados: number };
  limpiarTodosLosDatos: () => void;
  obtenerServiciosFiltrados: () => Service[];
  obtenerCiudades: () => string[];
  obtenerProveedores: () => string[];
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

  useEffect(() => {
    // Cargar datos iniciales desde Supabase
    const loadInitialData = async () => {
      try {
        const { data: clinicasData, error: clinicasError } = await supabase
          .from('clinics')
          .select('*');
        
        const { data: serviciosData, error: serviciosError } = await supabase
          .from('services')
          .select('*');

        if (!clinicasError) setClinicas(clinicasData || []);
        if (!serviciosError) setServicios(serviciosData || []);
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
          if (payload.eventType === 'INSERT') {
            setClinicas(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setClinicas(prev => prev.map(c => 
              c.id === payload.new.id ? payload.new : c
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
          if (payload.eventType === 'INSERT') {
            setServicios(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setServicios(prev => prev.map(s => 
              s.id === payload.new.id ? payload.new : s
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
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltrosState(filtrosPorDefecto);
  }, []);

  const agregarClinica = useCallback(async (clinica: VeterinaryClinic) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .insert([clinica]);
        
      if (error) throw error;
      // No actualizamos estado local - las suscripciones se encargarán
    } catch (error) {
      console.error('Error adding clinic:', error);
      throw error;
    }
  }, []);

  const actualizarClinica = useCallback(async (id: string, actualizaciones: Partial<VeterinaryClinic>) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ 
          ...actualizaciones,
          fecha_actualizacion: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);
        
      if (error) throw error;
      // No actualizamos estado local - las suscripciones se encargarán
    } catch (error) {
      console.error('Error updating clinic:', error);
      throw error;
    }
  }, []);

  const eliminarClinica = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      // Los servicios asociados se eliminarán por CASCADE en la BD
      // No actualizamos estado local - las suscripciones se encargarán
    } catch (error) {
      console.error('Error deleting clinic:', error);
      throw error;
    }
  }, []);

  const agregarServicio = useCallback(async (servicio: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .insert([servicio]);
        
      if (error) throw error;
      // No actualizamos estado local - las suscripciones se encargarán
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  }, []);

  const actualizarServicio = useCallback(async (id: string, actualizaciones: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ 
          ...actualizaciones,
          fecha_actualizacion: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);
        
      if (error) throw error;
      // No actualizamos estado local - las suscripciones se encargarán
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }, []);

  const eliminarServicio = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      // No actualizamos estado local - las suscripciones se encargarán
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }, []);

  const duplicarServicio = useCallback(async (id: string) => {
    try {
      // Primero obtenemos el servicio original
      const { data: originalData, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      if (!originalData) throw new Error('Service not found');
      
      // Creamos el nuevo servicio basado en el original
      const nuevoServicio: Omit<Service, 'id'> = {
        ...originalData,
        nombre: `${originalData.nombre} (Copia)`,
        estado: 'activo',
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_actualizacion: new Date().toISOString().split('T')[0],
      };
      
      // Eliminamos el id para que la BD genere uno nuevo
      delete nuevoServicio.id;
      
      // Insertamos el nuevo servicio
      const { error } = await supabase
        .from('services')
        .insert([nuevoServicio]);
        
      if (error) throw error;
      // No actualizamos estado local - las suscripciones se encargarán
    } catch (error) {
      console.error('Error duplicating service:', error);
      throw error;
    }
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
  }, [servicios, filtros]);

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