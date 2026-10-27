// Resume Checkout Types
//
// The RETURN LEG of an online checkout. Some payment methods — and 3-D Secure
// on a card — take the shopper away to their bank or wallet and send them back
// to `returnUrl` on a FRESH PAGE LOAD. The payment is not finished at that
// point: the provider hands the browser a one-time result in the URL, and it
// has to be handed back to the provider to complete the charge.
//
// `startCheckout` cannot do this. It ran in the page that is now gone.
//
// Served ONLY by the storefront runtime (a published website), like
// `startCheckout`. On a register it does not exist.

export interface ResumeCheckoutParams {
  /**
   * Where to read the provider's return data from. Defaults to the current
   * page URL, which is where the shopper has just landed.
   *
   * Only override this if you moved the query string somewhere else before
   * calling — for example if your router strips it on mount.
   */
  url?: string;
}

/**
 * What the return leg produced. Every field past `resumed` is absent when
 * `resumed` is `false`.
 */
export interface ResumeCheckoutResult {
  /**
   * `false` means THIS WAS AN ORDINARY PAGE LOAD — no provider return data was
   * in the URL, so there was nothing to finish and nothing happened. It is not
   * an error, and it is the answer on every normal visit to the page. Call this
   * unconditionally when your checkout or confirmation screen mounts and branch
   * on this field.
   */
  resumed: boolean;
  orderId?: string;
  receiptId?: string;
  /**
   * The provider's result code for the completed attempt, e.g. `Authorised` or
   * `Refused`. As everywhere else in this topic, `Authorised` is an
   * authorisation and NOT a settlement.
   */
  resultCode?: string;
  /** Opaque proof of the payment — see `PaymentCompletedPayload.sessionResult`. */
  sessionResult?: string;
  /**
   * The one-time order password from the original checkout, recovered from
   * browser storage. The page that held it in memory is gone, so this is the
   * only way back to the order's status after a redirect.
   */
  orderPassword?: string;
}

export interface ResumeCheckoutResponse {
  success: boolean;
  timestamp: string;
  checkout: ResumeCheckoutResult;
}

/**
 * Finish a checkout the shopper was redirected away from.
 *
 * SAFE TO CALL ON EVERY PAGE LOAD, and that is how it is meant to be used: on
 * an ordinary visit it finds no return data and answers `{ resumed: false }`
 * without touching the network. Calling it twice for one return is also safe —
 * the return data is consumed the first time.
 *
 * The outcome is ALSO published on the `checkout` topic (`payment-completed` or
 * `payment-failed`), exactly as it would have been had the shopper never left,
 * so a page that already subscribes needs no second code path. Subscribe first,
 * then call this, or the event fires before you are listening.
 */
export type ResumeCheckout = (params?: ResumeCheckoutParams) => Promise<ResumeCheckoutResponse>;
