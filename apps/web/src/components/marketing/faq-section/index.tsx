'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Do I need my own merchant accounts with Steadfast, Pathao, and RedX?',
      answer:
        'Yes! You simply enter your existing API Key and Secret Key from your courier merchant portals into Shopnix. You keep your direct merchant rates, and all Cash on Delivery (COD) payouts continue to be deposited directly into your bank or bKash account without any middleman cuts.',
    },
    {
      question: 'How does the 1-Click COD Funnel Builder help reduce ad spend waste?',
      answer:
        'Traditional websites force customers through multi-step cart pages and logins, causing 70%+ of Bangladeshi buyers on mobile to drop off. Our funnel builder presents a single high-converting landing page with an instant Cash on Delivery order form, auto-triggering Meta Conversions API (CAPI) and TikTok Pixels directly upon placement.',
    },
    {
      question: 'Are the 100+ OpenRouter AI models really free?',
      answer:
        'Yes. Shopnix continuously queries the official OpenRouter models catalog and strictly filters for models where the official pricing metadata reports $0.00 for prompt and completion tokens. This includes models from Google (Gemini Flash Exp), Meta (Llama 3.3 70B), DeepSeek, and Mistral.',
    },
    {
      question: 'How does the softphone and PBX call confirmation system work?',
      answer:
        'You can place calls directly from the order screen using your browser headset via integrated WebRTC, connect your existing office SIP/PBX lines, or use mobile click-to-dial. Every call records disposition status, talk time, and AI-generated notes automatically.',
    },
    {
      question: 'How fast can our team get started with Shopnix?',
      answer:
        'Onboarding takes less than 10 minutes. Create your organization account, enter your courier API credentials, connect your Shopify or WooCommerce store (or create a funnel), and you are ready to receive and dispatch orders immediately.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-muted/20 border-t border-border/70 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Everything You Need to Know About{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              Shopnix
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Clear answers about integrations, courier settlements, and setup.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
