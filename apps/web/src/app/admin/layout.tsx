'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Bot,
  ShieldAlert,
  LogOut,
  Shield,
  Activity,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show the dashboard shell
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  const navItems = [
    { label: 'Control Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Organizations', href: '/admin/organizations', icon: Building2 },
    { label: 'Subscription Plans', href: '/admin/subscriptions', icon: CreditCard },
    { label: 'Global AI Infrastructure', href: '/admin/ai', icon: Bot },
    { label: 'Platform Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
  ];

  const handleAdminLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shopnix_admin_tokens');
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Super Admin Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400 font-bold">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">Shopnix Control</span>
            <span className="text-[10px] text-red-400 uppercase font-semibold tracking-wider">Super Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-red-500/15 text-red-300 font-semibold border-l-2 border-red-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Exit Control Center</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">All Platform Microservices Operational</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-mono text-slate-300">
              API Port: 8000
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-mono text-slate-300">
              Web Port: 5000
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
