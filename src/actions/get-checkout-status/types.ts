// Get Checkout Status Types
//
// Where an online order stands NOW, as the server holds it. A confirmation page uses it to move
// from "we're confirming your payment" to "paid" once the payment provider's notification has
// landed, which the browser alone can never know: it only ever sees that the provider ACCEPTED
// a payment.
//
// The runtime asks about a checkout THIS TAB placed (it keeps the checkout's key), so a page can
// only ever ask about its own order. No password: the server no longer issues one.
//
// Served ONLY by the storefront runtime (a published website). On a register it does not exist.

/** The shopper-facing vocabulary: never the platform's payment / fulfilment states. */
export type CheckoutOrderStatus =
  | 'awaiting_payment'
  | 'confirming'
  | 'payment_failed'
  | 'paid'
  | 'fulfilled'
  | 'partially_refunded'
  | 'refunded'
  | 'cancelled';

/** Why the server cancelled an order the shopper paid for. */
export type CheckoutCancelReason = 'sold_out';

export interface GetCheckoutStatusParams {
  /**
   * The receipt `startCheckout` returned, to name which order. Omitted: the checkout in flight,
   * else the last one this tab finished.
   */
  receiptId?: string;
}

export interface GetCheckoutStatusResponse {
  success: boolean;
  /** `null` when this tab placed no such order, or the server could not be asked. */
  status: CheckoutOrderStatus | null;
  /** True once the money is in: `paid`, `fulfilled`, or refunded since. */
  paid: boolean;
  /**
   * Why a `cancelled` order was cancelled, when the server cancelled it. `sold_out`: the stock ran out
   * before the payment was captured, so the payment was released and nothing was charged.
   */
  cancelReason?: CheckoutCancelReason;
  receiptId: string | null;
  timestamp: string;
}

/** Never throws for an unknown order: answers `status: null`. */
export type GetCheckoutStatus = (params?: GetCheckoutStatusParams) => Promise<GetCheckoutStatusResponse>;
