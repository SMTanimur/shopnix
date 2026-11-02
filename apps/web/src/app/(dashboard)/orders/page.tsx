'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, ShoppingCart, Truck, Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Order, OrderStatus } from '@shopnix/types';
import { api } from '../../../lib/api';
import {
  PageHeader,
  DataTable,
  SearchInput,
  Pagination,
  StatusBadge,
} from '../../../components';
import { formatCurrency, formatDate } from '@shopnix/utils';

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', { page, search, status: statusFilter }],
    queryFn: () =>
      api.orders.list({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter,
      }),
  });

  const orders = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false,
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'order_number',
      header: 'Order #',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-primary hover:underline">
          {row.original.order_number}
        </span>
      ),
    },
    {
      accessorKey: 'customer_name',
      header: 'Customer',
      cell: ({ row }) => {
        const { customer_name, customer_phone, shipping_address } = row.original;
        return (
          <div>
            <div className="font-semibold text-foreground">{customer_name}</div>
            <div className="text-xs text-muted-foreground font-mono">{customer_phone}</div>
            <div className="text-[11px] text-muted-foreground/80 truncate max-w-[150px]">
              {shipping_address?.city || 'Dhaka'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => {
        const items = row.original.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        return (
          <div className="text-xs">
            <span className="font-semibold text-foreground">{totalItems} items</span>
            <div className="text-muted-foreground truncate max-w-[140px]">
              {items[0]?.name}
              {items.length > 1 && ` +${items.length - 1} more`}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'total_amount',
      header: 'Total & Payment',
      cell: ({ row }) => {
        const { total_amount, payment_method, payment_status } = row.original;
        return (
          <div>
            <div className="font-bold tabular-nums text-foreground">
              {formatCurrency(total_amount)}
            </div>
            <div className="text-[11px] text-muted-foreground capitalize">
              {payment_method} •{' '}
              <span
                className={
                  payment_status === 'paid' ? 'text-emerald-600 font-semibold' : ''
                }
              >
                {payment_status}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'courier_provider',
      header: 'Logistics',
      cell: ({ row }) => {
        const { courier_provider, consignment_id } = row.original;
        if (!courier_provider && !consignment_id) {
          return <span className="text-xs text-muted-foreground">Unassigned</span>;
        }

        return (
          <div className="text-xs space-y-0.5">
            <div className="flex items-center gap-1 font-semibold text-foreground capitalize">
              <Truck className="h-3 w-3 text-primary" />
              {courier_provider}
            </div>
            {consignment_id && (
              <div className="text-[11px] font-mono text-muted-foreground truncate max-w-[120px]">
                {consignment_id}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.created_at, 'datetime')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link
          href={`/orders/${row.original.id}`}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1 text-xs font-semibold"
        >
          <Eye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  const statuses: Array<{ label: string; value?: OrderStatus }> = [
    { label: 'All Orders' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Returned', value: 'returned' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Management"
        description="Fulfillment pipeline, consignment dispatch, COD tracking, and order timelines."
      />

      {/* Status Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-md border border-border bg-card">
          {statuses.map((tab) => {
            const isSelected =
              tab.value === undefined ? statusFilter === undefined : statusFilter === tab.value;

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search order number, customer name, phone, or tracking..."
            className="w-full sm:w-80"
          />
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        onRowClick={(order) => router.push(`/orders/${order.id}`)}
        emptyTitle="No orders matching this filter"
        emptyDescription="Orders will populate automatically when buyers place purchases."
      />

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <Pagination meta={meta} onPageChange={(newPage) => setPage(newPage)} />
      )}
    </div>
  );
}
