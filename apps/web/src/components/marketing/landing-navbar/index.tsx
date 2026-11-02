'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, ShieldCheck, ChevronRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { ShopnixLogo } from '../../brand';
import { useAuthStore } from '../../../stores/auth.store';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inside-app');
  const { isAuthenticated, user } = useAuthStore();

  // Main high-impact sections for uncluttered, premium desktop header
  const mainNavLinks = [
    { label: 'Features', href: '#inside-app' },
    { label: 'Funnels', href: '#funnel-builder' },
    { label: 'Couriers', href: '#couriers' },
    { label: 'Omnichannel', href: '#omnichannel' },
    { label: 'Pricing', href: '#pricing' },
  ];

  // Full module list for mobile slide-out drawer
  const mobileNavLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Platform & Storefronts', href: '#inside-app' },
    { label: '1-Click Funnel Builder', href: '#funnel-builder' },
    { label: 'Softphone Call Center', href: '#call-center' },
    { label: 'Omnichannel Chat & WhatsApp', href: '#omnichannel' },
    { label: 'Courier Hub (Steadfast/Pathao)', href: '#couriers' },
    { label: 'AI Intelligence Studio', href: '#ai-engine' },
    { label: 'Feature Matrix', href: '#comparison' },
    { label: 'Pricing Plans', href: '#pricing' },
  ];

  // Track scroll position for header blur and active section spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ['inside-app', 'funnel-builder', 'couriers', 'omnichannel', 'pricing'];

      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
          : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto flex h-20 items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Left Side: Modern Shopnix Logo with Relevant Shopping + Speed Mark */}
        <Link href="/" className="flex items-center group shrink-0 py-1" aria-label="Shopnix Home">
          <ShopnixLogo size={38} />
        </Link>

        {/* Center: Desktop Navigation Links (5 Core Platform Modules with generous font size and spacing) */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[14.5px] font-semibold text-slate-600 dark:text-slate-300">
          {mainNavLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 font-bold shadow-xs'
                    : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Side: Live Courier Status, Sign In, and Premium Crimson CTA */}
        <div className="hidden sm:flex items-center gap-3.5 shrink-0">
          {/* Live Courier Status Micro-Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="whitespace-nowrap">All Couriers Live</span>
          </div>

          <div className="hidden xl:block h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 h-11 px-5.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group whitespace-nowrap"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              {/* Sign In Link */}
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>

              {/* High-Velocity Crimson CTA Button */}
              <Link
                href="/register"
                className="inline-flex items-center gap-2 h-11 px-5.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group whitespace-nowrap"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-50 lg:hidden">
          {/* Frosted Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Panel */}
          <div className="relative w-full max-w-sm ml-auto h-[calc(100vh-5rem)] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Live Courier Status Card */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Steadfast, Pathao & RedX Live</span>
                </div>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>

              {/* Navigation Links List */}
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-rose-500" />
                  <span>Platform Modules</span>
                </div>
                {mobileNavLinks.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 font-bold'
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
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white text-sm font-semibold shadow-md shadow-rose-500/25 hover:opacity-95 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Operations Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-11 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Sign In to Account
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white text-sm font-semibold shadow-md shadow-rose-500/25 hover:opacity-95 transition-all"
                  >
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingNavbar;
