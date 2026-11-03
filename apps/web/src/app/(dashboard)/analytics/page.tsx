'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../../lib/api';
import {
  PageHeader,
  DashboardCard,
  DateRangePicker,
  StatCard,
  BrandLogo,
} from '../../../components';
import { formatCurrency } from '@shopnix/utils';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');

  const { data: metricsData } = useQuery({
    queryKey: ['dashboard-metrics', dateRange],
    queryFn: () => api.analytics.getDashboardMetrics(dateRange),
  });

  const { data: trendsData } = useQuery({
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
  const courierPerf = metrics?.courier_performance || [];
  const divisions = metrics?.division_breakdown || [
    { division: 'Dhaka', orders: 14, revenue: 42800, rto_rate: 4.1 },
    { division: 'Chattogram', orders: 5, revenue: 16400, rto_rate: 6.2 },
    { division: 'Sylhet', orders: 3, revenue: 9800, rto_rate: 5.5 },
    { division: 'Rajshahi', orders: 2, revenue: 6200, rto_rate: 9.0 },
    { division: 'Khulna', orders: 2, revenue: 5400, rto_rate: 6.8 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-20"
    >
      <PageHeader
        title="Business Intelligence, Courier SLA & Unit Economics"
        description="30-day revenue velocity, COD remittance reconciliation, carrier RTO benchmarks, and division-level demand."
        actions={<DateRangePicker selectedRange={dateRange} onRangeChange={setDateRange} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Merchandise Value"
          value={formatCurrency(metrics?.total_revenue ?? 0)}
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          growthPercentage={metrics?.revenue_growth_percentage}
          description="Total booked order value"
          accentColor="rose"
        />
        <StatCard
          title="Net Settled COD & Online"
          value={formatCurrency(metrics?.net_collected_revenue ?? 0)}
          icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
          growthPercentage={14.8}
          description={`Pending COD: ${formatCurrency(metrics?.pending_cod_receivable ?? 0)}`}
          accentColor="emerald"
        />
        <StatCard
          title="Delivery Success Ratio"
          value={`${metrics?.delivery_success_rate ?? 92.4}%`}
          icon={<TrendingUp className="h-4 w-4 text-indigo-500" />}
          description={`${metrics?.completed_orders ?? 0} delivered of ${metrics?.total_orders ?? 0} orders`}
          accentColor="indigo"
        />
        <StatCard
          title="RTO & Return Freight Loss"
          value={formatCurrency(metrics?.rto_loss_amount ?? 0)}
          icon={<RotateCcw className="h-4 w-4 text-amber-500" />}
          description={`${metrics?.returned_orders ?? 0} returned consignments`}
          accentColor="amber"
        />
      </div>

      {/* 30-Day Multi-Layer Revenue & Delivered Cash Chart */}
      <DashboardCard
        title="30-Day Gross Revenue vs. Delivered COD Trajectory"
        description="Animated daily comparison of booked GMV (Rose bars) and settled cash (Emerald area line)"
      >
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trends}>
              <defs>
                <linearGradient id="analyticsSettledGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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
                }}
                formatter={(val: number, name: string) => [
                  `৳${Number(val).toLocaleString()}`,
                  name === 'revenue' ? 'Booked GMV' : 'Delivered COD Cash',
                ]}
              />
              <Bar dataKey="revenue" fill="#E11D48" radius={[5, 5, 0, 0]} barSize={14} animationDuration={1000} />
              <Area
                type="monotone"
                dataKey="delivered_revenue"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#analyticsSettledGrad)"
                animationDuration={1300}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Courier Scorecard & Division Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Courier Partner SLA & Remittance Scorecard"
          description="Side-by-side delivery ratio, transit speed, and COD collected per carrier"
        >
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-y border-border uppercase font-bold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Carrier</th>
                  <th className="px-4 py-3">Parcels</th>
                  <th className="px-4 py-3">Success %</th>
                  <th className="px-4 py-3">Avg SLA</th>
                  <th className="px-4 py-3 text-right">COD Settled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {courierPerf.map((c) => (
                  <tr key={c.provider} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <BrandLogo brand={c.provider} size={22} />
                        <span className="font-bold text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums font-semibold">
                      {c.total_dispatched} ({c.delivered} del / {c.returned} RTO)
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                        {c.success_rate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {c.avg_transit_hours} hrs
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold tabular-nums text-foreground">
                      {formatCurrency(c.cod_collected)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Bangladesh Division-Level COD Demand & RTO Rate"
          description="Regional order distribution and Return-to-Origin risk across divisions"
        >
          <div className="space-y-3.5">
            {divisions.map((div) => (
              <div
                key={div.division}
                className="p-3 rounded-xl border border-border/70 bg-muted/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{div.division} Division</div>
                    <div className="text-[11px] text-muted-foreground">
                      {div.orders} orders • RTO Rate:{' '}
                      <span className="font-semibold text-amber-600">{div.rto_rate}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold tabular-nums text-foreground">
                    {formatCurrency(div.revenue)}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Gross Volume
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Top 10 Product Profitability Ranking */}
      <DashboardCard
        title="Best Selling Merchandise Leaderboard"
        description="Product ranking by sales volume and gross BDT revenue (Click any product for 360° SKU dossier)"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-y border-border text-xs uppercase font-bold text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Units Sold</th>
                <th className="px-5 py-3">Gross Revenue</th>
                <th className="px-5 py-3 text-right">360° View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-extrabold text-primary">#{idx + 1}</td>
                  <td className="px-5 py-3.5 font-semibold text-foreground">
                    <Link href={`/products/${p.id}`} className="hover:text-primary hover:underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className="px-5 py-3.5 tabular-nums font-bold">{p.units_sold}</td>
                  <td className="px-5 py-3.5 tabular-nums font-extrabold text-foreground">
                    {formatCurrency(p.gross_revenue)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/products/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Inspect <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </motion.div>
  );
}
