'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Radiant Rose Glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-14 rounded-3xl border-2 border-primary/40 bg-card/90 backdrop-blur-xl shadow-2xl glow-rose relative overflow-hidden">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Join 1,200+ Growing Brands
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
            Stop Juggling Spreadsheets.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-rose-500 to-pink-600">
              Run Shopnix Today.
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Unify your Shopify, WooCommerce, 1-Click Funnels, WhatsApp chats, and Bangladesh couriers in
            under 10 minutes. Zero credit card needed.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:scale-105"
            >
              Start 14-Day Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-bold rounded-xl bg-muted border border-border hover:bg-muted/80 text-foreground transition-all"
            >
              View Pricing (in BDT)
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Full Access to All 4 Couriers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>100+ Free AI Models via OpenRouter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Cancel Anytime with 1-Click</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
