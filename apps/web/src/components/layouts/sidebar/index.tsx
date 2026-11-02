'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Users,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Store,
  MessageSquare,
  Bot,
  Workflow,
  Cpu,
} from 'lucide-react';
import { useUIStore } from '../../../stores/ui.store';
import { cn } from '@shopnix/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, isMobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Orders', href: '/orders', icon: ShoppingCart },
    { label: 'Stores', href: '/stores', icon: Store },
    { label: 'Unified Inbox', href: '/inbox', icon: MessageSquare },
    { label: 'Inventory', href: '/inventory', icon: Boxes },
    { label: 'Customers', href: '/customers', icon: Users },
    { label: 'Couriers', href: '/couriers', icon: Truck },
    { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },
    { label: 'Automations', href: '/automations', icon: Workflow },
    { label: 'AI Agents', href: '/ai-agents', icon: Cpu },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-17' : 'w-64',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden font-bold tracking-tight text-foreground"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                Shopnix
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group cursor-pointer',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                  isSidebarCollapsed && 'justify-center px-0'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              <div className="font-semibold text-foreground mb-0.5">Shopnix Pro</div>
              <div>Multi-tenant SaaS v1.0</div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
