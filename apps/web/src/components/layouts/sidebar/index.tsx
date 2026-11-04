'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Store,
  MessageSquare,
  Workflow,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { cn } from '@shopnix/utils';
import { useUIStore } from '../../../stores/ui.store';
import { ShopnixLogo } from '../../brand';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Command & Analytics',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Commerce & Catalog',
    items: [
      { label: 'Orders', href: '/orders', icon: ShoppingCart, badge: 'COD' },
      { label: 'Products', href: '/products', icon: Package },
      { label: 'Inventory', href: '/inventory', icon: Warehouse },
      { label: 'Customers', href: '/customers', icon: Users },
    ],
  },
  {
    title: 'Omnichannel & Logistics',
    items: [
      { label: 'Stores', href: '/stores', icon: Store, badge: 'Sync' },
      { label: 'Unified Inbox', href: '/inbox', icon: MessageSquare },
      { label: 'Couriers', href: '/couriers', icon: Truck },
    ],
  },
  {
    title: 'AI & Automation',
    items: [
      { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },
      { label: 'Automations', href: '/automations', icon: Workflow },
      { label: 'AI Agents', href: '/admin/ai-agents', icon: Cpu },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { label: 'Settings & Email', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, isMobileSidebarOpen, setMobileSidebarOpen } =
    useUIStore();
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen glass-sidebar flex flex-col transition-all duration-300 ease-in-out select-none',
          isSidebarCollapsed ? 'w-[72px]' : 'w-64',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Specular Rose Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 opacity-80" />

        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-rose-500/12">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden group"
            onClick={closeMobileSidebar}
          >
            <ShopnixLogo
              variant={isSidebarCollapsed ? 'icon' : 'full'}
              size={28}
            />
          </Link>

          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/15 bg-white/70 text-muted-foreground hover:bg-rose-500/10 hover:text-primary hover:border-rose-500/30 transition-all cursor-pointer shadow-2xs"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Categorized Navigation Groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 scrollbar-none">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-2.5 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-rose-950/45">
                  {group.title}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard' || pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileSidebar}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 group',
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:bg-rose-500/8 hover:text-rose-700',
                      isSidebarCollapsed && 'justify-center px-2'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 shadow-md shadow-rose-500/25"
                      />
                    )}

                    <span className="relative z-10 flex items-center justify-center">
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105',
                          isActive
                            ? 'text-white'
                            : 'text-slate-500 group-hover:text-rose-600'
                        )}
                      />
                    </span>

                    {!isSidebarCollapsed && (
                      <span className="relative z-10 flex-1 truncate">{item.label}</span>
                    )}

                    {!isSidebarCollapsed && item.badge && (
                      <span
                        className={cn(
                          'relative z-10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Glass Status Footer */}
        <div className="p-3 border-t border-rose-500/12">
          {!isSidebarCollapsed ? (
            <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/8 via-pink-500/5 to-white/60 p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                  <span className="text-xs font-extrabold text-foreground">Shopnix Pro OS</span>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                Multi-Store Sync, Trackflow & AI Fraud Shield Active
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <span
                className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"
                title="Shopnix Pro OS Live"
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
