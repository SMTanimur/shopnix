'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  PhoneCall,
  ShoppingCart,
  Store,
  Layers,
} from 'lucide-react';
import { HeroBackground, HeroAnnouncement } from '../hero-background';

export function LandingHero() {
  const statCards = [
    {
      icon: ShoppingCart,
      category: 'OMNICHANNEL ORDERS',
      metric: '10,000+ Orders/mo',
      description: 'Unified orders from connected Shopify, WooCommerce & 1-Click Funnels.',
      tag: 'Real-time Sync',
      iconColor: 'text-primary',
      borderColor: 'hover:border-primary/50',
    },
    {
      icon: PhoneCall,
      category: 'CONFIRMATION CALLS',
      metric: '1,842 Live',
      description: 'Integrated softphone PBX, automated call logs & AI transcription.',
      tag: '94% Confirmed',
      iconColor: 'text-rose-500',
      borderColor: 'hover:border-rose-500/50',
    },
    {
      icon: ShieldCheck,
      category: 'ANTI-FRAUD PROTECTION',
      metric: '18.4% Saved',
      description: 'Customer return risk indicators, 11-digit phone checks & serial fake order alerts.',
      tag: 'Zero RTO Loss',
      iconColor: 'text-amber-500',
      borderColor: 'hover:border-amber-500/50',
    },
    {
      icon: Zap,
      category: 'AI INTELLIGENCE',
      metric: '100+ Free Models',
      description: 'Dynamic zero-cost OpenRouter model discovery, bilingual copy & chat copilot.',
      tag: '৳0 Cost Overhead',
      iconColor: 'text-indigo-500',
      borderColor: 'hover:border-indigo-500/50',
    },
  ];

  return (
    <section id="overview" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-white dark:bg-background">
      {/* Modular Animated SVG & Glowing Canvas Background */}
      <HeroBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <HeroAnnouncement />
        </motion.div>

        {/* Grand Headline with Shopnix Crimson Gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-foreground max-w-5xl mx-auto leading-[1.12] sm:leading-[1.12]"
        >
          Run Your Entire Ecommerce Empire on{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-rose-500 to-pink-600">
            One Operating System
          </span>
        </motion.h1>

        {/* Positioning Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Manage every store, order, customer conversation, courier, and automation from one intelligent platform.
          Connect Shopify, WooCommerce, WhatsApp, and Facebook Messenger while growing your business with AI-powered tools.
        </motion.p>

        {/* Dual CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/45 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#inside-app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-bold rounded-xl bg-card border border-border/80 hover:bg-muted text-foreground transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
          >
            <span>Explore Inside Shopnix</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </a>
        </motion.div>

        {/* Verified Trust Benefits (No fake statistics) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-muted-foreground font-medium"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Quick store integration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Real-time order management</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>AI-powered automation</span>
          </div>
        </motion.div>

        {/* Hero Feature & Statistics Cards (4 Columns) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left"
        >
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border border-border/70 bg-white/80 dark:bg-card/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${card.borderColor}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-muted-foreground">
                      {card.category}
                    </span>
                    <Icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>

                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-foreground tracking-tight">
                    {card.metric}
                  </div>

                  <p className="mt-2 text-xs text-slate-600 dark:text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-primary">{card.tag}</span>
                  <span className="text-[10px] text-muted-foreground">Active Module</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
