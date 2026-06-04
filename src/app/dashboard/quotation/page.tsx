'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ServiceSelector from '@/components/quotation/ServiceSelector';
import QuotationPanel from '@/components/quotation/QuotationPanel';
import QuotationSummary from '@/components/quotation/QuotationSummary';

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

          <div className="lg:col-span-4">
            <QuotationSummary />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
