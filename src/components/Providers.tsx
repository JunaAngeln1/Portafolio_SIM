'use client';

import { ReactNode } from 'react';
import { AppProvider } from '@/lib/store';
import { QuotationProvider } from '@/lib/quotationStore';
import { AuthProvider } from '@/components/AuthProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <QuotationProvider>
          {children}
        </QuotationProvider>
      </AppProvider>
    </AuthProvider>
  );
}
