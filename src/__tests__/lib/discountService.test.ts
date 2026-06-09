import {
  calcularDescuentoEPP,
  calcularItem,
  recalcularItem,
  recalcularTotales,
  crearItemDesdeServicio,
  generarTextoBasico,
  generarTextoDetallado,
  generarMensajeResumen,
} from '@/lib/discountService';
import { QuotationItem, Quotation } from '@/lib/quotationTypes';

function makeItem(overrides: Partial<QuotationItem> = {}): QuotationItem {
  return {
    id: 'qi_test',
    servicioId: 'srv_001',
    servicio: {
      nombre: 'Consulta General',
      categoria: 'CONSULTA',
      descripcion: 'Evaluación médica completa',
      proveedor: 'Veterinaria Ruffy',
      ciudad: 'Santa Marta',
      modoServicio: 'AMBOS',
    },
    precioRegular: 50000,
    precioSim: 42000,
    cantidad: 1,
    tipoDescuento: 'SIM',
    porcentajeDescuento: 0,
    valorDescuento: 8000,
    precioFinal: 42000,
    totalQuimicas: 0,
    quimicasCubiertas: 0,
    descuentoEPP: 0,
    ...overrides,
  };
}

function makeQuotation(overrides: Partial<Quotation> = {}): Quotation {
  return {
    id: 'qt_test',
    ciudad: 'Santa Marta',
    clinicaNombre: 'Veterinaria Ruffy',
    clienteNombre: 'Juan Pérez',
    fecha: '05/06/2026',
    notas: '',
    comentarios: '',
    items: [],
    totalSinDescuento: 0,
    totalDescuentos: 0,
    totalFinal: 0,
    fechaCreacion: '2026-06-05T00:00:00.000Z',
    ...overrides,
  };
}

describe('calcularDescuentoEPP', () => {
  it('debería retornar 0 si totalQuimicas es 0', () => {
    expect(calcularDescuentoEPP(100000, 0, 5)).toBe(0);
  });

  it('debería retornar 0 si quimicasCubiertas es 0', () => {
    expect(calcularDescuentoEPP(100000, 10, 0)).toBe(0);
  });

  it('debería retornar 0 si totalQuimicas es negativo', () => {
    expect(calcularDescuentoEPP(100000, -5, 3)).toBe(0);
  });

  it('debería retornar 0 si quimicasCubiertas es negativo', () => {
    expect(calcularDescuentoEPP(100000, 10, -2)).toBe(0);
  });

  it('debería calcular el descuento correctamente', () => {
    // precioRegular=100000, totalQuimicas=10, cubiertas=5
    // valorPorQuimica = 100000/10 = 10000
    // descuento = 10000 * 0.70 * 5 = 35000
    expect(calcularDescuentoEPP(100000, 10, 5)).toBe(35000);
  });

  it('debería clampar cubiertas al total si es mayor', () => {
    // cubiertas=15 > totalQuimicas=10, se usa 10
    // valorPorQuimica = 100000/10 = 10000
    // descuento = 10000 * 0.70 * 10 = 70000
    expect(calcularDescuentoEPP(100000, 10, 15)).toBe(70000);
  });

  it('debería manejar totalQuimicas=1', () => {
    // valorPorQuimica = 50000/1 = 50000
    // descuento = 50000 * 0.70 * 1 = 35000
    expect(calcularDescuentoEPP(50000, 1, 1)).toBe(35000);
  });
});

describe('calcularItem', () => {
  describe('descuento SIM', () => {
    it('debería aplicar descuento SIM correctamente', () => {
      const item = makeItem({
        precioRegular: 50000,
        precioSim: 42000,
        tipoDescuento: 'SIM',
        cantidad: 1,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(8000);
      expect(result.precioFinal).toBe(42000);
    });

    it('debería multiplicar por cantidad', () => {
      const item = makeItem({
        precioRegular: 50000,
        precioSim: 42000,
        tipoDescuento: 'SIM',
        cantidad: 3,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(24000);
      expect(result.precioFinal).toBe(126000);
    });

    it('debería retornar 0 descuento si precioSim es null', () => {
      const item = makeItem({
        precioRegular: 50000,
        precioSim: null,
        tipoDescuento: 'SIM',
        cantidad: 1,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(0);
      expect(result.precioFinal).toBe(50000);
    });
  });

  describe('descuento PERSONALIZADO', () => {
    it('debería aplicar porcentaje correctamente', () => {
      const item = makeItem({
        precioRegular: 100000,
        precioSim: null,
        tipoDescuento: 'PERSONALIZADO',
        porcentajeDescuento: 15,
        cantidad: 1,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(15000);
      expect(result.precioFinal).toBe(85000);
    });

    it('debería manejar 0% de descuento', () => {
      const item = makeItem({
        precioRegular: 50000,
        tipoDescuento: 'PERSONALIZADO',
        porcentajeDescuento: 0,
        cantidad: 1,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(0);
      expect(result.precioFinal).toBe(50000);
    });

    it('debería manejar 100% de descuento (precio a 0)', () => {
      const item = makeItem({
        precioRegular: 50000,
        tipoDescuento: 'PERSONALIZADO',
        porcentajeDescuento: 100,
        cantidad: 1,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(50000);
      expect(result.precioFinal).toBe(0);
    });

    it('debería clampar precio a 0 si porcentaje > 100%', () => {
      const item = makeItem({
        precioRegular: 50000,
        tipoDescuento: 'PERSONALIZADO',
        porcentajeDescuento: 150,
        cantidad: 1,
      });
      const result = calcularItem(item);
      expect(result.precioFinal).toBe(0);
    });

    it('debería multiplicar por cantidad', () => {
      const item = makeItem({
        precioRegular: 100000,
        tipoDescuento: 'PERSONALIZADO',
        porcentajeDescuento: 10,
        cantidad: 2,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(20000);
      expect(result.precioFinal).toBe(180000);
    });
  });

  describe('descuento EPP', () => {
    it('debería calcular descuento EPP correctamente', () => {
      const item = makeItem({
        precioRegular: 100000,
        tipoDescuento: 'EPP',
        totalQuimicas: 10,
        quimicasCubiertas: 5,
        cantidad: 1,
      });
      const result = calcularItem(item);
      // descuentoEPP unitario = 35000
      expect(result.valorDescuento).toBe(35000);
      expect(result.precioFinal).toBe(65000);
    });
  });

  describe('sin descuento (NINGUNO)', () => {
    it('debería mantener precio regular sin descuento', () => {
      const item = makeItem({
        precioRegular: 50000,
        tipoDescuento: 'NINGUNO',
        cantidad: 1,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(0);
      expect(result.precioFinal).toBe(50000);
    });
  });

  describe('edge cases', () => {
    it('debería manejar precioRegular de 0', () => {
      const item = makeItem({
        precioRegular: 0,
        tipoDescuento: 'NINGUNO',
        cantidad: 1,
      });
      const result = calcularItem(item);
      expect(result.valorDescuento).toBe(0);
      expect(result.precioFinal).toBe(0);
    });

    it('debería manejar cantidad máxima (999)', () => {
      const item = makeItem({
        precioRegular: 1000,
        tipoDescuento: 'NINGUNO',
        cantidad: 999,
      });
      const result = calcularItem(item);
      expect(result.precioFinal).toBe(999000);
    });
  });
});

describe('recalcularItem', () => {
  it('debería actualizar valorDescuento y precioFinal', () => {
    const item = makeItem({
      precioRegular: 50000,
      precioSim: 42000,
      tipoDescuento: 'SIM',
      cantidad: 1,
      valorDescuento: 0,
      precioFinal: 50000,
    });
    const recalculado = recalcularItem(item);
    expect(recalculado.valorDescuento).toBe(8000);
    expect(recalculado.precioFinal).toBe(42000);
  });

  it('debería calcular descuentoEPP cuando tipo es EPP', () => {
    const item = makeItem({
      precioRegular: 100000,
      tipoDescuento: 'EPP',
      totalQuimicas: 10,
      quimicasCubiertas: 5,
      cantidad: 1,
    });
    const recalculado = recalcularItem(item);
    expect(recalculado.descuentoEPP).toBe(35000);
  });

  it('debería poner descuentoEPP en 0 cuando tipo no es EPP', () => {
    const item = makeItem({
      tipoDescuento: 'SIM',
      descuentoEPP: 5000,
    });
    const recalculado = recalcularItem(item);
    expect(recalculado.descuentoEPP).toBe(0);
  });
});

describe('recalcularTotales', () => {
  it('debería retornar 0 para lista vacía', () => {
    const totals = recalcularTotales([]);
    expect(totals.totalSinDescuento).toBe(0);
    expect(totals.totalDescuentos).toBe(0);
    expect(totals.totalFinal).toBe(0);
  });

  it('debería calcular totales para un ítem', () => {
    const items = [makeItem({ precioRegular: 50000, cantidad: 1, valorDescuento: 8000, precioFinal: 42000 })];
    const totals = recalcularTotales(items);
    expect(totals.totalSinDescuento).toBe(50000);
    expect(totals.totalDescuentos).toBe(8000);
    expect(totals.totalFinal).toBe(42000);
  });

  it('debería calcular totales para múltiples ítems', () => {
    const items = [
      makeItem({ precioRegular: 50000, cantidad: 2, valorDescuento: 16000, precioFinal: 84000 }),
      makeItem({ precioRegular: 30000, cantidad: 1, valorDescuento: 0, precioFinal: 30000 }),
    ];
    const totals = recalcularTotales(items);
    expect(totals.totalSinDescuento).toBe(130000); // 100000 + 30000
    expect(totals.totalDescuentos).toBe(16000);
    expect(totals.totalFinal).toBe(114000);
  });
});

describe('crearItemDesdeServicio', () => {
  const servicio = {
    nombre: 'Consulta General',
    categoria: 'CONSULTA',
    descripcion: 'Evaluación completa',
    proveedor: 'Vet Ruffy',
    ciudad: 'Santa Marta',
    modoServicio: 'AMBOS',
  };

  it('debería crear ítem con descuento SIM si precioSim tiene valor', () => {
    const item = crearItemDesdeServicio('srv_001', servicio, 50000, 42000);
    expect(item.tipoDescuento).toBe('SIM');
    expect(item.cantidad).toBe(1);
    expect(item.precioRegular).toBe(50000);
    expect(item.precioSim).toBe(42000);
    expect(item.valorDescuento).toBe(8000);
    expect(item.precioFinal).toBe(42000);
  });

  it('debería crear ítem con NINGUNO si precioSim es null', () => {
    const item = crearItemDesdeServicio('srv_001', servicio, 50000, null);
    expect(item.tipoDescuento).toBe('NINGUNO');
    expect(item.valorDescuento).toBe(0);
    expect(item.precioFinal).toBe(50000);
  });

  it('debería generar ID único', () => {
    const item1 = crearItemDesdeServicio('srv_001', servicio, 50000, null);
    const item2 = crearItemDesdeServicio('srv_001', servicio, 50000, null);
    expect(item1.id).not.toBe(item2.id);
  });

  it('debería tener cantidad 1 por defecto', () => {
    const item = crearItemDesdeServicio('srv_001', servicio, 50000, null);
    expect(item.cantidad).toBe(1);
  });
});

describe('generarTextoBasico', () => {
  it('debería generar texto con formato básico', () => {
    const q = makeQuotation({
      items: [makeItem({ precioRegular: 50000, precioFinal: 42000, valorDescuento: 8000, cantidad: 1 })],
      totalSinDescuento: 50000,
      totalDescuentos: 8000,
      totalFinal: 42000,
    });
    const texto = generarTextoBasico(q);
    expect(texto).toContain('COTIZACIÓN');
    expect(texto).toContain('Ciudad: Santa Marta');
    expect(texto).toContain('Veterinaria: Veterinaria Ruffy');
    expect(texto).toContain('Cliente: Juan Pérez');
    expect(texto).toContain('Fecha: 05/06/2026');
    expect(texto).toContain('Consulta General');
    expect(texto).toContain('Total a pagar:');
    expect(texto).toContain('Ahorro total:');
  });

  it('debería incluir cantidad si es > 1', () => {
    const q = makeQuotation({
      items: [makeItem({ cantidad: 3, precioRegular: 10000, precioFinal: 30000, valorDescuento: 0 })],
      totalSinDescuento: 30000,
      totalFinal: 30000,
    });
    const texto = generarTextoBasico(q);
    expect(texto).toContain('×3');
  });

  it('no debería incluir cantidad si es 1', () => {
    const q = makeQuotation({
      items: [makeItem({ cantidad: 1, precioRegular: 10000, precioFinal: 10000, valorDescuento: 0 })],
      totalSinDescuento: 10000,
      totalFinal: 10000,
    });
    const texto = generarTextoBasico(q);
    expect(texto).not.toContain('×1');
  });

  it('debería incluir [Plus] para items EPP', () => {
    const q = makeQuotation({
      items: [makeItem({ tipoDescuento: 'EPP', precioRegular: 100000, precioFinal: 65000, valorDescuento: 35000 })],
      totalSinDescuento: 100000,
      totalDescuentos: 35000,
      totalFinal: 65000,
    });
    const texto = generarTextoBasico(q);
    expect(texto).toContain('[Plus]');
  });

  it('debería incluir comentarios si existen', () => {
    const q = makeQuotation({ comentarios: 'Vigencia 30 días' });
    const texto = generarTextoBasico(q);
    expect(texto).toContain('Comentarios: Vigencia 30 días');
  });

  it('no debería incluir línea de ahorro si totalDescuentos es 0', () => {
    const q = makeQuotation({
      items: [makeItem({ precioRegular: 50000, precioFinal: 50000, valorDescuento: 0 })],
      totalSinDescuento: 50000,
      totalDescuentos: 0,
      totalFinal: 50000,
    });
    const texto = generarTextoBasico(q);
    expect(texto).not.toContain('Ahorro total');
  });

  it('debería generar texto sin clinica ni cliente si están vacíos', () => {
    const q = makeQuotation({ clinicaNombre: '', clienteNombre: '' });
    const texto = generarTextoBasico(q);
    expect(texto).not.toContain('Veterinaria:');
    expect(texto).not.toContain('Cliente:');
  });
});

describe('generarTextoDetallado', () => {
  it('debería incluir categorías y descripciones', () => {
    const q = makeQuotation({
      items: [makeItem({
        servicio: {
          nombre: 'Análisis de Sangre',
          categoria: 'LABORATORIO',
          descripcion: 'Biometría hemática completa',
          proveedor: 'Vet Ruffy',
          ciudad: 'Santa Marta',
          modoServicio: 'EN_SEDE',
        },
        precioRegular: 35000,
        precioSim: null,
        tipoDescuento: 'NINGUNO',
        precioFinal: 35000,
        valorDescuento: 0,
      })],
      totalSinDescuento: 35000,
      totalFinal: 35000,
    });
    const texto = generarTextoDetallado(q);
    expect(texto).toContain('COTIZACIÓN DETALLADA');
    expect(texto).toContain('Categoría: Laboratorio');
    expect(texto).toContain('Descripción: Biometría hemática completa');
    expect(texto).toContain('Sin descuento aplicado');
  });

  it('debería incluir porcentaje para PERSONALIZADO', () => {
    const q = makeQuotation({
      items: [makeItem({
        tipoDescuento: 'PERSONALIZADO',
        porcentajeDescuento: 20,
        precioRegular: 100000,
        precioFinal: 80000,
        valorDescuento: 20000,
      })],
      totalSinDescuento: 100000,
      totalDescuentos: 20000,
      totalFinal: 80000,
    });
    const texto = generarTextoDetallado(q);
    expect(texto).toContain('Porcentaje: 20%');
  });

  it('debería incluir detalles EPP', () => {
    const q = makeQuotation({
      items: [makeItem({
        tipoDescuento: 'EPP',
        precioRegular: 100000,
        totalQuimicas: 10,
        quimicasCubiertas: 5,
        descuentoEPP: 35000,
        precioFinal: 65000,
        valorDescuento: 35000,
      })],
      totalSinDescuento: 100000,
      totalDescuentos: 35000,
      totalFinal: 65000,
    });
    const texto = generarTextoDetallado(q);
    expect(texto).toContain('Total químicas: 10');
    expect(texto).toContain('Químicas cubiertas: 5');
  });
});

describe('generarMensajeResumen', () => {
  it('debería generar formato compacto con veterinaria y titular', () => {
    const q = makeQuotation({
      items: [makeItem({ precioRegular: 50000, precioFinal: 42000, valorDescuento: 8000, cantidad: 1 })],
      totalSinDescuento: 50000,
      totalDescuentos: 8000,
      totalFinal: 42000,
    });
    const texto = generarMensajeResumen(q);
    expect(texto).toContain('Cotización - 05/06/2026');
    expect(texto).toContain('Veterinaria: Veterinaria Ruffy');
    expect(texto).toContain('Titular: Juan Pérez');
    expect(texto).toContain('Consulta General');
    expect(texto).toContain('Total:');
    expect(texto).toContain('Ahorro:');
  });

  it('debería incluir cantidad si es > 1', () => {
    const q = makeQuotation({
      items: [makeItem({ cantidad: 3, precioRegular: 10000, precioFinal: 30000, valorDescuento: 0 })],
      totalSinDescuento: 30000,
      totalFinal: 30000,
    });
    const texto = generarMensajeResumen(q);
    expect(texto).toContain('×3');
  });

  it('debería generar texto sin veterinaria ni titular si están vacíos', () => {
    const q = makeQuotation({ clinicaNombre: '', clienteNombre: '' });
    const texto = generarMensajeResumen(q);
    expect(texto).not.toContain('Veterinaria:');
    expect(texto).not.toContain('Titular:');
  });

  it('no debería incluir ahorro si no hay descuentos', () => {
    const q = makeQuotation({
      items: [makeItem({ precioRegular: 50000, precioFinal: 50000, valorDescuento: 0 })],
      totalSinDescuento: 50000,
      totalDescuentos: 0,
      totalFinal: 50000,
    });
    const texto = generarMensajeResumen(q);
    expect(texto).not.toContain('Ahorro:');
  });

  it('debería manejar lista vacía de items', () => {
    const q = makeQuotation({ items: [] });
    const texto = generarMensajeResumen(q);
    expect(texto).toContain('Cotización - 05/06/2026');
    expect(texto).toContain('Total:');
  });
});
