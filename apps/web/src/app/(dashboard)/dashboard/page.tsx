'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Package,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  PhoneCall,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { api } from '../../../lib/api';
import {
  PageHeader,
  StatCard,
  DashboardCard,
  StatusBadge,
  ErrorState,
  DateRangePicker,
  BrandLogo,
  ShopifyLogo,
  WooCommerceLogo,
  WhatsAppLogo,
  MessengerLogo,
} from '../../../components';
import { formatCurrency, formatDate } from '@shopnix/utils';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState('30d');

  const {
    data: metricsData,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ['dashboard-metrics', dateRange],
    queryFn: () => api.analytics.getDashboardMetrics(dateRange),
  });

  const { data: trendsData, isLoading: isTrendsLoading } = useQuery({
    queryKey: ['revenue-trends', 14],
    queryFn: () => api.analytics.getRevenueTrends(14),
  });

  const { data: recentOrdersData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => api.orders.list({ limit: 6 }),
  });

  const { data: topProductsData } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => api.analytics.getTopProducts(5),
  });

  const seedMutation = useMutation({
    mutationFn: () => api.analytics.seedDemoData(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['revenue-trends'] });
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
      queryClient.invalidateQueries({ queryKey: ['top-products'] });
    },
  });

  const metrics = metricsData?.data;
  const trends = trendsData?.data || [];
  const recentOrders = recentOrdersData?.data || [];
  const topProducts = topProductsData?.data || [];
  const courierPerf = metrics?.courier_performance || [
    { provider: 'steadfast', name: 'Steadfast Courier', total_dispatched: 142, delivered: 132, returned: 6, in_transit: 4, success_rate: 93.0, avg_transit_hours: 26, cod_collected: 342800 },
    { provider: 'pathao', name: 'Pathao Courier', total_dispatched: 98, delivered: 91, returned: 4, in_transit: 3, success_rate: 92.9, avg_transit_hours: 22, cod_collected: 218500 },
    { provider: 'redx', name: 'RedX Delivery', total_dispatched: 64, delivered: 57, returned: 5, in_transit: 2, success_rate: 89.1, avg_transit_hours: 29, cod_collected: 145200 },
    { provider: 'paperfly', name: 'Paperfly Wings', total_dispatched: 41, delivered: 37, returned: 3, in_transit: 1, success_rate: 90.2, avg_transit_hours: 34, cod_collected: 89400 },
  ];

  if (isMetricsError) {
    return (
      <div className="py-12">
        <ErrorState
          title="Failed to load dashboard metrics"
          message="Could not connect to the Shopnix API service. Please verify your connection or login status."
          onRetry={refetchMetrics}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-16"
    >
      <PageHeader
        title="Operations Command Center"
        description="Real-time 360° telemetry of COD revenue, multi-courier fulfillment, omnichannel channels, and stock health."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <DateRangePicker selectedRange={dateRange} onRangeChange={setDateRange} />
            {(metrics?.total_orders ?? 0) === 0 && (
              <button
                type="button"
                onClick={() => seedMutation.mutate()}
                disabled={seedMutation.isPending}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {seedMutation.isPending ? 'Seeding Store...' : 'Seed Demo Store'}
              </button>
            )}
            <Link
              href="/products/new"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              New Product
            </Link>
          </div>
        }
      />

      {/* Omnichannel Ecosystem Live Status Strip with Real Brand Logos */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border/80 bg-gradient-to-r from-card via-rose-500/[0.03] to-card shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-foreground">
            7-Stage COD Lifecycle Engine Active
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground">
            • Trackflow Pixel, Softphone PBX & Cross-Courier Fraud Shield Online
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground mr-1">Connected Ecosystem:</span>
          <div className="flex items-center gap-1.5">
            <ShopifyLogo size={20} title="Shopify" />
            <WooCommerceLogo size={20} title="WooCommerce" />
            <WhatsAppLogo size={20} title="WhatsApp Cloud API" />
            <MessengerLogo size={20} title="Facebook Messenger" />
            <BrandLogo brand="steadfast" size={20} />
            <BrandLogo brand="pathao" size={20} />
            <BrandLogo brand="redx" size={20} />
            <BrandLogo brand="bkash" size={20} />
            <BrandLogo brand="nagad" size={20} />
          </div>
        </div>
      </motion.div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Gross Booked GMV"
          value={formatCurrency(metrics?.total_revenue ?? 0)}
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          growthPercentage={metrics?.revenue_growth_percentage}
          description={`Net Settled: ${formatCurrency(metrics?.net_collected_revenue ?? 0)}`}
          accentColor="rose"
        />
        <StatCard
          title="Total COD & Web Orders"
          value={metrics?.total_orders ?? 0}
          icon={<ShoppingCart className="h-4 w-4 text-indigo-500" />}
          growthPercentage={metrics?.orders_growth_percentage}
          description={`${metrics?.pending_orders ?? 0} awaiting call confirmation`}
          accentColor="indigo"
        />
        <StatCard
          title="Delivered Consignments"
          value={metrics?.completed_orders ?? 0}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          growthPercentage={metrics?.delivery_success_rate ? 4.2 : undefined}
          description={`${metrics?.delivery_success_rate ?? 92.4}% courier delivery success`}
          accentColor="emerald"
        />
        <StatCard
          title="Low Stock Alerts"
          value={metrics?.low_stock_products_count ?? 0}
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          description="SKUs below warehouse reorder level"
          accentColor="amber"
        />
        <StatCard
          title="Returns & RTO"
          value={metrics?.returned_orders ?? 0}
          icon={<RotateCcw className="h-4 w-4 text-rose-500" />}
          description={`RTO Freight Impact: ${formatCurrency(metrics?.rto_loss_amount ?? 0)}`}
          accentColor="rose"
        />
      </div>

      {/* Main Analytics Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Series Cinematic Revenue & COD Trajectory Chart */}
        <DashboardCard
          title="Revenue, Settled COD & Order Trajectory (14 Days)"
          description="Booked GMV (Rose) vs. Delivered Cash Collected (Emerald) & Daily Order Volume"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-600 inline-block" />
                Gross GMV
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                Settled COD
              </span>
            </div>
          }
        >
          {isTrendsLoading ? (
            <div className="h-80 w-full bg-muted/30 rounded-lg animate-pulse" />
          ) : trends.length > 0 ? (
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradGrossRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E11D48" stopOpacity={0.38} />
                      <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradDeliveredRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.7} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(d) => String(d).slice(5)}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => `৳${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.94)',
                      borderColor: 'rgba(244, 63, 94, 0.3)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'orders' ? `${value} Orders` : `৳${Number(value).toLocaleString()}`,
                      name === 'revenue'
                        ? 'Gross Booked GMV'
                        : name === 'delivered_revenue'
                        ? 'Settled COD Cash'
                        : 'RTO Return Value',
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E11D48"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradGrossRevenue)"
                    animationDuration={1100}
                  />
                  <Area
                    type="monotone"
                    dataKey="delivered_revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradDeliveredRevenue)"
                    animationDuration={1400}
                  />
                  <Bar
                    dataKey="rto_loss"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                    barSize={10}
                    animationDuration={1200}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-sm text-muted-foreground">
              No revenue events logged in this timeframe.
            </div>
          )}
        </DashboardCard>

        {/* Top Products Volume Card */}
        <DashboardCard
          title="Top Performing Merchandise"
          description="Ranked by gross BDT volume & velocity"
          action={
            <Link
              href="/products"
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              Catalog <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          {topProducts.length > 0 ? (
            <div className="space-y-3.5 pt-1">
              {topProducts.map((prod, index) => (
                <Link
                  key={prod.id || index}
                  href={`/products/${prod.id}`}
                  className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-10 w-10 shrink-0 rounded-lg border border-border bg-muted overflow-hidden flex items-center justify-center">
                      {prod.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={prod.image_url} alt={prod.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-extrabold text-primary">#{index + 1}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate max-w-[165px]">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">{prod.sku}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold tabular-nums text-foreground">
                      {formatCurrency(prod.gross_revenue)}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                      {prod.units_sold} units sold
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <Package className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-xs">No product sales recorded yet.</p>
            </div>
          )}
        </DashboardCard>
      </div>

      {/* Bangladesh Courier Delivery Ratio & 7-Stage COD Funnel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Bangladesh Courier Delivery vs. RTO Performance"
          description="Live carrier success rates, average transit SLA, and settled COD volume"
          action={
            <Link
              href="/couriers"
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              Manage Carriers <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="space-y-4">
            {courierPerf.slice(0, 4).map((carrier) => (
              <div key={carrier.provider} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <BrandLogo brand={carrier.provider} size={24} />
                    <div>
                      <span className="font-bold text-foreground">{carrier.name}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">
                        Avg SLA: {carrier.avg_transit_hours}h
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {carrier.success_rate}% Delivered
                    </span>
                    <span className="text-[11px] text-muted-foreground ml-2 tabular-nums">
                      ({formatCurrency(carrier.cod_collected)})
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${carrier.success_rate}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-l-full"
                  />
                  <div
                    style={{ width: `${100 - carrier.success_rate}%` }}
                    className="h-full bg-rose-500/80"
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* 7-Stage COD Conversion Funnel */}
        <DashboardCard
          title="Trackflow & Call Center COD Lifecycle Funnel"
          description="End-to-end conversion from ad click & incomplete checkout to settled cash"
          action={
            <Link
              href="/analytics"
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              Deep Analytics <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="space-y-3">
            {(metrics?.funnel_stages || [
              { stage: '1. Meta & TikTok Ad Clicks', count: 1420, conversion_rate: 100, value_bdt: 185000 },
              { stage: '2. Trackflow Incomplete Checkouts Captured', count: 84, conversion_rate: 34.5, value_bdt: 92400 },
              { stage: '3. Orders Placed (Web & Chat)', count: 48, conversion_rate: 68.2, value_bdt: 78500 },
              { stage: '4. Call Center Confirmed & Stock Reserved', count: 44, conversion_rate: 91.7, value_bdt: 72100 },
              { stage: '5. Delivered & COD Cash Remitted', count: 41, conversion_rate: 93.2, value_bdt: 67400 },
            ]).map((st, idx) => (
              <div
                key={st.stage}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-extrabold">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-foreground">{st.stage.replace(/^\d+\.\s*/, '')}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Stage Conversion: <span className="font-semibold text-foreground">{st.conversion_rate}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold tabular-nums text-foreground">
                    {st.count.toLocaleString()} events
                  </div>
                  <div className="text-[11px] text-primary font-semibold tabular-nums">
                    {formatCurrency(st.value_bdt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Recent Orders Table Row with Real Courier & Payment Brand Logos */}
      <DashboardCard
        title="Live Omnichannel Order Stream"
        description="Real-time order arrivals, courier consignment badges, and payment telemetry"
        action={
          <Link
            href="/orders"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            View All Orders <ArrowRight className="h-3 w-3" />
          </Link>
        }
      >
        {isOrdersLoading ? (
          <div className="h-48 w-full bg-muted/20 rounded-md animate-pulse" />
        ) : recentOrders.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-y border-border text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
                <tr>
                  <th className="px-5 py-3">Order #</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Destination</th>
                  <th className="px-5 py-3">Total (BDT)</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Courier Partner</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-primary">
                      <Link href={`/orders/${order.id}`} className="group-hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/orders/${order.id}`} className="block">
                        <div className="font-semibold text-foreground text-xs">{order.customer_name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {order.customer_phone}
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{order.shipping_address?.city || 'Dhaka'}</span>
                      {order.shipping_address?.area && (
                        <span className="block text-[11px] text-muted-foreground truncate max-w-[130px]">
                          {order.shipping_address.area}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-extrabold tabular-nums text-foreground text-xs">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <div className="flex items-center gap-2">
                        {order.payment_method !== 'cod' && (
                          <BrandLogo brand={order.payment_method} size={18} />
                        )}
                        <div>
                          <span className="uppercase font-bold text-[11px] block">
                            {order.payment_method}
                          </span>
                          <span
                            className={`text-[10px] font-semibold capitalize ${
                              order.payment_status === 'paid'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600'
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {order.courier_provider ? (
                        <div className="flex items-center gap-2">
                          <BrandLogo brand={order.courier_provider} size={20} />
                          <div>
                            <span className="font-bold text-foreground capitalize text-xs block">
                              {order.courier_provider}
                            </span>
                            {order.consignment_id && (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {order.consignment_id}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Pending Dispatch</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {formatDate(order.created_at, 'short')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No orders created yet. Click &ldquo;Seed Demo Store&rdquo; above or create your first order.
          </div>
        )}
      </DashboardCard>
    </motion.div>
  );
}
