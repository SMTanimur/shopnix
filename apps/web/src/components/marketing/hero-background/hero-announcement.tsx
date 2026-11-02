import React from 'react';
import { Sparkles } from 'lucide-react';

export function HeroAnnouncement() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60 mb-8 shadow-xs hover:border-rose-300 dark:hover:border-rose-700 transition-colors select-none">
      <Sparkles className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
      <span>Shopnix 2.0 — The 360° Ecommerce OS & Funnel Builder</span>
    </div>
  );
}
