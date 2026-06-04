'use client';

import React from 'react';
import { useQuotation } from '@/lib/quotationStore';

export default function QuotationSummary() {
  const { clinicaNombre, clienteNombre, items, totalSinDescuento, totalDescuentos, totalFinal } = useQuotation();

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
  };

  const getDiscountLabel = (tipo: string, porcentaje: number) => {
    if (tipo === 'SIM') return 'SIM';
    if (tipo === 'PERSONALIZADO') return `${porcentaje}%`;
    return '';
  };

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-4 py-3">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Resumen de cotización</h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {clinicaNombre && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">Veterinaria</p>
              <p className="text-sm font-semibold text-primary">{clinicaNombre}</p>
            </div>
          )}
          {clienteNombre && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">Cliente</p>
              <p className="text-sm font-semibold text-gray-900">{clienteNombre}</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <div className="border-t border-border">
              <div className="grid grid-cols-12 gap-2 px-2 py-1.5 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                <div className="col-span-6">Servicio</div>
                <div className="col-span-3 text-center">Dcto.</div>
                <div className="col-span-3 text-right">Precio</div>
              </div>

              <div className="divide-y divide-border/50">
                {items.map(item => {
                  const desc = getDiscountLabel(item.tipoDescuento, item.porcentajeDescuento);
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center px-2 py-2">
                      <div className="col-span-6 text-sm text-gray-800 truncate">{item.servicio.nombre}</div>
                      <div className="col-span-3 text-center">
                        {desc && (
                          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            item.tipoDescuento === 'SIM'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {desc}
                          </span>
                        )}
                      </div>
                      <div className="col-span-3 text-right text-sm font-semibold text-gray-900">
                        {formatearPrecio(item.precioFinal)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-gray-500">Total sin descuento</span>
                <span className="text-sm font-medium text-gray-700">{formatearPrecio(totalSinDescuento)}</span>
              </div>
              <div className="flex items-center justify-between px-2 pt-2 border-t border-dashed border-border">
                <span className="text-base font-bold text-gray-900">Total con descuento</span>
                <span className="text-xl font-bold text-primary">{formatearPrecio(totalFinal)}</span>
              </div>
            </div>

            {totalDescuentos > 0 && (
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm shadow-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg">✓</span>
                  <span className="text-sm font-bold text-white uppercase tracking-wide">Ahorro total</span>
                </div>
                <span className="text-xl font-black text-white">{formatearPrecio(totalDescuentos)}</span>
              </div>
            )}
          </>
        )}

        {items.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">Agrega servicios para ver el resumen</p>
        )}
      </div>
    </div>
  );
}
