import { VeterinaryClinic, Service } from './types';

export const normalizeClinic = (row: any): VeterinaryClinic => ({
  id: row.id,
  nombre: row.nombre,
  ciudad: row.ciudad,
  direccion: row.direccion || '',
  servicioDomicilio: row.servicio_domicilio ?? row.servicioDomicilio ?? true,
  estado: row.estado,
  fechaCreacion: row.fecha_creacion || row.fechaCreacion || '',
  fechaActualizacion: row.fecha_actualizacion || row.fechaActualizacion || '',
});

export const serializeClinicForDb = (clinica: Partial<VeterinaryClinic>) => {
  const dbRow: Record<string, unknown> = {};

  if (clinica.id !== undefined) dbRow.id = clinica.id;
  if (clinica.nombre !== undefined) dbRow.nombre = clinica.nombre;
  if (clinica.ciudad !== undefined) dbRow.ciudad = clinica.ciudad;
  if (clinica.direccion !== undefined) dbRow.direccion = clinica.direccion;
  if (clinica.servicioDomicilio !== undefined) dbRow.servicio_domicilio = clinica.servicioDomicilio;
  if (clinica.estado !== undefined) dbRow.estado = clinica.estado;
  if (clinica.fechaCreacion !== undefined) dbRow.fecha_creacion = clinica.fechaCreacion;
  if (clinica.fechaActualizacion !== undefined) dbRow.fecha_actualizacion = clinica.fechaActualizacion;

  return dbRow;
};

export const normalizeService = (row: any): Service => ({
  id: row.id,
  categoria: row.categoria,
  nombre: row.nombre,
  descripcion: row.descripcion || '',
  precio: Number(row.precio ?? 0),
  precioDescuento: row.precio_descuento ? Number(row.precio_descuento) : null,
  proveedor: row.proveedor,
  clinicaId: row.clinica_id ?? row.clinicaId ?? '',
  ciudad: row.ciudad,
  modoServicio: row.modo_servicio ?? row.modoServicio ?? 'EN_SEDE',
  estado: row.estado,
  fechaCreacion: row.fecha_creacion || row.fechaCreacion || '',
  fechaActualizacion: row.fecha_actualizacion || row.fechaActualizacion || '',
});

export const serializeServiceForDb = (servicio: Partial<Service>) => {
  const dbRow: Record<string, unknown> = {};

  if (servicio.id !== undefined) dbRow.id = servicio.id;
  if (servicio.categoria !== undefined) dbRow.categoria = servicio.categoria;
  if (servicio.nombre !== undefined) dbRow.nombre = servicio.nombre;
  if (servicio.descripcion !== undefined) dbRow.descripcion = servicio.descripcion;
  if (servicio.precio !== undefined) dbRow.precio = servicio.precio;
  if ('precioDescuento' in servicio) dbRow.precio_descuento = servicio.precioDescuento;
  if (servicio.proveedor !== undefined) dbRow.proveedor = servicio.proveedor;
  if (servicio.clinicaId !== undefined) dbRow.clinica_id = servicio.clinicaId;
  if (servicio.ciudad !== undefined) dbRow.ciudad = servicio.ciudad;
  if (servicio.modoServicio !== undefined) dbRow.modo_servicio = servicio.modoServicio;
  if (servicio.estado !== undefined) dbRow.estado = servicio.estado;
  if (servicio.fechaCreacion !== undefined) dbRow.fecha_creacion = servicio.fechaCreacion;
  if (servicio.fechaActualizacion !== undefined) dbRow.fecha_actualizacion = servicio.fechaActualizacion;

  return dbRow;
};