import { CFActiveCart } from '../../CommonTypes';

// Get Current Cart Types
export interface GetCurrentCartResponse {
  success: boolean;
  cart: CFActiveCart; // ActiveCart
  /**
   * What each line adds to the cart, minor units, keyed by the line's `internalId` (products, bookings) or `id`
   * (custom sales): price × quantity − its own discounts + its own fees + its modifiers. Before the cart discount
   * and tax; Σ = the cart's subtotal before non-revenue items. Show it; do not recompute it.
   */
  lineTotals?: Record<string, number>;
  timestamp: string;
}

export type GetCurrentCart = () => Promise<GetCurrentCartResponse>;
