import { VeterinaryClinic, Service } from './types';

// Using any to accept both Supabase rows and typed objects
export const normalizeClinic = (row: any): VeterinaryClinic => ({
  id: (row.id as string) || '',
  nombre: (row.nombre as string) || '',
  ciudad: (row.ciudad as string) || '',
  direccion: (row.direccion as string) || '',
  servicioDomicilio: (row.servicio_domicilio ?? row.servicioDomicilio ?? true) as boolean,
  estado: ((row.estado as string) || 'activo') as 'activo' | 'inactivo',
  fechaCreacion: (row.fecha_creacion as string) || (row.fechaCreacion as string) || '',
  fechaActualizacion: (row.fecha_actualizacion as string) || (row.fechaActualizacion as string) || '',
});

// Using any to accept both Supabase rows and typed objects
export const normalizeService = (row: any): Service => ({
  id: (row.id as string) || '',
  categoria: ((row.categoria as string) || 'CONSULTA') as Service['categoria'],
  nombre: (row.nombre as string) || '',
  descripcion: (row.descripcion as string) || '',
  precio: Number(row.precio ?? 0),
  precioDescuento: (row.precio_descuento ?? row.precioDescuento ?? null) as number | null,
  proveedor: (row.proveedor as string) || '',
  clinicaId: (row.clinica_id ?? row.clinicaId ?? '') as string,
  ciudad: (row.ciudad as string) || '',
  modoServicio: ((row.modo_servicio ?? row.modoServicio ?? 'EN_SEDE') as Service['modoServicio']),
  estado: ((row.estado as string) || 'activo') as 'activo' | 'inactivo',
  fechaCreacion: (row.fecha_creacion as string) || (row.fechaCreacion as string) || '',
  fechaActualizacion: (row.fecha_actualizacion as string) || (row.fechaActualizacion as string) || '',
});
