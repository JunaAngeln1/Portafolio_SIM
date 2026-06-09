-- ============================================
-- SIM Platform - Diagnóstico de Auth
-- ============================================
-- Ejecutar este script en el SQL Editor de Supabase
-- para diagnosticar problemas con el login.

-- 1. Verificar que la tabla profiles existe y tiene las columnas correctas
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Verificar si el trigger existe
SELECT 
  trigger_name, 
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 3. Verificar si la función del trigger existe
SELECT 
  proname, 
  proargtypes::regtype[]
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 4. Verificar políticas RLS en profiles
SELECT 
  polname, 
  polcmd,
  polqual::text,
  polwithcheck::text
FROM pg_policy 
WHERE polrelid = 'profiles'::regclass;

-- 5. Verificar si hay usuarios en auth.users
SELECT 
  id, 
  email, 
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 6. Verificar si hay perfiles creados
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- 7. Verificar si hay duplicados o conflictos
SELECT 
  email, 
  COUNT(*) as count
FROM profiles
GROUP BY email
HAVING COUNT(*) > 1;

-- 8. Verificar permisos de la función handle_new_user
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
