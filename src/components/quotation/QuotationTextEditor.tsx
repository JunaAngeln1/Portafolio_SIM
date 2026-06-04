'use client';

import React, { useState } from 'react';
import { useQuotation } from '@/lib/quotationStore';
import { Copy, Check, RotateCcw } from 'lucide-react';

export default function QuotationTextEditor() {
  const { textoGenerado, copiarAlPortapapeles, viewMode } = useQuotation();
  const [copiado, setCopiado] = useState(false);
  const [textoEditado, setTextoEditado] = useState<string | null>(null);

  const textoVisible = textoEditado !== null ? textoEditado : textoGenerado;

  const handleCopiar = async () => {
    const textoACopiar = textoEditado !== null ? textoEditado : textoGenerado;
    try {
      await navigator.clipboard.writeText(textoACopiar);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textoACopiar;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleReset = () => {
    setTextoEditado(null);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={textoVisible}
          onChange={(e) => setTextoEditado(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm text-gray-700 resize-none bg-gray-50"
          placeholder="El texto se generará automáticamente..."
        />
        {textoEditado !== null && (
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 p-1.5 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors"
            title="Restaurar texto original"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {viewMode === 'basico' ? 'Vista Cliente' : 'Vista Registro'} · 
          {textoEditado !== null ? ' Editado' : ' Auto-generado'}
        </p>
        <button
          onClick={handleCopiar}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            copiado
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-primary text-white hover:bg-primary-dark'
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
              Copiar al portapapeles
            </>
          )}
        </button>
      </div>
    </div>
  );
}
