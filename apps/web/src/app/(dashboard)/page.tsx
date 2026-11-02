'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
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
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { api } from '../../lib/api';
import {
  PageHeader,
  StatCard,
  DashboardCard,
  StatusBadge,
  ErrorState,
  DateRangePicker,
} from '../../components';
import { formatCurrency, formatDate } from '@shopnix/utils';

export default function DashboardPage() {
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

  const {
    data: trendsData,
    isLoading: isTrendsLoading,
  } = useQuery({
    queryKey: ['revenue-trends'],
    queryFn: () => api.analytics.getRevenueTrends(14),
  });

  const {
    data: recentOrdersData,
    isLoading: isOrdersLoading,
  } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => api.orders.list({ limit: 5 }),
  });

  const {
    data: topProductsData,
  } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => api.analytics.getTopProducts(5),
  });

  const metrics = metricsData?.data;
  const trends = trendsData?.data || [];
  const recentOrders = recentOrdersData?.data || [];
  const topProducts = topProductsData?.data || [];

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
    <div className="space-y-6">
      <PageHeader
        title="Operations Dashboard"
        description="Real-time macro view of revenue, active fulfillment queues, and inventory health."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <DateRangePicker
              selectedRange={dateRange}
              onRangeChange={setDateRange}
            />
            <Link
              href="/products/new"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              New Product
            </Link>
          </div>
        }
      />

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics?.total_revenue ?? 0)}
          icon={<DollarSign className="h-4 w-4" />}
          growthPercentage={metrics?.revenue_growth_percentage}
          description="Paid and cleared receivables"
        />
        <StatCard
          title="Total Orders"
          value={metrics?.total_orders ?? 0}
          icon={<ShoppingCart className="h-4 w-4" />}
          growthPercentage={metrics?.orders_growth_percentage}
          description="Active and completed orders"
        />
        <StatCard
          title="Delivered"
          value={metrics?.completed_orders ?? 0}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          description="Successful deliveries"
        />
        <StatCard
          title="Low Stock Items"
          value={metrics?.low_stock_products_count ?? 0}
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          description="Below alert threshold"
        />
        <StatCard
          title="Returns & RTO"
          value={metrics?.returned_orders ?? 0}
          icon={<RotateCcw className="h-4 w-4 text-rose-500" />}
          description="Returned consignments"
        />
      </div>

      {/* Analytics Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <DashboardCard
          title="Revenue Trajectory (Last 14 Days)"
          description="Gross volume generated per day in BDT"
          className="lg:col-span-2"
        >
          {isTrendsLoading ? (
            <div className="h-72 w-full bg-muted/30 rounded-md animate-pulse" />
          ) : trends.length > 0 ? (
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => `৳${val}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">
              No revenue events logged in this timeframe.
            </div>
          )}
        </DashboardCard>

        {/* Top Products Volume Card */}
        <DashboardCard
          title="Top Performing Products"
          description="Ranked by volume sold"
          action={
            <Link
              href="/products"
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
            >
              Catalog <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          {topProducts.length > 0 ? (
            <div className="space-y-4 pt-2">
              {topProducts.map((prod, index) => (
                <div key={prod.id || index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-foreground truncate max-w-[160px]">
                        {prod.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">{prod.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums text-foreground">
                      {prod.units_sold} sold
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {formatCurrency(prod.gross_revenue)}
                    </div>
                  </div>
                </div>
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

      {/* Recent Orders Table Row */}
      <DashboardCard
        title="Recent Orders"
        description="Real-time order arrivals and live fulfillment status"
        action={
          <Link
            href="/orders"
            className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
          >
            View All Orders <ArrowRight className="h-3 w-3" />
          </Link>
        }
      >
        {isOrdersLoading ? (
          <div className="h-40 w-full bg-muted/20 rounded-md animate-pulse" />
        ) : recentOrders.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-y border-border text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Destination</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-primary">
                      <Link href={`/orders/${order.id}`}>{order.order_number}</Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-foreground">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {order.customer_phone}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {order.shipping_address?.city || 'Dhaka'}
                    </td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-foreground">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className="capitalize font-medium">{order.payment_method}</span>{' '}
                      ({order.payment_status})
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
            No orders created yet. Once customers purchase, transactions will stream here in real time.
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
