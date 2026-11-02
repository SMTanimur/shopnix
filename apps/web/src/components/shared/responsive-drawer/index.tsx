'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@shopnix/utils';

export interface ResponsiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export function ResponsiveDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'md',
}: ResponsiveDrawerProps) {
  if (!isOpen) return null;

  const widthClasses = {
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  }[width];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={cn(
          'w-full bg-card border-t sm:border-l border-border p-6 shadow-xl max-h-[90vh] sm:h-full sm:max-h-screen flex flex-col transition-transform',
          widthClasses
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 space-y-4">{children}</div>

        {footer && <div className="pt-4 border-t border-border mt-auto">{footer}</div>}
      </div>
    </div>
  );
}
