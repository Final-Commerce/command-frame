// Create Payment Link Types
//
// Creates a hosted payment link FOR THE CURRENT CART (station-v2 D-decisions,
// payment-link addendum). Mirrors kaching's `createPaymentLinkFromCart` input
// (`CreatePaymentLinkFromCartInput`) and result (`PaymentLinkFromCartResult`,
// which extends the provider's `PaymentLinkResponse` with the local `orderId`).
//
// The station creates the order (client `_id`, `unpaid × in_progress`) BEFORE
// the link is requested — only that id travels on the wire. On success the
// cart is cleared; on a failed send the order is voided and the cart is kept
// so the cashier can retry. Adyen-only today.

export interface CreatePaymentLinkParams {
  /** Address to email the link to. Exactly one of `email`/`phone` is required. */
  email?: string;
  /** Phone number to text the link to, E.164 (e.g. "+15555550123"). Exactly one of `email`/`phone` is required. */
  phone?: string;
}

export interface CreatePaymentLinkResponse {
  success: boolean;
  timestamp: string;
  /** Client `_id` of the order the station created for this link (charges the CURRENT CART). */
  orderId: string;
  /** Hosted payment page to send the shopper. */
  url: string;
  /** The provider's payment-link id. */
  id: string;
  /** When the link stops accepting payment (ISO date string). */
  expiresAt: string;
  /**
   * Per-channel delivery outcome. OPTIONAL: an older hub omits it entirely,
   * which reads as "delivered" — treat absence as success, not as a failure.
   */
  delivery?: {
    email?: 'sent' | 'failed';
    sms?: 'sent' | 'failed';
  };
}

export type CreatePaymentLink = (params: CreatePaymentLinkParams) => Promise<CreatePaymentLinkResponse>;
