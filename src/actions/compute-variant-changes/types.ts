import { CFProductVariant } from '../../CommonTypes';

// computeVariantChanges — PURE diff for edit saves (spec §3.2). Ports deerlake's
// findVariantChanges: a shallow field diff across price/costPrice/salePrice/sku/
// barcode/isOnSale/images/attributes/manageStock/inventory.
export interface ComputeVariantChangesParams {
  original: CFProductVariant[];
  edited: CFProductVariant[];
}

export interface ComputeVariantChangesResponse {
  success: boolean;
  changes: { _id: string; changes: Partial<CFProductVariant> }[];
  timestamp: string;
}

export type ComputeVariantChanges = (params: ComputeVariantChangesParams) => Promise<ComputeVariantChangesResponse>;
