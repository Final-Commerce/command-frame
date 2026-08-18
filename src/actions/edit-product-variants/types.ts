import { CFProductVariant } from '../../CommonTypes';

// Mirrors hub-api's POST product/variants (spec §3.3.2 semantics live HERE):
// additions (full docs, client _id honored) dense-seed inventory rows and flip
// productType to 'variable'; deletions soft-delete the variants AND their
// inventory rows.
export interface EditProductVariantsParams {
  productId: string;
  additions?: (Omit<CFProductVariant, '_id'> & { _id?: string })[];
  changes?: Array<{ _id: string; changes: Partial<CFProductVariant> }>;
  deletions?: string[];
}

export interface EditProductVariantsResponse {
  success: boolean;
  /** Ids actually written, per bucket — lets orchestrators verify. */
  added: string[];
  changed: string[];
  deleted: string[];
  timestamp: string;
}

export type EditProductVariants = (params: EditProductVariantsParams) => Promise<EditProductVariantsResponse>;
