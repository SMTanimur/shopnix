'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Eye,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { CreateProductInput } from '@shopnix/schemas';
import type { ProductImage } from '@shopnix/types';
import { api } from '../../../../lib/api';
import {
  PageHeader,
  FormSection,
  ImageUploader,
} from '../../../../components';
import { formatCurrency, calculateProfitMargin } from '@shopnix/utils';

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateProductInput>({
    name: '',
    description: '',
    short_description: '',
    sku: '',
    barcode: '',
    status: 'active',
    regular_price: 0,
    sale_price: null,
    cost_price: null,
    stock_quantity: 0,
    low_stock_threshold: 5,
    track_inventory: true,
    images: [],
    category_ids: [],
    tags: [],
    has_variants: false,
    variant_options: [],
    weight: 0.5,
    weight_unit: 'kg',
    seo_title: '',
    seo_description: '',
    seo_keywords: [],
  });

  const [newTag, setNewTag] = useState('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Profit Margin Calculation
  const profitMargin = calculateProfitMargin(
    form.sale_price || form.regular_price,
    form.cost_price
  );

  const createMutation = useMutation({
    mutationFn: (input: CreateProductInput) => api.products.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/products');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to create product';
      setErrorBanner(msg);
    },
  });

  const handleSubmit = (statusOverride?: 'draft' | 'active') => {
    if (!form.name.trim()) {
      setErrorBanner('Please enter a product name');
      return;
    }
    if (!form.sku.trim()) {
      setErrorBanner('Please provide an SKU code');
      return;
    }
    if (form.regular_price <= 0) {
      setErrorBanner('Regular price must be greater than 0');
      return;
    }

    setErrorBanner(null);
    createMutation.mutate({
      ...form,
      status: statusOverride || form.status,
    });
  };

  const handleAddVariantOption = () => {
    setForm((prev) => ({
      ...prev,
      has_variants: true,
      variant_options: [
        ...prev.variant_options,
        { name: 'Size', values: ['S', 'M', 'L'] },
      ],
    }));
  };

  const handleRemoveVariantOption = (idx: number) => {
    setForm((prev) => {
      const updated = prev.variant_options.filter((_, i) => i !== idx);
      return {
        ...prev,
        variant_options: updated,
        has_variants: updated.length > 0,
      };
    });
  };

  const primaryImage = form.images.find((img) => img.is_primary)?.url || form.images[0]?.url;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              New Product Builder
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure catalog pricing, media gallery, inventory stock, and SEO.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={createMutation.isPending}
            className="px-3.5 py-2 text-xs font-semibold rounded-md border border-border bg-card text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('active')}
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            {createMutation.isPending ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </div>

      {errorBanner && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <FormSection
            title="General Information"
            description="Core naming, identification, and descriptions."
          >
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Product Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Premium Cotton Panjabi - Indigo Navy"
                className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Short Summary
              </label>
              <input
                type="text"
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                placeholder="Brief one-line pitch for storefront cards..."
                className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Full Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed specifications, fabric, care instructions, and sizing guides..."
                className="w-full p-3 text-sm rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
              />
            </div>
          </FormSection>

          {/* Section 2: Media Gallery */}
          <FormSection
            title="Product Media"
            description="Drag and drop product photos. The starred image serves as the storefront cover."
          >
            <ImageUploader
              images={form.images}
              onChange={(images: ProductImage[]) => setForm({ ...form, images })}
            />
          </FormSection>

          {/* Section 3: Pricing */}
          <FormSection
            title="Pricing & Margin"
            description="Set retail prices and cost basis to monitor unit economics."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Regular Price (৳) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.regular_price || ''}
                  onChange={(e) =>
                    setForm({ ...form, regular_price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                  className="w-full h-9 px-3 text-sm font-semibold tabular-nums rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Sale / Discount Price (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.sale_price || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sale_price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="Optional discount"
                  className="w-full h-9 px-3 text-sm font-semibold tabular-nums rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Cost Price (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.cost_price || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cost_price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="Supplier unit cost"
                  className="w-full h-9 px-3 text-sm tabular-nums rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
                />
              </div>
            </div>

            {form.cost_price && form.regular_price > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-muted/60 text-xs">
                <span className="text-muted-foreground">Estimated Gross Margin:</span>
                <span
                  className={`font-bold tabular-nums ${
                    profitMargin >= 30 ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {profitMargin}%
                </span>
                <span className="text-muted-foreground">
                  (Profit: {formatCurrency((form.sale_price || form.regular_price) - form.cost_price)})
                </span>
              </div>
            )}
          </FormSection>

          {/* Section 4: Inventory & Tracking */}
          <FormSection
            title="Inventory & Barcode"
            description="Manage stock quantities and automated reorder alerts."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  SKU (Stock Keeping Unit) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                  placeholder="e.g. PNJ-NVY-001"
                  className="w-full h-9 px-3 text-sm font-mono uppercase rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Barcode (ISBN, UPC, GTIN)
                </label>
                <input
                  type="text"
                  value={form.barcode || ''}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  placeholder="Optional scanner barcode"
                  className="w-full h-9 px-3 text-sm font-mono rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Stock On-Hand
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock_quantity}
                  onChange={(e) =>
                    setForm({ ...form, stock_quantity: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full h-9 px-3 text-sm font-semibold tabular-nums rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.low_stock_threshold}
                  onChange={(e) =>
                    setForm({ ...form, low_stock_threshold: parseInt(e.target.value, 10) || 5 })
                  }
                  className="w-full h-9 px-3 text-sm tabular-nums rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
                />
              </div>
            </div>
          </FormSection>

          {/* Section 5: Variants */}
          <FormSection
            title="Product Variants"
            description="Manage options like Size, Color, or Material."
          >
            {form.variant_options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-md border border-border bg-muted/20"
              >
                <div className="w-1/3">
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => {
                      const updated = [...form.variant_options];
                      updated[idx]!.name = e.target.value;
                      setForm({ ...form, variant_options: updated });
                    }}
                    placeholder="Option (e.g. Size)"
                    className="w-full h-8 px-2.5 text-xs font-medium rounded-md border border-border bg-card"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={option.values.join(', ')}
                    onChange={(e) => {
                      const updated = [...form.variant_options];
                      updated[idx]!.values = e.target.value.split(',').map((v) => v.trim());
                      setForm({ ...form, variant_options: updated });
                    }}
                    placeholder="Values separated by comma (e.g. S, M, L, XL)"
                    className="w-full h-8 px-2.5 text-xs rounded-md border border-border bg-card"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariantOption(idx)}
                  className="p-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddVariantOption}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Option (e.g. Size, Color)
            </button>
          </FormSection>

          {/* Section 6: SEO Metadata */}
          <FormSection
            title="Search Engine Optimization (SEO)"
            description="Define how this product displays in Google search engine result snippets."
          >
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={form.seo_title || ''}
                onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                placeholder={form.name || 'e.g. Buy Premium Cotton Panjabi in Bangladesh | Shopnix'}
                className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={form.seo_description || ''}
                onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                placeholder={form.short_description || 'High quality cotton panjabi available for fast home delivery across Bangladesh with cash on delivery.'}
                className="w-full p-2.5 text-sm rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
              />
            </div>

            {/* Google Search Result Mockup */}
            <div className="p-3.5 rounded-md border border-border bg-muted/10 space-y-1">
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span>https://yourstore.shopnix.com</span>
                <span>› products › {form.sku.toLowerCase() || 'item'}</span>
              </div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {form.seo_title || form.name || 'Your Product Title Goes Here'}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {form.seo_description ||
                  form.short_description ||
                  'Your product search description snippet will render here in real search engine listings.'}
              </div>
            </div>
          </FormSection>
        </div>

        {/* Contextual Sidebar Column (1/3) */}
        <div className="space-y-6">
          {/* Interactive Live Storefront Preview Card */}
          <div className="sticky top-20 space-y-6">
            <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  Live Storefront Preview
                </span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm font-semibold">
                  Interactive
                </span>
              </div>

              {/* Storefront Mock Card */}
              <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {primaryImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={primaryImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground/50">
                      <Sparkles className="h-10 w-10 mb-1" />
                      <span className="text-xs">No media uploaded</span>
                    </div>
                  )}

                  {form.sale_price && (
                    <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                      SALE
                    </div>
                  )}

                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {form.stock_quantity > 0 ? `${form.stock_quantity} In Stock` : 'Out of Stock'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-mono text-muted-foreground uppercase">
                    {form.sku || 'SKU-00000'}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                    {form.name || 'Untitled Product'}
                  </h4>
                  {form.short_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {form.short_description}
                    </p>
                  )}

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-base font-bold text-foreground tabular-nums">
                      {formatCurrency(form.sale_price || form.regular_price)}
                    </span>
                    {form.sale_price && (
                      <span className="text-xs text-muted-foreground line-through tabular-nums">
                        {formatCurrency(form.regular_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Publishing Settings Widget */}
            <div className="rounded-lg border border-border bg-card p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Publishing Controls</h3>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Publishing Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as 'draft' | 'active' | 'archived' })
                  }
                  className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground cursor-pointer focus:ring-2 focus:ring-ring focus:outline-hidden"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="active">Active (Visible)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Package Weight ({form.weight_unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={form.weight || 0.5}
                  onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 0.5 })}
                  className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
                />
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Tags</label>
                <div className="flex gap-1.5 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newTag.trim() && !form.tags.includes(newTag.trim())) {
                          setForm({ ...form, tags: [...form.tags, newTag.trim()] });
                          setNewTag('');
                        }
                      }
                    }}
                    placeholder="Type tag & Enter..."
                    className="flex-1 h-8 px-2.5 text-xs rounded-md border border-border bg-card text-foreground"
                  />
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-muted text-foreground"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })
                          }
                          className="hover:text-destructive cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
