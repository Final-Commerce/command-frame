// Add Product To Cart Types
import type { AddProductDiscountParams } from '../add-product-discount/types';
import type { AddProductFeeParams } from '../add-product-fee/types';

export interface AddProductToCartParams {
  /** ID of the variant to add. */
  variantId: string;
  /**
   * Defaults to 1. **May be fractional** — a variant sold by weight, volume or length is priced
   * per its own unit and keyed in that unit, so `0.456` kg is a quantity, not a typo.
   *
   * How many decimals are allowed is the variant's own business: `variant.unit.precision` —
   * `3` for a litre, `0` for anything sold by the piece. The engine refuses a quantity finer
   * than that and says which unit it was measured against; do not round, floor or clamp before
   * sending, and never key a quantity in base units to work around it (a per-100g price with a
   * gram count is explicitly not supported).
   *
   * A quantity field should take its step and its decimal count from `variant.unit.precision`,
   * not from a constant.
   */
  quantity?: number;
  /** Array of discounts to apply immediately. */
  discounts?: AddProductDiscountParams[];
  /** Array of fees to apply immediately. */
  fees?: AddProductFeeParams[];
  /** Note or array of notes to add immediately. */
  notes?: string | string[];
}

export interface AddProductToCartResponse {
  success: boolean;
  productId: string;
  variantId: string;
  /** The unique identifier for the specific item instance added to the cart. */
  internalId: string;
  name: string;
  quantity: number;
  timestamp: string;
}

export type AddProductToCart = (params?: AddProductToCartParams) => Promise<AddProductToCartResponse>;
