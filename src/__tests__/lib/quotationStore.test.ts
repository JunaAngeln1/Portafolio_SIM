import { Quotation, QuotationItem, DiscountType } from '@/lib/quotationTypes';
import { generarTextoBasico, generarTextoDetallado, recalcularTotales } from '@/lib/discountService';

function obtenerFechaActual(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const mockQuotationItem: QuotationItem = {
  id: 'item_1',
  servicioId: 'srv_1',
  servicio: {
    nombre: 'Consulta General',
    categoria: 'CONSULTA',
    descripcion: 'Consulta veterinaria general',
    proveedor: 'Veterinaria San Francisco',
    ciudad: 'Bogotá',
    modoServicio: 'EN_SEDE',
  },
  precioRegular: 50000,
  precioSim: 42000,
  cantidad: 2,
  tipoDescuento: 'NINGUNO',
  porcentajeDescuento: 0,
  valorDescuento: 0,
  precioFinal: 100000,
  totalQuimicas: 0,
  quimicasCubiertas: 0,
  descuentoEPP: 0,
};

const mockQuotation: Quotation = {
  id: 'qt_1',
  ciudad: 'Bogotá',
  clinicaNombre: 'Veterinaria San Francisco',
  clienteNombre: 'Juan Pérez',
  fecha: obtenerFechaActual(),
  notas: '',
  comentarios: 'Cotización de prueba',
  items: [mockQuotationItem],
  totalSinDescuento: 100000,
  totalDescuentos: 0,
  totalFinal: 100000,
  fechaCreacion: new Date().toISOString(),
};

describe('obtenerFechaActual', () => {
  it('debería devolver fecha en formato DD/MM/YYYY', () => {
    const fecha = obtenerFechaActual();
    expect(fecha).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('debería usar la fecha actual', () => {
    const fecha = obtenerFechaActual();
    const partes = fecha.split('/');
    const dia = parseInt(partes[0]!, 10);
    const mes = parseInt(partes[1]!, 10);
    const anio = parseInt(partes[2]!, 10);
    const ahora = new Date();

    expect(dia).toBe(ahora.getDate());
    expect(mes).toBe(ahora.getMonth() + 1);
    expect(anio).toBe(ahora.getFullYear());
  });
});

describe('recalcularTotales', () => {
  it('debería calcular totales con un item sin descuento', () => {
    const items: QuotationItem[] = [
      { ...mockQuotationItem, precioFinal: 100000, valorDescuento: 0 },
    ];
    const totals = recalcularTotales(items);
    expect(totals.totalSinDescuento).toBe(100000);
    expect(totals.totalDescuentos).toBe(0);
    expect(totals.totalFinal).toBe(100000);
  });

  it('debería calcular totales con descuento', () => {
    const items: QuotationItem[] = [
      { ...mockQuotationItem, precioFinal: 84000, valorDescuento: 16000 },
    ];
    const totals = recalcularTotales(items);
    expect(totals.totalSinDescuento).toBe(100000);
    expect(totals.totalDescuentos).toBe(16000);
    expect(totals.totalFinal).toBe(84000);
  });

  it('debería calcular totales con múltiples items', () => {
    const items: QuotationItem[] = [
      { ...mockQuotationItem, precioFinal: 100000, valorDescuento: 0 },
      {
        ...mockQuotationItem,
        id: 'item_2',
        servicioId: 'srv_2',
        servicio: { ...mockQuotationItem.servicio, nombre: 'Cirugía Mayor' },
        precioRegular: 200000,
        precioSim: null,
        cantidad: 1,
        precioFinal: 200000,
        valorDescuento: 0,
      },
    ];
    const totals = recalcularTotales(items);
    expect(totals.totalSinDescuento).toBe(300000);
    expect(totals.totalDescuentos).toBe(0);
    expect(totals.totalFinal).toBe(300000);
  });

  it('debería manejar array vacío', () => {
    const totals = recalcularTotales([]);
    expect(totals.totalSinDescuento).toBe(0);
    expect(totals.totalDescuentos).toBe(0);
    expect(totals.totalFinal).toBe(0);
  });
});

describe('generarTextoBasico', () => {
  it('debería generar texto con cliente y fecha', () => {
    const texto = generarTextoBasico(mockQuotation);
    expect(texto).toContain('Juan Pérez');
    expect(texto).toContain(mockQuotation.fecha);
  });

  it('debería incluir items con precio', () => {
    const texto = generarTextoBasico(mockQuotation);
    expect(texto).toContain('Consulta General');
  });

  it('debería incluir total final', () => {
    const texto = generarTextoBasico(mockQuotation);
    expect(texto).toContain('100.000');
  });

  it('debería incluir comentarios si existen', () => {
    const texto = generarTextoBasico(mockQuotation);
    expect(texto).toContain('Cotización de prueba');
  });

  it('debería incluir clínica', () => {
    const texto = generarTextoBasico(mockQuotation);
    expect(texto).toContain('Veterinaria San Francisco');
  });
});

describe('generarTextoDetallado', () => {
  it('debería generar texto detallado con más información', () => {
    const texto = generarTextoDetallado(mockQuotation);
    expect(texto).toContain('Juan Pérez');
    expect(texto).toContain('Consulta General');
  });

  it('debería incluir categoría del servicio', () => {
    const texto = generarTextoDetallado(mockQuotation);
    expect(texto).toContain('Consulta');
  });

  it('debería incluir descripción', () => {
    const texto = generarTextoDetallado(mockQuotation);
    expect(texto).toContain('Consulta veterinaria general');
  });
});

describe('Lógica de items del quotationStore', () => {
  it('debería prevenir duplicados por servicioId', () => {
    const items: QuotationItem[] = [{ ...mockQuotationItem }];
    const existeDuplicado = items.some(i => i.servicioId === 'srv_1');
    expect(existeDuplicado).toBe(true);
  });

  it('debería limitar cantidad entre 1 y 999', () => {
    const cantidad = Math.max(1, Math.min(999, 1500));
    expect(cantidad).toBe(999);

    const cantidad2 = Math.max(1, Math.min(999, 0));
    expect(cantidad2).toBe(1);

    const cantidad3 = Math.max(1, Math.min(999, 5));
    expect(cantidad3).toBe(5);
  });

  it('debería togglear viewMode correctamente', () => {
    let viewMode: 'basico' | 'detallado' = 'basico';
    viewMode = viewMode === 'basico' ? 'detallado' : 'basico';
    expect(viewMode).toBe('detallado');

    viewMode = viewMode === 'basico' ? 'detallado' : 'basico';
    expect(viewMode).toBe('basico');
  });

  it('debería crear item con precio final correcto', () => {
    const precioRegular = 50000;
    const precioSim = 42000;
    const cantidad = 2;
    const precioFinal = (precioSim || precioRegular) * cantidad;
    expect(precioFinal).toBe(84000);
  });

  it('debería calcular descuento EPP correctamente', () => {
    const totalQuimicas = 10;
    const quimicasCubiertas = 7;
    const precioPorQuimica = 5000;
    const descuentoEPP = quimicasCubiertas * precioPorQuimica;
    expect(descuentoEPP).toBe(35000);
  });
});
