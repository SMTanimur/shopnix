'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Store,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  Trash2,
} from 'lucide-react';
import { api } from '../../../lib/api';
import {
  PageHeader,
  StatCard,
  DashboardCard,
  StatusBadge,
  LoadingState,
  ErrorState,
} from '../../../components/shared';
import { BrandLogo } from '../../../components/brand';
import type { StoreIntegration, StorePlatform } from '@shopnix/types';
import { formatDate } from '@shopnix/utils';

export default function StoresPage() {
  const queryClient = useQueryClient();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<StorePlatform>('shopify');
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: stores, isLoading, isError, refetch } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const res = await api.stores.listStores();
      return res.data;
    },
  });

  const syncMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'full' | 'products' | 'orders' }) => {
      return api.stores.triggerSync(id, { sync_type: type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.stores.disconnectStore(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });

  const handleConnectStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeUrl) return;

    setIsSubmitting(true);
    try {
      await api.stores.connectStore({
        name: storeName,
        platform: selectedPlatform,
        store_url: storeUrl,
        api_credentials: {
          access_token: apiKey,
          consumer_key: apiKey,
          consumer_secret: apiSecret,
          api_key: apiKey,
        },
        auto_sync_enabled: true,
        sync_interval_minutes: 30,
      });
      setIsConnectModalOpen(false);
      setStoreName('');
      setStoreUrl('');
      setApiKey('');
      setApiSecret('');
      refetch();
    } catch {
      // Handled by global interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingState rows={4} />;
  if (isError) return <ErrorState title="Failed to load stores" onRetry={() => refetch()} />;

  const activeStores = stores || [];
  const totalProducts = activeStores.reduce((acc, s) => acc + (s.product_count || 0), 0);
  const totalOrders = activeStores.reduce((acc, s) => acc + (s.order_count || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Integrations"
        description="Connect external Shopify, WooCommerce, and custom ecommerce channels for unified multi-store fulfillment"
        actions={
          <button
            type="button"
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Connect New Store
          </button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Connected Stores"
          value={activeStores.length}
          description="Active omnichannel endpoints"
          icon={<Store className="h-5 w-5" />}
        />
        <StatCard
          title="Synced Products"
          value={totalProducts}
          description="Unified catalog records"
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          title="Imported Orders"
          value={totalOrders}
          description="Multi-store sales volume"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          title="Sync Health"
          value="99.4%"
          description="Automated cron & webhooks"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
      </div>

      {/* Connected Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeStores.map((store) => (
          <div
            key={store.id}
            className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <BrandLogo brand={store.platform} size={38} className="shrink-0 rounded-lg" />
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-tight">{store.name}</h3>
                    <a
                      href={store.store_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5"
                    >
                      {store.store_url.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <StatusBadge
                  status={
                    store.connection_status === 'connected'
                      ? 'active'
                      : store.connection_status === 'syncing'
                      ? 'processing'
                      : 'archived'
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-lg bg-muted/40 text-xs">
                <div>
                  <span className="text-muted-foreground block">Products</span>
                  <span className="font-semibold text-foreground text-sm">{store.product_count || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Orders</span>
                  <span className="font-semibold text-foreground text-sm">{store.order_count || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Last synced: {store.last_synced_at ? formatDate(store.last_synced_at) : 'Never'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={syncMutation.isPending}
                onClick={() => syncMutation.mutate({ id: store.id, type: 'full' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                Sync Catalog
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Disconnect store "${store.name}"?`)) {
                    disconnectMutation.mutate(store.id);
                  }
                }}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                title="Disconnect store"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {activeStores.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
            <Store className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold text-foreground text-base">No stores connected yet</h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-4">
              Connect your Shopify, WooCommerce, or Custom API store to sync products and incoming orders automatically.
            </p>
            <button
              type="button"
              onClick={() => setIsConnectModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Connect Store
            </button>
          </div>
        )}
      </div>

      {/* Connect Store Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-foreground mb-1">Connect External Store</h3>
            <p className="text-xs text-muted-foreground mb-5">
              Select your platform and configure API credentials to begin real-time sync.
            </p>

            {/* Platform selector */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                { id: 'shopify', label: 'Shopify' },
                { id: 'woocommerce', label: 'WooCommerce' },
                { id: 'daraz', label: 'Daraz BD' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id as StorePlatform)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center text-xs font-bold cursor-pointer transition-all ${
                    selectedPlatform === p.id
                      ? 'border-primary bg-primary/10 text-primary shadow-xs'
                      : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <BrandLogo brand={p.id} size={26} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleConnectStore} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Store Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Flagship Shopify"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Store URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://your-store.myshopify.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              {selectedPlatform === 'shopify' && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Admin API Access Token (shpat_...)</label>
                  <input
                    type="password"
                    placeholder="Leave blank for Sandbox Mock testing"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Leave empty to connect in sandbox preview mode.</p>
                </div>
              )}

              {selectedPlatform === 'woocommerce' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Consumer Key (ck_...)</label>
                    <input
                      type="text"
                      placeholder="Leave blank for Sandbox Mock testing"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Consumer Secret (cs_...)</label>
                    <input
                      type="password"
                      placeholder="Leave blank for Sandbox Mock testing"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>
                </>
              )}

              {selectedPlatform === 'custom' && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">API Key / Token</label>
                  <input
                    type="password"
                    placeholder="Leave blank for Sandbox Mock testing"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Connecting...' : 'Authorize & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
