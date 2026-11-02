'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '@shopnix/types';
import { cn } from '@shopnix/utils';

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  const { page, total_pages, total, limit } = meta;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card text-xs text-muted-foreground',
        className
      )}
    >
      <div>
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{' '}
        <span className="font-semibold text-foreground">{endItem}</span> of{' '}
        <span className="font-semibold text-foreground">{total}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!meta.has_prev_page}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md border border-border bg-card font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>

        <span className="px-2 font-medium text-foreground">
          {page} / {total_pages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!meta.has_next_page}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md border border-border bg-card font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
