import React from 'react';
import { Sparkles } from 'lucide-react';

export function HeroAnnouncement() {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 mb-8 shadow-xs hover:border-primary/50 transition-colors select-none">
      <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
      <span>Shopnix 2.0 — The 360° Ecommerce OS & Funnel Builder</span>
      <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-primary/50" />
      <span className="hidden sm:inline-block text-[11px] text-muted-foreground font-normal">
        Better than EcomDrive
      </span>
    </div>
  );
}
