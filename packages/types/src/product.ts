export type ProductStatus = 'draft' | 'active' | 'archived';

export interface ProductImage {
  url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}

export interface VariantOption {
  name: string; // e.g. 'Size'
  values: string[]; // e.g. ['S', 'M', 'L']
}

export interface ProductDimensions {
  length: number | null;
  width: number | null;
  height: number | null;
}

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  barcode: string | null;
  status: ProductStatus;
  regular_price: number;
  sale_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  images: ProductImage[];
  category_ids: string[];
  tags: string[];
  has_variants: boolean;
  variant_options: VariantOption[];
  weight: number | null;
  weight_unit: 'kg' | 'g';
  dimensions?: ProductDimensions;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  organization_id: string;
  sku: string;
  barcode: string | null;
  option_values: Record<string, string>;
  regular_price: number;
  sale_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilterParams {
  search?: string;
  status?: ProductStatus;
  category_id?: string;
  low_stock?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
