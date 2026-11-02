'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Workflow,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  Bot,
  MessageSquare,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader, LoadingState, ErrorState, StatusBadge } from '../../../components/shared';
import type { WorkflowDefinition, WorkflowExecutionLog } from '@shopnix/types';
import { formatDate } from '@shopnix/utils';

export default function AutomationsPage() {
  const queryClient = useQueryClient();
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testLog, setTestLog] = useState<WorkflowExecutionLog | null>(null);

  const { data: workflows, isLoading, isError, refetch } = useQuery({
    queryKey: ['automations'],
    queryFn: async () => {
      const res = await api.automation.listWorkflows();
      return res.data;
    },
  });

  const testMutation = useMutation({
    mutationFn: async (workflowId: string) => {
      const res = await api.automation.testWorkflow(workflowId, {
        mock_payload: {
          order_id: 'ORD-9912',
          customer_name: 'Tanvir Hossain',
          customer_phone: '01711223344',
          total_amount: 2450,
          payment_method: 'cod',
          shipping_city: 'Dhaka',
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setTestLog(data);
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });

  const activeWorkflows = workflows || [];
  const currentWorkflow = selectedWorkflow || activeWorkflows[0];

  if (isLoading) return <LoadingState title="Loading visual automations..." />;
  if (isError) return <ErrorState title="Failed to load workflows" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visual Automation Engine"
        description="Automate repetitive ecommerce operations, fraud checks, and WhatsApp customer communications with event-driven pipelines"
      />

      {/* Main Workflow View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Workflows List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-foreground">Active Workflows</h3>
            <span className="text-xs text-muted-foreground">{activeWorkflows.length} configured</span>
          </div>

          <div className="space-y-2.5">
            {activeWorkflows.map((wf) => {
              const isSelected = currentWorkflow?.id === wf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => {
                    setSelectedWorkflow(wf);
                    setTestLog(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-semibold text-sm text-foreground">{wf.name}</h4>
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        wf.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'
                      }`}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {wf.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                    <span className="font-medium text-foreground capitalize">
                      {wf.trigger_type.replace('.', ' ')}
                    </span>
                    <span>{wf.execution_count} runs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Canvas & Node Flow Inspector (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-xl border border-border bg-card p-5 shadow-xs">
          {currentWorkflow ? (
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" />
                    {currentWorkflow.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Triggered automatically on: <span className="font-semibold text-foreground">{currentWorkflow.trigger_type}</span>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={testMutation.isPending}
                  onClick={() => {
                    setIsTestModalOpen(true);
                    testMutation.mutate(currentWorkflow.id);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5" />
                  {testMutation.isPending ? 'Executing...' : 'Test Run'}
                </button>
              </div>

              {/* Visual Node Graph Diagram */}
              <div className="flex-1 p-6 rounded-xl bg-muted/30 border border-border/60 flex flex-col justify-center items-center overflow-x-auto min-h-[300px]">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {(currentWorkflow.nodes || []).map((node, i) => {
                    const isTrigger = node.data?.nodeType === 'trigger';
                    const isAi = node.data?.nodeType === 'ai';

                    return (
                      <React.Fragment key={node.id}>
                        <div
                          className={`w-52 p-4 rounded-xl border shadow-xs transition-all ${
                            isTrigger
                              ? 'border-indigo-500/40 bg-indigo-500/10'
                              : isAi
                              ? 'border-violet-500/40 bg-violet-500/10'
                              : 'border-border bg-card'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {node.data?.nodeType}
                            </span>
                            {isAi && <Sparkles className="h-3.5 w-3.5 text-violet-500" />}
                            {isTrigger && <Zap className="h-3.5 w-3.5 text-indigo-500" />}
                          </div>

                          <h5 className="font-semibold text-xs text-foreground mb-1">
                            {node.data?.label}
                          </h5>

                          {node.data?.config?.prompt && (
                            <p className="text-[10px] text-muted-foreground line-clamp-2">
                              {node.data.config.prompt}
                            </p>
                          )}
                        </div>

                        {i < (currentWorkflow.nodes?.length || 0) - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Test Run Execution Output Drawer */}
              {testLog && (
                <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Execution Finished in {testLog.duration_ms}ms
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      Status: <span className="font-semibold text-emerald-500 uppercase">{testLog.status}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {testLog.steps.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-md bg-card border border-border/60 text-xs flex items-center justify-between"
                      >
                        <span className="font-medium text-foreground">{st.node_name}</span>
                        <span className="text-muted-foreground text-[11px]">{st.duration_ms}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              Select a workflow to inspect its visual pipeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
