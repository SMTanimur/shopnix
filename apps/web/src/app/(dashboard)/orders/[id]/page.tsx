'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Truck,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../../../lib/api';
import {
  PageHeader,
  StatusBadge,
  DashboardCard,
  LoadingState,
  ErrorState,
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
  const [selectedCourier, setSelectedCourier] = useState<CourierProviderName>('sandbox');
  const [weightKg, setWeightKg] = useState(0.5);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.orders.getById(orderId),
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

  const order = data?.data;

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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground font-mono">
                {order.order_number}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Placed on {formatDate(order.created_at, 'datetime')}
            </p>
          </div>
        </div>

        {/* Status Transition Header Control */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="h-9 px-3 text-xs font-semibold rounded-md border border-border bg-card text-foreground cursor-pointer focus:ring-2 focus:ring-ring focus:outline-hidden"
          >
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
          <button
            type="button"
            onClick={() => updateStatusMutation.mutate()}
            disabled={updateStatusMutation.isPending}
            className="h-9 px-3.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
          >
            {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Line Items Card */}
          <DashboardCard title="Ordered Items" description="Product units and price breakdown">
            <div className="divide-y divide-border -mx-5 -my-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                      {item.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-mono">ITEM</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        SKU: {item.sku}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(item.total_price)}
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {item.quantity} × {formatCurrency(item.unit_price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-5 pt-4 border-t border-border space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Charge</span>
                <span className="tabular-nums">{formatCurrency(order.shipping_charge)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border/60">
                <span>Total Amount</span>
                <span className="tabular-nums text-primary">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Cash on Delivery (COD) to Collect</span>
                <span className="tabular-nums text-foreground">
                  {formatCurrency(order.cod_amount)}
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Timeline & Audit History */}
          <DashboardCard
            title="Fulfillment Timeline"
            description="Chronological event log of status transitions and logistics updates"
          >
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-bold text-foreground capitalize">
                      {event.status}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(event.created_at, 'datetime')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.note}</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Internal Staff Notes */}
          <DashboardCard title="Internal Staff Notes" description="Only visible to team members">
            <div className="space-y-3 mb-4">
              {order.notes.length > 0 ? (
                order.notes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-md bg-muted/40 border border-border text-xs">
                    <div className="flex justify-between font-semibold text-foreground mb-1">
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
                placeholder="Log internal conversation or confirmation notes..."
                className="flex-1 h-9 px-3 text-xs rounded-md border border-border bg-card text-foreground"
              />
              <button
                type="button"
                onClick={() => addNoteMutation.mutate()}
                disabled={!internalNote.trim() || addNoteMutation.isPending}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Add Note
              </button>
            </div>
          </DashboardCard>
        </div>

        {/* Contextual Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Customer Summary Card */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Customer Intelligence</h3>
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
              <div className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Shipping Destination
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {order.shipping_address.address_line}, {order.shipping_address.city}
                {order.shipping_address.area ? `, ${order.shipping_address.area}` : ''}
              </p>
            </div>
          </div>

          {/* Courier Logistics & Consignment Card */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Truck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Logistics & Courier</h3>
            </div>

            {order.consignment_id ? (
              <div className="space-y-3">
                <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Booked with {order.courier_provider?.toUpperCase()}
                  </div>
                  <div className="mt-1 font-mono text-[11px]">
                    Consignment ID: {order.consignment_id}
                  </div>
                  {order.tracking_code && (
                    <div className="font-mono text-[11px]">
                      Tracking Code: {order.tracking_code}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Dispatch order to preferred courier partner to generate AWB and tracking code.
                </p>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Select Courier Partner
                  </label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value as CourierProviderName)}
                    className="w-full h-9 px-3 text-xs font-semibold rounded-md border border-border bg-card text-foreground cursor-pointer"
                  >
                    <option value="sandbox">Sandbox Simulator (Dev Mode)</option>
                    <option value="steadfast">Steadfast Courier</option>
                    <option value="pathao">Pathao Courier</option>
                    <option value="redx">RedX Delivery</option>
                    <option value="ecourier">eCourier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
                    className="w-full h-8 px-2.5 text-xs rounded-md border border-border bg-card text-foreground"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => dispatchCourierMutation.mutate()}
                  disabled={dispatchCourierMutation.isPending}
                  className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Truck className="h-3.5 w-3.5" />
                  {dispatchCourierMutation.isPending ? 'Booking Shipment...' : 'Book Consignment'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
