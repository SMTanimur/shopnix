'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, MoreHorizontal, Copy, Trash2, Edit3, AlertTriangle } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product, ProductStatus } from '@shopnix/types';
import { api } from '../../../lib/api';
import {
  PageHeader,
  DataTable,
  SearchInput,
  Pagination,
  StatusBadge,
  ConfirmDialog,
} from '../../../components';
import { formatCurrency, formatDate } from '@shopnix/utils';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, search, status: statusFilter }],
    queryFn: () =>
      api.products.list({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter,
      }),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => api.products.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: () => {
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const products = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false,
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => {
        const prod = row.original;
        const primaryImg = prod.images?.find((img) => img.is_primary)?.url || prod.images?.[0]?.url;

        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-md border border-border bg-muted overflow-hidden">
              {primaryImg ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={primaryImg}
                  alt={prod.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground font-semibold">
                  IMG
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-foreground hover:text-primary transition-colors">
                <Link href={`/products/${prod.id}`}>{prod.name}</Link>
              </div>
              <div className="text-xs font-mono text-muted-foreground">{prod.sku}</div>
            </div>
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
      accessorKey: 'regular_price',
      header: 'Price',
      cell: ({ row }) => {
        const { regular_price, sale_price } = row.original;
        return (
          <div>
            <div className="font-semibold text-foreground tabular-nums">
              {formatCurrency(sale_price || regular_price)}
            </div>
            {sale_price && (
              <div className="text-xs text-muted-foreground line-through tabular-nums">
                {formatCurrency(regular_price)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'stock_quantity',
      header: 'Stock',
      cell: ({ row }) => {
        const { stock_quantity, low_stock_threshold } = row.original;
        const isLow = stock_quantity <= low_stock_threshold;

        return (
          <div className="flex items-center gap-1.5 tabular-nums">
            <span
              className={`font-semibold ${
                stock_quantity === 0
                  ? 'text-destructive'
                  : isLow
                  ? 'text-amber-600'
                  : 'text-foreground'
              }`}
            >
              {stock_quantity}
            </span>
            {isLow && (
              <span title="Low stock alert">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.created_at, 'short')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const prod = row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Duplicate"
              onClick={() => duplicateMutation.mutate(prod.id)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <Copy className="h-4 w-4" />
            </button>
            <Link
              href={`/products/${prod.id}/edit`}
              title="Edit"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
            </Link>
            <button
              type="button"
              title="Delete"
              onClick={() => setDeleteId(prod.id)}
              className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Catalog"
        description="Manage merchandise, prices, stock levels, variants, and SEO."
        actions={
          <Link
            href="/products/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-md border border-border bg-card w-full sm:w-auto">
          {(['all', 'active', 'draft', 'archived'] as const).map((s) => {
            const isSelected =
              s === 'all' ? statusFilter === undefined : statusFilter === s;

            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s === 'all' ? undefined : s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search product name or SKU..."
          className="w-full sm:w-72"
        />
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyTitle="No products found"
        emptyDescription="Create your first catalog item to start selling."
        emptyAction={
          <Link
            href="/products/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Link>
        }
      />

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <Pagination meta={meta} onPageChange={(newPage) => setPage(newPage)} />
      )}

      {/* Soft Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Archive Product"
        description="Are you sure you want to archive this product? It will be removed from storefronts and marked as archived."
        confirmLabel="Archive Product"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
