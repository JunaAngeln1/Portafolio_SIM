'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { QuotationItem, Quotation, QuotationViewMode, DiscountType } from './quotationTypes';
import { useApp } from './store';
import { crearItemDesdeServicio, recalcularItem, recalcularTotales, generarTextoBasico, generarTextoDetallado } from './discountService';

interface QuotationContextType {
  ciudadSeleccionada: string;
  setCiudad: (ciudad: string) => void;
  clinicaSeleccionada: string;
  clinicaNombre: string;
  setClinica: (clinica: string) => void;
  clienteNombre: string;
  setClienteNombre: (nombre: string) => void;
  fecha: string;
  setFecha: (fecha: string) => void;
  comentarios: string;
  setComentarios: (comentarios: string) => void;
  items: QuotationItem[];
  agregarItem: (servicioId: string) => void;
  eliminarItem: (itemId: string) => void;
  setCantidad: (itemId: string, cantidad: number) => void;
  setTipoDescuento: (itemId: string, tipo: DiscountType, porcentaje?: number) => void;
  viewMode: QuotationViewMode;
  toggleViewMode: () => void;
  totalSinDescuento: number;
  totalDescuentos: number;
  totalFinal: number;
  textoGenerado: string;
  limpiarCotizacion: () => void;
  copiarAlPortapapeles: () => Promise<boolean>;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

function obtenerFechaActual(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function QuotationProvider({ children }: { children: ReactNode }) {
  const { clinicas, servicios } = useApp();

  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('simp_q_ciudad') || '';
    }
    return '';
  });
  const [clinicaSeleccionada, setClinicaSeleccionada] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('simp_q_clinica') || '';
    }
    return '';
  });
  const [clienteNombre, setClienteNombre] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('simp_q_cliente') || '';
    }
    return '';
  });
  const [fecha, setFecha] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('simp_q_fecha') || obtenerFechaActual();
    }
    return obtenerFechaActual();
  });
  const [comentarios, setComentarios] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('simp_q_comentarios') || '';
    }
    return '';
  });
  const [items, setItems] = useState<QuotationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simp_q_items');
      if (saved) {
        try { return JSON.parse(saved); } catch { return []; }
      }
    }
    return [];
  });
  const [viewMode, setViewMode] = useState<QuotationViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('simp_q_viewMode') as QuotationViewMode) || 'basico';
    }
    return 'basico';
  });

  useEffect(() => {
    localStorage.setItem('simp_q_ciudad', ciudadSeleccionada);
  }, [ciudadSeleccionada]);

  useEffect(() => {
    localStorage.setItem('simp_q_clinica', clinicaSeleccionada);
  }, [clinicaSeleccionada]);

  useEffect(() => {
    localStorage.setItem('simp_q_cliente', clienteNombre);
  }, [clienteNombre]);

  useEffect(() => {
    localStorage.setItem('simp_q_fecha', fecha);
  }, [fecha]);

  useEffect(() => {
    localStorage.setItem('simp_q_comentarios', comentarios);
  }, [comentarios]);

  useEffect(() => {
    localStorage.setItem('simp_q_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('simp_q_viewMode', viewMode);
  }, [viewMode]);

  const ciudades = useMemo(() => {
    const ciudadSet = new Set(clinicas.filter(c => c.estado === 'activo').map(c => c.ciudad));
    return Array.from(ciudadSet).sort();
  }, [clinicas]);

  const clinicasEnCiudad = useMemo(() => {
    return clinicas.filter(c => c.ciudad === ciudadSeleccionada && c.estado === 'activo');
  }, [clinicas, ciudadSeleccionada]);

  const serviciosEnCiudad = useMemo(() => {
    const clinicaIds = new Set(clinicasEnCiudad.map(c => c.id));
    return servicios.filter(s => clinicaIds.has(s.clinicaId) && s.estado === 'activo');
  }, [servicios, clinicasEnCiudad]);

  const setCiudad = useCallback((ciudad: string) => {
    setCiudadSeleccionada(ciudad);
    setClinicaSeleccionada('');
    setItems([]);
  }, []);

  const setClinica = useCallback((clinica: string) => {
    setClinicaSeleccionada(clinica);
  }, []);

  const agregarItem = useCallback((servicioId: string) => {
    const servicio = serviciosEnCiudad.find(s => s.id === servicioId);
    if (!servicio) return;
    if (items.some(i => i.servicioId === servicioId)) return;

    const clinica = clinicas.find(c => c.id === servicio.clinicaId);
    const nuevoItem = crearItemDesdeServicio(
      servicio.id,
      {
        nombre: servicio.nombre,
        categoria: servicio.categoria,
        descripcion: servicio.descripcion,
        proveedor: clinica?.nombre || servicio.proveedor,
        ciudad: servicio.ciudad,
        modoServicio: servicio.modoServicio,
      },
      servicio.precio,
      servicio.precioDescuento
    );

    setItems(prev => [...prev, nuevoItem]);
  }, [serviciosEnCiudad, clinicas, items]);

  const eliminarItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const setCantidad = useCallback((itemId: string, cantidad: number) => {
    const clamped = Math.max(1, Math.min(999, cantidad));
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const actualizado = { ...item, cantidad: clamped };
      return recalcularItem(actualizado);
    }));
  }, []);

  const setTipoDescuento = useCallback((itemId: string, tipo: DiscountType, porcentaje?: number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const actualizado = {
        ...item,
        tipoDescuento: tipo,
        porcentajeDescuento: tipo === 'PERSONALIZADO' ? (porcentaje ?? 0) : 0,
      };
      return recalcularItem(actualizado);
    }));
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'basico' ? 'detallado' : 'basico');
  }, []);

  const limpiarCotizacion = useCallback(() => {
    setCiudadSeleccionada('');
    setClinicaSeleccionada('');
    setClienteNombre('');
    setFecha(obtenerFechaActual());
    setComentarios('');
    setItems([]);
    setViewMode('basico');
    localStorage.removeItem('simp_q_ciudad');
    localStorage.removeItem('simp_q_clinica');
    localStorage.removeItem('simp_q_cliente');
    localStorage.removeItem('simp_q_fecha');
    localStorage.removeItem('simp_q_comentarios');
    localStorage.removeItem('simp_q_items');
    localStorage.removeItem('simp_q_viewMode');
  }, []);

  const totals = useMemo(() => recalcularTotales(items), [items]);

  const clinicaNombre = useMemo(() => {
    const clinica = clinicasEnCiudad.find(c => c.id === clinicaSeleccionada);
    return clinica?.nombre || '';
  }, [clinicasEnCiudad, clinicaSeleccionada]);

  const quotation: Quotation = useMemo(() => ({
    id: `qt_${Date.now()}`,
    ciudad: ciudadSeleccionada,
    clinicaNombre,
    clienteNombre,
    fecha,
    notas: '',
    comentarios,
    items,
    totalSinDescuento: totals.totalSinDescuento,
    totalDescuentos: totals.totalDescuentos,
    totalFinal: totals.totalFinal,
    fechaCreacion: new Date().toISOString(),
  }), [ciudadSeleccionada, clinicaNombre, clienteNombre, fecha, comentarios, items, totals]);

  const textoGenerado = useMemo(() => {
    return viewMode === 'basico' ? generarTextoBasico(quotation) : generarTextoDetallado(quotation);
  }, [quotation, viewMode]);

  const copiarAlPortapapeles = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(textoGenerado);
      return true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textoGenerado;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  }, [textoGenerado]);

  return (
    <QuotationContext.Provider value={{
      ciudadSeleccionada,
      setCiudad,
      clinicaSeleccionada,
      clinicaNombre,
      setClinica,
      clienteNombre,
      setClienteNombre,
      fecha,
      setFecha,
      comentarios,
      setComentarios,
      items,
      agregarItem,
      eliminarItem,
      setCantidad,
      setTipoDescuento,
      viewMode,
      toggleViewMode,
      totalSinDescuento: totals.totalSinDescuento,
      totalDescuentos: totals.totalDescuentos,
      totalFinal: totals.totalFinal,
      textoGenerado,
      limpiarCotizacion,
      copiarAlPortapapeles,
    }}>
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (!context) throw new Error('useQuotation must be used within QuotationProvider');
  return context;
}
