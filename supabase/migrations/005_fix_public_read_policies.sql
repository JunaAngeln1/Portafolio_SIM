-- Fix: allow public read access for clinics and services
-- Keep admin-only writes for data management.

DROP POLICY IF EXISTS "Authenticated users can view clinics" ON clinics;
CREATE POLICY "Anyone can view clinics" ON clinics
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can view services" ON services;
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (true);
