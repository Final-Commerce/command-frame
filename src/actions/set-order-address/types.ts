import type { CFActiveCart, CFCartAddress } from '../../CommonTypes';

// Set Order Address Types
//
// Puts a shipping or billing address on the cart; it is written onto the order at
// checkout. Adding a customer fills an EMPTY address from the customer's own copy,
// and this command is how the till or the shopper edits it before confirming. An
// edit changes the order's copy only, never the customer's saved address.
//
// Served by the till and by the storefront runtime.

export type OrderAddressType = 'shipping' | 'billing';

export interface SetOrderAddressParams {
  type: OrderAddressType;
  /** `null` clears it. Country and province may be codes or names; the runtime stores codes. */
  address: CFCartAddress | null;
}

export interface SetOrderAddressResponse {
  /** As stored: country as ISO-2, province as its code, postal code tidied. */
  address: CFCartAddress | null;
  /** The cart after the change. A new shipping address re-checks the chosen shipping option. */
  cart: CFActiveCart;
  timestamp: string;
}

/**
 * THROWS when the address can't be used: no country, a country we can't read, or a
 * shipping address without a street and city. The message says which, for the form.
 */
export type SetOrderAddress = (params: SetOrderAddressParams) => Promise<SetOrderAddressResponse>;
