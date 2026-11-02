'use client';

import React from 'react';
import {
  ShopifyLogo,
  WooCommerceLogo,
  SteadfastLogo,
  PathaoLogo,
  RedXLogo,
  ECourierLogo,
  PaperflyLogo,
  MetaLogo,
  WhatsAppLogo,
  TikTokLogo,
  GoogleAdsLogo,
  GeminiLogo,
  OpenAILogo,
  OpenRouterLogo,
  BkashLogo,
  NagadLogo,
} from '../brand-logos';

export function BrandMarquee() {
  const brands = [
    { name: 'Shopify', logo: ShopifyLogo, category: 'Storefront' },
    { name: 'WooCommerce', logo: WooCommerceLogo, category: 'Storefront' },
    { name: 'Steadfast Courier', logo: SteadfastLogo, category: 'Logistics' },
    { name: 'Pathao Courier', logo: PathaoLogo, category: 'Logistics' },
    { name: 'RedX Delivery', logo: RedXLogo, category: 'Logistics' },
    { name: 'eCourier', logo: ECourierLogo, category: 'Logistics' },
    { name: 'Paperfly', logo: PaperflyLogo, category: 'Logistics' },
    { name: 'Meta Ads & Messenger', logo: MetaLogo, category: 'Acquisition' },
    { name: 'WhatsApp Cloud API', logo: WhatsAppLogo, category: 'Conversations' },
    { name: 'TikTok Ads', logo: TikTokLogo, category: 'Acquisition' },
    { name: 'Google Ads', logo: GoogleAdsLogo, category: 'Acquisition' },
    { name: 'Google Gemini', logo: GeminiLogo, category: 'AI Intelligence' },
    { name: 'OpenAI', logo: OpenAILogo, category: 'AI Intelligence' },
    { name: 'OpenRouter Free Models', logo: OpenRouterLogo, category: 'AI Intelligence' },
    { name: 'bKash Merchant', logo: BkashLogo, category: 'Payment' },
    { name: 'Nagad Gateway', logo: NagadLogo, category: 'Payment' },
  ];

  return (
    <section className="py-12 border-b border-border/70 bg-card/40 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p className="text-xs uppercase tracking-widest font-extrabold text-muted-foreground">
          Seamlessly Connected to the Entire Bangladeshi & Global Ecommerce Ecosystem
        </p>
      </div>

      {/* Marquee Wrapper with Gradient Mask for Fade Effect */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex items-center gap-6 py-2">
          {/* Double array for seamless loop */}
          {[...brands, ...brands].map((brand, idx) => {
            const Logo = brand.logo;
            return (
              <div
                key={`${brand.name}-${idx}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/70 bg-card hover:border-primary/50 transition-all hover:scale-105 shadow-xs shrink-0 select-none cursor-default group"
              >
                <Logo size={24} className="shrink-0 transition-transform group-hover:scale-110" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground tracking-tight whitespace-nowrap">
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                    {brand.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
