import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIM Platform - Sistema Integral de Mascotas',
  description: 'Professional platform for veterinary portfolio management and digitalization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}