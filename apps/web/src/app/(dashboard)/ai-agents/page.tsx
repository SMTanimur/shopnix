'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Cpu,
  Plus,
  Bot,
  Sparkles,
  Shield,
  Search,
  MessageSquare,
  Package,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader, LoadingState, ErrorState, StatusBadge } from '../../../components/shared';
import type { AIAgentDefinition } from '@shopnix/types';

export default function AIAgentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgentDefinition | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('sales_agent');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState('google/gemini-2.0-flash-exp:free');
  const [allowedTools, setAllowedTools] = useState<string[]>(['search_catalog', 'order_status']);

  const { data: agents, isLoading, isError, refetch } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: async () => {
      const res = await api.ai.listAgents();
      return res.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingAgent) {
        return api.ai.updateAgent(editingAgent.id, {
          name,
          role,
          description,
          system_prompt: systemPrompt,
          model,
          allowed_tools: allowedTools,
        });
      }
      return api.ai.createAgent({
        name,
        role,
        description,
        system_prompt: systemPrompt,
        model,
        allowed_tools: allowedTools,
      });
    },
    onSuccess: () => {
      setIsModalOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.ai.deleteAgent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    },
  });

  const resetForm = () => {
    setEditingAgent(null);
    setName('');
    setRole('sales_agent');
    setDescription('');
    setSystemPrompt('');
    setAllowedTools(['search_catalog', 'order_status']);
  };

  const handleEdit = (agent: AIAgentDefinition) => {
    setEditingAgent(agent);
    setName(agent.name);
    setRole(agent.role);
    setDescription(agent.description);
    setSystemPrompt(agent.system_prompt);
    setModel(agent.model);
    setAllowedTools(agent.allowed_tools);
    setIsModalOpen(true);
  };

  const toggleTool = (tool: string) => {
    setAllowedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  if (isLoading) return <LoadingState rows={4} />;
  if (isError) return <ErrorState title="Failed to load agents" onRetry={() => refetch()} />;

  const activeAgents = agents || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Autonomous AI Agents"
        description="Deploy specialized ecommerce agents equipped with controlled business tools to automate sales, support, and logistics"
        actions={
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Build New Agent
          </button>
        }
      />

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm leading-tight">{agent.name}</h3>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {agent.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <StatusBadge status={agent.is_active ? 'active' : 'archived'} />
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {agent.description || agent.system_prompt}
              </p>

              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block">
                  Allowed Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {agent.allowed_tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground"
                    >
                      {t.replace('_', ' ')}
                    </span>
                  ))}
                  {agent.allowed_tools.length === 0 && (
                    <span className="text-[11px] text-muted-foreground">No tools granted (Read-only)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-mono">
                {agent.model.split('/')[1] || agent.model}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEdit(agent)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Edit agent"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete agent "${agent.name}"?`)) {
                      deleteMutation.mutate(agent.id);
                    }
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  title="Delete agent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeAgents.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
            <Cpu className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold text-foreground text-base">No AI Agents deployed</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
              Create autonomous agents with tailored system prompts and tool access for specialized workflows.
            </p>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Build Agent
            </button>
          </div>
        )}
      </div>

      {/* Build / Edit Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">
                {editingAgent ? 'Edit AI Agent' : 'Create Specialized AI Agent'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-medium text-foreground mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WhatsApp COD Sales Agent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-8 px-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option value="sales_agent">Sales & Product Recommendations</option>
                  <option value="support_agent">Customer Support & FAQs</option>
                  <option value="fraud_prevention">Return & Fraud Risk Guardian</option>
                  <option value="logistics_agent">Courier & Shipment Tracking</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">System Instructions (Prompt)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Define your agent's persona, rules, and how it handles prices in BDT..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-border bg-background text-foreground leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1.5">Granted Tools</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'search_catalog', label: 'Search Products' },
                    { id: 'order_status', label: 'Lookup Order Status' },
                    { id: 'create_draft_order', label: 'Create Draft Orders' },
                    { id: 'courier_tracking', label: 'Check Courier Tracking' },
                  ].map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={allowedTools.includes(t.id)}
                        onChange={() => toggleTool(t.id)}
                        className="rounded border-border text-primary"
                      />
                      <span className="text-[11px] font-medium text-foreground">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Deploy Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
