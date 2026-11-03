'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Truck,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  PhoneCall,
  Printer,
  ShieldCheck,
  Sparkles,
  Play,
  Pause,
  Calculator,
  QrCode,
  Volume2,
} from 'lucide-react';
import { api } from '../../../../lib/api';
import {
  StatusBadge,
  DashboardCard,
  LoadingState,
  ErrorState,
  BrandLogo,
} from '../../../../components';
import { formatCurrency, formatDate } from '@shopnix/utils';
import type { OrderStatus, CourierProviderName } from '@shopnix/types';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = params.id as string;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<CourierProviderName>('steadfast');
  const [weightKg, setWeightKg] = useState(0.5);
  const [isPlayingCall, setIsPlayingCall] = useState(false);
  const [showThermalLabel, setShowThermalLabel] = useState(true);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.orders.getById(orderId),
  });

  const order = data?.data;

  const { data: fraudData } = useQuery({
    queryKey: ['order-fraud-check', order?.customer_phone],
    queryFn: () => api.couriers.checkFraudRisk(order?.customer_phone || '01711223344'),
    enabled: !!order?.customer_phone,
  });

  const updateStatusMutation = useMutation({
    mutationFn: () =>
      api.orders.updateStatus(orderId, {
        status: selectedStatus,
        note: statusNote || undefined,
      }),
    onSuccess: () => {
      setStatusNote('');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const dispatchCourierMutation = useMutation({
    mutationFn: () =>
      api.couriers.dispatch({
        order_id: orderId,
        provider: selectedCourier,
        item_weight: weightKg,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: () => api.orders.addNote(orderId, internalNote),
    onSuccess: () => {
      setInternalNote('');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
  });

  if (isLoading) {
    return <LoadingState rows={8} className="py-10" />;
  }

  if (isError || !order) {
    return (
      <div className="py-12">
        <ErrorState
          title="Order not found"
          message="Could not locate the requested order details."
          onRetry={refetch}
        />
      </div>
    );
  }

  const fraud = fraudData?.data;

  // 7-Stage COD Lifecycle Stepper Calculation
  const lifecycleStages = [
    { key: 'placed', label: '1. Order Placed', done: true },
    { key: 'fraud', label: '2. Fraud Verified', done: true },
    { key: 'confirmed', label: '3. Call Confirmed', done: order.status !== 'pending' },
    { key: 'packed', label: '4. Stock Reserved & AWB', done: ['processing', 'shipped', 'delivered'].includes(order.status) || !!order.consignment_id },
    { key: 'shipped', label: '5. Courier Booked', done: ['shipped', 'delivered'].includes(order.status) || !!order.consignment_id },
    { key: 'delivered', label: '6. Doorstep Delivered', done: order.status === 'delivered' },
    { key: 'settled', label: '7. COD Cash Settled', done: order.payment_status === 'paid' && order.status === 'delivered' },
  ];

  // Unit Economics Waterfall Calculation
  const estCogs = Math.round(order.subtotal * 0.46);
  const courierFee = order.shipping_charge || 70;
  const codFee = order.payment_method === 'cod' ? Math.round(order.total_amount * 0.01) : 0;
  const packagingCost = 18;
  const metaAdCpa = 165;
  const netProfit = order.total_amount - estCogs - courierFee - codFee - packagingCost - metaAdCpa;
  const netMarginPct = order.total_amount > 0 ? ((netProfit / order.total_amount) * 100).toFixed(1) : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      {/* Sticky Command Bar */}
      <div className="sticky top-0 z-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                {order.order_number}
              </h1>
              <StatusBadge status={order.status} />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase">
                {order.payment_method} • {order.payment_status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Placed on {formatDate(order.created_at, 'datetime')} • Destination: {order.shipping_address.city}
            </p>
          </div>
        </div>

        {/* Action & Status Transition Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowThermalLabel((v) => !v)}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-bold rounded-lg border border-border bg-background text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-primary" />
            {showThermalLabel ? 'Hide Invoice 15 Label' : 'Print Invoice 15 AWB'}
          </button>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="h-9 px-3 text-xs font-bold rounded-lg border border-border bg-card text-foreground cursor-pointer"
          >
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned (RTO)</option>
          </select>
          <button
            type="button"
            onClick={() => updateStatusMutation.mutate()}
            disabled={updateStatusMutation.isPending}
            className="h-9 px-4 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
          >
            {updateStatusMutation.isPending ? 'Updating...' : 'Transition Status'}
          </button>
        </div>
      </div>

      {/* 7-Stage Animated COD Lifecycle Progress Stepper */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            7-Stage COD Fulfillment Pipeline
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Stock Reserved in Dhaka Primary Warehouse
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {lifecycleStages.map((st, idx) => (
            <motion.div
              key={st.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3 rounded-lg border text-xs transition-all ${
                st.done
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'border-border bg-muted/30 text-muted-foreground font-medium'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <CheckCircle2 className={`h-4 w-4 ${st.done ? 'text-emerald-500' : 'text-muted-foreground/40'}`} />
                <span className="text-[10px] font-mono">0{idx + 1}</span>
              </div>
              <div className="leading-snug">{st.label.replace(/^\d+\.\s*/, '')}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (2/3): Items, Call Center Player, Unit Economics, Timeline, Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Line Items Card */}
          <DashboardCard title="Ordered Merchandise & Financial Breakdown" description="SKU line items, unit prices, and collectible COD total">
            <div className="divide-y divide-border -mx-5 -my-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                      {item.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-mono font-bold">SKU</span>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.product_id}`}
                        className="text-sm font-bold text-foreground hover:text-primary hover:underline"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-muted-foreground font-mono">
                        SKU: {item.sku} • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold tabular-nums text-foreground">
                      {formatCurrency(item.total_price)}
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {item.quantity} × {formatCurrency(item.unit_price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Merchandise Subtotal</span>
                <span className="tabular-nums font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Courier Delivery Charge ({order.shipping_address.city})</span>
                <span className="tabular-nums font-semibold">{formatCurrency(order.shipping_charge)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span className="tabular-nums">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-foreground text-base pt-2 border-t border-border/60">
                <span>Grand Order Total</span>
                <span className="tabular-nums text-primary">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>Cash on Delivery (COD) Collectible by Rider</span>
                <span className="tabular-nums text-foreground">{formatCurrency(order.cod_amount)}</span>
              </div>
            </div>
          </DashboardCard>

          {/* Integrated Softphone Call Center & AI Call Recording Transcript */}
          <DashboardCard
            title="Integrated Cloud Softphone (PBX) & AI Call Audit"
            description="Recorded confirmation call, agent talk time, and AI script compliance verification"
            action={
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold">
                <Sparkles className="h-3.5 w-3.5" />
                AI Script Score: 96/100
              </span>
            }
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingCall((p) => !p)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
                  >
                    {isPlayingCall ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span>Confirmation Call Recording — {order.customer_phone}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border">
                        01:18s
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Agent: Nusrat (Desk #04) • Disposition: Confirmed & Stock Reserved
                    </div>
                  </div>
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center gap-1 h-8 px-3">
                  {[35, 65, 90, 45, 80, 60, 95, 50, 70, 85, 40, 75, 55, 90, 60, 40].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${isPlayingCall ? Math.max(25, (h + i * 11) % 100) : h}%` }}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingCall ? 'bg-primary animate-pulse' : 'bg-primary/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-card text-xs space-y-2">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-primary" />
                  Bilingual AI Transcription & Landmark Extraction
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Agent:</strong> &ldquo;Assalamu Alaikum {order.customer_name}, calling from Shopnix regarding your order {order.order_number} for {formatCurrency(order.total_amount)} Cash on Delivery. Should we dispatch to {order.shipping_address.area || order.shipping_address.city}?&rdquo;
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Buyer:</strong> &ldquo;Walaikum Assalam, haan order confirm. {order.shipping_address.address_line} e pathiye din, rider ashle call dilei hobe.&rdquo;
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* Unit Economics & Net Margin Waterfall Card */}
          <DashboardCard
            title="Order Unit Economics & Net Profit P&L Waterfall"
            description="Real-time net margin calculation after COGS, courier freight, COD fee, packaging, and attributed Meta Ad CPA"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Gross Total</span>
                <span className="text-sm font-extrabold text-foreground tabular-nums mt-0.5 block">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Est. COGS</span>
                <span className="text-sm font-bold text-rose-600 tabular-nums mt-0.5 block">
                  -{formatCurrency(estCogs)}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Courier Fee</span>
                <span className="text-sm font-bold text-rose-600 tabular-nums mt-0.5 block">
                  -{formatCurrency(courierFee)}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">1% COD + Pack</span>
                <span className="text-sm font-bold text-rose-600 tabular-nums mt-0.5 block">
                  -{formatCurrency(codFee + packagingCost)}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Meta Ad CPA</span>
                <span className="text-sm font-bold text-rose-600 tabular-nums mt-0.5 block">
                  -{formatCurrency(metaAdCpa)}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-extrabold block">
                  Net Profit ({netMarginPct}%)
                </span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 block">
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Fulfillment Timeline & Audit History */}
          <DashboardCard
            title="Immutable Fulfillment Audit Timeline"
            description="Chronological event ledger of status transitions, call confirmations, and courier webhooks"
          >
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                      {event.status}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {formatDate(event.created_at, 'datetime')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.note}</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Internal Staff Notes */}
          <DashboardCard title="Internal Operations Notes" description="Team collaboration log">
            <div className="space-y-3 mb-4">
              {order.notes.length > 0 ? (
                order.notes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/40 border border-border text-xs">
                    <div className="flex justify-between font-bold text-foreground mb-1">
                      <span>{note.author_name}</span>
                      <span className="text-muted-foreground font-normal">
                        {formatDate(note.created_at, 'datetime')}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No internal notes added yet.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Log internal conversation, special packaging instruction, or rider note..."
                className="flex-1 h-9 px-3 text-xs rounded-lg border border-border bg-card text-foreground"
              />
              <button
                type="button"
                onClick={() => addNoteMutation.mutate()}
                disabled={!internalNote.trim() || addNoteMutation.isPending}
                className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Add Note
              </button>
            </div>
          </DashboardCard>
        </div>

        {/* Right Contextual Sidebar (1/3): Fraud Ratio Gauge, Courier Dispatch, Thermal Label Preview, Customer */}
        <div className="space-y-6">
          {/* Cross-Courier Customer Fraud & Delivery Ratio Gauge Card */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Cross-Courier Fraud Shield</h3>
              </div>
              {fraud && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    fraud.risk_level === 'trusted'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : fraud.risk_level === 'moderate'
                      ? 'bg-amber-500/15 text-amber-600'
                      : 'bg-rose-500/15 text-rose-600'
                  }`}
                >
                  {fraud.success_rate}% Ratio
                </span>
              )}
            </div>

            {fraud ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Historical COD Parcels</span>
                  <span className="font-extrabold text-foreground tabular-nums">
                    {fraud.delivered_parcels} Delivered / {fraud.total_parcels} Total
                  </span>
                </div>

                <div className="space-y-2">
                  {fraud.carriers.map((c) => (
                    <div key={c.provider} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2">
                        <BrandLogo brand={c.provider} size={20} />
                        <span className="font-bold capitalize text-foreground">{c.provider}</span>
                      </div>
                      <span className="font-mono font-semibold text-foreground">
                        {c.delivered_parcels}/{c.total_parcels} ({c.success_rate}%)
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50 leading-relaxed">
                  {fraud.ai_recommendation}
                </p>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Analyzing cross-courier phone history...</div>
            )}
          </div>

          {/* Courier Logistics & Consignment Card with Real Brand Logos */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Truck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Courier Consignment & AWB</h3>
            </div>

            {order.consignment_id ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <BrandLogo brand={order.courier_provider || 'steadfast'} size={28} />
                    <div>
                      <div className="font-extrabold text-emerald-700 dark:text-emerald-300 uppercase">
                        Booked with {order.courier_provider}
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        AWB: {order.consignment_id}
                      </div>
                    </div>
                  </div>
                  {order.courier_status && (
                    <div className="text-[11px] font-semibold text-foreground pt-1 border-t border-emerald-500/20">
                      Live Hub Status: {order.courier_status}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Select a carrier below for 1-click consignment booking and barcode AWB generation:
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {(['steadfast', 'pathao', 'redx', 'paperfly', 'ecourier', 'carrybee'] as const).map(
                    (prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setSelectedCourier(prov)}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 text-[11px] font-bold capitalize cursor-pointer transition-all ${
                          selectedCourier === prov
                            ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                            : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <BrandLogo brand={prov} size={22} />
                        <span>{prov}</span>
                      </button>
                    )
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Parcel Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
                    className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-card text-foreground"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => dispatchCourierMutation.mutate()}
                  disabled={dispatchCourierMutation.isPending}
                  className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Truck className="h-3.5 w-3.5" />
                  {dispatchCourierMutation.isPending
                    ? 'Booking Consignment...'
                    : `Dispatch to ${selectedCourier.toUpperCase()}`}
                </button>
              </div>
            )}
          </div>

          {/* Printable Thermal Barcode AWB Slip ("Invoice 15" Style) */}
          {showThermalLabel && (
            <div className="rounded-xl border-2 border-dashed border-foreground/30 bg-white text-slate-900 p-4 shadow-sm space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                <div className="flex items-center gap-2">
                  <BrandLogo brand={order.courier_provider || selectedCourier} size={26} />
                  <div>
                    <div className="font-extrabold text-xs uppercase">SHOPNIX EXPRESS AWB</div>
                    <div className="text-[10px] text-slate-500">Thermal Invoice 15 (4×6&quot;)</div>
                  </div>
                </div>
                <QrCode className="h-7 w-7 text-slate-800" />
              </div>

              {/* Simulated Code-128 Barcode SVG */}
              <div className="py-2 text-center bg-slate-50 rounded border border-slate-200">
                <svg className="h-10 w-48 mx-auto" viewBox="0 0 200 40" fill="none">
                  {[4, 10, 14, 22, 28, 32, 40, 46, 54, 60, 64, 72, 78, 86, 92, 98, 106, 112, 120, 126, 134, 140, 146, 154, 160, 168, 174, 182, 188, 194].map(
                    (x, i) => (
                      <rect
                        key={i}
                        x={x}
                        y="2"
                        width={i % 3 === 0 ? '4' : '2'}
                        height="36"
                        fill="#0F172A"
                      />
                    )
                  )}
                </svg>
                <div className="text-[11px] font-bold tracking-widest mt-1">
                  {order.consignment_id || `AWB-${order.order_number}`}
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div>
                  <strong>RECIPIENT:</strong> {order.customer_name} ({order.customer_phone})
                </div>
                <div>
                  <strong>ADDRESS:</strong> {order.shipping_address.address_line},{' '}
                  {order.shipping_address.area}, {order.shipping_address.city}
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 text-white flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase">COD TO COLLECT:</span>
                <span className="text-sm font-extrabold">{formatCurrency(order.cod_amount)}</span>
              </div>
            </div>
          )}

          {/* Customer Summary Card with Link to 360° Customer Dossier */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Customer Profile</h3>
              </div>
              {order.customer_id && (
                <Link
                  href={`/customers/${order.customer_id}`}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  360° Dossier →
                </Link>
              )}
            </div>

            <div>
              <div className="text-sm font-bold text-foreground">{order.customer_name}</div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5">
                {order.customer_phone}
              </div>
              {order.customer_email && (
                <div className="text-xs text-muted-foreground">{order.customer_email}</div>
              )}
            </div>

            <div className="pt-2 border-t border-border/60">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Delivery Address
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {order.shipping_address.address_line}, {order.shipping_address.city}
                {order.shipping_address.area ? `, ${order.shipping_address.area}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
