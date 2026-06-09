import { supabase } from './supabase';
import { VeterinaryClinic } from './types';
import { serializeClinicForDb } from './normalizers';

export const agregarClinica = async (clinica: VeterinaryClinic) => {
  const payload = serializeClinicForDb(clinica);
  delete payload.id; // Supabase genera el UUID automáticamente

  const { data, error } = await supabase
    .from('clinics')
    .insert([payload])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const actualizarClinica = async (id: string, actualizaciones: Partial<VeterinaryClinic>) => {
  const payload = serializeClinicForDb({
    ...actualizaciones,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  });

  delete payload.id;

  const { error } = await supabase
    .from('clinics')
    .update(payload)
    .eq('id', id);
  
  if (error) throw error;
};

export const eliminarClinica = async (id: string) => {
  const { error } = await supabase
    .from('clinics')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};