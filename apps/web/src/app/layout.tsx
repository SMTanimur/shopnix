import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '../providers/query-provider';
import { AuthProvider } from '../providers/auth-provider';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:5000'),
  title: {
    default: 'Shopnix — All-in-One Ecommerce Management & AI Automation Platform',
    template: '%s | Shopnix — Ecommerce OS',
  },
  description:
    'Manage ecommerce stores, products, orders, inventory, WhatsApp, Facebook Messenger, courier integrations, and AI-powered business automation with Shopnix.',
  applicationName: 'Shopnix',
  authors: [{ name: 'Shopnix Product & Engineering Team', url: 'https://shopnix.io' }],
  creator: 'Shopnix BD Technologies Ltd.',
  publisher: 'Shopnix',
  keywords: [
    'ecommerce management Bangladesh',
    'ecommerce operating system',
    'Steadfast courier API',
    'Pathao courier integration',
    'RedX courier dispatch',
    'COD remittance reconciliation',
    'WhatsApp ecommerce inbox',
    'AI ecommerce copywriter',
    '1-click COD funnels',
    'Shopify WooCommerce sync',
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/shopnix-icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/brand/shopnix-icon.svg' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shopnix.io',
    siteName: 'Shopnix',
    title: 'Shopnix — All-in-One Ecommerce Management & AI Automation Platform',
    description:
      'Manage ecommerce stores, products, orders, inventory, WhatsApp, Facebook Messenger, courier integrations, and AI-powered business automation with Shopnix.',
    images: [
      {
        url: '/brand/shopnix-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Shopnix — The 360° Ecommerce Operating System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopnix — All-in-One Ecommerce Management & AI Automation Platform',
    description:
      'Manage ecommerce stores, products, orders, inventory, WhatsApp, Facebook Messenger, courier integrations, and AI-powered business automation with Shopnix.',
    images: ['/brand/shopnix-logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://shopnix.io/#organization',
      name: 'Shopnix',
      url: 'https://shopnix.io',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shopnix.io/brand/shopnix-logo.svg',
      },
      description:
        'All-in-one ecommerce operating system: multi-store sync, WhatsApp omnichannel messaging, integrated call center, anti-fraud RTO scoring, multi-courier fulfillment, and AI automation.',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Shopnix Ecommerce Operating System',
      operatingSystem: 'Web-based Cloud SaaS',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '1499',
        priceCurrency: 'BDT',
      },
      description:
        'Unified SaaS for Bangladeshi and global ecommerce merchants. Ingest orders, dispatch to couriers, and automate WhatsApp sales.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
