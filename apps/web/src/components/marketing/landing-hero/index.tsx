'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Star,
  Zap,
  PhoneCall,
} from 'lucide-react';

export function LandingHero() {
  return (
    <section id="overview" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background radial ambient glow in Rose */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-primary/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-rose-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Shimmer Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 mb-8 shadow-xs hover:border-primary/50 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Shopnix 2.0 — The 360° Ecommerce OS & Funnel Builder</span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-primary/50" />
          <span className="hidden sm:inline-block text-[11px] text-muted-foreground font-normal">
            Better than EcomDrive
          </span>
        </motion.div>

        {/* Grand Headline with Rose Gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto leading-[1.1] sm:leading-[1.1]"
        >
          Run Your Entire Bangladeshi Ecommerce Empire on{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-rose-500 to-pink-600">
            One Operating System
          </span>
        </motion.h1>

        {/* Detailed Explanatory Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Replace disconnected spreadsheets, fragmented courier portals, and lost WhatsApp chats.
          Ingest orders from Shopify, WooCommerce, or our high-converting{' '}
          <strong className="text-foreground font-semibold">1-Click COD Funnel Builder</strong>, verify via
          integrated <strong className="text-foreground font-semibold">Softphone Call Center</strong>, auto-dispatch to
          Steadfast, Pathao & RedX, and reconcile cash payouts with zero fraud.
        </motion.p>

        {/* Dual CTAs & Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start 14-Day Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#inside-app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-bold rounded-xl bg-card border border-border hover:bg-muted text-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Inside Shopnix
            <Sparkles className="h-4 w-4 text-primary" />
          </a>
        </motion.div>

        {/* Merchant Proof & Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-medium"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Instant Steadfast & Pathao API setup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-foreground">4.9/5</span>
            <span>(1,200+ BD Merchants)</span>
          </div>
        </motion.div>

        {/* Live Operational Metric Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="h-4 w-4" />
              Delivered Revenue
            </div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">৳48,29,100</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              +14.8% vs yesterday · 92.4% Delivery
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">
              <PhoneCall className="h-4 w-4" />
              Confirmation Calls
            </div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">1,842 Live</div>
            <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              Integrated PBX & Softphone
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              Anti-Fraud RTO Shield
            </div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">18.4% Saved</div>
            <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              Detects serial fake orders
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Zap className="h-4 w-4" />
              Zero-Cost AI Studio
            </div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight">100+ Free Models</div>
            <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              OpenRouter live discovery
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
