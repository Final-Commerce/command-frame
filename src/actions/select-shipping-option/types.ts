import type { CFActiveCart, CFCartShipping } from '../../CommonTypes';

// Select Shipping Option Types
//
// Chooses one of the options `getShippingOptions` listed. The cart re-prices: its
// totals now include shipping and the tax on it. On a website the order is
// re-priced on the server before payment, so the amount charged is always the
// server's.
//
// Served by the till and by the storefront runtime.

export interface SelectShippingOptionParams {
  /** An `optionId` from `getShippingOptions`. `null` takes shipping off the cart. */
  optionId: string | null;
}

export interface SelectShippingOptionResponse {
  shipping: CFCartShipping | null;
  cart: CFActiveCart;
  timestamp: string;
}

/**
 * THROWS for an option this cart isn't offered: one from another address, a
 * website-only option at the till, or one the store has since removed.
 */
export type SelectShippingOption = (params: SelectShippingOptionParams) => Promise<SelectShippingOptionResponse>;
