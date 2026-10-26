import type { CFOrder } from '../../CommonTypes';

export interface ReleaseFromCartResponse {
  success: boolean;
  /** The order that left the cart, as saved — its state is unchanged and `inCart.active` is false. */
  order: CFOrder;
  timestamp: string;
}

export type ReleaseFromCart = () => Promise<ReleaseFromCartResponse>;
