import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { supabase, user } = auth;
  const { id } = params;

  if (user.id === id) {
    return NextResponse.json(
      { error: 'No puedes cambiar tu propio rol' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { role } = body;

    if (role !== 'admin' && role !== 'general') {
      return NextResponse.json(
        { error: 'Rol inválido. Debe ser "admin" o "general"' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
