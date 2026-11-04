'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sidebar } from '../sidebar';
import { TopNav } from '../top-nav';
import { CommandPalette } from '../command-palette';
import { useUIStore } from '../../../stores/ui.store';
import { cn } from '@shopnix/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="relative min-h-screen ambient-rose-mesh text-foreground flex overflow-x-hidden">
      {/* Cinematic Ambient Rose / Pink Light Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-28 left-1/4 h-96 w-96 rounded-full bg-rose-500/8 blur-3xl" />
        <div
          className="animate-float-slow absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-pink-500/7 blur-3xl"
          style={{ animationDelay: '-5s' }}
        />
        <div
          className="animate-float-slow absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-rose-600/6 blur-3xl"
          style={{ animationDelay: '-9s' }}
        />
      </div>

      {/* Glass Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        <TopNav />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette />
    </div>
  );
}
