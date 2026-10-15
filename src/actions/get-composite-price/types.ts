// Get Composite Price Types (FT-83)
import type { CFCompositePick } from '../../CommonTypes';

export interface GetCompositePriceParams {
  /** The composite's variant — the one `addProductToCart` takes. */
  variantId: string;
  /** The picks so far, exactly as `addProductToCart({ composite })` would send them. */
  composite: CFCompositePick[];
  /** B41: the date and time a bookable pick is for, as `addProductToCart` takes it; without one a bookable pick is refused. */
  compositeSlot?: { startAt: string };
  /** How many of this composite, as `addProductToCart({ quantity })` takes it. Defaults to 1. */
  quantity?: number;
}

export interface GetCompositePriceResponse {
  success: boolean;
  /** Why these picks are refused — the same refusal and text `addProductToCart` would give. */
  reason?: string;
  /**
   * What `quantity` composites with these picks add to the cart, minor units: `unitTotal` × `quantity`. Before
   * discounts, fees and tax. Show it; do not recompute it. Absent when refused.
   */
  total?: number;
  /** What ONE composite with these picks adds: the line price the host would build plus the picked items' modifiers,
   *  minor units. Absent when refused. */
  unitTotal?: number;
  /**
   * The parts that still need picks before the composite can be added, with the part's `name` (null = untitled) and
   * how many ("Pick 2 more side"); empty when every required part is filled. Decided by the host — keep Add to cart
   * disabled while this is not empty.
   */
  missing: { partId: string; name: string | null; needed: number }[];
  /** The parts whose picks already reach their `max` — disable "+" on them. Decided by the host. */
  fullPartIds: string[];
  timestamp: string;
}

export type GetCompositePrice = (params: GetCompositePriceParams) => Promise<GetCompositePriceResponse>;
