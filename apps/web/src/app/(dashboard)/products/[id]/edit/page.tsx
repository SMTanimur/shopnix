'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Eye,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { UpdateProductInput } from '@shopnix/schemas';
import type { ProductImage } from '@shopnix/types';
import { api } from '../../../../../lib/api';
import {
  PageHeader,
  FormSection,
  ImageUploader,
  LoadingState,
  ErrorState,
} from '../../../../../components';
import { formatCurrency, calculateProfitMargin } from '@shopnix/utils';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.products.getById(productId),
  });

  const [form, setForm] = useState<UpdateProductInput>({});
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    if (data?.data) {
      setForm(data.data);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (input: UpdateProductInput) => api.products.update(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      router.push('/products');
    },
    onError: (err: any) => {
      setErrorBanner(err.response?.data?.message || 'Failed to update product');
    },
  });

  if (isLoading) return <LoadingState rows={8} className="py-10" />;
  if (isError || !data?.data) {
    return <ErrorState title="Product Not Found" message="Could not locate the product." />;
  }

  const profitMargin = calculateProfitMargin(
    form.sale_price || form.regular_price || 0,
    form.cost_price
  );
  const primaryImage = form.images?.find((img) => img.is_primary)?.url || form.images?.[0]?.url;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Edit Product: {data.data.name}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">SKU: {data.data.sku}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {errorBanner && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FormSection title="General Information" description="Name and descriptions">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Short Summary
              </label>
              <input
                type="text"
                value={form.short_description || ''}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 text-sm rounded-md border border-border bg-card text-foreground"
              />
            </div>
          </FormSection>

          <FormSection title="Product Media" description="Manage gallery images">
            <ImageUploader
              images={form.images || []}
              onChange={(images: ProductImage[]) => setForm({ ...form, images })}
            />
          </FormSection>

          <FormSection title="Pricing & Inventory" description="Price and stock controls">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Regular Price (৳)
                </label>
                <input
                  type="number"
                  value={form.regular_price || ''}
                  onChange={(e) =>
                    setForm({ ...form, regular_price: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full h-9 px-3 text-sm font-semibold rounded-md border border-border bg-card text-foreground tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Sale Price (৳)
                </label>
                <input
                  type="number"
                  value={form.sale_price || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sale_price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="w-full h-9 px-3 text-sm font-semibold rounded-md border border-border bg-card text-foreground tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={form.stock_quantity ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, stock_quantity: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full h-9 px-3 text-sm font-semibold rounded-md border border-border bg-card text-foreground tabular-nums"
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Live Preview Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-20 rounded-lg border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5 pb-3 border-b border-border">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Storefront Preview
              </span>
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {primaryImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={primaryImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="p-4 space-y-1">
                <div className="text-sm font-semibold text-foreground">{form.name}</div>
                <div className="text-base font-bold text-foreground">
                  {formatCurrency(form.sale_price || form.regular_price || 0)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Status</label>
              <select
                value={form.status || 'draft'}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
