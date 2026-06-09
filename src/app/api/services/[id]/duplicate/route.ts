import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { supabase } = auth;
  const { id } = params;

  try {
    const { data: original, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !original) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }

    const fechaActual = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('services')
      .insert([{
        categoria: original.categoria,
        nombre: `${original.nombre} (Copia)`,
        descripcion: original.descripcion,
        precio: original.precio,
        precio_descuento: original.precio_descuento,
        proveedor: original.proveedor,
        clinica_id: original.clinica_id,
        ciudad: original.ciudad,
        modo_servicio: original.modo_servicio,
        estado: 'activo',
        fecha_creacion: fechaActual,
        fecha_actualizacion: fechaActual,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
