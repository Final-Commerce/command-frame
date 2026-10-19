import { CFActiveCart } from '../../CommonTypes';

// Get Current Cart Types
export interface GetCurrentCartResponse {
  success: boolean;
  cart: CFActiveCart; // ActiveCart
  /**
   * `true` while the order in this cart has any payment on it (a split leg, a part payment,
   * or paid in full): its items, amounts and customer can no longer be changed — the
   * value-changing cart commands and clearCart refuse. Absent on hosts that predate the lock.
   */
  itemsLocked?: boolean;
  /**
   * What each line adds to the cart, minor units, keyed by the line's `internalId` (products, bookings) or `id`
   * (custom sales): price × quantity − its own discounts + its own fees + its modifiers. Before the cart discount
   * and tax; Σ = the cart's subtotal before non-revenue items. Show it; do not recompute it.
   */
  lineTotals?: Record<string, number>;
  timestamp: string;
}

export type GetCurrentCart = () => Promise<GetCurrentCartResponse>;
