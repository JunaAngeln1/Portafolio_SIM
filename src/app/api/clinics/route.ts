import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { supabase } = auth;

  try {
    const body = await request.json();

    const { nombre, ciudad, direccion, servicioDomicilio, estado } = body;

    if (!nombre || !ciudad) {
      return NextResponse.json(
        { error: 'nombre y ciudad son requeridos' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('clinics')
      .insert([{
        nombre,
        ciudad,
        direccion: direccion || '',
        servicio_domicilio: servicioDomicilio ?? true,
        estado: estado || 'activo',
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_actualizacion: new Date().toISOString().split('T')[0],
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
