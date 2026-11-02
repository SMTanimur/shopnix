'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Cpu,
  Workflow,
  ShieldAlert,
  ArrowRight,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@shopnix/utils';

export default function SuperAdminOverviewPage() {
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch('http://localhost:8000/api/v1/admin/metrics', {
        headers: {
          Authorization: `Bearer ${tokens?.access_token || ''}`,
        },
      });

      if (!res.ok) throw new Error('Failed to load admin metrics');
      const json = await res.json();
      return json.data;
    },
  });

  const cards = [
    {
      title: 'Total Organizations',
      value: metrics?.total_organizations ?? 1,
      desc: 'Active merchant accounts',
      icon: Building2,
      color: 'text-blue-400',
    },
    {
      title: 'Active Subscriptions',
      value: metrics?.active_subscriptions ?? 1,
      desc: 'Paying and trial stores',
      icon: CreditCard,
      color: 'text-emerald-400',
    },
    {
      title: 'Registered Users',
      value: metrics?.total_users ?? 2,
      desc: 'Store owners and staff',
      icon: Users,
      color: 'text-violet-400',
    },
    {
      title: 'Platform GMV',
      value: formatCurrency(metrics?.total_gmv_bdt ?? 125000),
      desc: 'Processed transaction volume',
      icon: TrendingUp,
      color: 'text-amber-400',
    },
    {
      title: 'AI Tokens Consumed',
      value: (metrics?.total_ai_tokens_consumed ?? 45000).toLocaleString(),
      desc: 'Platform-wide LLM token usage',
      icon: Cpu,
      color: 'text-pink-400',
    },
    {
      title: 'Workflow Executions',
      value: metrics?.total_workflows_executed ?? 3,
      desc: 'Automated event triggers',
      icon: Workflow,
      color: 'text-cyan-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Super Admin Platform Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-tenant operations, AI usage telemetry, and billing control
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/organizations"
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Manage Tenants
          </Link>
          <Link
            href="/admin/ai"
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors"
          >
            AI Control Vault
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{c.title}</span>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{c.value}</div>
              <span className="text-[11px] text-slate-500">{c.desc}</span>
            </div>
          );
        })}
      </div>

      {/* Recent Platform Audit Activity Feed */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <ShieldAlert className="h-4 w-4 text-red-400" />
          Recent Platform Administrative Audit Log
        </h3>

        <div className="divide-y divide-slate-800/80">
          {(metrics?.recent_activity || []).map((act: any) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white">{act.action}</span>
                <span className="text-slate-400 ml-2">by {act.admin_email}</span>
                <span className="text-slate-500 block text-[10px] mt-0.5">
                  Target: {act.target_type} ({act.target_id})
                </span>
              </div>
              <span className="text-slate-500 text-[11px]">{formatDate(act.created_at)}</span>
            </div>
          ))}

          {(!metrics?.recent_activity || metrics.recent_activity.length === 0) && (
            <div className="py-6 text-center text-xs text-slate-500">
              No administrative audit events recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
