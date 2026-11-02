import React from 'react';
import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import { ShopnixIcon } from '../components/brand';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/60 dark:bg-background text-center">
      <div className="max-w-md w-full p-8 rounded-2xl border border-border/80 bg-card shadow-xl space-y-6">
        <div className="flex justify-center">
          <ShopnixIcon size={52} />
        </div>
        <div className="space-y-2">
          <div className="text-5xl font-black text-rose-600">404</div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Page Not Found</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been relocated, or requires authentication.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-semibold shadow-md shadow-rose-500/25 hover:opacity-95 transition-all"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
