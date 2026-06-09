import { VeterinaryClinic, Service, ServiceCategory, ServiceMode } from './types';

export const mockClinics: VeterinaryClinic[] = [
  { id: 'vet_001', nombre: 'Veterinaria Ruffy', ciudad: 'Santa Marta', direccion: 'Cra 10 #15-20', servicioDomicilio: true, estado: 'activo', fechaCreacion: '2026-01-15', fechaActualizacion: '2026-05-10' },
  { id: 'vet_002', nombre: 'Clínica Veterinaria El Roble', ciudad: 'Bogotá', direccion: 'Calle 45 #12-30', servicioDomicilio: false, estado: 'activo', fechaCreacion: '2026-01-20', fechaActualizacion: '2026-05-12' },
  { id: 'vet_003', nombre: 'Veterinaria San Marcos', ciudad: 'Medellín', direccion: 'Av. El Poblado #20-45', servicioDomicilio: true, estado: 'activo', fechaCreacion: '2026-02-01', fechaActualizacion: '2026-05-08' },
  { id: 'vet_004', nombre: 'Centro Veterinario Andes', ciudad: 'Cali', direccion: 'Calle 5 #38-60', servicioDomicilio: false, estado: 'activo', fechaCreacion: '2026-02-10', fechaActualizacion: '2026-05-14' },
  { id: 'vet_005', nombre: 'Veterinaria Patitas Felices', ciudad: 'Barranquilla', direccion: 'Cra 50 #68-30', servicioDomicilio: true, estado: 'inactivo', fechaCreacion: '2026-03-05', fechaActualizacion: '2026-04-20' },
];

export const mockServices: Service[] = [
  { id: 'srv_001', categoria: 'CONSULTA', nombre: 'Consulta General', descripcion: 'Evaluación médica completa del paciente', precio: 50000, precioDescuento: 42000, proveedor: 'Veterinaria Ruffy', clinicaId: 'vet_001', ciudad: 'Santa Marta', modoServicio: 'AMBOS', estado: 'activo', fechaCreacion: '2026-01-15', fechaActualizacion: '2026-05-10' },
  { id: 'srv_002', categoria: 'CONSULTA', nombre: 'Consulta Domiciliaria', descripcion: 'Atención veterinaria a domicilio', precio: 80000, precioDescuento: 68000, proveedor: 'Veterinaria Ruffy', clinicaId: 'vet_001', ciudad: 'Santa Marta', modoServicio: 'A_DOMICILIO', estado: 'activo', fechaCreacion: '2026-01-15', fechaActualizacion: '2026-05-12' },
  { id: 'srv_003', categoria: 'CIRUGIA', nombre: 'Cirugía de Esterilización', descripcion: 'Procedimiento quirúrgico de esterilización canina/felina', precio: 150000, precioDescuento: 125000, proveedor: 'Clínica Veterinaria El Roble', clinicaId: 'vet_002', ciudad: 'Bogotá', modoServicio: 'EN_SEDE', estado: 'activo', fechaCreacion: '2026-01-20', fechaActualizacion: '2026-05-11' },
  { id: 'srv_004', categoria: 'VACUNAS', nombre: 'Vacuna Rabia', descripcion: 'Vacunación antirrábica anual', precio: 30000, precioDescuento: null, proveedor: 'Veterinaria San Marcos', clinicaId: 'vet_003', ciudad: 'Medellín', modoServicio: 'AMBOS', estado: 'activo', fechaCreacion: '2026-02-01', fechaActualizacion: '2026-05-08' },
  { id: 'srv_005', categoria: 'LABORATORIO', nombre: 'Panel Hemático Completo', descripcion: 'Análisis de sangre con 18 parámetros', precio: 95000, precioDescuento: 80000, proveedor: 'Centro Veterinario Andes', clinicaId: 'vet_004', ciudad: 'Cali', modoServicio: 'EN_SEDE', estado: 'activo', fechaCreacion: '2026-02-10', fechaActualizacion: '2026-05-14' },
  { id: 'srv_006', categoria: 'IMAGENES', nombre: 'Radiografía Digital', descripcion: 'Captura de imágenes radiográficas digitales', precio: 110000, precioDescuento: 92000, proveedor: 'Clínica Veterinaria El Roble', clinicaId: 'vet_002', ciudad: 'Bogotá', modoServicio: 'EN_SEDE', estado: 'activo', fechaCreacion: '2026-02-15', fechaActualizacion: '2026-05-13' },
  { id: 'srv_007', categoria: 'PROCEDIMIENTOS', nombre: 'Limpieza Dental', descripcion: 'Profilaxis dental con ultrasonido', precio: 85000, precioDescuento: 72000, proveedor: 'Veterinaria Ruffy', clinicaId: 'vet_001', ciudad: 'Santa Marta', modoServicio: 'AMBOS', estado: 'activo', fechaCreacion: '2026-03-01', fechaActualizacion: '2026-05-10' },
];

export const categories: { value: ServiceCategory | 'TODAS'; label: string; color: string }[] = [
  { value: 'TODAS', label: 'Todas las Categorías', color: '#6B7280' },
  { value: 'CONSULTA', label: 'Consulta', color: '#3B82F6' },
  { value: 'CIRUGIA', label: 'Cirugía', color: '#EC4899' },
  { value: 'LABORATORIO', label: 'Laboratorio', color: '#6B7280' },
  { value: 'IMAGENES', label: 'Imágenes', color: '#8B5CF6' },
  { value: 'VACUNAS', label: 'Vacunas', color: '#EAB308' },
  { value: 'PROCEDIMIENTOS', label: 'Procedimientos', color: '#F97316' },
];

export const serviceModes: { value: ServiceMode | 'TODOS'; label: string }[] = [
  { value: 'TODOS', label: 'Todos los Modos' },
  { value: 'EN_SEDE', label: 'En Sede' },
  { value: 'A_DOMICILIO', label: 'A Domicilio' },
  { value: 'AMBOS', label: 'Ambos' },
];