import { VeterinaryClinic, Service } from './types';

interface ClinicRow {
  id?: string;
  nombre?: string;
  ciudad?: string;
  direccion?: string;
  servicio_domicilio?: boolean;
  servicioDomicilio?: boolean;
  estado?: string;
  fecha_creacion?: string;
  fechaCreacion?: string;
  fecha_actualizacion?: string;
  fechaActualizacion?: string;
  [key: string]: unknown;
}

interface ServiceRow {
  id?: string;
  categoria?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  precio_descuento?: number | null;
  precioDescuento?: number | null;
  proveedor?: string;
  clinica_id?: string;
  clinicaId?: string;
  ciudad?: string;
  modo_servicio?: string;
  modoServicio?: string;
  estado?: string;
  fecha_creacion?: string;
  fechaCreacion?: string;
  fecha_actualizacion?: string;
  fechaActualizacion?: string;
  [key: string]: unknown;
}

export const normalizeClinic = (row: ClinicRow): VeterinaryClinic => ({
  id: row.id || '',
  nombre: row.nombre || '',
  ciudad: row.ciudad || '',
  direccion: row.direccion || '',
  servicioDomicilio: row.servicio_domicilio ?? row.servicioDomicilio ?? true,
  estado: (row.estado || 'activo') as 'activo' | 'inactivo',
  fechaCreacion: row.fecha_creacion || row.fechaCreacion || '',
  fechaActualizacion: row.fecha_actualizacion || row.fechaActualizacion || '',
});

export const normalizeService = (row: ServiceRow): Service => ({
  id: row.id || '',
  categoria: (row.categoria || 'CONSULTA') as Service['categoria'],
  nombre: row.nombre || '',
  descripcion: row.descripcion || '',
  precio: Number(row.precio ?? 0),
  precioDescuento: row.precio_descuento ?? row.precioDescuento ?? null,
  proveedor: row.proveedor || '',
  clinicaId: row.clinica_id ?? row.clinicaId ?? '',
  ciudad: row.ciudad || '',
  modoServicio: (row.modo_servicio ?? row.modoServicio ?? 'EN_SEDE') as Service['modoServicio'],
  estado: (row.estado || 'activo') as 'activo' | 'inactivo',
  fechaCreacion: row.fecha_creacion || row.fechaCreacion || '',
  fechaActualizacion: row.fecha_actualizacion || row.fechaActualizacion || '',
});
