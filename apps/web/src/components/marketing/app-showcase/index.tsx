'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  MessageSquare,
  Truck,
  Sparkles,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ShowcaseTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  image: string;
  title: string;
  description: string;
  bullets: string[];
  urlPath: string;
}

export function AppShowcase() {
  const tabs: ShowcaseTab[] = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: LayoutDashboard,
      tag: 'Executive Overview',
      image: '/screenshots/dashboard-preview.svg',
      title: 'Real-Time Operations Command Dashboard',
      description:
        'Stop cross-referencing four dashboards and fragmented spreadsheets. See live delivered revenue in BDT, 7-stage order status progression, multi-channel performance, and instant dispatch queues.',
      bullets: [
        'Live GMV and delivered net revenue attribution',
        '7-stage finite state machine order progression',
        'Multi-channel ingestion (Shopify, Woo, Funnels, Chat)',
        'Low inventory warning triggers and stock reserves',
      ],
      urlPath: 'app.shopnix.io/dashboard',
    },
    {
      id: 'inbox',
      label: 'Omnichannel Inbox',
      icon: MessageSquare,
      tag: 'WhatsApp & Messenger',
      image: '/screenshots/inbox-preview.svg',
      title: 'Unified Customer Inbox with AI Copilot Approval Mode',
      description:
        'Handle WhatsApp Business Cloud and Facebook Messenger DMs in one unified stream. The AI Copilot drafts fluent Bengali responses that agents can approve in 1-click before sending.',
      bullets: [
        'Native WhatsApp Cloud API & Meta Messenger integration',
        'AI Copilot Approval Mode prevents unintended AI hallucinations',
        'Customer order history and delivery address attached to every chat',
        '1-Click order creation drawer parses chat details into confirmed orders',
      ],
      urlPath: 'app.shopnix.io/inbox/whatsapp',
    },
    {
      id: 'couriers',
      label: 'Courier & COD Hub',
      icon: Truck,
      tag: 'Steadfast · Pathao · RedX',
      image: '/screenshots/courier-preview.svg',
      title: 'Multi-Carrier Dispatch, Anti-Fraud & Remittance Reconciliation',
      description:
        'Dispatch hundreds of parcels in seconds. Shopnix scores customer phone numbers for return fraud risk, generates consignments across Steadfast, Pathao, RedX & eCourier, and reconciles cash collections.',
      bullets: [
        '1-Click bulk consignment generation & automated AWB printing',
        'Anti-Fraud Return Risk Score detects serial fake order numbers',
        'Live courier cash-on-delivery (COD) settlement balance ledger',
        'Automated real-time tracking webhook synchronization',
      ],
      urlPath: 'app.shopnix.io/couriers/dispatch',
    },
    {
      id: 'ai-studio',
      label: 'Bilingual AI Studio',
      icon: Sparkles,
      tag: 'Bangla + English SEO',
      image: '/screenshots/ai-studio-preview.svg',
      title: 'Bilingual AI Copywriter & OpenRouter Free Model Discovery',
      description:
        'Generate compelling Bengali and English product titles, persuasive sales bullets, and SEO meta tags. Features dynamic discovery of 100+ zero-cost free models on OpenRouter with zero API expense.',
      bullets: [
        'Bangla & English culturally tuned ecommerce copy generation',
        'Dynamic OpenRouter model discovery with 100% Free-Only filtering',
        'Master AI Key Vault with encrypted at-rest API credential security',
        'Real-time token usage telemetry calculated in BDT (৳)',
      ],
      urlPath: 'app.shopnix.io/ai-studio/copywriter',
    },
    {
      id: 'automations',
      label: 'Workflow Engine',
      icon: GitBranch,
      tag: 'Visual Node Canvas',
      image: '/screenshots/automation-preview.svg',
      title: 'Visual Topological Workflow Automation Engine',
      description:
        'Automate your business logic with a visual node builder. Create conditional triggers, AI decision branches, and automated courier or WhatsApp dispatch actions without writing code.',
      bullets: [
        'Drag-and-drop triggers (New Order, Cart Abandoned, RTO Warning)',
        'AI decision nodes evaluate customer sentiment & fraud probability',
        'Automated actions (WhatsApp message, Steadfast dispatch, inventory reserve)',
        'Immutable execution audit log ledger with step-by-step diffs',
      ],
      urlPath: 'app.shopnix.io/automations/builder',
    },
  ];

  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <section id="inside-app" className="py-20 lg:py-28 bg-muted/30 border-y border-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Live Software Walkthrough
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            See Exactly How It Looks{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              Inside Shopnix
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Click through our 5 core operational modules below to explore the actual high-density
            interface designed for modern ecommerce teams.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                <span>{tab.label}</span>
                <span
                  className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3D Perspective Browser Frame with Embedded Screenshot */}
        <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden max-w-6xl mx-auto">
          {/* Top Browser Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/80 bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Simulated URL bar */}
            <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-background border border-border text-[11px] font-mono text-muted-foreground w-64 sm:w-80 justify-center shadow-inner">
              <span className="text-emerald-500">https://</span>
              <span className="text-foreground font-semibold">{activeTab.urlPath}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Protected SaaS</span>
            </div>
          </div>

          {/* Screenshot Display Area with Animated Crossfade */}
          <div className="p-3 sm:p-6 bg-background">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-border/70 shadow-inner bg-card flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeTab.image}
                  alt={activeTab.title}
                  className="w-full h-full object-contain select-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Screenshot Explanatory Footer Drawer */}
          <div className="p-6 sm:p-8 border-t border-border/80 bg-muted/20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {activeTab.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">
                  {activeTab.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {activeTab.description}
                </p>
              </div>

              <div className="space-y-2 border-t lg:border-t-0 lg:border-l border-border/70 pt-4 lg:pt-0 lg:pl-6">
                {activeTab.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
