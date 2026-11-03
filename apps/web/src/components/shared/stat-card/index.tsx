'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@shopnix/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  growthPercentage?: number;
  description?: string;
  className?: string;
  accentColor?: 'rose' | 'emerald' | 'amber' | 'indigo' | 'sky';
}

export function StatCard({
  title,
  value,
  icon,
  growthPercentage,
  description,
  className,
  accentColor = 'rose',
}: StatCardProps) {
  const isPositive = growthPercentage !== undefined && growthPercentage > 0;
  const isNegative = growthPercentage !== undefined && growthPercentage < 0;

  const gradientBar = {
    rose: 'from-primary via-rose-500 to-pink-500',
    emerald: 'from-emerald-500 via-teal-500 to-cyan-500',
    amber: 'from-amber-500 via-orange-500 to-yellow-500',
    indigo: 'from-indigo-500 via-violet-500 to-purple-500',
    sky: 'from-sky-500 via-blue-500 to-indigo-500',
  }[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 text-card-foreground shadow-xs transition-all hover:shadow-md hover:border-primary/35 group',
        className
      )}
    >
      {/* Top Cinematic Accent Line */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-85', gradientBar)} />

      {/* Subtle Ambient Corner Glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-50" />

      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground/90">
          {title}
        </span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 text-foreground/80 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
            {value}
          </span>
          {growthPercentage !== undefined && (
            <span
              className={cn(
                'inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full',
                isPositive && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                isNegative && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                !isPositive && !isNegative && 'bg-muted text-muted-foreground'
              )}
            >
              {isPositive && <ArrowUpRight className="mr-0.5 h-3 w-3" />}
              {isNegative && <ArrowDownRight className="mr-0.5 h-3 w-3" />}
              {!isPositive && !isNegative && <Minus className="mr-0.5 h-3 w-3" />}
              {Math.abs(growthPercentage)}%
            </span>
          )}
        </div>

        {/* Micro Sparkline SVG */}
        <svg className="h-6 w-14 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 56 24" fill="none">
          <path
            d={
              isNegative
                ? 'M2 4C12 6 18 14 28 13C38 12 44 19 54 21'
                : 'M2 20C12 18 18 11 28 13C38 15 44 6 54 3'
            }
            stroke={isNegative ? '#F43F5E' : '#10B981'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {description && (
        <p className="mt-1.5 text-xs text-muted-foreground font-medium">{description}</p>
      )}
    </motion.div>
  );
}
