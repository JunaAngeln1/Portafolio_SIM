'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { VeterinaryClinic, Service, FilterState, ImportData, StoredData } from './types';
import { mockClinics, mockServices } from './data';

const STORAGE_KEY = 'simp_data';

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
    const datosAlmacenados = localStorage.getItem(STORAGE_KEY);
    if (datosAlmacenados) {
      try {
        const datos: StoredData = JSON.parse(datosAlmacenados);
        setClinicas(datos.clinicas || []);
        setServicios(datos.servicios || []);
      } catch {
        setClinicas(mockClinics);
        setServicios(mockServices);
      }
    } else {
      setClinicas(mockClinics);
      setServicios(mockServices);
    }
    setDatosCargados(true);
  }, []);

  useEffect(() => {
    if (datosCargados) {
      const datos: StoredData = {
        clinicas,
        servicios,
        ultimaActualizacion: new Date().toISOString().split('T')[0],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    }
  }, [clinicas, servicios, datosCargados]);

  const guardarDatos = useCallback(() => {
    const datos: StoredData = {
      clinicas,
      servicios,
      ultimaActualizacion: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  }, [clinicas, servicios]);

  const setFiltros = useCallback((nuevosFiltros: Partial<FilterState>) => {
    setFiltrosState(prev => ({ ...prev, ...nuevosFiltros }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltrosState(filtrosPorDefecto);
  }, []);

  const agregarClinica = useCallback((clinica: VeterinaryClinic) => {
    setClinicas(prev => [...prev, clinica]);
  }, []);

  const actualizarClinica = useCallback((id: string, actualizaciones: Partial<VeterinaryClinic>) => {
    setClinicas(prev => prev.map(c => c.id === id ? { ...c, ...actualizaciones, fechaActualizacion: new Date().toISOString().split('T')[0] } : c));
  }, []);

  const eliminarClinica = useCallback((id: string) => {
    setClinicas(prev => prev.filter(c => c.id !== id));
    setServicios(prev => prev.filter(s => s.clinicaId !== id));
  }, []);

  const agregarServicio = useCallback((servicio: Service) => {
    setServicios(prev => [...prev, servicio]);
  }, []);

  const actualizarServicio = useCallback((id: string, actualizaciones: Partial<Service>) => {
    setServicios(prev => prev.map(s => s.id === id ? { ...s, ...actualizaciones, fechaActualizacion: new Date().toISOString().split('T')[0] } : s));
  }, []);

  const eliminarServicio = useCallback((id: string) => {
    setServicios(prev => prev.filter(s => s.id !== id));
  }, []);

  const duplicarServicio = useCallback((id: string) => {
    const original = servicios.find(s => s.id === id);
    if (original) {
      const nuevoServicio: Service = {
        ...original,
        id: `srv_${Date.now()}`,
        nombre: `${original.nombre} (Copia)`,
        estado: 'activo',
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
      setServicios(prev => [...prev, nuevoServicio]);
    }
  }, [servicios]);

  const importarDatos = useCallback((data: ImportData): { clinicasImportadas: number; serviciosImportados: number } => {
    let clinicasCount = 0;
    let serviciosCount = 0;
    const nuevasClinicas: VeterinaryClinic[] = [];
    const nuevosServicios: Service[] = [];

    data.veterinarias.forEach((vet, vetIndex) => {
      const clinicaId = `vet_${Date.now()}_${vetIndex}`;
      const fechaActual = new Date().toISOString().split('T')[0];
      
      const clinica: VeterinaryClinic = {
        id: clinicaId,
        nombre: vet.nombre,
        ciudad: vet.ciudad,
        direccion: vet.direccion || '',
        servicioDomicilio: vet.servicio_domicilio ?? true,
        estado: 'activo',
        fechaCreacion: fechaActual,
        fechaActualizacion: fechaActual,
      };
      nuevasClinicas.push(clinica);
      clinicasCount++;

      vet.servicios.forEach((srv, srvIndex) => {
        const validCategories = ['CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS'];
        const categoria = validCategories.includes(srv.categoria) ? srv.categoria : 'CONSULTA';
        
        const modoServicio = srv.modo_servicio === 'EN_SEDE' ? 'EN_SEDE' 
          : srv.modo_servicio === 'A_DOMICILIO' ? 'A_DOMICILIO' 
          : 'AMBOS';

        const servicio: Service = {
          id: `srv_${Date.now()}_${vetIndex}_${srvIndex}`,
          categoria: categoria as Service['categoria'],
          nombre: srv.nombre,
          descripcion: srv.descripcion || '',
          precio: srv.precio || 0,
          proveedor: vet.nombre,
          clinicaId: clinicaId,
          ciudad: vet.ciudad,
          modoServicio: modoServicio as Service['modoServicio'],
          estado: 'activo',
          fechaCreacion: fechaActual,
          fechaActualizacion: fechaActual,
        };
        nuevosServicios.push(servicio);
        serviciosCount++;
      });
    });

    setClinicas(prev => [...prev, ...nuevasClinicas]);
    setServicios(prev => [...prev, ...nuevosServicios]);

    return { clinicasImportadas: clinicasCount, serviciosImportados: serviciosCount };
  }, []);

  const limpiarTodosLosDatos = useCallback(() => {
    setClinicas([]);
    setServicios([]);
    localStorage.removeItem(STORAGE_KEY);
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