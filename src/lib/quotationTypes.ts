export type DiscountType = 'SIM' | 'NINGUNO' | 'PERSONALIZADO' | 'EPP';

export type QuotationViewMode = 'basico' | 'detallado';

export interface QuotationItem {
  id: string;
  servicioId: string;
  servicio: {
    nombre: string;
    categoria: string;
    descripcion: string;
    proveedor: string;
    ciudad: string;
    modoServicio: string;
  };
  precioRegular: number;
  precioSim: number | null;
  cantidad: number;
  tipoDescuento: DiscountType;
  porcentajeDescuento: number;
  valorDescuento: number;
  precioFinal: number;
  totalQuimicas: number;
  quimicasCubiertas: number;
  descuentoEPP: number;
}

export interface Quotation {
  id: string;
  ciudad: string;
  clinicaNombre: string;
  clienteNombre: string;
  fecha: string;
  notas: string;
  comentarios: string;
  items: QuotationItem[];
  totalSinDescuento: number;
  totalDescuentos: number;
  totalFinal: number;
  fechaCreacion: string;
}

export interface QuotationTotals {
  totalSinDescuento: number;
  totalDescuentos: number;
  totalFinal: number;
}
