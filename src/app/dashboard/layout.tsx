'use client';

import { AppProvider } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}