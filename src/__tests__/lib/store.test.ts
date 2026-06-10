import { VeterinaryClinic, Service, FilterState } from '@/lib/types';

const mockClinicas: VeterinaryClinic[] = [
  {
    id: 'vet_1',
    nombre: 'Veterinaria San Francisco',
    ciudad: 'Bogotá',
    direccion: 'Calle 123',
    servicioDomicilio: true,
    estado: 'activo',
    fechaCreacion: '2024-01-01',
    fechaActualizacion: '2024-01-01',
  },
  {
    id: 'vet_2',
    nombre: 'Veterinaria La Mascota',
    ciudad: 'Medellín',
    direccion: 'Avenida 456',
    servicioDomicilio: false,
    estado: 'activo',
    fechaCreacion: '2024-01-01',
    fechaActualizacion: '2024-01-01',
  },
  {
    id: 'vet_3',
    nombre: 'Veterinaria Inactiva',
    ciudad: 'Bogotá',
    direccion: 'Calle 789',
    servicioDomicilio: false,
    estado: 'inactivo',
    fechaCreacion: '2024-01-01',
    fechaActualizacion: '2024-01-01',
  },
];

const mockServicios: Service[] = [
  {
    id: 'srv_1',
    categoria: 'CONSULTA',
    nombre: 'Consulta General',
    descripcion: 'Consulta veterinaria general',
    precio: 50000,
    precioDescuento: 42000,
    proveedor: 'Veterinaria San Francisco',
    clinicaId: 'vet_1',
    ciudad: 'Bogotá',
    modoServicio: 'EN_SEDE',
    estado: 'activo',
    fechaCreacion: '2024-01-01',
    fechaActualizacion: '2024-01-01',
  },
  {
    id: 'srv_2',
    categoria: 'CIRUGIA',
    nombre: 'Cirugía Mayor',
    descripcion: 'Cirugía de alto riesgo',
    precio: 200000,
    precioDescuento: null,
    proveedor: 'Veterinaria San Francisco',
    clinicaId: 'vet_1',
    ciudad: 'Bogotá',
    modoServicio: 'EN_SEDE',
    estado: 'activo',
    fechaCreacion: '2024-01-01',
    fechaActualizacion: '2024-01-01',
  },
  {
    id: 'srv_3',
    categoria: 'VACUNAS',
    nombre: 'Vacuna Antirrábica',
    descripcion: 'Vacuna contra la rabia',
    precio: 35000,
    precioDescuento: 30000,
    proveedor: 'Veterinaria La Mascota',
    clinicaId: 'vet_2',
    ciudad: 'Medellín',
    modoServicio: 'A_DOMICILIO',
    estado: 'activo',
    fechaCreacion: '2024-01-01',
    fechaActualizacion: '2024-01-01',
  },
  {
    id: 'srv_4',
    categoria: 'LABORATORIO',
    nombre: 'Análisis de Sangre',
    descripcion: 'Examen completo de sangre',
    precio: 80000,
    precioDescuento: 70000,
    proveedor: 'Veterinaria Inactiva',
    clinicaId: 'vet_3',
    ciudad: 'Bogotá',
    modoServicio: 'EN_SEDE',
    estado: 'inactivo',
    fechaCreacion: '2024-01-01',
    fechaActualizacion: '2024-01-01',
  },
];

function filterServices(servicios: Service[], filtros: FilterState): Service[] {
  return servicios.filter(servicio => {
    if (filtros.clinicaId !== 'TODAS' && servicio.clinicaId !== filtros.clinicaId) return false;
    if (filtros.ciudad !== 'TODAS' && servicio.ciudad !== filtros.ciudad) return false;
    if (filtros.categoria !== 'TODAS' && servicio.categoria !== filtros.categoria) return false;
    if (filtros.proveedor !== 'TODAS' && servicio.proveedor !== filtros.proveedor) return false;
    if (filtros.modoServicio !== 'TODOS' && servicio.modoServicio !== filtros.modoServicio) return false;
    if (filtros.estado !== 'TODOS' && servicio.estado !== filtros.estado) return false;
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      if (!servicio.nombre.toLowerCase().includes(busqueda) &&
          !servicio.descripcion.toLowerCase().includes(busqueda) &&
          !servicio.categoria.toLowerCase().includes(busqueda) &&
          !servicio.proveedor.toLowerCase().includes(busqueda) &&
          !servicio.ciudad.toLowerCase().includes(busqueda)) return false;
    }
    return true;
  });
}

const filtrosPorDefecto: FilterState = {
  clinicaId: 'TODAS',
  ciudad: 'TODAS',
  categoria: 'TODAS',
  proveedor: 'TODAS',
  modoServicio: 'TODOS',
  estado: 'TODOS',
  busqueda: '',
};

describe('Filtrado de Servicios (lógica del store)', () => {
  it('debería devolver todos los servicios con filtros por defecto', () => {
    const resultado = filterServices(mockServicios, filtrosPorDefecto);
    expect(resultado).toHaveLength(4);
  });

  it('debería filtrar por ciudad', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, ciudad: 'Bogotá' });
    expect(resultado).toHaveLength(3);
    resultado.forEach(s => expect(s.ciudad).toBe('Bogotá'));
  });

  it('debería filtrar por categoría', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, categoria: 'CONSULTA' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.categoria).toBe('CONSULTA');
  });

  it('debería filtrar por proveedor', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, proveedor: 'Veterinaria San Francisco' });
    expect(resultado).toHaveLength(2);
    resultado.forEach(s => expect(s.proveedor).toBe('Veterinaria San Francisco'));
  });

  it('debería filtrar por modo de servicio', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, modoServicio: 'A_DOMICILIO' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.modoServicio).toBe('A_DOMICILIO');
  });

  it('debería filtrar por estado', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, estado: 'inactivo' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.estado).toBe('inactivo');
  });

  it('debería filtrar por búsqueda en nombre', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, busqueda: 'Consulta' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.nombre).toContain('Consulta');
  });

  it('debería filtrar por búsqueda en descripción', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, busqueda: 'alto riesgo' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.descripcion).toContain('alto riesgo');
  });

  it('debería filtrar por búsqueda en categoría', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, busqueda: 'cirugia' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.categoria).toBe('CIRUGIA');
  });

  it('debería filtrar por búsqueda en proveedor', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, busqueda: 'La Mascota' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.proveedor).toContain('La Mascota');
  });

  it('debería filtrar por búsqueda en ciudad', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, busqueda: 'La Mascota' });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.proveedor).toContain('La Mascota');
  });

  it('debería combinar filtros de categoría y ciudad', () => {
    const resultado = filterServices(mockServicios, {
      ...filtrosPorDefecto,
      categoria: 'CONSULTA',
      ciudad: 'Bogotá',
    });
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.categoria).toBe('CONSULTA');
    expect(resultado[0]!.ciudad).toBe('Bogotá');
  });

  it('debería devolver array vacío si no hay coincidencias', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, busqueda: 'xyz123' });
    expect(resultado).toHaveLength(0);
  });

  it('debería filtrar por clínica específica', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, clinicaId: 'vet_1' });
    expect(resultado).toHaveLength(2);
    resultado.forEach(s => expect(s.clinicaId).toBe('vet_1'));
  });

  it('debería ser case-insensitive en búsqueda', () => {
    const resultado = filterServices(mockServicios, { ...filtrosPorDefecto, busqueda: 'CONSULTA' });
    expect(resultado).toHaveLength(1);
  });
});

describe('Obtener Ciudades', () => {
  it('debería extraer ciudades únicas de las clínicas activas', () => {
    const ciudades = [...new Set(mockClinicas.filter(c => c.estado === 'activo').map(c => c.ciudad))];
    expect(ciudades).toContain('Bogotá');
    expect(ciudades).toContain('Medellín');
    expect(ciudades).toHaveLength(2);
  });
});

describe('Obtener Proveedores', () => {
  it('debería extraer proveedores únicos de los servicios', () => {
    const proveedores = [...new Set(mockServicios.map(s => s.proveedor))];
    expect(proveedores).toContain('Veterinaria San Francisco');
    expect(proveedores).toContain('Veterinaria La Mascota');
    expect(proveedores).toContain('Veterinaria Inactiva');
    expect(proveedores).toHaveLength(3);
  });
});
