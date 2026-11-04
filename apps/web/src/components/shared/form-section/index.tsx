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
        'rounded-2xl glass-card p-6',
        className
      )}
    >
      <div className="mb-5 pb-3 border-b border-rose-500/12">
        <h3 className="text-base font-extrabold text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
