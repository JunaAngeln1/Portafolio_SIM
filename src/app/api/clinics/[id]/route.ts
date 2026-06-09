import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

const VALID_STATES = ['activo', 'inactivo'];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { supabase, user } = auth;
  const { id } = params;

  try {
    const body = await request.json();

    if (body.nombre !== undefined && (typeof body.nombre !== 'string' || body.nombre.trim() === '')) {
      return NextResponse.json({ error: 'nombre debe ser un texto no vacío' }, { status: 400 });
    }
    if (body.ciudad !== undefined && (typeof body.ciudad !== 'string' || body.ciudad.trim() === '')) {
      return NextResponse.json({ error: 'ciudad debe ser un texto no vacío' }, { status: 400 });
    }
    if (body.estado !== undefined && !VALID_STATES.includes(body.estado)) {
      return NextResponse.json({ error: `Estado inválido. Válidos: ${VALID_STATES.join(', ')}` }, { status: 400 });
    }
    if (body.servicioDomicilio !== undefined && typeof body.servicioDomicilio !== 'boolean') {
      return NextResponse.json({ error: 'servicioDomicilio debe ser un booleano' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      fecha_actualizacion: new Date().toISOString().split('T')[0],
    };

    if (body.nombre !== undefined) updates.nombre = body.nombre;
    if (body.ciudad !== undefined) updates.ciudad = body.ciudad;
    if (body.direccion !== undefined) updates.direccion = body.direccion;
    if (body.servicioDomicilio !== undefined) updates.servicio_domicilio = body.servicioDomicilio;
    if (body.estado !== undefined) updates.estado = body.estado;

    const { error } = await supabase
      .from('clinics')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    console.log(`[CLINICS] Admin ${user.email} actualizó clínica ${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { supabase, user } = auth;
  const { id } = params;

  try {
    const { error } = await supabase
      .from('clinics')
      .delete()
      .eq('id', id);

    if (error) throw error;

    console.log(`[CLINICS] Admin ${user.email} eliminó clínica ${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
