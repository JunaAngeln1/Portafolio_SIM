import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

const VALID_CATEGORIES = ['CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS'];
const VALID_MODES = ['EN_SEDE', 'A_DOMICILIO', 'AMBOS'];
const VALID_STATES = ['activo', 'inactivo'];

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { supabase, user } = auth;

  try {
    const body = await request.json();

    const { categoria, nombre, precio, clinicaId, ciudad, proveedor } = body;

    if (!nombre || !categoria || !clinicaId || !ciudad) {
      return NextResponse.json(
        { error: 'nombre, categoria, clinicaId y ciudad son requeridos' },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(categoria)) {
      return NextResponse.json({ error: `Categoría inválida. Válidas: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
    }

    const modoServicio = body.modoServicio || 'EN_SEDE';
    if (!VALID_MODES.includes(modoServicio)) {
      return NextResponse.json({ error: `Modo inválido. Válidos: ${VALID_MODES.join(', ')}` }, { status: 400 });
    }

    const estado = body.estado || 'activo';
    if (!VALID_STATES.includes(estado)) {
      return NextResponse.json({ error: `Estado inválido. Válidos: ${VALID_STATES.join(', ')}` }, { status: 400 });
    }

    if (typeof precio !== 'number' || precio < 0 || !Number.isFinite(precio)) {
      return NextResponse.json(
        { error: 'precio debe ser un numero positivo' },
        { status: 400 }
      );
    }

    if (body.precioDescuento !== undefined && body.precioDescuento !== null) {
      if (typeof body.precioDescuento !== 'number' || body.precioDescuento < 0 || !Number.isFinite(body.precioDescuento)) {
        return NextResponse.json({ error: 'precioDescuento debe ser un numero positivo o null' }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from('services')
      .insert([{
        categoria,
        nombre,
        descripcion: body.descripcion || '',
        precio,
        precio_descuento: body.precioDescuento ?? null,
        proveedor: proveedor || '',
        clinica_id: clinicaId,
        ciudad,
        modo_servicio: modoServicio,
        estado,
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_actualizacion: new Date().toISOString().split('T')[0],
      }])
      .select()
      .single();

    if (error) throw error;

    console.log(`[SERVICES] Admin ${user.email} creó servicio "${nombre}" (${categoria})`);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
