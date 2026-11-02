export type InventoryMovementType =
  | 'sale'
  | 'restock'
  | 'adjustment'
  | 'return'
  | 'initial';

export interface InventoryMovement {
  id: string;
  organization_id: string;
  product_id: string;
  product_name?: string;
  product_sku?: string;
  variant_id: string | null;
  type: InventoryMovementType;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reference_type: 'order' | 'manual_adjustment' | 'import';
  reference_id: string | null;
  note: string | null;
  author_id: string | null;
  created_at: string;
}

export interface StockAdjustmentInput {
  product_id: string;
  variant_id?: string | null;
  quantity_change: number;
  type: InventoryMovementType;
  note?: string;
}
