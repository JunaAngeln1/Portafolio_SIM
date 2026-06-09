-- ============================================
-- SIM Platform - Fix Role Update + Admin Policies
-- ============================================
-- Este script corrige el bloqueo de cambio de rol
-- y asegura que los admins puedan gestionar usuarios.
-- Ejecutar en el SQL Editor de Supabase.

-- PASO 1: Eliminar el trigger prevent_role_change (CAUSA DEL BLOQUEO)
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
DROP FUNCTION IF EXISTS public.prevent_role_change();

-- PASO 2: Asegurar políticas de UPDATE correctas
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PASO 3: Asegurar política de SELECT para todos
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;

CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- PASO 4: Admins pueden eliminar perfiles
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PASO 5: Verificar resultado
SELECT polname, polcmd 
FROM pg_policy 
WHERE polrelid = 'profiles'::regclass
ORDER BY polname;
