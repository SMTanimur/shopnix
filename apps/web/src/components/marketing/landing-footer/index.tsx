'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';
import { ShopnixLogo } from '../../brand';

export function LandingFooter() {
  return (
    <footer className="border-t border-border/80 bg-background pt-16 pb-12 text-xs text-muted-foreground">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <ShopnixLogo size={34} />
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              The 360° ecommerce operating system, high-converting 1-click COD funnel engine, and
              multi-carrier dispatch platform built specifically for modern Bangladeshi online merchants.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All Systems Operational (API 8000 · Web 5000)</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <div className="font-extrabold text-foreground text-xs uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#inside-app" className="hover:text-primary transition-colors">
                  Command Dashboard
                </a>
              </li>
              <li>
                <a href="#funnel-builder" className="hover:text-primary transition-colors">
                  1-Click COD Funnels
                </a>
              </li>
              <li>
                <a href="#call-center" className="hover:text-primary transition-colors">
                  Softphone PBX Center
                </a>
              </li>
              <li>
                <a href="#omnichannel" className="hover:text-primary transition-colors">
                  WhatsApp Social Inbox
                </a>
              </li>
              <li>
                <a href="#couriers" className="hover:text-primary transition-colors">
                  Multi-Carrier Logistics
                </a>
              </li>
              <li>
                <a href="#ai-engine" className="hover:text-primary transition-colors">
                  Free AI Model Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Logistics Integrations */}
          <div className="space-y-3">
            <div className="font-extrabold text-foreground text-xs uppercase tracking-wider">
              Couriers & Channels
            </div>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  Steadfast Courier
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  Pathao Courier
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  RedX Delivery
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  eCourier Bangladesh
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  Shopify & WooCommerce
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  Meta CAPI & TikTok Pixels
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Account */}
          <div className="space-y-3">
            <div className="font-extrabold text-foreground text-xs uppercase tracking-wider">
              Access
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Merchant Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Create Organization
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary transition-colors">
                  Super Admin Portal
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Subscription Plans
                </a>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  Privacy & Data Security
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 <strong className="text-foreground">Shopnix BD Technologies Ltd.</strong> Built with pride in Dhaka,
            Bangladesh.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted for high-growth merchants with <Heart className="h-3 w-3 text-primary fill-current" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
