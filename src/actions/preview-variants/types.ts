import { CFProductVariant } from '../../CommonTypes';

// previewVariants — PURE math (no writes): the variant matrix generator flows use
// for the live preview table (spec §3.2). Ports deerlake's generateVariants /
// computeVariantDiff, including the stable dedup key ("Color:Red|Size:S") and
// client-side ObjectId generation for new combos.
export interface PreviewVariantsParams {
  selectedOptions: { name: string; values: string[] }[];
  existingVariants?: CFProductVariant[];
  defaults: { price: number; outletIds: string[] };
}

export interface PreviewVariantsResponse {
  success: boolean;
  /** New combos as ready-to-submit variant docs (client-generated _id, inventory seeds {outletId, stock: 0}). Attributes always carry concrete values (generated from selectedOptions), so they feed createProductWithVariants/updateProductBundle inputs without narrowing. */
  additions: (Omit<CFProductVariant, '_id' | 'attributes'> & {
    _id: string;
    attributes: { name: string; value: string }[];
  })[];
  /** Existing variants whose combos survive the new option set. */
  existing: CFProductVariant[];
  /** Ids of attribute-less placeholder variants that should be deleted when additions land. */
  autoDeleteIds: string[];
  timestamp: string;
}

export type PreviewVariants = (params: PreviewVariantsParams) => Promise<PreviewVariantsResponse>;
