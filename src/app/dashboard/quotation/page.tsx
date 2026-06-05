'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ServiceSelector from '@/components/quotation/ServiceSelector';
import QuotationPanel from '@/components/quotation/QuotationPanel';
import QuotationSummary from '@/components/quotation/QuotationSummary';
import { useQuotation } from '@/lib/quotationStore';
import { generarMensajeResumen } from '@/lib/discountService';
import { Copy, Check } from 'lucide-react';

function CopiarCotizacionButton() {
  const { items, clinicaNombre, clienteNombre, fecha, totalSinDescuento, totalDescuentos, totalFinal } = useQuotation();
  const [copiado, setCopiado] = useState(false);

  const quotation = useMemo(() => ({
    id: `qt_${Date.now()}`,
    ciudad: '',
    clinicaNombre,
    clienteNombre,
    fecha,
    notas: '',
    comentarios: '',
    items,
    totalSinDescuento,
    totalDescuentos,
    totalFinal,
    fechaCreacion: new Date().toISOString(),
  }), [clinicaNombre, clienteNombre, fecha, items, totalSinDescuento, totalDescuentos, totalFinal]);

  const handleCopiar = async () => {
    const texto = generarMensajeResumen(quotation);
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = texto;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (items.length === 0) return null;

  return (
    <button
      onClick={handleCopiar}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
        copiado
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          : 'bg-primary text-white hover:bg-primary-dark shadow-sm'
      }`}
    >
      {copiado ? (
        <>
          <Check className="w-4 h-4" />
          ¡Copiado!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copiar Cotización
        </>
      )}
    </button>
  );
}

export default function QuotationPage() {
  return (
    <DashboardLayout titulo="Sistema de Cotizaciones">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ minHeight: 'calc(100vh - 180px)' }}>
          <div className="lg:col-span-4">
            <ServiceSelector />
          </div>

          <div className="lg:col-span-4">
            <QuotationPanel />
          </div>

          <div className="lg:col-span-4 space-y-3">
            <QuotationSummary />
            <CopiarCotizacionButton />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
