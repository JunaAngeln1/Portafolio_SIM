import { normalizeClinic, normalizeService } from '@/lib/normalizers';

describe('normalizeClinic', () => {
  it('debería normalizar campos snake_case de Supabase', () => {
    const row = {
      id: 'vet_001',
      nombre: 'Vet Test',
      ciudad: 'Bogotá',
      direccion: 'Cra 10',
      servicio_domicilio: true,
      estado: 'activo',
      fecha_creacion: '2026-01-01',
      fecha_actualizacion: '2026-01-01',
    };
    const result = normalizeClinic(row);
    expect(result).toEqual({
      id: 'vet_001',
      nombre: 'Vet Test',
      ciudad: 'Bogotá',
      direccion: 'Cra 10',
      servicioDomicilio: true,
      estado: 'activo',
      fechaCreacion: '2026-01-01',
      fechaActualizacion: '2026-01-01',
    });
  });

  it('debería manejar campos camelCase', () => {
    const row = {
      id: 'vet_002',
      nombre: 'Vet 2',
      ciudad: 'Cali',
      direccion: '',
      servicioDomicilio: false,
      estado: 'inactivo',
      fechaCreacion: '2026-02-01',
      fechaActualizacion: '2026-02-01',
    };
    const result = normalizeClinic(row);
    expect(result.servicioDomicilio).toBe(false);
    expect(result.estado).toBe('inactivo');
  });

  it('debería usar valores por defecto para campos faltantes', () => {
    const row = { id: 'vet_003', nombre: 'Vet 3', ciudad: 'Medellín', estado: 'activo' };
    const result = normalizeClinic(row);
    expect(result.direccion).toBe('');
    expect(result.servicioDomicilio).toBe(true);
    expect(result.estado).toBe('activo');
    expect(result.fechaCreacion).toBe('');
    expect(result.fechaActualizacion).toBe('');
  });
});

describe('normalizeService', () => {
  it('debería normalizar campos snake_case', () => {
    const row = {
      id: 'srv_001',
      categoria: 'CONSULTA',
      nombre: 'Consulta',
      descripcion: 'Desc',
      precio: 50000,
      precio_descuento: 42000,
      proveedor: 'Vet',
      clinica_id: 'vet_001',
      ciudad: 'Bogotá',
      modo_servicio: 'AMBOS',
      estado: 'activo',
      fecha_creacion: '2026-01-01',
      fecha_actualizacion: '2026-01-01',
    };
    const result = normalizeService(row);
    expect(result.clinicaId).toBe('vet_001');
    expect(result.precioDescuento).toBe(42000);
    expect(result.modoServicio).toBe('AMBOS');
    expect(result.fechaCreacion).toBe('2026-01-01');
  });

  it('debería manejar precioDescuento null', () => {
    const row = {
      id: 'srv_002',
      categoria: 'CIRUGIA',
      nombre: 'Cirugía',
      precio: 100000,
      precio_descuento: null,
      clinica_id: 'vet_001',
      ciudad: 'Bogotá',
      modo_servicio: 'EN_SEDE',
      estado: 'activo',
      fecha_creacion: '2026-01-01',
      fecha_actualizacion: '2026-01-01',
    };
    const result = normalizeService(row);
    expect(result.precioDescuento).toBeNull();
  });

  it('debería usar valores por defecto para campos faltantes', () => {
    const row = { id: 'srv_003', categoria: 'LABORATORIO', nombre: 'Lab' };
    const result = normalizeService(row);
    expect(result.descripcion).toBe('');
    expect(result.precio).toBe(0);
    expect(result.precioDescuento).toBeNull();
    expect(result.clinicaId).toBe('');
    expect(result.modoServicio).toBe('EN_SEDE');
  });
});
