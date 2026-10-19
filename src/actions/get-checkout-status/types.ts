// Get Checkout Status Types
//
// Where an online order stands NOW, as the server holds it. A confirmation page uses it to move
// from "we're confirming your payment" to "paid" once the payment provider's notification has
// landed, which the browser alone can never know: it only ever sees that the provider ACCEPTED
// a payment.
//
// Keyed by the one-time order password `startCheckout` (or `resumeCheckout`, after a redirect)
// returned, so a page can only ever ask about an order it created.
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

export interface GetCheckoutStatusParams {
  /** The order password from `startCheckout` or `resumeCheckout`. */
  orderPassword: string;
  /**
   * The provider's opaque `sessionResult` from the payment-completed event, when the page has it.
   * Lets the server verify the payment with the provider while the notification is still on its way.
   */
  sessionResult?: string;
}

export interface GetCheckoutStatusResponse {
  success: boolean;
  /** `null` when the order is unknown or the password has expired. */
  status: CheckoutOrderStatus | null;
  /** True once the money is in: `paid`, `fulfilled`, or refunded since. */
  paid: boolean;
  receiptId: string | null;
  timestamp: string;
}

/** Never throws for an unknown order: answers `status: null`. */
export type GetCheckoutStatus = (params: GetCheckoutStatusParams) => Promise<GetCheckoutStatusResponse>;
