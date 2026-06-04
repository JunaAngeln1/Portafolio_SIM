import { ServiceCategory } from './types';

export type DiscountType = 'SIM' | 'NINGUNO' | 'PERSONALIZADO';

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
