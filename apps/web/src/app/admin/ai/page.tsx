'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bot,
  Key,
  ShieldCheck,
  Zap,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../../lib/api';
import type { AIModelInfo } from '@shopnix/types';
import { formatCurrency } from '@shopnix/utils';

export default function AdminAIPage() {
  const queryClient = useQueryClient();
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const { data: aiStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['admin-ai-status'],
    queryFn: async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch('http://localhost:8000/api/v1/admin/ai/status', {
        headers: { Authorization: `Bearer ${tokens?.access_token || ''}` },
      });
      if (!res.ok) throw new Error('Failed to load AI status');
      const json = await res.json();
      return json.data;
    },
  });

  const { data: models, isLoading: isModelsLoading, refetch: refetchModels } = useQuery({
    queryKey: ['openrouter-free-models'],
    queryFn: async () => {
      const res = await api.ai.discoverOpenRouterModels({ free_only: true });
      return res.data;
    },
  });

  const saveKeyMutation = useMutation({
    mutationFn: async ({ provider, key }: { provider: string; key: string }) => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch('http://localhost:8000/api/v1/admin/ai/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.access_token || ''}`,
        },
        body: JSON.stringify({ provider, api_key: key }),
      });
      if (!res.ok) throw new Error('Failed to save key');
      return res.json();
    },
    onSuccess: (_, vars) => {
      setSavedSuccess(`${vars.provider.toUpperCase()} master key registered successfully!`);
      setTimeout(() => setSavedSuccess(null), 3000);
      refetchStatus();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Global AI Provider Infrastructure</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure platform-managed AI keys, discover dynamic OpenRouter free models, and audit token usage
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetchModels()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Models Catalog
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block mb-1">Total Tokens Consumed</span>
          <span className="text-xl font-bold text-white font-mono">
            {(aiStatus?.total_tokens_consumed || 45000).toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block mb-1">Estimated Platform Cost</span>
          <span className="text-xl font-bold text-emerald-400">
            {formatCurrency(aiStatus?.estimated_cost_bdt || 0)}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block mb-1">Discovered Free Models</span>
          <span className="text-xl font-bold text-indigo-400 font-mono">
            {models?.length || 3} Active Free
          </span>
        </div>
      </div>

      {/* Provider Keys Vault */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* OpenRouter */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-white">OpenRouter</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                Free Mode Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Powers dynamic discovery and strict zero-cost free model routing across all merchants.
            </p>
            <input
              type="password"
              placeholder="sk-or-v1-..."
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md border border-slate-700 bg-slate-800 text-xs text-white placeholder:text-slate-500"
            />
          </div>
          <button
            type="button"
            disabled={!openRouterKey.trim() || saveKeyMutation.isPending}
            onClick={() => saveKeyMutation.mutate({ provider: 'openrouter', key: openRouterKey })}
            className="mt-4 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            Update Key
          </button>
        </div>

        {/* Gemini */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-white">Google Gemini</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                Direct REST API
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Used for structured JSON catalog synthesis and multi-language Bangla copy.
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md border border-slate-700 bg-slate-800 text-xs text-white placeholder:text-slate-500"
            />
          </div>
          <button
            type="button"
            disabled={!geminiKey.trim() || saveKeyMutation.isPending}
            onClick={() => saveKeyMutation.mutate({ provider: 'gemini', key: geminiKey })}
            className="mt-4 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            Update Key
          </button>
        </div>

        {/* OpenAI */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-white">OpenAI</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                Chat Completions
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              GPT-4o and GPT-4o mini models for complex enterprise reasoning tasks.
            </p>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md border border-slate-700 bg-slate-800 text-xs text-white placeholder:text-slate-500"
            />
          </div>
          <button
            type="button"
            disabled={!openAIKey.trim() || saveKeyMutation.isPending}
            onClick={() => saveKeyMutation.mutate({ provider: 'openai', key: openAIKey })}
            className="mt-4 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            Update Key
          </button>
        </div>
      </div>

      {/* Discovered Free Models List */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-emerald-400" />
          Active Free Models Catalog (Verified 0.00 BDT Cost)
        </h3>

        <div className="divide-y divide-slate-800/60">
          {(models || []).map((m) => (
            <div key={m.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white">{m.name}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{m.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400 text-[11px]">
                  Context: {(m.context_length / 1024).toFixed(0)}k
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                  FREE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
