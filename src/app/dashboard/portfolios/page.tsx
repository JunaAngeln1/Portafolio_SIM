'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PortfolioTable from '@/components/portfolio/PortfolioTable';

export default function PortfoliosPage() {
  return (
    <DashboardLayout titulo="Portafolios">
      <PortfolioTable />
    </DashboardLayout>
  );
}