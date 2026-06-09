import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { validarImportData } from '@/lib/importValidation';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { supabase } = auth;

  try {
    const body = await request.json();
    const validation = validarImportData(body);
    if (!validation.valid) {
      return NextResponse.json({ error: 'Datos inválidos', details: validation.errors }, { status: 400 });
    }

    const data = validation.data;
    let clinicasCount = 0;
    let serviciosCount = 0;

    for (const vet of data.veterinarias) {
      const fechaActual = new Date().toISOString().split('T')[0];

      const { data: clinicaResult, error: clinicaError } = await supabase
        .from('clinics')
        .insert([{
          nombre: vet.nombre,
          ciudad: vet.ciudad,
          direccion: vet.direccion || '',
          servicio_domicilio: vet.servicio_domicilio ?? true,
          estado: 'activo',
          fecha_creacion: fechaActual,
          fecha_actualizacion: fechaActual,
        }])
        .select()
        .single();

      if (clinicaError) throw clinicaError;
      clinicasCount++;

      for (const srv of vet.servicios) {
        const validCategories = ['CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS'];
        const categoria = validCategories.includes(srv.categoria) ? srv.categoria : 'CONSULTA';
        const modoServicio = srv.modo_servicio === 'EN_SEDE' ? 'EN_SEDE'
          : srv.modo_servicio === 'A_DOMICILIO' ? 'A_DOMICILIO'
          : 'AMBOS';

        const { error: servicioError } = await supabase
          .from('services')
          .insert([{
            categoria,
            nombre: srv.nombre,
            descripcion: srv.descripcion || '',
            precio: srv.precio || 0,
            precio_descuento: srv.precio_descuento ?? null,
            proveedor: vet.nombre,
            clinica_id: clinicaResult.id,
            ciudad: vet.ciudad,
            modo_servicio: modoServicio,
            estado: 'activo',
            fecha_creacion: fechaActual,
            fecha_actualizacion: fechaActual,
          }]);

        if (servicioError) throw servicioError;
        serviciosCount++;
      }
    }

    return NextResponse.json({ clinicasImportadas: clinicasCount, serviciosImportados: serviciosCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
