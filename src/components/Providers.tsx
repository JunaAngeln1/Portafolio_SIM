'use client';

import React from 'react';
import { AppProvider } from '@/lib/store';
import { QuotationProvider } from '@/lib/quotationStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <QuotationProvider>
        {children}
      </QuotationProvider>
    </AppProvider>
  );
}
