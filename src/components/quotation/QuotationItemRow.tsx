'use client';

import React from 'react';
import { QuotationItem } from '@/lib/quotationTypes';
import { useQuotation } from '@/lib/quotationStore';
import CategoryBadge from '@/components/portfolio/CategoryBadge';
import { Trash2, Minus, Plus } from 'lucide-react';

interface QuotationItemRowProps {
  item: QuotationItem;
}

export default function QuotationItemRow({ item }: QuotationItemRowProps) {
  const { beneficioPlus, eliminarItem, setCantidad, setTipoDescuento, setQuimicasFields } = useQuotation();

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
  };

  const handleTogglePersonalizado = () => {
    if (item.tipoDescuento === 'PERSONALIZADO') {
      setTipoDescuento(item.id, 'SIM');
    } else {
      setTipoDescuento(item.id, 'PERSONALIZADO', 10);
    }
  };

  const handlePorcentajeChange = (valor: number) => {
    const clamped = Math.max(0, Math.min(100, valor));
    setTipoDescuento(item.id, 'PERSONALIZADO', clamped);
  };

  const handleTotalQuimicasChange = (valor: number) => {
    const total = Math.max(1, Math.min(99, valor));
    setQuimicasFields(item.id, total, item.quimicasCubiertas);
  };

  const handleCubiertasChange = (valor: number) => {
    const cubiertas = Math.max(0, Math.min(item.totalQuimicas, valor));
    setQuimicasFields(item.id, item.totalQuimicas, cubiertas);
  };

  const tieneSim = item.precioSim !== null;
  const esLaboratorio = item.servicio.categoria === 'LABORATORIO';
  const mostrarCamposEPP = beneficioPlus && esLaboratorio;

  return (
    <div className="bg-white border border-border rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <CategoryBadge categoria={item.servicio.categoria} size="sm" />
          <span className="font-medium text-gray-900 text-sm leading-snug">{item.servicio.nombre}</span>
        </div>
        <button
          onClick={() => eliminarItem(item.id)}
          className="p-1 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          title="Eliminar"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
        </button>
      </div>

      <p className="text-xs text-gray-400">{item.servicio.proveedor}</p>

      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-gray-900">{formatearPrecio(item.precioRegular)}</span>
        {tieneSim && (
          <>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-emerald-600">{formatearPrecio(item.precioSim!)}</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePersonalizado}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              item.tipoDescuento === 'PERSONALIZADO'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Dct.manual
          </button>
          {item.tipoDescuento === 'PERSONALIZADO' && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={item.porcentajeDescuento}
                onChange={(e) => handlePorcentajeChange(Number(e.target.value))}
                min={0}
                max={100}
                className="w-12 px-1.5 py-0.5 border border-border rounded text-xs text-center focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <span className="text-xs text-gray-400">%</span>
            </div>
          )}
        </div>
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => setCantidad(item.id, item.cantidad - 1)}
            disabled={item.cantidad <= 1}
            className="p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3 h-3 text-gray-600" />
          </button>
          <input
            type="number"
            value={item.cantidad}
            onChange={(e) => setCantidad(item.id, Number(e.target.value))}
            min={1}
            max={999}
            className="w-8 px-0.5 py-0.5 text-center text-xs font-medium border-x border-border focus:ring-0 focus:border-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => setCantidad(item.id, item.cantidad + 1)}
            disabled={item.cantidad >= 999}
            className="p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>

      {mostrarCamposEPP && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 space-y-2">
          <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">Beneficio Plus</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-emerald-700 font-medium block mb-0.5">Total químicas</label>
              <input
                type="number"
                value={item.totalQuimicas || ''}
                onChange={(e) => handleTotalQuimicasChange(Number(e.target.value))}
                placeholder="0"
                min={1}
                max={99}
                className="w-full px-2 py-1 border border-emerald-300 rounded text-xs text-center font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-emerald-700 font-medium block mb-0.5">Cubiertas</label>
              <input
                type="number"
                value={item.quimicasCubiertas || ''}
                onChange={(e) => handleCubiertasChange(Number(e.target.value))}
                placeholder="0"
                min={0}
                max={item.totalQuimicas}
                className="w-full px-2 py-1 border border-emerald-300 rounded text-xs text-center font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
              />
            </div>
          </div>
          {item.descuentoEPP > 0 && (
            <p className="text-xs font-semibold text-emerald-700 text-right">
              Ahorro EPP: -{formatearPrecio(item.descuentoEPP)}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-gray-500">Total</span>
        <span className="text-sm font-bold text-gray-900">{formatearPrecio(item.precioFinal)}</span>
      </div>
    </div>
  );
}
