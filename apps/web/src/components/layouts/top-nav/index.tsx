'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Store,
  ShoppingBag,
  AlertTriangle,
  Mail,
  CheckCheck,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useUIStore } from '../../../stores/ui.store';
import { useAuthStore } from '../../../stores/auth.store';
import { api } from '../../../lib/api';
import { formatDate } from '@shopnix/utils';

interface NotificationItem {
  id: string;
  type: 'order' | 'stock' | 'store' | 'email' | 'system';
  title: string;
  message: string;
  href: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
  created_at: string;
  read: boolean;
}

export function TopNav() {
  const router = useRouter();
  const { setMobileSidebarOpen, setCommandPaletteOpen } = useUIStore();
  const { user, organization, logout } = useAuthStore();
  const openMobileSidebar = () => setMobileSidebarOpen(true);
  const openCommandPalette = () => setCommandPaletteOpen(true);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'order' | 'stock' | 'store'>('all');
  const [readIds, setReadIds] = useState<string[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery<NotificationItem[]>({
    queryKey: ['top-nav-notifications'],
    queryFn: async () => {
      const res = await api.axios.get('/organizations/current/notifications');
      return res.data?.data || [];
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore logout API error
    } finally {
      logout();
      router.push('/login');
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.read && !readIds.includes(n.id)
  ).length;

  const filteredNotifications = notifications.filter((n) =>
    notifFilter === 'all' ? true : n.type === notifFilter
  );

  const markAllRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  const getNotifIcon = (type: NotificationItem['type'], severity: NotificationItem['severity']) => {
    if (type === 'order') return <ShoppingBag className="h-4 w-4 text-rose-600" />;
    if (type === 'stock') return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    if (type === 'store') return <Store className="h-4 w-4 text-emerald-600" />;
    if (type === 'email') return <Mail className="h-4 w-4 text-sky-600" />;
    return (
      <Sparkles
        className={`h-4 w-4 ${severity === 'danger' ? 'text-rose-600' : 'text-primary'}`}
      />
    );
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-header flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Trigger & Active Store Pill */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-primary transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {organization && (
          <Link
            href="/stores"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-rose-50/80 border border-rose-500/15 text-xs font-bold text-foreground transition-all shadow-2xs group"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
            <Store className="h-3.5 w-3.5 text-primary" />
            <span>{organization.store_name}</span>
            <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              • Channels
            </span>
          </Link>
        )}
      </div>

      {/* Right: Command Search, Quick Store Connect, Notification Center & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={openCommandPalette}
          className="flex items-center gap-2.5 h-9 px-3.5 rounded-xl border border-rose-500/15 bg-white/75 text-xs text-muted-foreground hover:text-foreground hover:border-rose-500/35 hover:shadow-xs transition-all cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-rose-500" />
          <span className="hidden md:inline font-medium">Search orders, SKUs, commands...</span>
          <span className="md:hidden font-medium">Search...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded-md border border-rose-500/15 bg-rose-500/8 px-1.5 font-mono text-[10px] font-bold text-rose-700">
            ⌘K
          </kbd>
        </button>

        {/* Quick Connect Store / New Order Pill */}
        <Link
          href="/stores"
          className="hidden xl:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-700 text-xs font-bold transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Connect Store
        </Link>

        {/* Interactive Notifications Bell & Glass Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-xl border border-rose-500/15 bg-white/75 text-slate-600 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 transition-all cursor-pointer shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-1 text-[9px] font-extrabold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl glass-modal overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-rose-500/15 bg-gradient-to-r from-rose-500/8 to-pink-500/5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-rose-600" />
                    <span className="text-xs font-extrabold text-foreground">
                      Notifications Center
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-rose-500/10 bg-white/50">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'order', label: 'Orders' },
                    { id: 'stock', label: 'Stock Alerts' },
                    { id: 'store', label: 'Store Sync' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setNotifFilter(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        notifFilter === tab.id
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'text-muted-foreground hover:bg-rose-500/10 hover:text-foreground'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-rose-500/10">
                  {filteredNotifications.map((item) => {
                    const isRead = item.read || readIds.includes(item.id);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          setReadIds((prev) => [...prev, item.id]);
                          setIsNotifOpen(false);
                        }}
                        className={`flex items-start gap-3 p-3.5 hover:bg-rose-500/6 transition-colors ${
                          !isRead ? 'bg-rose-500/4' : ''
                        }`}
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/15">
                          {getNotifIcon(item.type, item.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-foreground truncate">
                              {item.title}
                            </p>
                            {!isRead && (
                              <span className="h-2 w-2 rounded-full bg-rose-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                            {item.message}
                          </p>
                          <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                            {formatDate(item.created_at, 'short')}
                          </span>
                        </div>
                      </Link>
                    );
                  })}

                  {filteredNotifications.length === 0 && (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No notifications in this category.
                    </div>
                  )}
                </div>

                {/* Footer Link to Email & Notification Settings */}
                <div className="p-2.5 border-t border-rose-500/12 bg-white/70 flex items-center justify-between">
                  <Link
                    href="/settings"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Configure Email & Notification Alerts
                  </Link>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-rose-500/15">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 text-white font-bold text-xs shadow-xs shadow-rose-500/20">
            {user?.first_name?.[0] || 'U'}
            {user?.last_name?.[0] || ''}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-foreground leading-none">
              {user ? `${user.first_name} ${user.last_name}` : 'Merchant'}
            </div>
            <div className="text-[10px] font-semibold text-rose-600 capitalize mt-0.5">
              {user?.role || 'Owner'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
