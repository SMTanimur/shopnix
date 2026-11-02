import React from 'react';
import { cn } from '@shopnix/utils';

export interface LoadingStateProps {
  rows?: number;
  className?: string;
}

export function LoadingState({ rows = 5, className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-3 p-4', className)}>
      <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse mb-6" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted rounded-md animate-pulse shrink-0" />
          <div className="h-5 flex-1 bg-muted rounded-md animate-pulse" />
          <div className="h-5 w-24 bg-muted rounded-md animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded-md animate-pulse" />
        </div>
      ))}
    </div>
  );
}
