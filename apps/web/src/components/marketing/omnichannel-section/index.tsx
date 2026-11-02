'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Send,
  UserCheck,
  ShieldCheck,
  ShoppingCart,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppLogo, MetaLogo } from '../brand-logos';

export function OmnichannelSection() {
  const [aiApproved, setAiApproved] = useState(false);

  return (
    <section id="omnichannel" className="py-20 lg:py-28 bg-muted/20 border-y border-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-4">
            <WhatsAppLogo size={16} />
            <span>Social Commerce Inbox</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            WhatsApp & Messenger{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-primary">
              Unified Social Inbox
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Most Bangladeshi online sales happen in chat threads. Shopnix brings WhatsApp Business Cloud
            and Facebook Messenger into one unified screen with contextual customer history, Bengali AI
            draft suggestions, and 1-click order creation.
          </p>
        </div>

        {/* Interactive Chat Console Workspace */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Chat Left List (Simulated channels) */}
          <div className="lg:col-span-4 border-r border-border/80 bg-muted/30 p-4 space-y-3 hidden sm:block">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
              <span>Active Threads</span>
              <span className="text-primary font-bold">12 Unread</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-primary/50 shadow-xs cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WhatsAppLogo size={18} />
                  <span className="text-xs font-extrabold text-foreground">ফারহানা চৌধুরী</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">1m ago</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-1">
                ভাইয়া, এই ওয়াটারপ্রুফ ঘড়িটা কি স্টকে আছে? চট্টগ্রাম...
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-bold">
                <Sparkles className="h-3 w-3" /> AI draft ready
              </div>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border/60 hover:border-border cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MetaLogo size={18} />
                  <span className="text-xs font-bold text-foreground">কামরুল হাসান</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">14m ago</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-1">
                আমার অর্ডার #9088 ডেলিভারি কবে পাবো?
              </p>
            </div>
          </div>

          {/* Main Chat Thread & AI Copilot Console */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between bg-background">
            {/* Thread Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-sm">
                  FC
                </div>
                <div>
                  <div className="text-sm font-extrabold text-foreground flex items-center gap-2">
                    <span>ফারহানা চৌধুরী (Farhana Chowdhury)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                      Trusted Buyer (0% Return)
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    WhatsApp Cloud · 01812-349876 · Chattogram
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert('1-Click Order Creation Drawer opened for Farhana Chowdhury!')}
                className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                1-Click Order
              </button>
            </div>

            {/* Chat Bubble Stream */}
            <div className="py-6 space-y-4">
              <div className="flex items-start gap-2 max-w-md">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0 font-bold">
                  FC
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-muted/60 text-xs text-foreground leading-relaxed">
                  ভাইয়া, এই ওয়াটারপ্রুফ ঘড়িটা কি স্টকে আছে? চট্টগ্রাম ডেলিভারি হতে কত দিন লাগবে? ক্যাশ অন
                  ডেলিভারি কি সম্ভব?
                </div>
              </div>

              {/* AI Draft Suggestion Box (Approval Mode) */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Sparkles className="h-4 w-4" />
                    AI Copilot Draft (Bengali Grounded)
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Model: OpenRouter / Free
                  </span>
                </div>

                <p className="text-xs text-foreground leading-relaxed italic bg-background/80 p-3 rounded-lg border border-border/60">
                  {aiApproved
                    ? 'হ্যাঁ আপু, প্রডাক্টটি রেডি স্টকে আছে। চট্টগ্রামে Steadfast কুরিয়ারের মাধ্যমে ২-৩ দিনের মধ্যে হোম ডেলিভারি পাবেন। পণ্য হাতে পেয়ে সম্পূর্ণ ক্যাশ অন ডেলিভারিতে মুল্য পরিশোধ করতে পারবেন। আমি কি আপনার অর্ডারটি কনফার্ম করব?'
                    : 'হ্যাঁ আপু, প্রডাক্টটি রেডি স্টকে আছে। চট্টগ্রামে Steadfast কুরিয়ারের মাধ্যমে ২-৩ দিনের মধ্যে হোম ডেলিভারি পাবেন। পণ্য হাতে পেয়ে সম্পূর্ণ ক্যাশ অন ডেলিভারিতে মুল্য পরিশোধ করতে পারবেন। আমি কি আপনার অর্ডারটি কনফার্ম করব?'}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAiApproved(true);
                      alert('Message Approved and Sent via WhatsApp Cloud API!');
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {aiApproved ? 'Sent to Customer!' : 'Approve & Send (1-Click)'}
                  </button>
                  <button
                    onClick={() => alert('Opening edit modal')}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold hover:bg-muted transition-all cursor-pointer"
                  >
                    Edit Draft
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Message Input Bar */}
            <div className="pt-3 border-t border-border flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Type a reply or use AI suggested responses..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground"
              />
              <button
                disabled
                className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
