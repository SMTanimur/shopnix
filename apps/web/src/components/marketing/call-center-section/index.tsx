'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Mic,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  UserCheck,
  Headphones,
  RotateCcw,
} from 'lucide-react';

export function CallCenterSection() {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'confirmed'>('calling');

  return (
    <section id="call-center" className="py-20 lg:py-28 bg-muted/20 border-t border-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/25 mb-4">
            <PhoneCall className="h-3.5 w-3.5" />
            COD Survival Workflow
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Integrated Softphone &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              Order Confirmation Call Center
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            In Bangladesh, 85%+ of orders are COD, and the quality of the telephone confirmation
            call determines whether a package gets accepted or returned with freight loss. Shopnix
            embeds a complete softphone, automated call queue, and AI call transcription inside the
            order screen.
          </p>
        </div>

        {/* Call Center Interactive Workspace Card */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-foreground">
                  Order Verification Softphone
                </div>
                <div className="text-[11px] text-muted-foreground font-medium">
                  Direct PBX Line · Auto-Queue Active
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>8 Agents Online</span>
              </div>
              <div className="text-muted-foreground">·</div>
              <div className="text-foreground">348 Calls Today</div>
              <div className="text-muted-foreground">·</div>
              <div className="text-primary font-bold">92.8% Confirmed</div>
            </div>
          </div>

          {/* Active Call Dialer Console */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Customer & Live Call Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="p-4 rounded-xl border border-border/80 bg-background shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-rose-500/10 text-rose-600 font-bold flex items-center justify-center text-sm">
                      NJ
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-foreground">
                        নুসরাত জাহান (Nusrat Jahan)
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">
                        01712-984321 · Order #9142
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    ৳২,৮৫০ (COD)
                  </span>
                </div>

                {/* Simulated Audio Waveform */}
                <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-500">
                    <Mic className="h-3.5 w-3.5 animate-pulse" />
                    <span>Call in Progress: 00:48</span>
                  </div>
                  {/* Waveform Bars */}
                  <div className="flex items-center gap-1 h-5">
                    {[12, 20, 15, 24, 18, 22, 14, 26, 16, 20, 10, 18, 24, 16].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-primary/70 rounded-full animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">HD Audio · Rec</span>
                </div>
              </div>

              {/* AI Auto-Generated Call Notes */}
              <div className="p-4 rounded-xl border border-border/80 bg-primary/5">
                <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Real-Time Call Transcription & Summary
                </div>
                <p className="text-xs text-foreground leading-relaxed italic">
                  &ldquo;গ্রাহক ২ পিস স্পেশাল কম্বো নিশ্চিত করেছেন। উনি অনুরোধ করেছেন পার্সেলটি বৃহস্পতিবার
                  বিকাল ৫টার পর ধানমন্ডি ঠিকানায় ডেলিভারি করতে।&rdquo;
                </p>
                <div className="mt-2 text-[10px] text-muted-foreground font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Auto-attached to Order #9142 timeline
                </div>
              </div>
            </div>

            {/* Right: Rapid Action Buttons with Keyboard Hotkeys */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                One-Click Call Disposition
              </div>

              <button
                onClick={() => setCallState('confirmed')}
                className="w-full p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Confirm Order & Send to Courier</span>
                </div>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                  [Enter]
                </span>
              </button>

              <button
                onClick={() => alert('Call logged: No Answer (Attempt 1). Scheduled retry in 2 hours.')}
                className="w-full p-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>No Answer (Log Attempt 1)</span>
                </div>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                  [Esc]
                </span>
              </button>

              <button
                onClick={() => alert('Callback scheduled for customer')}
                className="w-full p-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <PhoneForwarded className="h-4 w-4 text-blue-500" />
                  <span>Schedule Callback Later</span>
                </div>
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
                  [Key C]
                </span>
              </button>

              <button
                onClick={() => alert('Order marked as Cancelled / Fake number.')}
                className="w-full p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <PhoneOff className="h-4 w-4 text-rose-500" />
                  <span>Cancel / Fake Customer Flag</span>
                </div>
                <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded font-mono">
                  [Key X]
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
