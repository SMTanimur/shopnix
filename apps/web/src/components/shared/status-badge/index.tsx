import React from 'react';
import { cn } from '@shopnix/utils';

export type BadgeVariant =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'active'
  | 'draft'
  | 'archived'
  | 'paid'
  | 'unpaid'
  | 'partial'
  | 'high_risk';

export interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const normalized = (variant || status.toLowerCase()) as BadgeVariant;

  const styleMap: Record<BadgeVariant, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    confirmed: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    processing: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    returned: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    draft: 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
    archived: 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    unpaid: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    partial: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    high_risk: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700',
  };

  const badgeStyle = styleMap[normalized] || 'bg-muted text-muted-foreground border-border';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize transition-colors',
        badgeStyle,
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
