// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with a code by email or text, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

import type { ShopperOrderView } from '../get-shopper-orders/types';

export interface ShopperOrderItemView {
  name: string;
  /** e.g. "Slate", or null */
  variant: string | null;
  quantity: number;
  totalLabel: string;
}

export interface ShopperOrderDetailView extends ShopperOrderView {
  items: ShopperOrderItemView[];
  /** Subtotal, Discount, Tax, Shipping, Refunded, Total: only the ones that apply. */
  totals: { label: string; amountLabel: string }[];
  /** "Visa •••• 4242", or null */
  paidWithLabel: string | null;
  /** "Pickup at Water St.", "Shipping", or null */
  deliveryLabel: string | null;
  /** "Return requested Nov 3, 2026", or null */
  returnLabel: string | null;
}

export interface GetShopperOrderParams {
  orderId: string;
}

export interface GetShopperOrderResponse {
  success: boolean;
  order?: ShopperOrderDetailView;
  reason?: string;
}

/** One of the shopper's orders at this store. */
export type GetShopperOrder = (params: GetShopperOrderParams) => Promise<GetShopperOrderResponse>;
