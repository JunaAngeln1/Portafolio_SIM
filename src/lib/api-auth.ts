import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from './supabase-server';
import { UserProfile, UserRole } from './types';

interface AuthResult {
  user: UserProfile & { role: UserRole };
  supabase: ReturnType<typeof createServerSupabase>;
}

export async function requireAdmin(request: NextRequest): Promise<
  { error: NextResponse } | AuthResult
> {
  const supabase = createServerSupabase();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return {
      error: NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 }),
    };
  }

  if (profile.role !== 'admin') {
    return {
      error: NextResponse.json({ error: 'Se requiere rol admin' }, { status: 403 }),
    };
  }

  return {
    user: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role as UserRole,
      createdAt: profile.created_at,
    },
    supabase,
  };
}
