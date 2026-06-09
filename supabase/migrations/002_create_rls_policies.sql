-- Habilitar RLS en las tablas existentes
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Políticas para clinics

-- Todos los usuarios autenticados pueden leer clínicas
CREATE POLICY "Authenticated users can view clinics" ON clinics
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Solo admin puede insertar clínicas
CREATE POLICY "Admins can insert clinics" ON clinics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admin puede actualizar clínicas
CREATE POLICY "Admins can update clinics" ON clinics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admin puede eliminar clínicas
CREATE POLICY "Admins can delete clinics" ON clinics
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para services

-- Todos los usuarios autenticados pueden leer servicios
CREATE POLICY "Authenticated users can view services" ON services
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Solo admin puede insertar servicios
CREATE POLICY "Admins can insert services" ON services
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admin puede actualizar servicios
CREATE POLICY "Admins can update services" ON services
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admin puede eliminar servicios
CREATE POLICY "Admins can delete services" ON services
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
