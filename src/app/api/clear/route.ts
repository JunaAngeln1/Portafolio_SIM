import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { supabase, user } = auth;

  try {
    const body = await request.json().catch(() => ({}));
    if (body.confirm !== true) {
      return NextResponse.json(
        { error: 'Se requiere { "confirm": true } en el body para ejecutar esta acción' },
        { status: 400 }
      );
    }

    const { error: servicesError } = await supabase
      .from('services')
      .delete()
      .neq('id', '');

    if (servicesError) throw servicesError;

    const { error: clinicsError } = await supabase
      .from('clinics')
      .delete()
      .neq('id', '');

    if (clinicsError) throw clinicsError;

    console.warn(`[CLEAR] Admin ${user.email} (${user.id}) eliminó todos los datos`);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
