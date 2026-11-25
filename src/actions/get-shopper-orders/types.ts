// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with a code by email or text, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

import type { ShopperOrderStatus } from '@final-commerce/common';

/** One order row, ready to display. */
export interface ShopperOrderView {
  orderId: string;
  receiptId: string;
  /** e.g. "Nov 1, 2026" */
  placedAtLabel: string;
  /** For styling only: the label is what the shopper reads. */
  status: ShopperOrderStatus;
  /** "Paid", "Refunded", "Partially refunded", "Cancelled" */
  statusLabel: string;
  /** "$42.50" */
  totalLabel: string;
  /** "3 items" */
  itemsLabel: string;
}

export interface GetShopperOrdersParams {
  /** From the previous page's `nextCursor`. */
  cursor?: string;
}

export interface GetShopperOrdersResponse {
  success: boolean;
  /** This store's orders placed with the shopper's verified emails, newest first. */
  orders: ShopperOrderView[];
  nextCursor: string | null;
  reason?: string;
}

/** The signed-in shopper's orders at this store. */
export type GetShopperOrders = (params?: GetShopperOrdersParams) => Promise<GetShopperOrdersResponse>;
