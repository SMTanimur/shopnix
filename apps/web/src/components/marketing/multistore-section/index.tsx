'use client';

import React from 'react';
import {
  Store,
  RefreshCw,
  Boxes,
  CheckCircle2,
  ArrowRightLeft,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ShopifyLogo, WooCommerceLogo } from '../brand-logos';

export function MultistoreSection() {
  const storeConnections = [
    {
      name: 'Main Brand Store',
      platform: 'Shopify Plus',
      logo: ShopifyLogo,
      status: 'Synchronized',
      lastSync: '2 mins ago',
      products: '420 Products',
      orders: '1,890 Orders/mo',
      health: '100% Healthy',
    },
    {
      name: 'Outlet Clearance Store',
      platform: 'WooCommerce',
      logo: WooCommerceLogo,
      status: 'Synchronized',
      lastSync: 'Just now',
      products: '185 Products',
      orders: '650 Orders/mo',
      health: '100% Healthy',
    },
    {
      name: 'Direct Funnel Engine',
      platform: 'Shopnix 1-Click Funnels',
      logo: Store,
      status: 'Real-Time Webhook',
      lastSync: 'Live',
      products: '12 Campaigns',
      orders: '3,410 Orders/mo',
      health: '100% Healthy',
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Store className="h-3.5 w-3.5" />
              Multi-Store Centralization
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Connect Every Store.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
                Sync Stock Across All Channels.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Never oversell or manually reconcile inventory again. Shopnix connects to your Shopify,
              WooCommerce, custom website, and high-converting landing pages, syncing stock deltas and
              orders in real-time.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-foreground">2-Way Live Inventory Sync:</span> When an item sells on
                  Shopify, stock instantly deducts from WooCommerce and your landing funnels.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-foreground">Single Master Catalog:</span> Edit images, prices, and
                  variants once; push updates across all connected storefronts.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-foreground">Zero Duplicate Orders:</span> Normalized data schemas
                  prevent duplicate webhook triggers and lost orders.
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Store Connections Card */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <ArrowRightLeft className="h-4 w-4 text-primary" />
                  Connected Store Channels
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-Sync Enabled
                </span>
              </div>

              {storeConnections.map((store, idx) => {
                const Logo = store.logo;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border/70 bg-background hover:border-primary/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/60 border border-border shrink-0">
                        <Logo size={24} className="shrink-0" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-foreground">{store.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{store.platform}</span>
                          <span>·</span>
                          <span className="font-mono text-[11px]">{store.products}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
                      <div className="text-right">
                        <div className="text-xs font-bold text-foreground">{store.orders}</div>
                        <div className="text-[10px] text-muted-foreground">Sync: {store.lastSync}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
