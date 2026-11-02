'use client';

import React from 'react';
import { Check, X, Sparkles, Minus } from 'lucide-react';

export function FeatureMatrixSection() {
  const comparisons = [
    {
      feature: 'Built-In 1-Click COD Funnel Builder',
      shopnix: 'Native drag & drop funnel engine with COD forms & Meta CAPI',
      ecomdrive: 'No funnel builder (relies solely on external stores)',
      manual: 'Separate expensive tools ($97/mo ClickFunnels / WordPress)',
      status: true,
    },
    {
      feature: 'Integrated Softphone & PBX Call Center',
      shopnix: 'Softphone dialer, audio waveform, hotkeys & AI call transcription',
      ecomdrive: 'Basic call attempt logger',
      manual: 'Manual dialing on agent mobile phones with zero records',
      status: true,
    },
    {
      feature: 'Omnichannel Inbox with AI Copilot',
      shopnix: 'WhatsApp Cloud API & Messenger with AI Approval Mode',
      ecomdrive: 'Standard chat inbox without approval guardrails',
      manual: 'Fragmented WhatsApp Web & Meta Business Suite tabs',
      status: true,
    },
    {
      feature: 'Multi-Carrier Logistics Integration',
      shopnix: '1-Click bulk dispatch: Steadfast, Pathao, RedX, eCourier',
      ecomdrive: 'Steadfast, Pathao, RedX, Paperfly',
      manual: 'Manually copy-pasting customer details into 4 separate portals',
      status: true,
    },
    {
      feature: 'Anti-Fraud Return Risk Intelligence',
      shopnix: 'Phone fraud scoring across historical returns & duplicate order shield',
      ecomdrive: 'Manual phone number blacklist',
      manual: 'Zero protection; discovering fraud only when courier bills return fees',
      status: true,
    },
    {
      feature: 'AI Model Infrastructure & Cost',
      shopnix: '100+ Free Models on OpenRouter + Gemini + OpenAI at ৳0 overhead',
      ecomdrive: 'Locked proprietary AI with monthly token limits',
      manual: 'None or separate $20/mo individual ChatGPT subscriptions',
      status: true,
    },
    {
      feature: 'COD Remittance Settlement Reconciliation',
      shopnix: 'Automated discrepancy detector between courier payouts & cash',
      ecomdrive: 'Manual balance viewing',
      manual: 'Manual Excel spreadsheets prone to calculation mistakes',
      status: true,
    },
    {
      feature: 'Multi-Tenant Super Admin Control',
      shopnix: 'Dedicated /admin control center, dynamic BDT tiers, immutable audit logs',
      ecomdrive: 'Basic organization settings',
      manual: 'None',
      status: true,
    },
  ];

  return (
    <section id="comparison" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Clear Architectural Superiority
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Shopnix vs.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              EcomDrive BD & Old Methods
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            See why high-volume Bangladeshi merchants choose Shopnix as their all-in-one operating system.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="rounded-2xl border border-border/80 bg-card shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40">
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-muted-foreground w-1/4">
                  Operational Capability
                </th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-primary w-1/3 bg-primary/5 border-x border-primary/20">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    Shopnix 2.0 (Recommended)
                  </div>
                </th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-muted-foreground w-1/4">
                  EcomDrive BD
                </th>
                <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-muted-foreground w-1/4">
                  Spreadsheets & Manual
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-6 font-bold text-foreground">{row.feature}</td>
                  <td className="py-4 px-6 font-semibold text-foreground bg-primary/5 border-x border-primary/20">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{row.shopnix}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Minus className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{row.ecomdrive}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{row.manual}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
