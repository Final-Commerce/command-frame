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
  timestamp: string;
}

export type GetCurrentCart = () => Promise<GetCurrentCartResponse>;
