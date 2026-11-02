'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Smartphone,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Sliders,
  MousePointerClick,
} from 'lucide-react';
import { MetaLogo, TikTokLogo, SteadfastLogo } from '../brand-logos';

export function FunnelBuilderShowcase() {
  const [selectedBundle, setSelectedBundle] = useState<number>(2);
  const [deliveryLocation, setDeliveryLocation] = useState<'inside' | 'outside'>('inside');

  const bundleOptions = [
    { id: 1, title: '১ পিস (সিঙ্গেল প্যাক)', price: 1190, discount: '' },
    { id: 2, title: '২ পিস (স্পেশাল অফার)', price: 1990, discount: '৳৩৯০ ছাড় (জনপ্রিয়)' },
    { id: 3, title: '৩ পিস (ফ্যামিলি প্যাক)', price: 2790, discount: '৳৭৮০ ছাড় + ফ্রি ডেলিভারি' },
  ];

  const deliveryFee = deliveryLocation === 'inside' ? 60 : 120;
  const currentBundle = bundleOptions.find((b) => b.id === selectedBundle) || bundleOptions[1];
  const totalPrice = currentBundle.price + (selectedBundle === 3 ? 0 : deliveryFee);

  return (
    <section id="funnel-builder" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <MousePointerClick className="h-3.5 w-3.5" />
            Built-in SaaS Capability (EcomDrive Doesn&apos;t Have This)
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Built-in 1-Click COD{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              Funnel & Landing Page Builder
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            In Bangladesh, over 70% of social media ad traffic converts through single-product landing
            pages, not bloated multi-step ecommerce storefronts. Build high-converting, mobile-first
            funnels with automated Meta CAPI tracking and instant courier dispatch.
          </p>
        </div>

        {/* Funnel Builder Interactive Canvas Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Column: Visual Builder Blocks & Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-3">
                <Layers className="h-4 w-4" />
                Visual Drag & Drop Blocks
              </div>
              <h3 className="text-xl font-extrabold text-foreground">
                High-Converting Conversion Blocks
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Add conversion-optimized sections built specifically for Bangladeshi buyer psychology:
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/30 text-xs font-semibold">
                  <span className="flex items-center gap-2 text-foreground">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Urgency Stock Countdown Timer
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/30 text-xs font-semibold">
                  <span className="flex items-center gap-2 text-foreground">
                    <Sliders className="h-4 w-4 text-rose-500" />
                    Multi-Pack Bundle Pricing (1, 2, 3 Pcs)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    +42% AOV
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/30 text-xs font-semibold">
                  <span className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    1-Click Cash on Delivery Checkout Form
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                    Zero Cart Drop
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/30 text-xs font-semibold">
                  <span className="flex items-center gap-2 text-foreground">
                    <Zap className="h-4 w-4 text-indigo-500" />
                    Meta CAPI & TikTok Instant Pixel Firing
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 font-bold">
                    Server-Side
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Metric Pill */}
            <div className="p-4 rounded-xl border border-border/80 bg-primary/5 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary shrink-0" />
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">3.8x Higher Conversion Rate:</span> Bypasses the
                traditional cart and account registration pages, leading straight to a confirmed COD order.
              </div>
            </div>
          </div>

          {/* Right Column: Live Mobile Preview of the Landing Page */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-sm rounded-[36px] border-4 border-foreground/20 bg-background shadow-2xl p-4 overflow-hidden relative">
              {/* Phone Notch / Dynamic Island */}
              <div className="w-28 h-4 bg-foreground/20 rounded-full mx-auto mb-4" />

              {/* Funnel Mobile Screen Content */}
              <div className="space-y-4 text-left">
                {/* Product Badge & Urgency Timer */}
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-[11px] text-rose-600 font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> অফার শেষ হতে বাকি:
                  </span>
                  <span className="font-mono bg-rose-500 text-white px-2 py-0.5 rounded">
                    04:28:15
                  </span>
                </div>

                {/* Product Image & Title */}
                <div>
                  <div className="w-full h-32 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-xs text-muted-foreground font-semibold">
                    [ হাই-কোয়ালিটি প্রডাক্ট ছবি / ভিডিও ]
                  </div>
                  <h4 className="mt-2 text-sm font-extrabold text-foreground">
                    প্রিমিয়াম ওয়াটারপ্রুফ স্মার্ট ওয়াচ (Ultra 2 Edition)
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-extrabold text-primary">৳১,১৯০</span>
                    <span className="text-xs text-muted-foreground line-through">৳১,৯৫০</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      ৪০% ছাড়
                    </span>
                  </div>
                </div>

                {/* Interactive Multi-Pack Bundle Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-foreground block">
                    প্যাকেজ নির্বাচন করুন:
                  </label>
                  {bundleOptions.map((bundle) => (
                    <button
                      key={bundle.id}
                      onClick={() => setSelectedBundle(bundle.id)}
                      className={`w-full p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                        selectedBundle === bundle.id
                          ? 'border-primary bg-primary/10 text-foreground font-bold shadow-xs'
                          : 'border-border bg-card text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                            selectedBundle === bundle.id
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}
                        >
                          {selectedBundle === bundle.id && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span>{bundle.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">৳{bundle.price}</span>
                        {bundle.discount && (
                          <span className="text-[9px] px-1 rounded bg-rose-500/20 text-rose-600 font-semibold">
                            {bundle.discount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* 1-Click Cash on Delivery Form */}
                <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                  <div className="text-[11px] font-bold text-foreground flex items-center justify-between">
                    <span>ক্যাশ অন ডেলিভারি তথ্য</span>
                    <span className="text-[9px] text-emerald-600 font-semibold">পণ্য হাতে পেয়ে পেমেন্ট</span>
                  </div>

                  <input
                    type="text"
                    disabled
                    value="মো: তানভীর আহমেদ"
                    className="w-full text-[11px] px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground"
                    placeholder="আপনার নাম"
                  />
                  <input
                    type="tel"
                    disabled
                    value="01712-345678"
                    className="w-full text-[11px] px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground"
                    placeholder="১১ ডিজিটের মোবাইল নম্বর"
                  />
                  <input
                    type="text"
                    disabled
                    value="বাসা নং ১২, রোড ৩, ধানমন্ডি, ঢাকা"
                    className="w-full text-[11px] px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground"
                    placeholder="সম্পূর্ণ ঠিকানা"
                  />

                  {/* Delivery Location Selector */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setDeliveryLocation('inside')}
                      className={`text-[10px] py-1 rounded border text-center font-semibold ${
                        deliveryLocation === 'inside'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      ঢাকার ভেতরে (৳৬০)
                    </button>
                    <button
                      onClick={() => setDeliveryLocation('outside')}
                      className={`text-[10px] py-1 rounded border text-center font-semibold ${
                        deliveryLocation === 'outside'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      ঢাকার বাইরে (৳১২০)
                    </button>
                  </div>
                </div>

                {/* Confirm Order CTA Button */}
                <button
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all cursor-pointer"
                  onClick={() => alert(`Shopnix Demo Order: ৳${totalPrice} (Sent to Steadfast Courier!)`)}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>অর্ডার কনফার্ম করুন — মোট: ৳{totalPrice.toLocaleString()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
