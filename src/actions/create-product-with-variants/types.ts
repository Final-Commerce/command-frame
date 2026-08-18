import { CFProduct } from '../../CommonTypes';

// createProductWithVariants — deerlake-parity nested create (spec §3.3.1). Mirrors
// deerlake's CreateProductPayload; atomic in the host (kaching's build buffer:
// commit every write or discard them all).
export interface CreateProductVariantInput {
  _id?: string;
  name: string;
  sku?: string;
  barcode?: string;
  price: number;
  costPrice?: number;
  salePrice?: number;
  images?: string[];
  manageStock?: boolean;
  allowBackorder?: boolean;
  inventory?: { outletId: string; stock: number }[];
  attributes?: { name: string; value: string }[];
}

export interface CreateProductWithVariantsParams {
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  /** Integer minor units — used for the simple product's mandatory default variant. Required when no variants[]. */
  price?: number;
  costPrice?: number;
  salePrice?: number;
  taxable?: boolean;
  taxTable?: string;
  trackInventory?: boolean;
  manageStock?: boolean;
  categories?: string[];
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  images?: string[];
  /** Outlet scoping — omitted/empty = visible everywhere (no CV reconcile). */
  outlets?: string[];
  variants?: CreateProductVariantInput[];
}

export interface CreateProductWithVariantsResponse {
  success: boolean;
  product: CFProduct;
  timestamp: string;
}

export type CreateProductWithVariants = (
  params: CreateProductWithVariantsParams,
) => Promise<CreateProductWithVariantsResponse>;
