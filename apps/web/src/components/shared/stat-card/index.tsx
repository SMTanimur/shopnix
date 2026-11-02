import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@shopnix/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  growthPercentage?: number;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  growthPercentage,
  description,
  className,
}: StatCardProps) {
  const isPositive = growthPercentage !== undefined && growthPercentage > 0;
  const isNegative = growthPercentage !== undefined && growthPercentage < 0;

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-5 text-card-foreground shadow-xs transition-shadow hover:shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-medium tracking-wide uppercase">{title}</span>
        {icon && <div className="text-muted-foreground/80">{icon}</div>}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        {growthPercentage !== undefined && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded-sm',
              isPositive && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
              isNegative && 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
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

      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
