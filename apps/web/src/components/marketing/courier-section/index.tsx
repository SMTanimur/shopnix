'use client';

import React from 'react';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Package,
} from 'lucide-react';
import {
  SteadfastLogo,
  PathaoLogo,
  RedXLogo,
  ECourierLogo,
  PaperflyLogo,
} from '../brand-logos';

export function CourierSection() {
  const couriers = [
    {
      name: 'Steadfast Courier',
      logo: SteadfastLogo,
      status: 'Live Connected',
      balance: '৳1,84,320',
      parcelsToday: '142 Dispatched',
      speed: '24-48 Hours',
    },
    {
      name: 'Pathao Courier',
      logo: PathaoLogo,
      status: 'Live Connected',
      balance: '৳98,450',
      parcelsToday: '86 Dispatched',
      speed: 'Same-Day / Next-Day',
    },
    {
      name: 'RedX Delivery',
      logo: RedXLogo,
      status: 'Live Connected',
      balance: '৳42,100',
      parcelsToday: '34 Dispatched',
      speed: '48-72 Hours',
    },
    {
      name: 'eCourier',
      logo: ECourierLogo,
      status: 'Live Connected',
      balance: '৳28,900',
      parcelsToday: '22 Dispatched',
      speed: 'Nationwide 64 Districts',
    },
  ];

  return (
    <section id="couriers" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/25 mb-4">
            <Truck className="h-3.5 w-3.5" />
            Zero Copy-Pasting into Courier Portals
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Multi-Carrier Dispatch &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              Anti-Fraud RTO Shield
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Never manually copy-paste customer names, phone numbers, and addresses into separate courier
            portals again. Shopnix connects directly to Bangladesh&apos;s leading logistics providers,
            detects fake orders before dispatch, and reconciles every Taka collected at the doorstep.
          </p>
        </div>

        {/* Courier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {couriers.map((courier, idx) => {
            const Logo = courier.logo;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all hover:scale-[1.02] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Logo size={28} className="shrink-0" />
                    <div>
                      <div className="text-sm font-extrabold text-foreground">{courier.name}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {courier.status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Available COD Balance:</span>
                    <span className="font-extrabold text-foreground">{courier.balance}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Dispatched Today:</span>
                    <span className="font-bold text-primary">{courier.parcelsToday}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Anti-Fraud Return-To-Origin (RTO) Intelligence Showcase */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-xl max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
              <ShieldCheck className="h-4 w-4" />
              Return-To-Origin (RTO) Protection
            </div>
            <h3 className="text-2xl font-extrabold text-foreground">
              Detect Serial Returners Before You Pay Shipping Freight
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In Bangladesh, every returned parcel costs the merchant ৳100 to ৳180 in courier return
              charges plus packaging waste. Shopnix scores customer phone numbers across historical
              delivery data to flag high-risk buyers before you dispatch.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Automated 11-digit mobile validation (013 - 019 operator prefix check)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Detection of duplicate spam orders placed within 30 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Discrepancy warnings between courier payout reports and delivered orders</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-xl border border-border/70 bg-muted/30 space-y-3">
            <div className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Risk Scoring Simulation</span>
              <span className="text-[10px] text-muted-foreground font-mono">Real-Time</span>
            </div>

            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs">
              <div className="flex items-center justify-between font-bold text-rose-600">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-500" /> High Return Risk (78%)
                </span>
                <span className="text-[10px] uppercase tracking-wider">Caution</span>
              </div>
              <p className="mt-1 text-[11px] text-foreground leading-normal">
                Customer has 3 previous refused parcels at doorstep in Mirpur. Confirmation call
                required before Steadfast booking.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Trusted Buyer (0% Return)
                </span>
                <span className="text-[10px] uppercase tracking-wider">Safe</span>
              </div>
              <p className="mt-1 text-[11px] text-foreground leading-normal">
                Customer completed 5/5 previous orders. Eligible for 1-Click Fast Track dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
