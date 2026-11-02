'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@shopnix/utils';

export interface DateRangePickerProps {
  selectedRange?: string;
  onRangeChange: (range: string) => void;
  className?: string;
}

export function DateRangePicker({
  selectedRange = '30d',
  onRangeChange,
  className,
}: DateRangePickerProps) {
  const ranges = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-lg border border-border bg-card text-card-foreground',
        className
      )}
    >
      <Calendar className="h-4 w-4 ml-1.5 mr-0.5 text-muted-foreground" />
      {ranges.map((range) => {
        const isSelected = selectedRange === range.value;
        return (
          <button
            key={range.value}
            type="button"
            onClick={() => onRangeChange(range.value)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer',
              isSelected
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
