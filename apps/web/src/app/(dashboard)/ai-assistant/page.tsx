'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  Package,
  Layers,
  RotateCcw,
  Check,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader, LoadingState } from '../../../components/shared';
import type { AIChatMessage } from '@shopnix/types';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your Shopnix AI Operations Assistant. I monitor your connected stores, order fulfillment pipelines, courier tracking, and inventory levels in real-time. How can I assist your business today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-exp:free');

  // Discover OpenRouter free models
  const { data: models } = useQuery({
    queryKey: ['ai', 'openrouter', 'models'],
    queryFn: async () => {
      const res = await api.ai.discoverOpenRouterModels({ free_only: true });
      return res.data;
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (updatedMessages: AIChatMessage[]) => {
      return api.ai.chatAssistant({
        messages: updatedMessages,
        routing_mode: 'free_only',
        model: selectedModel,
      });
    },
    onSuccess: (res) => {
      if (res?.data?.text) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: res.data.text },
        ]);
      }
    },
  });

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || chatMutation.isPending) return;

    const newMsgs: AIChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInputText('');
    chatMutation.mutate(newMsgs);
  };

  const quickPrompts = [
    { label: "Summarize today's sales & revenue", icon: TrendingUp },
    { label: 'Which products are below threshold stock?', icon: AlertTriangle },
    { label: 'Give me tips to reduce Steadfast COD return rate', icon: Package },
    { label: 'Check status of connected stores', icon: Layers },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader
          title="AI Operations Assistant"
          description="Contextual operations copilot grounded with your live store, order, and courier data"
        />

        {/* Model selector pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Zap className="h-3 w-3" />
            FREE MODEL
          </span>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground focus:outline-hidden cursor-pointer shadow-2xs"
          >
            {(models || []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
            {!models?.length && (
              <option value="google/gemini-2.0-flash-exp:free">
                Google Gemini 2.0 Flash (Free)
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Main Chat Canvas */}
      <div className="h-[650px] rounded-xl border border-border bg-card flex flex-col overflow-hidden shadow-xs">
        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {isUser ? 'You' : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 border border-border/60 text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            );
          })}

          {chatMutation.isPending && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="rounded-xl px-4 py-3 bg-muted/50 border border-border/60 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-primary" />
                Thinking and analyzing store records...
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2 border-t border-border/60 bg-muted/20 flex gap-2 overflow-x-auto">
          {quickPrompts.map((q, i) => {
            const Icon = q.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 transition-colors cursor-pointer"
              >
                <Icon className="h-3 w-3 text-primary" />
                {q.label}
              </button>
            );
          })}
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your orders, products, shipments, or customers..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-11 px-4 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || chatMutation.isPending}
              className="h-11 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Ask AI
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
