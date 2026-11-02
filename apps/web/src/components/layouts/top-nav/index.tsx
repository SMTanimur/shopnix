'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, LogOut, Store, User as UserIcon } from 'lucide-react';
import { useUIStore } from '../../../stores/ui.store';
import { useAuthStore } from '../../../stores/auth.store';
import { api } from '../../../lib/api';

export function TopNav() {
  const router = useRouter();
  const { setMobileSidebarOpen, setCommandPaletteOpen } = useUIStore();
  const { user, organization, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore
    } finally {
      logout();
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-card/95 px-4 lg:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {organization && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-xs font-medium text-foreground">
            <Store className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold">{organization.store_name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Global Command Search Button */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-background text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search or command...</span>
          <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded border border-border bg-muted px-1 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Icon */}
        <button
          type="button"
          title="Notifications"
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User Profile Pill & Sign Out */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {user.first_name[0]}
                {user.last_name[0]}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <div className="font-semibold text-foreground">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-[10px] text-muted-foreground capitalize">{user.role}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </header>
  );
}
