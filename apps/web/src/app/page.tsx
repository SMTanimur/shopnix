import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  TrendingUp,
  Boxes,
  ShoppingCart,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Truck,
      title: 'Automated Courier Dispatch',
      description:
        'Native integrations with Steadfast, Pathao, RedX, and eCourier. Generate consignments, labels, and track shipments in 1-click.',
    },
    {
      icon: ShieldCheck,
      title: 'Anti-Fraud & Return Risk',
      description:
        'Detect serial returners and fake orders with phone intelligence and historical customer return rate telemetry.',
    },
    {
      icon: Boxes,
      title: 'Warehouse Stock Control',
      description:
        'Real-time inventory levels, reorder threshold alerts, and immutable stock delta movement audit ledgers.',
    },
    {
      icon: ShoppingCart,
      title: 'Full Order Lifecycle',
      description:
        'Finite state machine tracking orders from confirmation to doorstep delivery, with staff notes and chronological timeline logs.',
    },
    {
      icon: TrendingUp,
      title: 'Net Profit & COD Analytics',
      description:
        'Track cash collections, courier remittance settlements, and true profitability after freight and packaging expenses.',
    },
    {
      icon: Users,
      title: '360° Customer Intelligence',
      description:
        'Centralize buyer profiles, delivery address records, purchase frequency, and lifetime value in a unified CRM.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
      <header className="flex h-16 w-full items-center justify-between border-b border-border/80 px-6 lg:px-12 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            Shopnix
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 h-8 px-3.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-28 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Gen Ecommerce Operations SaaS
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl leading-tight sm:leading-none">
          The Operational Operating System for Modern Ecommerce
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Centralize your catalog builder, multi-carrier courier fulfillment (Steadfast,
          Pathao, RedX, eCourier), warehouse stock balancing, and COD cash reconciliation into one
          high-velocity platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3.5">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-md transition-all w-full sm:w-auto"
          >
            Launch Your Store Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-all w-full sm:w-auto"
          >
            Explore Dashboard Demo
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left w-full">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-6 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Shopnix Inc. All rights reserved. Built for Bangladesh & global ecommerce.
      </footer>
    </div>
  );
}
