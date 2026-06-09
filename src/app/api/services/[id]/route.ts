import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

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

    const VALID_CATEGORIES = ['CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS'];
    const VALID_MODES = ['EN_SEDE', 'A_DOMICILIO', 'AMBOS'];
    const VALID_STATES = ['activo', 'inactivo'];

    if (body.categoria !== undefined && !VALID_CATEGORIES.includes(body.categoria)) {
      return NextResponse.json({ error: `Categoría inválida. Válidas: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
    }
    if (body.modoServicio !== undefined && !VALID_MODES.includes(body.modoServicio)) {
      return NextResponse.json({ error: `Modo inválido. Válidos: ${VALID_MODES.join(', ')}` }, { status: 400 });
    }
    if (body.estado !== undefined && !VALID_STATES.includes(body.estado)) {
      return NextResponse.json({ error: `Estado inválido. Válidos: ${VALID_STATES.join(', ')}` }, { status: 400 });
    }
    if (body.precio !== undefined && (typeof body.precio !== 'number' || body.precio < 0 || !Number.isFinite(body.precio))) {
      return NextResponse.json({ error: 'precio debe ser un numero positivo' }, { status: 400 });
    }
    if (body.precioDescuento !== undefined && body.precioDescuento !== null) {
      if (typeof body.precioDescuento !== 'number' || body.precioDescuento < 0 || !Number.isFinite(body.precioDescuento)) {
        return NextResponse.json({ error: 'precioDescuento debe ser un numero positivo o null' }, { status: 400 });
      }
    }
    if (body.nombre !== undefined && (typeof body.nombre !== 'string' || body.nombre.trim() === '')) {
      return NextResponse.json({ error: 'nombre debe ser un texto no vacío' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      fecha_actualizacion: new Date().toISOString().split('T')[0],
    };

    if (body.categoria !== undefined) updates.categoria = body.categoria;
    if (body.nombre !== undefined) updates.nombre = body.nombre;
    if (body.descripcion !== undefined) updates.descripcion = body.descripcion;
    if (body.precio !== undefined) updates.precio = body.precio;
    if (body.precioDescuento !== undefined) updates.precio_descuento = body.precioDescuento;
    if (body.proveedor !== undefined) updates.proveedor = body.proveedor;
    if (body.clinicaId !== undefined) updates.clinica_id = body.clinicaId;
    if (body.ciudad !== undefined) updates.ciudad = body.ciudad;
    if (body.modoServicio !== undefined) updates.modo_servicio = body.modoServicio;
    if (body.estado !== undefined) updates.estado = body.estado;

    const { error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    console.log(`[SERVICES] Admin ${user.email} actualizó servicio ${id}`);

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

  const { supabase, user: adminUser } = auth;
  const { id } = params;

  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;

    console.log(`[SERVICES] Admin ${adminUser.email} eliminó servicio ${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
