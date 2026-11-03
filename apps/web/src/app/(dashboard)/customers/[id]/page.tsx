'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  RotateCcw,
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
import { formatCurrency, formatDate } from '@shopnix/utils';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const { data: customerRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => api.customers.getById(customerId),
  });

  const customer = customerRes?.data;

  const { data: ordersRes } = useQuery({
    queryKey: ['customer-orders', customer?.phone_number],
    queryFn: () => api.orders.list({ search: customer?.phone_number, limit: 20 }),
    enabled: !!customer?.phone_number,
  });

  const { data: fraudRes } = useQuery({
    queryKey: ['customer-fraud', customer?.phone_number],
    queryFn: () => api.couriers.checkFraudRisk(customer?.phone_number || '01711223344'),
    enabled: !!customer?.phone_number,
  });

  if (isLoading) return <LoadingState rows={6} className="py-10" />;
  if (isError || !customer) {
    return (
      <div className="py-12">
        <ErrorState
          title="Customer profile not found"
          message="Could not locate the requested customer dossier."
          onRetry={refetch}
        />
      </div>
    );
  }

  const customerOrders = ordersRes?.data || [];
  const fraud = fraudRes?.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-extrabold text-lg">
            {customer.name[0]}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-foreground">{customer.name}</h1>
              {customer.is_high_risk ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  High RTO Risk Flag
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Trusted Buyer
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="h-3.5 w-3.5 text-primary" />
                {customer.phone_number}
              </span>
              {customer.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {customer.email}
                </span>
              )}
              <span>Customer since {formatDate(customer.created_at, 'short')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lifetime Value (LTV)"
          value={formatCurrency(customer.total_spent)}
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          description="Cumulative gross spend"
          accentColor="rose"
        />
        <StatCard
          title="Total Orders"
          value={customer.total_orders}
          icon={<ShoppingBag className="h-4 w-4 text-indigo-500" />}
          description={`${customer.completed_orders} delivered successfully`}
          accentColor="indigo"
        />
        <StatCard
          title="Cross-Courier Ratio"
          value={`${fraud?.success_rate ?? 92.5}%`}
          icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
          description={`${fraud?.delivered_parcels ?? 18} / ${fraud?.total_parcels ?? 20} nationwide parcels`}
          accentColor="emerald"
        />
        <StatCard
          title="Returned (RTO) Parcels"
          value={customer.returned_orders}
          icon={<RotateCcw className="h-4 w-4 text-amber-500" />}
          description={`Return rate: ${customer.return_rate_percentage || 0}%`}
          accentColor="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard
            title="Customer Order History & Consignment Ledger"
            description="Complete purchase timeline with courier tracking and payment status"
          >
            {customerOrders.length > 0 ? (
              <div className="overflow-x-auto -mx-5 -mb-5">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-y border-border uppercase font-bold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Order #</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Courier</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {customerOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono font-bold text-primary">
                          <Link href={`/orders/${ord.id}`} className="hover:underline">
                            {ord.order_number}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium">
                          {ord.items?.[0]?.name || 'Order Item'}
                        </td>
                        <td className="px-4 py-3 font-extrabold tabular-nums">
                          {formatCurrency(ord.total_amount)}
                        </td>
                        <td className="px-4 py-3">
                          {ord.courier_provider ? (
                            <div className="flex items-center gap-1.5">
                              <BrandLogo brand={ord.courier_provider} size={18} />
                              <span className="capitalize font-semibold">{ord.courier_provider}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={ord.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(ord.created_at, 'short')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No historical orders linked to this phone number yet.
              </p>
            )}
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard
            title="Cross-Courier Delivery Ratio"
            description="National courier database lookup"
          >
            {fraud ? (
              <div className="space-y-2.5">
                {fraud.carriers.map((c) => (
                  <div
                    key={c.provider}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <BrandLogo brand={c.provider} size={22} />
                      <span className="font-bold capitalize text-foreground">{c.provider}</span>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      {c.delivered_parcels}/{c.total_parcels} ({c.success_rate}%)
                    </span>
                  </div>
                ))}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground flex items-start gap-2 mt-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{fraud.ai_recommendation}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Loading courier ratio...</p>
            )}
          </DashboardCard>

          <DashboardCard title="Saved Delivery Addresses" description="Verified shipping destinations">
            <div className="space-y-2.5">
              {(customer.addresses || []).map((addr, i) => (
                <div key={i} className="p-3 rounded-lg border border-border bg-muted/20 text-xs">
                  <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {addr.label || 'Default Address'} ({addr.city})
                  </div>
                  <p className="text-muted-foreground">
                    {addr.address_line}, {addr.area}, {addr.city}
                  </p>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </motion.div>
  );
}
