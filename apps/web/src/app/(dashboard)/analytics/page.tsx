'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Download, TrendingUp, DollarSign, Package } from 'lucide-react';
import { api } from '../../../lib/api';
import {
  PageHeader,
  DashboardCard,
  DateRangePicker,
  StatCard,
} from '../../../components';
import { formatCurrency } from '@shopnix/utils';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');

  const { data: metricsData } = useQuery({
    queryKey: ['dashboard-metrics', dateRange],
    queryFn: () => api.analytics.getDashboardMetrics(dateRange),
  });

  const { data: trendsData, isLoading: isTrendsLoading } = useQuery({
    queryKey: ['revenue-trends', 30],
    queryFn: () => api.analytics.getRevenueTrends(30),
  });

  const { data: topProductsData } = useQuery({
    queryKey: ['top-products', 10],
    queryFn: () => api.analytics.getTopProducts(10),
  });

  const metrics = metricsData?.data;
  const trends = trendsData?.data || [];
  const topProducts = topProductsData?.data || [];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Business Intelligence & Analytics"
        description="Comprehensive sales trends, volume metrics, and product revenue performance."
        actions={
          <DateRangePicker
            selectedRange={dateRange}
            onRangeChange={setDateRange}
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Gross Revenue"
          value={formatCurrency(metrics?.total_revenue ?? 0)}
          icon={<DollarSign className="h-4 w-4" />}
          growthPercentage={metrics?.revenue_growth_percentage}
        />
        <StatCard
          title="Order Conversion"
          value={`${metrics?.completed_orders ?? 0} Delivered`}
          icon={<TrendingUp className="h-4 w-4" />}
          description={`From ${metrics?.total_orders ?? 0} total bookings`}
        />
        <StatCard
          title="Return Rate Impact"
          value={`${metrics?.returned_orders ?? 0} Returned`}
          description="RTO & cancellations"
        />
      </div>

      {/* 30-Day Revenue Trend Chart */}
      <DashboardCard
        title="Daily Volume & Gross Revenue"
        description="Daily sales performance over the past 30 days"
      >
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
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
                formatter={(val: number) => [`৳${val.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Top 10 Product Profitability Ranking */}
      <DashboardCard
        title="Best Selling Merchandise"
        description="Product ranking by sales volume and gross revenue"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-y border-border text-xs uppercase font-semibold text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Units Sold</th>
                <th className="px-5 py-3">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-bold text-muted-foreground">#{idx + 1}</td>
                  <td className="px-5 py-3.5 font-semibold text-foreground">{p.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className="px-5 py-3.5 tabular-nums font-medium">{p.units_sold}</td>
                  <td className="px-5 py-3.5 tabular-nums font-bold text-foreground">
                    {formatCurrency(p.gross_revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
