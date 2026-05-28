import { supabase } from './supabase';
import { Service } from './types';
import { normalizeService, serializeServiceForDb } from './normalizers';

export const agregarServicio = async (servicio: Service) => {
  const { error } = await supabase
    .from('services')
    .insert([serializeServiceForDb(servicio)]);
  
  if (error) throw error;
};

export const actualizarServicio = async (id: string, actualizaciones: Partial<Service>) => {
  const payload = serializeServiceForDb({
    ...actualizaciones,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  });

  delete payload.id;

  const { error } = await supabase
    .from('services')
    .update(payload)
    .eq('id', id);
  
  if (error) throw error;
};

export const eliminarServicio = async (id: string) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const duplicarServicio = async (id: string) => {
  // Primero obtenemos el servicio original
  const { data: originalData, error: fetchError } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  if (!originalData) throw new Error('Service not found');

  const originalServicio = normalizeService(originalData);
  const fechaActual = new Date().toISOString().split('T')[0];
  
  // Creamos el nuevo servicio basado en el original
  const nuevoServicio: Service = {
    ...originalServicio,
    id: `srv_${Date.now()}`,
    nombre: `${originalServicio.nombre} (Copia)`,
    estado: 'activo',
    fechaCreacion: fechaActual,
    fechaActualizacion: fechaActual,
  };
  
  // Insertamos el nuevo servicio
  const { error } = await supabase
    .from('services')
    .insert([serializeServiceForDb(nuevoServicio)]);
  
  if (error) throw error;
};