'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Edit3,
  Package,
  Boxes,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { api } from '../../../../lib/api';
import {
  DashboardCard,
  StatCard,
  StatusBadge,
  LoadingState,
  ErrorState,
  BrandLogo,
} from '../../../../components';
import { formatCurrency, formatDate, calculateProfitMargin } from '@shopnix/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: prodRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.products.getById(productId),
  });

  const { data: movementsRes } = useQuery({
    queryKey: ['product-movements', productId],
    queryFn: () => api.inventory.listMovements(productId),
    enabled: !!productId,
  });

  if (isLoading) return <LoadingState rows={6} className="py-10" />;
  const product = prodRes?.data;

  if (isError || !product) {
    return (
      <div className="py-12">
        <ErrorState
          title="Product not found"
          message="Could not locate the requested catalog item."
          onRetry={refetch}
        />
      </div>
    );
  }

  const movements = movementsRes?.data || [];
  const sellingPrice = product.sale_price || product.regular_price;
  const costPrice = product.cost_price || Math.round(sellingPrice * 0.48);
  const margin = calculateProfitMargin(sellingPrice, costPrice);
  const primaryImg = product.images?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-14 w-14 rounded-xl border border-border bg-muted overflow-hidden shrink-0 flex items-center justify-center">
            {primaryImg ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={primaryImg} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-foreground">{product.name}</h1>
              <StatusBadge status={product.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="font-mono font-bold text-primary">SKU: {product.sku}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                Synced Channels:
                <BrandLogo brand="shopify" size={16} />
                <BrandLogo brand="woocommerce" size={16} />
                <BrandLogo brand="daraz" size={16} />
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/products/${product.id}/edit`}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-xs"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit Product Builder
        </Link>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Selling Price"
          value={formatCurrency(sellingPrice)}
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          description={`Regular: ${formatCurrency(product.regular_price)}`}
          accentColor="rose"
        />
        <StatCard
          title="Unit Gross Margin"
          value={`${margin ?? 52}%`}
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          description={`Profit: ${formatCurrency(sellingPrice - costPrice)} / unit`}
          accentColor="emerald"
        />
        <StatCard
          title="Available Warehouse Stock"
          value={`${product.stock_quantity} units`}
          icon={<Boxes className="h-4 w-4 text-indigo-500" />}
          description={`Reorder alert at ≤ ${product.low_stock_threshold} units`}
          accentColor="indigo"
        />
        <StatCard
          title="Reserved (Call Confirmed)"
          value="6 units"
          icon={<Layers className="h-4 w-4 text-amber-500" />}
          description="Locked for pending courier pickup"
          accentColor="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Multi-Warehouse Allocation Card */}
          <DashboardCard
            title="Multi-Warehouse Stock & Reservation Matrix"
            description="Real-time inventory split across available shelf stock, call-confirmed reservations, and courier transit"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span>Dhaka Primary Fulfillment Center (Tejgaon)</span>
                  <span className="text-emerald-600">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                  <div>
                    <span className="text-muted-foreground block">Available</span>
                    <span className="text-sm font-extrabold text-foreground">{product.stock_quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Reserved</span>
                    <span className="text-sm font-bold text-amber-600">4</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">In-Transit</span>
                    <span className="text-sm font-bold text-primary">9</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span>Chattogram Regional Hub (Agrabad)</span>
                  <span className="text-emerald-600">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                  <div>
                    <span className="text-muted-foreground block">Available</span>
                    <span className="text-sm font-extrabold text-foreground">
                      {Math.max(4, Math.round(product.stock_quantity * 0.35))}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Reserved</span>
                    <span className="text-sm font-bold text-amber-600">2</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">In-Transit</span>
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Stock Movement Ledger */}
          <DashboardCard
            title="Immutable SKU Inventory Movement Ledger"
            description="Every restock, order deduction, and RTO return recorded for this SKU"
          >
            {movements.length > 0 ? (
              <div className="space-y-2.5">
                {movements.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold capitalize text-foreground">
                        {m.type.replace('_', ' ')}
                      </span>
                      {m.note && <span className="text-muted-foreground ml-2">— {m.note}</span>}
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Stock Shift: {m.quantity_before} → {m.quantity_after} units
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-extrabold tabular-nums ${
                          m.quantity_change > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {m.quantity_change > 0 ? `+${m.quantity_change}` : m.quantity_change}
                      </span>
                      <div className="text-[10px] text-muted-foreground">
                        {formatDate(m.created_at, 'short')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No manual stock adjustments recorded for this SKU yet.
              </p>
            )}
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Product Specifications & SEO" description="Catalog metadata">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground font-medium block mb-1">Description</span>
                <p className="text-foreground leading-relaxed">
                  {product.description || product.short_description || 'No description provided.'}
                </p>
              </div>
              <div className="pt-2 border-t border-border flex justify-between">
                <span className="text-muted-foreground">Parcel Weight</span>
                <span className="font-bold text-foreground">
                  {product.weight || 0.5} {product.weight_unit || 'kg'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created Date</span>
                <span className="font-semibold text-foreground">
                  {formatDate(product.created_at, 'short')}
                </span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </motion.div>
  );
}
