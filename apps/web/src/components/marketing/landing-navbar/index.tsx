'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { ShopnixLogo } from '../../brand';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Platform', href: '#inside-app' },
    { label: 'Funnels', href: '#funnel-builder' },
    { label: 'Call Center', href: '#call-center' },
    { label: 'Omnichannel', href: '#omnichannel' },
    { label: 'Couriers', href: '#couriers' },
    { label: 'AI Studio', href: '#ai-engine' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Pricing', href: '#pricing' },
  ];

  // Track scroll position for header blur and active section spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

      const sectionIds = [
        'overview',
        'inside-app',
        'funnel-builder',
        'call-center',
        'omnichannel',
        'couriers',
        'ai-engine',
        'comparison',
        'pricing',
      ];

      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs'
          : 'bg-white/70 dark:bg-background/70 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Professional Shopnix Logo */}
        <Link href="/" className="flex items-center group shrink-0 py-1">
          <ShopnixLogo size={36} />
        </Link>

        {/* Center: Desktop Navigation Links (Sophisticated Spacing, No Chunky Red Boxes) */}
        <nav className="hidden xl:flex items-center gap-1 text-[13px] font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-primary font-bold bg-primary/10'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Side: Status Badge, Sign In, and Premium Crimson CTA */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Live Courier Status Micro-Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All Couriers Live</span>
          </div>

          <div className="hidden lg:block h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Sign In Text Button */}
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
          >
            Sign In
          </Link>

          {/* High-Velocity CTA Button */}
          <Link
            href="/register"
            className="inline-flex items-center gap-2 h-10 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-primary via-rose-500 to-pink-600 text-white hover:opacity-95 transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-18 z-50 xl:hidden">
          {/* Frosted Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Panel */}
          <div className="relative w-full max-w-sm ml-auto h-[calc(100vh-4.5rem)] bg-white dark:bg-card border-l border-border shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Live Courier Status Card */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Steadfast, Pathao & RedX Live</span>
                </div>
                <ShieldCheck className="h-4 w-4" />
              </div>

              {/* Navigation Links List */}
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-muted-foreground px-3 mb-2">
                  Platform Modules
                </div>
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'text-primary bg-primary/10 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Cluster */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In to Account
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-rose-600 text-white text-xs font-bold shadow-md shadow-primary/30 hover:opacity-95 transition-all"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
