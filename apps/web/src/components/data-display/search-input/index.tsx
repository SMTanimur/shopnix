'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@shopnix/utils';

export interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value: initialValue = '',
  onChange,
  placeholder = 'Search records...',
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onChange]);

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 text-sm rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue('');
            onChange('');
          }}
          className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
