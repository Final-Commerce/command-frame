// Get Composite Price Types (FT-83)
import type { CFCompositePick } from '../../CommonTypes';

export interface GetCompositePriceParams {
  /** The composite's variant — the one `addProductToCart` takes. */
  variantId: string;
  /** The picks so far, exactly as `addProductToCart({ composite })` would send them. */
  composite: CFCompositePick[];
}

export interface GetCompositePriceResponse {
  success: boolean;
  /** Why these picks cannot be priced — the same refusal and text `addProductToCart` would give. */
  reason?: string;
  /**
   * What ONE composite with these picks adds to the cart, minor units: the line price the host would build plus the
   * picked items' modifiers. Before discounts, fees and tax. Show it; do not recompute it. Absent when refused.
   */
  total?: number;
  /**
   * The parts that still need picks before the composite can be added, and how many ("Pick 2 more"); empty when every
   * required part is filled. Decided by the host — keep Add to cart disabled while this is not empty.
   */
  missing: { partId: string; needed: number }[];
  timestamp: string;
}

export type GetCompositePrice = (params: GetCompositePriceParams) => Promise<GetCompositePriceResponse>;
