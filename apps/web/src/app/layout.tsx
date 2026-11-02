import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '../providers/query-provider';
import { AuthProvider } from '../providers/auth-provider';

export const metadata: Metadata = {
  title: 'Shopnix — Premium Ecommerce Operations & Management',
  description:
    'Comprehensive multi-tenant SaaS for Bangladeshi e-commerce merchants. Integrated orders, inventory, customers, and automated courier fulfillment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
