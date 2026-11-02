'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Check, Sliders, Zap, Shield } from 'lucide-react';
import { formatCurrency } from '@shopnix/utils';
import type { PlatformSubscriptionPlan } from '@shopnix/types';

export default function AdminSubscriptionsPage() {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<PlatformSubscriptionPlan | null>(null);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [maxStores, setMaxStores] = useState(1);
  const [maxOrders, setMaxOrders] = useState(100);
  const [maxAiTokens, setMaxAiTokens] = useState(50000);

  const { data: plans, isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch('http://localhost:8000/api/v1/admin/subscriptions', {
        headers: { Authorization: `Bearer ${tokens?.access_token || ''}` },
      });
      if (!res.ok) throw new Error('Failed to load plans');
      const json = await res.json();
      return json.data as PlatformSubscriptionPlan[];
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!editingPlan) return;
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch(`http://localhost:8000/api/v1/admin/subscriptions/${editingPlan.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.access_token || ''}`,
        },
        body: JSON.stringify({
          monthly_price_bdt: monthlyPrice,
          limits: {
            max_stores: maxStores,
            max_orders_per_month: maxOrders,
            max_ai_tokens_per_month: maxAiTokens,
          },
        }),
      });
      if (!res.ok) throw new Error('Failed to update plan');
      return res.json();
    },
    onSuccess: () => {
      setEditingPlan(null);
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
    },
  });

  const handleEdit = (p: PlatformSubscriptionPlan) => {
    setEditingPlan(p);
    setMonthlyPrice(p.monthly_price_bdt);
    setMaxStores(p.limits.max_stores);
    setMaxOrders(p.limits.max_orders_per_month);
    setMaxAiTokens(p.limits.max_ai_tokens_per_month);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Subscription Plan Entitlements</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure multi-tenant SaaS tiers, feature flags, store connection limits, and monthly AI quotas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(plans || []).map((plan) => (
          <div
            key={plan.id}
            className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-white">{plan.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] uppercase font-bold text-slate-300">
                  {plan.code}
                </span>
              </div>

              <div className="mb-5">
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(plan.monthly_price_bdt)}
                </span>
                <span className="text-xs text-slate-500 ml-1">/ month</span>
              </div>

              {/* Limits */}
              <div className="space-y-2 text-xs text-slate-300 mb-6">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Stores Allowed</span>
                  <span className="font-semibold text-white">{plan.limits.max_stores} stores</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Monthly Orders</span>
                  <span className="font-semibold text-white">{plan.limits.max_orders_per_month} orders</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">AI Token Quota</span>
                  <span className="font-semibold text-white">{plan.limits.max_ai_tokens_per_month.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Team Seats</span>
                  <span className="font-semibold text-white">{plan.limits.max_team_members} members</span>
                </div>
              </div>

              {/* Features checklist */}
              <div className="space-y-1.5 text-xs">
                {Object.entries(plan.features).map(([feat, enabled]) => (
                  <div key={feat} className="flex items-center gap-2 text-slate-400">
                    <Check className={`h-3.5 w-3.5 ${enabled ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={enabled ? 'text-slate-200' : 'text-slate-500 line-through'}>
                      {feat.replace(/_/g, ' ').replace('enabled', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleEdit(plan)}
              className="mt-6 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sliders className="h-3.5 w-3.5" />
              Adjust Limits & Pricing
            </button>
          </div>
        ))}
      </div>

      {/* Adjust Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-1">Adjust {editingPlan.name}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Update billing and quota thresholds for all organizations assigned to this plan.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Monthly Price (BDT ৳)</label>
                <input
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Max Stores</label>
                  <input
                    type="number"
                    value={maxStores}
                    onChange={(e) => setMaxStores(parseInt(e.target.value) || 1)}
                    className="w-full h-8 px-2.5 rounded-md border border-slate-700 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Max Monthly Orders</label>
                  <input
                    type="number"
                    value={maxOrders}
                    onChange={(e) => setMaxOrders(parseInt(e.target.value) || 100)}
                    className="w-full h-8 px-2.5 rounded-md border border-slate-700 bg-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Monthly AI Tokens Quota</label>
                <input
                  type="number"
                  step="10000"
                  value={maxAiTokens}
                  onChange={(e) => setMaxAiTokens(parseInt(e.target.value) || 50000)}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => updatePlanMutation.mutate()}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Save Tier Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
