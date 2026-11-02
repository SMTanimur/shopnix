'use client';

import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Cpu,
  Key,
} from 'lucide-react';
import { GeminiLogo, OpenAILogo, OpenRouterLogo } from '../brand-logos';

export function AIIntelligenceSection() {
  const freeModels = [
    { name: 'google/gemini-2.0-flash-exp:free', provider: 'Google', context: '1,048k', price: '৳0.00' },
    { name: 'meta-llama/llama-3.3-70b-instruct:free', provider: 'Meta', context: '131k', price: '৳0.00' },
    { name: 'deepseek/deepseek-r1:free', provider: 'DeepSeek', context: '128k', price: '৳0.00' },
    { name: 'mistralai/mistral-small-24b-instruct:free', provider: 'Mistral', context: '32k', price: '৳0.00' },
  ];

  return (
    <section id="ai-engine" className="py-20 lg:py-28 bg-muted/20 border-t border-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              Dynamic Zero-Cost AI Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Centralized AI Hub &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-rose-500 to-indigo-600">
                100+ Free Models on OpenRouter
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Don&apos;t get locked into expensive monthly AI model subscriptions. Shopnix includes a
              native OpenRouter dynamic model discovery engine that automatically identifies 100% free
              models using official pricing metadata.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-foreground">Bangla & English Copywriting:</span> Create
                  culturally authentic Bengali product descriptions, Facebook ad copy, and SEO meta tags.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-foreground">Strict Free-Only Filter:</span> Automatically
                  blocks paid models to prevent unintended credit card surprises for merchants.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-foreground">Master Key Vault:</span> Centralized AES-256
                  encrypted key storage never exposed to client browsers.
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Free Model Discovery Explorer Card */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-7 rounded-2xl border border-border/80 bg-card shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <OpenRouterLogo size={22} />
                  <span className="text-xs font-bold text-foreground">OpenRouter Model Explorer</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Zero Cost (৳0/token)
                </span>
              </div>

              <div className="space-y-2">
                {freeModels.map((model, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-border/60 bg-background flex items-center justify-between hover:border-primary/50 transition-all text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-foreground truncate max-w-[220px] sm:max-w-xs">
                        {model.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>Provider: {model.provider}</span>
                        <span>·</span>
                        <span>Context: {model.context}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        FREE
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-primary" />
                  API Keys AES-256 Encrypted
                </span>
                <span className="font-semibold text-foreground">Auto-Refreshed Hourly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
