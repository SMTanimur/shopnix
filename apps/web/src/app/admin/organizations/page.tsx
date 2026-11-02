'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Search,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  X,
  Sliders,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@shopnix/utils';
import type { OrganizationAdminView } from '@shopnix/types';

export default function AdminOrganizationsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<OrganizationAdminView | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState('growth');

  const { data: orgs, isLoading, refetch } = useQuery({
    queryKey: ['admin-organizations'],
    queryFn: async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch('http://localhost:8000/api/v1/admin/organizations', {
        headers: { Authorization: `Bearer ${tokens?.access_token || ''}` },
      });
      if (!res.ok) throw new Error('Failed to load organizations');
      const json = await res.json();
      return json.data as OrganizationAdminView[];
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isSuspended }: { id: string; isSuspended: boolean }) => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch(`http://localhost:8000/api/v1/admin/organizations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.access_token || ''}`,
        },
        body: JSON.stringify({
          is_suspended: isSuspended,
          suspension_reason: isSuspended ? 'Policy violation or payment overdue' : undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, plan }: { id: string; plan: string }) => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch(`http://localhost:8000/api/v1/admin/organizations/${id}/plan`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.access_token || ''}`,
        },
        body: JSON.stringify({ plan_id: plan }),
      });
      if (!res.ok) throw new Error('Failed to update plan');
      return res.json();
    },
    onSuccess: () => {
      setIsPlanModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
    },
  });

  const filtered = (orgs || []).filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.owner_email.toLowerCase().includes(q) || o.slug.includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Organization Tenants</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage merchant stores, adjust feature limits, and enforce subscription entitlements
          </p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-red-500"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Organization</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Orders</th>
              <th className="py-3 px-4">GMV (৳)</th>
              <th className="py-3 px-4">AI Tokens</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filtered.map((org) => (
              <tr key={org.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">
                  {org.name}
                  <span className="block text-[10px] text-slate-500 font-normal">{org.slug}</span>
                </td>
                <td className="py-3 px-4">
                  {org.owner_name}
                  <span className="block text-[10px] text-slate-500">{org.owner_email}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase text-[10px] font-bold">
                    {org.subscription_plan}
                  </span>
                </td>
                <td className="py-3 px-4">{org.total_orders}</td>
                <td className="py-3 px-4 font-medium text-white">{formatCurrency(org.total_revenue)}</td>
                <td className="py-3 px-4 font-mono">{org.ai_token_usage_this_month.toLocaleString()}</td>
                <td className="py-3 px-4">
                  {org.is_suspended ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold text-[10px]">
                      Suspended
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                      Active
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrg(org);
                      setSelectedPlanCode(org.subscription_plan);
                      setIsPlanModalOpen(true);
                    }}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-white cursor-pointer"
                  >
                    Change Plan
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleStatusMutation.mutate({
                        id: org.id,
                        isSuspended: !org.is_suspended,
                      })
                    }
                    className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer ${
                      org.is_suspended
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {org.is_suspended ? 'Reactivate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Plan Modal */}
      {isPlanModalOpen && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Update Plan for {selectedOrg.name}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select the target subscription tier to immediately update store limits and entitlements.
            </p>

            <div className="space-y-2 mb-5">
              {['starter', 'growth', 'enterprise'].map((p) => (
                <label
                  key={p}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                    selectedPlanCode === p
                      ? 'border-red-500 bg-red-500/10 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400'
                  }`}
                >
                  <span className="capitalize text-xs font-semibold">{p} Tier</span>
                  <input
                    type="radio"
                    name="plan_choice"
                    value={p}
                    checked={selectedPlanCode === p}
                    onChange={() => setSelectedPlanCode(p)}
                    className="text-red-500"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  updatePlanMutation.mutate({
                    id: selectedOrg.id,
                    plan: selectedPlanCode,
                  })
                }
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer"
              >
                Save Entitlements
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
