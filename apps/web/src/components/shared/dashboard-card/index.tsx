import React from 'react';
import { cn } from '@shopnix/utils';

export interface DashboardCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DashboardCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-xs',
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn('p-5', contentClassName)}>{children}</div>
    </div>
  );
}
