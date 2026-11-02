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
    { label: 'Inside App', href: '#inside-app' },
    { label: 'Funnel Builder', href: '#funnel-builder' },
    { label: 'Call Center', href: '#call-center' },
    { label: 'Omnichannel', href: '#omnichannel' },
    { label: 'Couriers', href: '#couriers' },
    { label: 'AI Intelligence', href: '#ai-engine' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Pricing', href: '#pricing' },
  ];

  // Detect scroll position for backdrop elevation & active spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section
      const sections = navLinks.map((l) => l.href.substring(1));
      for (const sectionId of sections.reverse()) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sectionId);
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
          ? 'border-b border-border/80 bg-white/85 dark:bg-card/85 backdrop-blur-xl shadow-xs'
          : 'border-b border-border/40 bg-white/70 dark:bg-background/70 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <ShopnixLogo size={36} />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary bg-primary/10 font-bold'
                    : 'hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Live Courier Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All Couriers Live</span>
          </div>

          <Link
            href="/login"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Slide-Out Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 xl:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Panel */}
          <div className="relative w-full max-w-sm ml-auto h-[calc(100vh-4rem)] bg-card border-l border-border shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Steadfast, Pathao & RedX Live</span>
                </div>
                <ShieldCheck className="h-4 w-4" />
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground px-3 mb-2">
                  Navigation
                </div>
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'text-primary bg-primary/10 font-bold'
                          : 'text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border/80 space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 flex items-center justify-center rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted transition-colors"
              >
                Sign In to Account
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/30 hover:bg-primary/90 transition-all"
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
