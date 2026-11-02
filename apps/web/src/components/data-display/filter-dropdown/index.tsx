'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@shopnix/utils';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  selectedValue,
  onSelect,
  className,
}: FilterDropdownProps) {
  return (
    <div className={cn('relative inline-block', className)}>
      <div className="flex items-center gap-1.5 h-9 px-3 text-xs font-medium rounded-md border border-border bg-card text-foreground hover:bg-muted/50 cursor-pointer transition-colors">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{label}:</span>
        <select
          value={selectedValue || ''}
          onChange={(e) => onSelect(e.target.value)}
          className="bg-transparent text-foreground font-semibold focus:outline-hidden cursor-pointer"
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
