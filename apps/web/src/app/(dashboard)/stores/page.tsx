'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Plus,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Layers,
  ShieldCheck,
  Clock,
  Trash2,
  Package,
  ShoppingCart,
  SlidersHorizontal,
  X,
  Code2,
  Truck,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '../../../lib/api';
import {
  PageHeader,
  StatCard,
  StatusBadge,
  LoadingState,
  ErrorState,
} from '../../../components/shared';
import { BrandLogo } from '../../../components/brand';
import type { StoreIntegration, StorePlatform, OrderStatus, Product, Order } from '@shopnix/types';
import { formatCurrency, formatDate } from '@shopnix/utils';

export default function StoresPage() {
  const queryClient = useQueryClient();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<StorePlatform>('custom');
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store Command Drawer State
  const [activeControlStore, setActiveControlStore] = useState<StoreIntegration | null>(null);
  const [drawerTab, setDrawerTab] = useState<'products' | 'orders' | 'webhook'>('products');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const { data: stores, isLoading, isError, refetch } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const res = await api.stores.listStores();
      return res.data;
    },
  });

  // Fetch products for the selected store in the Command Drawer
  const { data: storeProducts = [], isLoading: isProductsLoading, refetch: refetchStoreProducts } =
    useQuery<Product[]>({
      queryKey: ['store-products', activeControlStore?.id],
      queryFn: async () => {
        if (!activeControlStore) return [];
        const res = await api.stores.getStoreProducts(activeControlStore.id);
        return res.data || [];
      },
      enabled: Boolean(activeControlStore?.id),
    });

  // Fetch orders for the selected store in the Command Drawer
  const { data: storeOrders = [], isLoading: isOrdersLoading, refetch: refetchStoreOrders } =
    useQuery<Order[]>({
      queryKey: ['store-orders', activeControlStore?.id],
      queryFn: async () => {
        if (!activeControlStore) return [];
        const res = await api.stores.getStoreOrders(activeControlStore.id);
        return res.data || [];
      },
      enabled: Boolean(activeControlStore?.id),
    });

  const syncMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'full' | 'products' | 'orders' }) => {
      return api.stores.triggerSync(id, { sync_type: type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      if (activeControlStore) {
        refetchStoreProducts();
        refetchStoreOrders();
      }
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.stores.disconnectStore(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      if (activeControlStore) setActiveControlStore(null);
    },
  });

  const orderStatusMutation = useMutation({
    mutationFn: async ({
      storeId,
      orderId,
      status,
    }: {
      storeId: string;
      orderId: string;
      status: OrderStatus;
    }) => {
      return api.stores.updateStoreOrderStatus(storeId, orderId, {
        status,
        note: `Controlled from ${activeControlStore?.name || 'Store'} Command Center`,
      });
    },
    onSuccess: () => {
      refetchStoreOrders();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['top-nav-notifications'] });
    },
  });

  const productStockMutation = useMutation({
    mutationFn: async ({
      storeId,
      productId,
      stock_quantity,
    }: {
      storeId: string;
      productId: string;
      stock_quantity: number;
    }) => {
      return api.stores.updateStoreProduct(storeId, productId, { stock_quantity });
    },
    onSuccess: () => {
      refetchStoreProducts();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleConnectStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeUrl) return;

    setIsSubmitting(true);
    try {
      const created = await api.stores.connectStore({
        name: storeName,
        platform: selectedPlatform,
        store_url: storeUrl,
        api_credentials: {
          access_token: apiKey,
          consumer_key: apiKey,
          consumer_secret: apiSecret,
          api_key: apiKey,
          webhook_secret: webhookSecret,
        },
        auto_sync_enabled: true,
        sync_interval_minutes: 30,
      });
      setIsConnectModalOpen(false);
      setStoreName('');
      setStoreUrl('');
      setApiKey('');
      setApiSecret('');
      setWebhookSecret('');
      await refetch();
      if (created?.data) {
        setActiveControlStore(created.data);
        setDrawerTab('products');
      }
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
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Omnichannel & Custom Store Integrations"
        description="Connect Custom E-Commerce Websites, Shopify, WooCommerce, and Daraz to view synced product lists and control incoming orders in real time."
        actions={
          <button
            type="button"
            onClick={() => {
              setSelectedPlatform('custom');
              setIsConnectModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-md shadow-rose-500/20"
          >
            <Plus className="h-4 w-4" />
            Connect Custom / External Store
          </button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Connected Stores"
          value={activeStores.length}
          description="Custom API, Shopify & Woo channels"
          icon={<Store className="h-4 w-4" />}
          accentColor="rose"
        />
        <StatCard
          title="Synced Store Products"
          value={totalProducts}
          description="Bi-directional SKU & stock catalog"
          icon={<Layers className="h-4 w-4" />}
          accentColor="indigo"
        />
        <StatCard
          title="Imported Store Orders"
          value={totalOrders}
          description="Centralized COD & courier control"
          icon={<CheckCircle2 className="h-4 w-4" />}
          accentColor="emerald"
        />
        <StatCard
          title="Webhook & API Uptime"
          value="99.9%"
          description="Real-time order & stock bridge"
          icon={<ShieldCheck className="h-4 w-4" />}
          accentColor="sky"
        />
      </div>

      {/* Connected Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeStores.map((store) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass-card p-5 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-500 opacity-85" />

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <BrandLogo brand={store.platform} size={40} className="shrink-0 rounded-xl shadow-2xs" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-foreground text-base leading-tight">
                        {store.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        {store.platform === 'custom' ? 'Custom E-Com' : store.platform}
                      </span>
                    </div>
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

              {/* Clickable Product & Order Counters */}
              <div className="grid grid-cols-2 gap-2.5 my-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveControlStore(store);
                    setDrawerTab('products');
                  }}
                  className="p-3 rounded-xl border border-rose-500/15 bg-white/70 hover:bg-rose-500/8 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Synced Products</span>
                    <Package className="h-3.5 w-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-extrabold text-foreground text-lg tabular-nums mt-0.5 block">
                    {store.product_count || 0}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600">View Product List →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveControlStore(store);
                    setDrawerTab('orders');
                  }}
                  className="p-3 rounded-xl border border-rose-500/15 bg-white/70 hover:bg-rose-500/8 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Store Orders</span>
                    <ShoppingCart className="h-3.5 w-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-extrabold text-foreground text-lg tabular-nums mt-0.5 block">
                    {store.order_count || 0}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">Control Orders →</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                <Clock className="h-3.5 w-3.5 text-rose-500" />
                <span>
                  Last synced: {store.last_synced_at ? formatDate(store.last_synced_at) : 'Just now'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-rose-500/12 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveControlStore(store);
                    setDrawerTab('products');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer shadow-xs"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Manage Catalog & Orders
                </button>

                <button
                  type="button"
                  disabled={syncMutation.isPending}
                  onClick={() => syncMutation.mutate({ id: store.id, type: 'full' })}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-500/20 bg-white/80 text-xs font-semibold text-foreground hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                  title="Re-sync products & orders"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${syncMutation.isPending ? 'animate-spin text-primary' : ''}`} />
                  Sync
                </button>
              </div>

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
          </motion.div>
        ))}

        {activeStores.length === 0 && (
          <div className="col-span-full py-14 text-center rounded-2xl glass-card border-2 border-dashed border-rose-500/25">
            <Store className="h-11 w-11 text-rose-500 mx-auto mb-3" />
            <h4 className="font-extrabold text-foreground text-base">
              No ecommerce stores connected yet
            </h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-5">
              Connect your Custom E-Commerce Site, Shopify, WooCommerce, or Daraz store to view synced products and control incoming orders from one dashboard.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedPlatform('custom');
                setIsConnectModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Connect Custom or External Store
            </button>
          </div>
        )}
      </div>

      {/* Store Command Drawer: Synced Product List & Order Control */}
      <AnimatePresence>
        {activeControlStore && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="w-full max-w-4xl h-full glass-modal flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-rose-500/15 bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-transparent flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BrandLogo brand={activeControlStore.platform} size={42} className="rounded-xl" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold text-foreground">
                        {activeControlStore.name} — Store Command Center
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-700">
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activeControlStore.store_url} • Control synced catalog items and incoming store orders
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={syncMutation.isPending}
                    onClick={() =>
                      syncMutation.mutate({ id: activeControlStore.id, type: 'full' })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${syncMutation.isPending ? 'animate-spin' : ''}`}
                    />
                    {syncMutation.isPending ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveControlStore(null)}
                    className="p-2 rounded-xl border border-rose-500/15 bg-white/80 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Navigation Tabs */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-rose-500/12 bg-white/60">
                <button
                  type="button"
                  onClick={() => setDrawerTab('products')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    drawerTab === 'products'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:bg-rose-500/10 hover:text-foreground'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  Synced Product List ({storeProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('orders')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    drawerTab === 'orders'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:bg-rose-500/10 hover:text-foreground'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Store Orders Control ({storeOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('webhook')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    drawerTab === 'webhook'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:bg-rose-500/10 hover:text-foreground'
                  }`}
                >
                  <Code2 className="h-4 w-4" />
                  Custom Store SDK & Webhook
                </button>
              </div>

              {/* Drawer Content Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {drawerTab === 'products' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">
                          Store Product Catalog ({storeProducts.length} SKUs)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Adjust inventory quantities or inspect products synced from {activeControlStore.name}.
                        </p>
                      </div>
                      <Link
                        href="/products"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Open Master Catalog →
                      </Link>
                    </div>

                    {isProductsLoading ? (
                      <LoadingState rows={4} />
                    ) : storeProducts.length > 0 ? (
                      <div className="rounded-2xl border border-rose-500/15 bg-white/80 overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-rose-500/6 border-b border-rose-500/12 uppercase font-extrabold text-slate-600">
                            <tr>
                              <th className="px-4 py-3">Product</th>
                              <th className="px-4 py-3">SKU</th>
                              <th className="px-4 py-3">Price</th>
                              <th className="px-4 py-3">Stock Control</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-rose-500/10">
                            {storeProducts.map((prod) => {
                              const pid = prod.id || (prod as any)._id;
                              return (
                                <tr key={pid} className="hover:bg-rose-500/4">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/15 overflow-hidden flex items-center justify-center shrink-0">
                                        {prod.images?.[0]?.url ? (
                                          <img
                                            src={prod.images[0].url}
                                            alt={prod.name}
                                            className="h-full w-full object-cover"
                                          />
                                        ) : (
                                          <Package className="h-4 w-4 text-rose-500" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-bold text-foreground">{prod.name}</div>
                                        <div className="text-[11px] text-muted-foreground">
                                          Synced from {activeControlStore.platform}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 font-mono font-bold text-slate-700">
                                    {prod.sku}
                                  </td>
                                  <td className="px-4 py-3 font-extrabold tabular-nums text-foreground">
                                    {formatCurrency(prod.regular_price)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          productStockMutation.mutate({
                                            storeId: activeControlStore.id,
                                            productId: pid,
                                            stock_quantity: Math.max(0, (prod.stock_quantity || 0) - 5),
                                          })
                                        }
                                        className="h-6 w-6 rounded-md border border-rose-500/20 bg-white font-bold hover:bg-rose-500/10 cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <span className="w-10 text-center font-mono font-extrabold tabular-nums">
                                        {prod.stock_quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          productStockMutation.mutate({
                                            storeId: activeControlStore.id,
                                            productId: pid,
                                            stock_quantity: (prod.stock_quantity || 0) + 5,
                                          })
                                        }
                                        className="h-6 w-6 rounded-md border border-rose-500/20 bg-white font-bold hover:bg-rose-500/10 cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <Link
                                      href={`/products/${pid}`}
                                      className="text-xs font-bold text-rose-600 hover:underline"
                                    >
                                      Inspect →
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-2xl border border-dashed border-rose-500/25">
                        <p className="text-xs text-muted-foreground mb-3">
                          No products synced yet for this store.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            syncMutation.mutate({ id: activeControlStore.id, type: 'products' })
                          }
                          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer"
                        >
                          Sync Store Products Now
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {drawerTab === 'orders' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">
                          Store Orders Control ({storeOrders.length} Orders)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Approve, process, dispatch to courier, or mark orders delivered directly from Shopnix.
                        </p>
                      </div>
                      <Link
                        href="/orders"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Open Master Order Desk →
                      </Link>
                    </div>

                    {isOrdersLoading ? (
                      <LoadingState rows={4} />
                    ) : storeOrders.length > 0 ? (
                      <div className="rounded-2xl border border-rose-500/15 bg-white/80 overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-rose-500/6 border-b border-rose-500/12 uppercase font-extrabold text-slate-600">
                            <tr>
                              <th className="px-4 py-3">Order #</th>
                              <th className="px-4 py-3">Customer</th>
                              <th className="px-4 py-3">Items & Total</th>
                              <th className="px-4 py-3">Current Status</th>
                              <th className="px-4 py-3">Control Order Lifecycle</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-rose-500/10">
                            {storeOrders.map((ord) => {
                              const oid = ord.id || (ord as any)._id;
                              return (
                                <tr key={oid} className="hover:bg-rose-500/4">
                                  <td className="px-4 py-3">
                                    <Link
                                      href={`/orders/${oid}`}
                                      className="font-mono font-extrabold text-rose-600 hover:underline"
                                    >
                                      {ord.order_number}
                                    </Link>
                                    <div className="text-[10px] text-muted-foreground">
                                      {formatDate(ord.created_at, 'short')}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="font-bold text-foreground">{ord.customer_name}</div>
                                    <div className="font-mono text-[11px] text-muted-foreground">
                                      {ord.customer_phone}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="font-extrabold tabular-nums text-foreground">
                                      {formatCurrency(ord.total_amount)}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground truncate max-w-44">
                                      {ord.items?.[0]?.name || '1 item'} ({ord.payment_method.toUpperCase()})
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <StatusBadge status={ord.status} />
                                    {ord.consignment_id && (
                                      <div className="text-[10px] font-mono text-emerald-700 mt-0.5 flex items-center gap-1">
                                        <Truck className="h-3 w-3" />
                                        {ord.consignment_id}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <select
                                      value={ord.status}
                                      disabled={orderStatusMutation.isPending}
                                      onChange={(e) =>
                                        orderStatusMutation.mutate({
                                          storeId: activeControlStore.id,
                                          orderId: oid,
                                          status: e.target.value as OrderStatus,
                                        })
                                      }
                                      className="h-8 px-2.5 rounded-lg border border-rose-500/25 bg-white text-xs font-bold text-foreground focus:outline-hidden focus:border-primary cursor-pointer"
                                    >
                                      <option value="pending">Pending Verification</option>
                                      <option value="confirmed">Confirmed (Ready)</option>
                                      <option value="processing">Processing / Packed</option>
                                      <option value="shipped">Dispatched to Courier</option>
                                      <option value="delivered">Delivered & Settled</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-2xl border border-dashed border-rose-500/25">
                        <p className="text-xs text-muted-foreground mb-3">
                          No orders imported from this store yet.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            syncMutation.mutate({ id: activeControlStore.id, type: 'orders' })
                          }
                          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer"
                        >
                          Import Store Orders Now
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {drawerTab === 'webhook' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-rose-700">
                        <Sparkles className="h-4 w-4" />
                        Custom E-Commerce REST API & Webhook Bridge
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Connect any custom Next.js, Laravel, Node.js, Django, or PHP storefront to Shopnix. Your custom site can expose <code className="font-mono text-rose-700">/api/products</code> and <code className="font-mono text-rose-700">/api/orders</code> or push live orders to the webhook below:
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          readOnly
                          value={`http://localhost:8000/api/v1/stores/${activeControlStore.id}/sync`}
                          className="flex-1 h-9 px-3 rounded-xl border border-rose-500/20 bg-white font-mono text-xs text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `http://localhost:8000/api/v1/stores/${activeControlStore.id}/sync`
                            );
                            setCopiedWebhook(true);
                            setTimeout(() => setCopiedWebhook(false), 2000);
                          }}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                        >
                          {copiedWebhook ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedWebhook ? 'Copied' : 'Copy Endpoint'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Connect Store Modal (with Custom E-Commerce First-Class Support) */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl glass-modal p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-extrabold text-foreground">
                Connect Custom or External E-Commerce Store
              </h3>
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-5">
              Connect your Custom Website (REST API / Webhook), Shopify, WooCommerce, or Daraz store to sync products and control orders.
            </p>

            {/* Platform selector (4 platforms including Custom E-Commerce) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              {[
                { id: 'custom', label: 'Custom E-Com' },
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
                      ? 'border-rose-500 bg-rose-500/12 text-rose-700 shadow-xs'
                      : 'border-rose-500/15 bg-white/60 text-muted-foreground hover:bg-rose-500/5'
                  }`}
                >
                  <BrandLogo brand={p.id} size={26} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleConnectStore} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Store Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    selectedPlatform === 'custom'
                      ? 'e.g. My Custom Next.js / Laravel Store'
                      : 'e.g. My Flagship Store'
                  }
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-rose-500/20 bg-white text-sm text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Storefront / API Base URL
                </label>
                <input
                  type="url"
                  required
                  placeholder={
                    selectedPlatform === 'custom'
                      ? 'https://mycustomshop.com'
                      : 'https://your-store.myshopify.com'
                  }
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-rose-500/20 bg-white text-sm text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              {selectedPlatform === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Custom Store API Key (X-Api-Key)
                    </label>
                    <input
                      type="password"
                      placeholder="Leave blank for Sandbox Demo Catalog"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-rose-500/20 bg-white text-xs text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Webhook Signing Secret
                    </label>
                    <input
                      type="password"
                      placeholder="Optional webhook secret"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-rose-500/20 bg-white text-xs text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <p className="col-span-full text-[11px] text-muted-foreground">
                    Tip: Leave API Key blank to immediately connect in Sandbox Mode with sample custom store products & orders.
                  </p>
                </div>
              )}

              {selectedPlatform === 'shopify' && (
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Admin API Access Token (shpat_...)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank for Sandbox Mock testing"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-rose-500/20 bg-white text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>
              )}

              {selectedPlatform === 'woocommerce' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Consumer Key (ck_...)
                    </label>
                    <input
                      type="text"
                      placeholder="Optional for Sandbox"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-rose-500/20 bg-white text-xs text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Consumer Secret (cs_...)
                    </label>
                    <input
                      type="password"
                      placeholder="Optional for Sandbox"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-rose-500/20 bg-white text-xs text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-500/15 mt-5">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-rose-500/20"
                >
                  {isSubmitting ? 'Connecting & Syncing...' : 'Authorize & Sync Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
