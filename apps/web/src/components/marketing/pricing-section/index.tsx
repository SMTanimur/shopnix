'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { BkashLogo, NagadLogo } from '../brand-logos';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal for solo sellers and boutique brands starting with COD.',
      monthlyPrice: 1499,
      annualPrice: 1199,
      popular: false,
      features: [
        '1 Connected Storefront',
        'Up to 1,000 Orders / Month',
        '2 Couriers: Steadfast & Pathao',
        'WhatsApp Unified Inbox (1 Agent)',
        'Basic Phone Fraud Validation',
        'Email & Community Support',
      ],
      ctaText: 'Start Free Trial',
      ctaHref: '/register?plan=starter',
    },
    {
      name: 'Growth',
      description: 'Built for scaling F-commerce brands and multi-channel merchants.',
      monthlyPrice: 3999,
      annualPrice: 3199,
      popular: true,
      features: [
        '5 Connected Storefronts (Shopify, Woo)',
        'Up to 10,000 Orders / Month',
        'All 4 Couriers: Steadfast, Pathao, RedX, eCourier',
        'Built-in 1-Click COD Funnel Builder',
        'Integrated Softphone Call Center (5 Agents)',
        'WhatsApp & Messenger with AI Copilot',
        '100+ Free OpenRouter AI Models',
        'Automated COD Remittance Reconciliation',
        'Priority WhatsApp Agent Support',
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/register?plan=growth',
    },
    {
      name: 'Enterprise',
      description: 'For high-volume retail operations, multi-warehouse brands & 3PLs.',
      monthlyPrice: 9999,
      annualPrice: 7999,
      popular: false,
      features: [
        'Unlimited Connected Stores & Funnels',
        'Unlimited Orders & Bandwidth',
        'Custom Courier & 3PL Warehouse Integrations',
        'Unlimited Softphone PBX Seats & Call Recordings',
        'Visual Topological Workflow Automation Engine',
        'Multi-Tenant Organization Role Permissions',
        'Dedicated Technical Account Manager',
        '99.9% Uptime Guarantee & Custom SLA',
      ],
      ctaText: 'Contact Enterprise Team',
      ctaHref: '/register?plan=enterprise',
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-muted/20 border-t border-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent Pricing in BDT (৳)
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Simple, Predictable Plans for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              Bangladeshi Merchants
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Zero hidden transaction cuts. Pay in BDT using bKash, Nagad, or credit card. Cancel or switch
            plans anytime.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-bold ${
                !isAnnual ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full bg-muted border border-border p-0.5 transition-colors focus:outline-hidden"
              aria-label="Toggle Annual Billing"
            >
              <div
                className={`w-5 h-5 rounded-full bg-primary shadow-xs transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-bold ${
                  isAnnual ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                Annual Billing
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'border-2 border-primary bg-card shadow-2xl scale-105 z-10 glow-rose-sm'
                    : 'border border-border/80 bg-card/60 shadow-md hover:border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-extrabold text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                      ৳{price.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">/month</span>
                  </div>
                  {isAnnual && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      Billed annually (৳{(price * 12).toLocaleString()}/year)
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-border/70 space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      What&apos;s Included:
                    </div>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-foreground font-medium">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/70">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/30'
                        : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Local Payment Methods Verification */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-medium">
          <span>We accept Bangladeshi payment methods:</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card">
            <BkashLogo size={18} />
            <span className="text-foreground font-bold">bKash Merchant</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card">
            <NagadLogo size={18} />
            <span className="text-foreground font-bold">Nagad Gateway</span>
          </div>
          <span className="text-muted-foreground">· Visa, Mastercard, AMEX & Bank Transfer</span>
        </div>
      </div>
    </section>
  );
}
