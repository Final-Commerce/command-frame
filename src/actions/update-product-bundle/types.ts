import { CFProduct, CFProductVariant } from '../../CommonTypes';
import { EditProductParams } from '../edit-product/types';
import { CreateProductVariantInput } from '../create-product-with-variants/types';

// updateProductBundle — the edit-page Save (spec §3.3.2). Bundles product scalar
// changes, variant changes/additions/deletions, and an optional outlet-visibility
// reconcile into one atomic call (kaching build buffer: commit every write
// together or discard them all).
export interface UpdateProductBundleParams {
  productId: string;
  productChanges?: EditProductParams['changes'];
  variantChanges?: { _id: string; changes: Partial<CFProductVariant> }[];
  variantAdditions?: CreateProductVariantInput[];
  variantDeletions?: string[];
  /** undefined = leave visibility alone; array (incl. []) = reconcile to exactly these outlets. */
  outlets?: string[];
}

export interface UpdateProductBundleResponse {
  success: boolean;
  product: CFProduct;
  added: string[];
  changed: string[];
  deleted: string[];
  timestamp: string;
}

export type UpdateProductBundle = (params: UpdateProductBundleParams) => Promise<UpdateProductBundleResponse>;
