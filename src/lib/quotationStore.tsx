'use client';

import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
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
  beneficioPlus: boolean;
  setBeneficioPlus: (valor: boolean) => void;
  items: QuotationItem[];
  agregarItem: (servicioId: string) => void;
  eliminarItem: (itemId: string) => void;
  setCantidad: (itemId: string, cantidad: number) => void;
  setTipoDescuento: (itemId: string, tipo: DiscountType, porcentaje?: number) => void;
  setQuimicasFields: (itemId: string, total: number, cubiertas: number) => void;
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

  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [clinicaSeleccionada, setClinicaSeleccionada] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [fecha, setFecha] = useState(obtenerFechaActual());
  const [comentarios, setComentarios] = useState('');
  const [beneficioPlus, setBeneficioPlusState] = useState(false);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [viewMode, setViewMode] = useState<QuotationViewMode>('basico');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedCiudad = localStorage.getItem('simp_q_ciudad') || '';
    const savedClinica = localStorage.getItem('simp_q_clinica') || '';
    const savedCliente = localStorage.getItem('simp_q_cliente') || '';
    const savedFecha = localStorage.getItem('simp_q_fecha') || obtenerFechaActual();
    const savedComentarios = localStorage.getItem('simp_q_comentarios') || '';
    const savedBeneficioPlus = localStorage.getItem('simp_q_beneficioPlus') === 'true';
    const savedViewMode = (localStorage.getItem('simp_q_viewMode') as QuotationViewMode) || 'basico';
    let savedItems: QuotationItem[] = [];
    try {
      const raw = localStorage.getItem('simp_q_items');
      if (raw) savedItems = JSON.parse(raw);
    } catch { /* ignore */ }

    setCiudadSeleccionada(savedCiudad);
    setClinicaSeleccionada(savedClinica);
    setClienteNombre(savedCliente);
    setFecha(savedFecha);
    setComentarios(savedComentarios);
    setBeneficioPlusState(savedBeneficioPlus);
    setViewMode(savedViewMode);
    setItems(savedItems);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('simp_q_ciudad', ciudadSeleccionada);
    localStorage.setItem('simp_q_clinica', clinicaSeleccionada);
    localStorage.setItem('simp_q_cliente', clienteNombre);
    localStorage.setItem('simp_q_fecha', fecha);
    localStorage.setItem('simp_q_comentarios', comentarios);
    localStorage.setItem('simp_q_beneficioPlus', String(beneficioPlus));
    localStorage.setItem('simp_q_items', JSON.stringify(items));
    localStorage.setItem('simp_q_viewMode', viewMode);
  }, [ciudadSeleccionada, clinicaSeleccionada, clienteNombre, fecha, comentarios, beneficioPlus, items, viewMode, hydrated]);

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

  const setBeneficioPlus = useCallback((valor: boolean) => {
    setBeneficioPlusState(valor);
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

  const setQuimicasFields = useCallback((itemId: string, total: number, cubiertas: number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const clampedCubiertas = Math.min(cubiertas, total);
      const actualizado = {
        ...item,
        tipoDescuento: 'EPP' as DiscountType,
        totalQuimicas: total,
        quimicasCubiertas: clampedCubiertas,
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
    setBeneficioPlusState(false);
    setItems([]);
    setViewMode('basico');
    localStorage.removeItem('simp_q_ciudad');
    localStorage.removeItem('simp_q_clinica');
    localStorage.removeItem('simp_q_cliente');
    localStorage.removeItem('simp_q_fecha');
    localStorage.removeItem('simp_q_comentarios');
    localStorage.removeItem('simp_q_beneficioPlus');
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

  const contextValue = useMemo(() => ({
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
    beneficioPlus,
    setBeneficioPlus,
    items,
    agregarItem,
    eliminarItem,
    setCantidad,
    setTipoDescuento,
    setQuimicasFields,
    viewMode,
    toggleViewMode,
    totalSinDescuento: totals.totalSinDescuento,
    totalDescuentos: totals.totalDescuentos,
    totalFinal: totals.totalFinal,
    textoGenerado,
    limpiarCotizacion,
    copiarAlPortapapeles,
  }), [
    ciudadSeleccionada, setCiudad, clinicaSeleccionada, clinicaNombre, setClinica,
    clienteNombre, setClienteNombre, fecha, setFecha, comentarios, setComentarios,
    beneficioPlus, setBeneficioPlus, items, agregarItem, eliminarItem,
    setCantidad, setTipoDescuento, setQuimicasFields, viewMode, toggleViewMode,
    totals.totalSinDescuento, totals.totalDescuentos, totals.totalFinal,
    textoGenerado, limpiarCotizacion, copiarAlPortapapeles,
  ]);

  return (
    <QuotationContext.Provider value={contextValue}>
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (!context) throw new Error('useQuotation must be used within QuotationProvider');
  return context;
}
