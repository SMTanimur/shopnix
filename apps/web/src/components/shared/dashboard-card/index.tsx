'use client';

import React from 'react';
import { motion } from 'motion/react';
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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl glass-card text-card-foreground overflow-hidden',
        className
      )}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 border-b border-rose-500/12 bg-gradient-to-r from-rose-500/5 via-pink-500/3 to-transparent">
          <div>
            {title && <h3 className="text-sm font-extrabold tracking-tight text-foreground">{title}</h3>}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn('p-5', contentClassName)}>{children}</div>
    </motion.div>
  );
}
