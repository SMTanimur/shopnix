'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MessageSquare,
  Search,
  Send,
  Bot,
  User,
  CheckCircle2,
  Phone,
  Sparkles,
  ShoppingBag,
  Clock,
  ThumbsUp,
  X,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader, LoadingState, ErrorState, StatusBadge } from '../../../components/shared';
import type { InboxConversation, InboxMessage, AIMessagingMode } from '@shopnix/types';
import { formatDate, formatCurrency } from '@shopnix/utils';

export default function InboxPage() {
  const queryClient = useQueryClient();
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Quick order state
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderCity, setOrderCity] = useState('Dhaka');
  const [orderAmount, setOrderAmount] = useState('1500');

  const { data: conversations, isLoading: isConvLoading, refetch: refetchConvs } = useQuery({
    queryKey: ['inbox', 'conversations', selectedChannel],
    queryFn: async () => {
      const res = await api.inbox.listConversations({
        channel: selectedChannel === 'all' ? undefined : selectedChannel,
      });
      return res.data;
    },
  });

  const activeConv = conversations?.find((c) => c.id === activeConversationId) || conversations?.[0];

  const { data: messages, isLoading: isMsgLoading } = useQuery({
    queryKey: ['inbox', 'messages', activeConv?.id],
    queryFn: async () => {
      if (!activeConv) return [];
      const res = await api.inbox.listMessages(activeConv.id);
      return res.data;
    },
    enabled: !!activeConv,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!activeConv) return;
      return api.inbox.sendMessage(activeConv.id, { content: text });
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['inbox', 'messages', activeConv?.id] });
      queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] });
    },
  });

  const approveAIMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return api.inbox.approveAIMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', 'messages', activeConv?.id] });
      queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] });
    },
  });

  const updateAIModeMutation = useMutation({
    mutationFn: async ({ id, mode }: { id: string; mode: AIMessagingMode }) => {
      return api.inbox.updateConversation(id, { ai_mode: mode });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!activeConv) return;
      return api.inbox.createOrderFromChat(activeConv.id, {
        customer_name: orderCustomerName || activeConv.customer_name,
        customer_phone: orderPhone || activeConv.customer_phone || '01700000000',
        delivery_address: orderAddress || 'Dhaka delivery',
        city: orderCity,
        items: [
          {
            product_id: 'sample_prod_id',
            quantity: 1,
            unit_price: parseFloat(orderAmount) || 1000,
          },
        ],
        shipping_charge: 60,
      });
    },
    onSuccess: () => {
      setIsOrderModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['inbox', 'messages', activeConv?.id] });
      queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] });
      alert('Order created and confirmation dispatched to chat!');
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText);
  };

  const filteredConversations = (conversations || []).filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.customer_name.toLowerCase().includes(q) ||
        (c.customer_phone && c.customer_phone.includes(q)) ||
        c.last_message_text.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (isConvLoading) return <LoadingState rows={4} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Unified Omnichannel Inbox"
        description="Respond to customer inquiries and convert conversations into Cash on Delivery orders from WhatsApp and Messenger"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-210px)] min-h-[580px] rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        {/* Left: Conversations List (4 cols) */}
        <div className="lg:col-span-4 border-r border-border flex flex-col h-full bg-card">
          <div className="p-3 border-b border-border space-y-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chats, phone, message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
              />
            </div>

            {/* Channels tab */}
            <div className="flex gap-1 p-0.5 rounded-lg bg-muted text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'facebook_messenger', label: 'Messenger' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedChannel(tab.id)}
                  className={`flex-1 py-1 rounded-md text-center font-medium cursor-pointer transition-colors ${
                    selectedChannel === tab.id
                      ? 'bg-card text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/40'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-foreground text-xs">
                    {conv.customer_name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-semibold text-xs text-foreground truncate">{conv.customer_name}</h4>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatDate(conv.last_message_at)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground truncate leading-relaxed">
                      {conv.last_message_text}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-1.5 py-0.5 rounded-sm bg-muted text-[10px] font-medium text-foreground uppercase">
                        {conv.channel === 'whatsapp' ? 'WhatsApp' : 'Messenger'}
                      </span>

                      {conv.ai_mode !== 'disabled' && (
                        <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
                          <Bot className="h-2.5 w-2.5" />
                          {conv.ai_mode}
                        </span>
                      )}

                      {conv.unread_count > 0 && (
                        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No customer conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Chat Area (8 cols) */}
        {activeConv ? (
          <div className="lg:col-span-8 flex flex-col h-full bg-background/50">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                  {activeConv.customer_name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    {activeConv.customer_name}
                    <span className="text-[11px] font-normal text-muted-foreground">
                      ({activeConv.customer_phone || activeConv.external_sender_id})
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="capitalize">{activeConv.channel.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="capitalize">{activeConv.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* AI Mode Selector */}
                <select
                  value={activeConv.ai_mode}
                  onChange={(e) =>
                    updateAIModeMutation.mutate({
                      id: activeConv.id,
                      mode: e.target.value as AIMessagingMode,
                    })
                  }
                  className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
                  title="Configure AI Assistant Mode for this customer"
                >
                  <option value="copilot">AI Copilot (Suggests)</option>
                  <option value="approval">AI Approval Mode</option>
                  <option value="auto">AI Autonomous (Auto-reply)</option>
                  <option value="disabled">AI Disabled</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setOrderCustomerName(activeConv.customer_name);
                    setOrderPhone(activeConv.customer_phone || '');
                    setIsOrderModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Create Order
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(messages || []).map((msg) => {
                const isOutbound = msg.direction === 'outbound';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        isOutbound
                          ? 'bg-primary text-primary-foreground rounded-br-xs'
                          : 'bg-card border border-border text-foreground rounded-bl-xs'
                      }`}
                    >
                      {msg.is_ai_generated && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold mb-1 opacity-90 text-indigo-200">
                          <Sparkles className="h-3 w-3" />
                          AI Suggested Response
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {msg.ai_approval_status === 'pending' && (
                        <div className="mt-2 pt-2 border-t border-primary-foreground/20 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-medium">Pending Agent Approval</span>
                          <button
                            type="button"
                            onClick={() => approveAIMessageMutation.mutate(msg.id)}
                            className="px-2 py-1 rounded bg-background text-foreground font-semibold text-[10px] hover:bg-muted cursor-pointer flex items-center gap-1"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            Approve & Dispatch
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex items-center gap-2">
              <input
                type="text"
                placeholder={`Type a message or reply to ${activeConv.customer_name}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 h-10 px-4 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
              />

              <button
                type="submit"
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-8 text-center text-muted-foreground">
            Select a conversation on the left to start messaging.
          </div>
        )}
      </div>

      {/* 1-Click Create Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Instant Order from Chat
              </h3>
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Customer Name</label>
                <input
                  type="text"
                  value={orderCustomerName}
                  onChange={(e) => setOrderCustomerName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Customer Phone Number</label>
                <input
                  type="text"
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 12, Road 4, Sector 7, Uttara"
                  value={orderAddress}
                  onChange={(e) => setOrderAddress(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">City</label>
                  <select
                    value={orderCity}
                    onChange={(e) => setOrderCity(e.target.value)}
                    className="w-full h-8 px-2 rounded-md border border-border bg-background text-foreground"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">COD Total Amount (৳)</label>
                  <input
                    type="number"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-foreground font-semibold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>৳60</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border">
                  <span>Grand Total to Collect</span>
                  <span>{formatCurrency(parseFloat(orderAmount) + 60)}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-3 py-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={createOrderMutation.isPending}
                  onClick={() => createOrderMutation.mutate()}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  {createOrderMutation.isPending ? 'Confirming...' : 'Confirm & Dispatch Confirmation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
