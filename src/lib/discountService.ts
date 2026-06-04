import { QuotationItem, Quotation, QuotationTotals, DiscountType } from './quotationTypes';

export function calcularItem(item: QuotationItem): { valorDescuento: number; precioFinal: number } {
  let precioUnitario = item.precioRegular;
  let descuentoUnitario = 0;

  if (item.tipoDescuento === 'SIM' && item.precioSim !== null) {
    descuentoUnitario = item.precioRegular - item.precioSim;
    precioUnitario = item.precioSim;
  } else if (item.tipoDescuento === 'PERSONALIZADO') {
    descuentoUnitario = item.precioRegular * (item.porcentajeDescuento / 100);
    precioUnitario = item.precioRegular - descuentoUnitario;
  }

  return {
    valorDescuento: descuentoUnitario * item.cantidad,
    precioFinal: precioUnitario * item.cantidad,
  };
}

export function recalcularItem(item: QuotationItem): QuotationItem {
  const resultado = calcularItem(item);
  return { ...item, valorDescuento: resultado.valorDescuento, precioFinal: resultado.precioFinal };
}

export function recalcularTotales(items: QuotationItem[]): QuotationTotals {
  const totalSinDescuento = items.reduce((sum, item) => sum + (item.precioRegular * item.cantidad), 0);
  const totalDescuentos = items.reduce((sum, item) => sum + item.valorDescuento, 0);
  const totalFinal = totalSinDescuento - totalDescuentos;
  return { totalSinDescuento, totalDescuentos, totalFinal };
}

export function crearItemDesdeServicio(servicioId: string, servicio: QuotationItem['servicio'], precioRegular: number, precioSim: number | null): QuotationItem {
  const item: QuotationItem = {
    id: `qi_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    servicioId,
    servicio,
    precioRegular,
    precioSim,
    cantidad: 1,
    tipoDescuento: precioSim ? 'SIM' : 'NINGUNO',
    porcentajeDescuento: 0,
    valorDescuento: 0,
    precioFinal: precioRegular,
  };
  const resultado = calcularItem(item);
  return { ...item, valorDescuento: resultado.valorDescuento, precioFinal: resultado.precioFinal };
}

const categoryLabels: Record<string, string> = {
  CONSULTA: 'Consulta',
  CIRUGIA: 'Cirugía',
  LABORATORIO: 'Laboratorio',
  IMAGENES: 'Imágenes',
  VACUNAS: 'Vacunas',
  PROCEDIMIENTOS: 'Procedimientos',
};

const discountTypeLabels: Record<string, string> = {
  SIM: 'Precio SIM',
  PERSONALIZADO: 'Personalizado',
};

export function generarTextoBasico(q: Quotation): string {
  const lineas: string[] = [];
  lineas.push('COTIZACIÓN');
  lineas.push('');
  lineas.push(`Ciudad: ${q.ciudad}`);
  if (q.clinicaNombre) lineas.push(`Veterinaria: ${q.clinicaNombre}`);
  if (q.clienteNombre) lineas.push(`Cliente: ${q.clienteNombre}`);
  lineas.push(`Fecha: ${q.fecha}`);
  lineas.push('');
  lineas.push('Servicios:');

  q.items.forEach((item, i) => {
    const precioReg = formatearMoneda(item.precioRegular);
    const subtotal = formatearMoneda(item.precioFinal);
    const cantStr = item.cantidad > 1 ? ` ×${item.cantidad}` : '';
    if (item.valorDescuento > 0) {
      const ahorro = formatearMoneda(item.valorDescuento);
      lineas.push(`${i + 1}. ${item.servicio.nombre}${cantStr} ... ${precioReg} → ${subtotal} (Ahorro: ${ahorro})`);
    } else {
      lineas.push(`${i + 1}. ${item.servicio.nombre}${cantStr} ... ${subtotal}`);
    }
  });

  lineas.push('');
  lineas.push(`Total a pagar: ${formatearMoneda(q.totalFinal)}`);

  if (q.totalDescuentos > 0) {
    lineas.push(`Ahorro total: ${formatearMoneda(q.totalDescuentos)} ✓`);
  }

  if (q.comentarios) {
    lineas.push('');
    lineas.push(`Comentarios: ${q.comentarios}`);
  }

  if (q.notas) {
    lineas.push('');
    lineas.push(q.notas);
  }

  return lineas.join('\n');
}

export function generarTextoDetallado(q: Quotation): string {
  const lineas: string[] = [];
  lineas.push('═══════════════════════════════');
  lineas.push('   COTIZACIÓN DETALLADA');
  lineas.push('═══════════════════════════════');
  lineas.push('');
  lineas.push(`Ciudad: ${q.ciudad}`);
  if (q.clinicaNombre) lineas.push(`Veterinaria: ${q.clinicaNombre}`);
  if (q.clienteNombre) lineas.push(`Cliente: ${q.clienteNombre}`);
  lineas.push(`Fecha: ${q.fecha}`);
  lineas.push('');
  lineas.push('───────────────────────────────');

  q.items.forEach((item, i) => {
    lineas.push('');
    lineas.push(`${i + 1}. ${item.servicio.nombre}`);
    lineas.push(`   Categoría: ${categoryLabels[item.servicio.categoria] || item.servicio.categoria}`);
    if (item.servicio.descripcion) {
      lineas.push(`   Descripción: ${item.servicio.descripcion}`);
    }
    lineas.push(`   Veterinaria: ${item.servicio.proveedor}`);
    lineas.push(`   Ciudad: ${item.servicio.ciudad}`);
    lineas.push('');
    lineas.push(`   Precio unitario: ${formatearMoneda(item.precioRegular)}`);
    lineas.push(`   Cantidad: ${item.cantidad}`);
    lineas.push(`   Subtotal: ${formatearMoneda(item.precioRegular * item.cantidad)}`);
    lineas.push(`   Tipo descuento: ${discountTypeLabels[item.tipoDescuento] || 'Precio SIM'}`);

    if (item.tipoDescuento === 'PERSONALIZADO') {
      lineas.push(`   Porcentaje: ${item.porcentajeDescuento}%`);
    }
    if (item.precioSim) {
      lineas.push(`   Precio SIM unitario: ${formatearMoneda(item.precioSim)}`);
    }
    if (item.valorDescuento > 0) {
      lineas.push(`   Descuento total: -${formatearMoneda(item.valorDescuento)}`);
    } else {
      lineas.push(`   Sin descuento aplicado`);
    }
    lineas.push(`   ► Precio final: ${formatearMoneda(item.precioFinal)}`);
  });

  lineas.push('');
  lineas.push('───────────────────────────────');
  lineas.push('RESUMEN');
  lineas.push('───────────────────────────────');
  lineas.push(`Subtotal:          ${formatearMoneda(q.totalSinDescuento)}`);
  lineas.push(`Descuentos:        -${formatearMoneda(q.totalDescuentos)}`);
  lineas.push(`TOTAL A PAGAR:     ${formatearMoneda(q.totalFinal)}`);

  if (q.totalDescuentos > 0) {
    lineas.push(`Ahorro total:      ${formatearMoneda(q.totalDescuentos)}`);
  }

  if (q.comentarios) {
    lineas.push('');
    lineas.push(`Comentarios: ${q.comentarios}`);
  }

  if (q.notas) {
    lineas.push('');
    lineas.push(`Notas: ${q.notas}`);
  }

  lineas.push('═══════════════════════════════');
  return lineas.join('\n');
}

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}
