import React from 'react';
import { cn } from '@shopnix/utils';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-6 shadow-xs',
        className
      )}
    >
      <div className="mb-5 pb-3 border-b border-border/60">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
