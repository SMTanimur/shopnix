'use client';

import React from 'react';
import { Star, Quote, TrendingUp, CheckCircle2 } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        'আগে প্রতিদিন ৪টি আলাদা কুরিয়ার পোর্টালে অ্যাড্রেস কপি-পেস্ট করতে আমাদের ৩ জন কর্মীর ৪ ঘণ্টা সময় লাগতো। Shopnix আসার পর আমরা ১ ক্লিকে সব পার্সেল বুকিং দিচ্ছি এবং ফোন ভেরিফিকেশন দিয়ে রিটার্ন রেট ২২% থেকে ৯%-এ নামিয়ে এনেছি।',
      author: 'তানজিম হাসান (Tanjim Hasan)',
      role: 'Founder & CEO',
      company: 'Dhaka Trends (ফ্যাশন ব্র্যান্ড)',
      location: 'Banani, Dhaka',
      metrics: '৪,৫০০+ অর্ডার / মাস · ৳৬৮ লাখ বার্ষিক রাজস্ব',
      rating: 5,
    },
    {
      quote:
        'Shopnix-এর 1-Click COD Funnel Builder আমাদের বিজ্ঞাপনের কনভার্সন রেট ৩ গুণ বাড়িয়ে দিয়েছে। সাধারণ ওয়ার্ডপ্রেস স্টোরে কাস্টমার ড্রপ করতো, কিন্তু এখানে ১ পেজের ক্যাশ অন ডেলিভারি ফর্মে কাস্টমার খুব সহজেই অর্ডার কনফার্ম করে।',
      author: 'আয়েশা সিদ্দিকা (Ayesha Siddiqua)',
      role: 'Head of Growth',
      company: 'Modest Wear BD (লেডিস ক্লদিং)',
      location: 'Agrabad, Chattogram',
      metrics: '৩,২০০+ অর্ডার / মাস · ৩.৪x Ad ROAS',
      rating: 5,
    },
    {
      quote:
        'সবচেয়ে বড় সুবিধা হলো কল সেন্টারের ইন্টিগ্রেশন। অর্ডার স্ক্রিন থেকেই কাস্টমারকে ফোন দেওয়া যায়, রেকর্ডিং থাকে এবং AI সামারি নিজে থেকেই লিখে দেয়। কুরিয়ার রেমিট্যান্সের টাকার হিসাব মেলানো এখন ১০০% নির্ভুল।',
      author: 'মাহফুজুর রহমান (Mahfuzur Rahman)',
      role: 'Operations Lead',
      company: 'Gadget Vault (ইলেকট্রনিক্স)',
      location: 'Zindabazar, Sylhet',
      metrics: '৭,৮০০+ অর্ডার / মাস · ৯৩.৪% ডেলিভারি রেট',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <Quote className="h-3.5 w-3.5" />
            Merchant Success Stories
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Trusted by Top Bangladeshi{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
              Ecommerce Brands
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            See how merchants in Dhaka, Chittagong, and Sylhet use Shopnix to scale their revenue while
            slashing courier return losses.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-border/70 space-y-1.5">
                <div className="text-sm font-extrabold text-foreground">{t.author}</div>
                <div className="text-xs text-primary font-bold">{t.company}</div>
                <div className="text-[11px] text-muted-foreground">{t.location}</div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md inline-block">
                  {t.metrics}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
