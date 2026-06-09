import { validarImportData, validarTamanioArchivo } from '@/lib/importValidation';

describe('validarImportData', () => {
  it('debería aceptar JSON válido con estructura correcta', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet Test',
          ciudad: 'Bogotá',
          servicios: [
            {
              nombre: 'Consulta',
              categoria: 'CONSULTA',
              precio: 50000,
            },
          ],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(true);
  });

  it('debería rechazar si no es un objeto', () => {
    const result = validarImportData(null);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors[0].message).toContain('objeto válido');
    }
  });

  it('debería rechazar si falta campo veterinarias', () => {
    const result = validarImportData({});
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors[0].field).toBe('veterinarias');
    }
  });

  it('debería rechazar si veterinarias no es array', () => {
    const result = validarImportData({ veterinarias: 'no es array' });
    expect(result.valid).toBe(false);
  });

  it('debería rechazar si veterinarias está vacío', () => {
    const result = validarImportData({ veterinarias: [] });
    expect(result.valid).toBe(false);
  });

  it('debería rechazar veterinaria sin nombre', () => {
    const data = {
      veterinarias: [
        {
          ciudad: 'Bogotá',
          servicios: [],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.field.includes('nombre'))).toBe(true);
    }
  });

  it('debería rechazar veterinaria sin ciudad', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet',
          servicios: [],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.field.includes('ciudad'))).toBe(true);
    }
  });

  it('debería rechazar servicio sin nombre', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet',
          ciudad: 'Bogotá',
          servicios: [
            {
              categoria: 'CONSULTA',
              precio: 50000,
            },
          ],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(false);
  });

  it('debería rechazar servicio con categoría inválida', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet',
          ciudad: 'Bogotá',
          servicios: [
            {
              nombre: 'Servicio',
              categoria: 'CATEGORIA_INVALIDA',
              precio: 50000,
            },
          ],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.message.includes('Categoría inválida'))).toBe(true);
    }
  });

  it('debería aceptar todas las categorías válidas', () => {
    const categorias = ['CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS'];
    categorias.forEach(cat => {
      const data = {
        veterinarias: [
          {
            nombre: 'Vet',
            ciudad: 'Bogotá',
            servicios: [{ nombre: 'Serv', categoria: cat, precio: 10000 }],
          },
        ],
      };
      const result = validarImportData(data);
      expect(result.valid).toBe(true);
    });
  });

  it('debería rechazar precio negativo', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet',
          ciudad: 'Bogotá',
          servicios: [{ nombre: 'Serv', categoria: 'CONSULTA', precio: -1000 }],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(false);
  });

  it('debería aceptar precio de 0', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet',
          ciudad: 'Bogotá',
          servicios: [{ nombre: 'Serv', categoria: 'CONSULTA', precio: 0 }],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(true);
  });

  it('debería aceptar modo_servicio válido', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet',
          ciudad: 'Bogotá',
          servicios: [{ nombre: 'Serv', categoria: 'CONSULTA', precio: 10000, modo_servicio: 'EN_SEDE' }],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(true);
  });

  it('debería rechazar modo_servicio inválido', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet',
          ciudad: 'Bogotá',
          servicios: [{ nombre: 'Serv', categoria: 'CONSULTA', precio: 10000, modo_servicio: 'INVALIDO' }],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(false);
  });

  it('debería aceptar servicios como opcional', () => {
    const data = {
      veterinarias: [
        {
          nombre: 'Vet',
          ciudad: 'Bogotá',
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(true);
  });

  it('debería reportar múltiples errores', () => {
    const data = {
      veterinarias: [
        {
          servicios: [{ precio: 10000 }],
        },
      ],
    };
    const result = validarImportData(data);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('validarTamanioArchivo', () => {
  it('debería aceptar archivo pequeño', () => {
    const file = new File(['test'], 'test.json', { type: 'application/json' });
    Object.defineProperty(file, 'size', { value: 1000 });
    expect(validarTamanioArchivo(file)).toBeNull();
  });

  it('debería rechazar archivo mayor a 1MB', () => {
    const file = new File(['test'], 'test.json', { type: 'application/json' });
    Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 });
    const result = validarTamanioArchivo(file);
    expect(result).toContain('demasiado grande');
  });

  it('debería aceptar archivo exactamente de 1MB', () => {
    const file = new File(['test'], 'test.json', { type: 'application/json' });
    Object.defineProperty(file, 'size', { value: 1 * 1024 * 1024 });
    expect(validarTamanioArchivo(file)).toBeNull();
  });
});
