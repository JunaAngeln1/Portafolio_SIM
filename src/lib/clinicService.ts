import { supabase } from './supabase';
import { VeterinaryClinic } from './types';
import { normalizeClinic, serializeClinicForDb } from './normalizers';

export const agregarClinica = async (clinica: VeterinaryClinic) => {
  const { error } = await supabase
    .from('clinics')
    .insert([serializeClinicForDb(clinica)]);
  
  if (error) throw error;
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