'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Boxes, Plus, AlertTriangle, ArrowUpDown, History } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product, InventoryMovement } from '@shopnix/types';
import { api } from '../../../lib/api';
import {
  PageHeader,
  DataTable,
  SearchInput,
  DashboardCard,
  ResponsiveDrawer,
} from '../../../components';
import { formatDate } from '@shopnix/utils';

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityDelta, setQuantityDelta] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState<
    'sale' | 'restock' | 'adjustment' | 'return'
  >('restock');
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['inventory-products', search],
    queryFn: () => api.products.list({ search: search || undefined, limit: 50 }),
  });

  const { data: movementsData } = useQuery({
    queryKey: ['inventory-movements', selectedProduct?.id],
    queryFn: () => api.inventory.listMovements(selectedProduct?.id),
    enabled: isHistoryOpen || !!selectedProduct,
  });

  const adjustStockMutation = useMutation({
    mutationFn: () => {
      if (!selectedProduct) throw new Error('No product selected');
      return api.inventory.adjustStock({
        product_id: selectedProduct.id,
        quantity_change: quantityDelta,
        type: adjustmentType,
        note: adjustmentNote || undefined,
      });
    },
    onSuccess: () => {
      setSelectedProduct(null);
      setQuantityDelta(0);
      setAdjustmentNote('');
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-movements'] });
    },
  });

  const products = productsData?.data || [];
  const movements = movementsData?.data || [];

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product & SKU',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">{row.original.name}</div>
          <div className="text-xs font-mono text-muted-foreground">{row.original.sku}</div>
        </div>
      ),
    },
    {
      accessorKey: 'stock_quantity',
      header: 'Available Stock',
      cell: ({ row }) => {
        const { stock_quantity, low_stock_threshold } = row.original;
        const isLow = stock_quantity <= low_stock_threshold;
        return (
          <div className="flex items-center gap-2 tabular-nums">
            <span
              className={`text-sm font-bold ${
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
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-sm">
                <AlertTriangle className="h-3 w-3" />
                Low Stock
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'low_stock_threshold',
      header: 'Reorder Level',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {row.original.low_stock_threshold} units
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setSelectedProduct(row.original)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-border bg-card text-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
          Adjust Stock
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse Inventory Control"
        description="Track on-hand stock levels, reorder thresholds, and immutable inventory movement ledgers."
        actions={
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold rounded-md border border-border bg-card text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <History className="h-4 w-4" />
            Audit Ledger
          </button>
        }
      />

      <div className="flex items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search inventory by title or SKU..."
          className="w-full sm:w-80"
        />
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isProductsLoading}
        emptyTitle="No inventory found"
        emptyDescription="Add products to your catalog to begin tracking stock."
      />

      {/* Stock Adjustment Dialog */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Stock Adjustment — {selectedProduct.name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                SKU: {selectedProduct.sku} • Current Stock: {selectedProduct.stock_quantity}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Adjustment Reason / Type
              </label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as any)}
                className="w-full h-9 px-3 text-xs font-semibold rounded-md border border-border bg-card text-foreground cursor-pointer"
              >
                <option value="restock">Restock (Received from supplier)</option>
                <option value="adjustment">Count Correction (Damage / Found)</option>
                <option value="return">Customer Return</option>
                <option value="sale">Manual Offline Sale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Quantity Delta (e.g. +10 or -5)
              </label>
              <input
                type="number"
                value={quantityDelta || ''}
                onChange={(e) => setQuantityDelta(parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                className="w-full h-9 px-3 text-sm font-bold tabular-nums rounded-md border border-border bg-card text-foreground"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                New resulting stock: {selectedProduct.stock_quantity + quantityDelta}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Note</label>
              <input
                type="text"
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                placeholder="Optional reason details or invoice ref..."
                className="w-full h-9 px-3 text-xs rounded-md border border-border bg-card text-foreground"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-md border border-border bg-card text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => adjustStockMutation.mutate()}
                disabled={quantityDelta === 0 || adjustStockMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
              >
                {adjustStockMutation.isPending ? 'Saving...' : 'Apply Stock Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movement History Drawer */}
      <ResponsiveDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Inventory Movement Audit Ledger"
        description="Immutable record of all stock adjustments, sales, and restocks"
        width="lg"
      >
        <div className="space-y-3">
          {movements.length > 0 ? (
            movements.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-md border border-border bg-muted/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span className="capitalize">{m.type.replace('_', ' ')}</span>
                  <span
                    className={`font-bold tabular-nums ${
                      m.quantity_change > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {m.quantity_change > 0 ? `+${m.quantity_change}` : m.quantity_change}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span>Before: {m.quantity_before} → After: {m.quantity_after}</span>
                  <span>{formatDate(m.created_at, 'datetime')}</span>
                </div>
                {m.note && <p className="text-muted-foreground italic text-[11px]">{m.note}</p>}
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">
              No inventory delta events recorded yet.
            </p>
          )}
        </div>
      </ResponsiveDrawer>
    </div>
  );
}
