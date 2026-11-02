'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Users,
  Truck,
  BarChart3,
  Settings,
  PlusCircle,
  Search,
  X,
} from 'lucide-react';
import { useUIStore } from '../../../stores/ui.store';

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (path: string) => {
    setCommandPaletteOpen(false);
    router.push(path);
  };

  const navActions = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'All Products', icon: Package, path: '/products' },
    { label: 'Create New Product', icon: PlusCircle, path: '/products/new' },
    { label: 'Orders & Shipments', icon: ShoppingCart, path: '/orders' },
    { label: 'Warehouse Inventory', icon: Boxes, path: '/inventory' },
    { label: 'Customers & CRM', icon: Users, path: '/customers' },
    { label: 'Courier Logistics', icon: Truck, path: '/couriers' },
    { label: 'Business Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Store Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-lg border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground mr-2.5" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or jump to page... (ESC to exit)"
            className="w-full h-12 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-hidden"
          />
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(false)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground px-3 py-1.5">
            Navigation & Actions
          </div>
          <div className="space-y-0.5">
            {navActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  type="button"
                  onClick={() => navigateTo(action.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/70 transition-colors text-left cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
