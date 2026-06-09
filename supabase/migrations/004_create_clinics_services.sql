-- ============================================
-- SIM Platform - Clinics & Services Tables
-- ============================================
-- Crea las tablas clinics y services que son requeridas
-- por la aplicación pero no existían en migraciones anteriores.
-- Ejecutar en el SQL Editor de Supabase.

-- 1. Tabla clinics
CREATE TABLE IF NOT EXISTS clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  direccion TEXT DEFAULT '',
  servicio_domicilio BOOLEAN DEFAULT true,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  fecha_creacion DATE DEFAULT CURRENT_DATE,
  fecha_actualizacion DATE DEFAULT CURRENT_DATE
);

-- 2. Tabla services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria TEXT NOT NULL CHECK (categoria IN ('CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS')),
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  precio NUMERIC NOT NULL DEFAULT 0,
  precio_descuento NUMERIC,
  proveedor TEXT DEFAULT '',
  clinica_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  ciudad TEXT NOT NULL,
  modo_servicio TEXT NOT NULL DEFAULT 'AMBOS' CHECK (modo_servicio IN ('EN_SEDE', 'A_DOMICILIO', 'AMBOS')),
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  fecha_creacion DATE DEFAULT CURRENT_DATE,
  fecha_actualizacion DATE DEFAULT CURRENT_DATE
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_services_clinica_id ON services(clinica_id);
CREATE INDEX IF NOT EXISTS idx_services_ciudad ON services(ciudad);
CREATE INDEX IF NOT EXISTS idx_services_categoria ON services(categoria);
CREATE INDEX IF NOT EXISTS idx_clinics_ciudad ON clinics(ciudad);
CREATE INDEX IF NOT EXISTS idx_clinics_estado ON clinics(estado);
