'use client';

import { ReactNode } from 'react';
import { AppProvider } from '@/lib/store';
import { QuotationProvider } from '@/lib/quotationStore';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <QuotationProvider>
        {children}
      </QuotationProvider>
    </AppProvider>
  );
}
