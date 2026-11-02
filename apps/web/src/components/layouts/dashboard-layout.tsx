'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav';
import { CommandPalette } from './command-palette';
import { useUIStore } from '../../stores/ui.store';
import { cn } from '@shopnix/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'lg:pl-17' : 'lg:pl-64'
        )}
      >
        <TopNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette />
    </div>
  );
}
