'use client';

import React from 'react';
import { useQuotation } from '@/lib/quotationStore';
import { Eye, FileText } from 'lucide-react';

export default function ViewToggle() {
  const { viewMode, toggleViewMode } = useQuotation();

  return (
    <div className="flex items-center bg-gray-100 rounded-xl p-1">
      <button
        onClick={() => viewMode !== 'basico' && toggleViewMode()}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          viewMode === 'basico'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Eye className="w-4 h-4" />
        Cliente
      </button>
      <button
        onClick={() => viewMode !== 'detallado' && toggleViewMode()}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          viewMode === 'detallado'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <FileText className="w-4 h-4" />
        Registro
      </button>
    </div>
  );
}
