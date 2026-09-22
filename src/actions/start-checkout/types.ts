// Start Checkout Types
//
// The ONLINE counterpart of the POS tenders: a shopper on a published website
// pays for the current cart with their own card. Mirrors kaching's storefront
// `startCheckout` input and result. All money is integer MINOR currency units.
//
// This command is served ONLY by the storefront runtime (a published website).
// On a register it does not exist, exactly as the till tenders (`cashPayment`,
// `terminalPayment`, `tapToPayPayment`, `chargeMoto`) do not exist online.

/**
 * Guest contact for the order. There is no shopper account, so this is the only
 * way to reach them — `email` is where the receipt goes and is required.
 */
export interface StartCheckoutContact {
  email: string;
  name?: string;
  phone?: string;
}

export interface StartCheckoutParams {
  contact: StartCheckoutContact;
  /**
   * CSS SELECTOR for the element the payment fields mount into, e.g.
   * `'#card-fields'`. The element must already be in the DOM when this is
   * called.
   *
   * A SELECTOR, NOT AN ELEMENT — and this is not a style preference. Command
   * params cross a `postMessage` boundary, which serializes them with the
   * structured clone algorithm; a DOM node is not cloneable, so passing
   * `ref.current` throws `DataCloneError: HTMLDivElement object could not be
   * cloned` before the command is ever sent. The string is resolved on the
   * runtime's side against the same document the page rendered.
   */
  container: string;
  /**
   * Where the provider returns the shopper after a redirect payment method
   * (bank apps, wallets). Defaults to the current URL.
   *
   * Must be HTTPS and on the SAME ORIGIN the storefront token was minted for;
   * the server rejects anything else, since this URL is handed to a payment
   * provider and an open redirect on a checkout is a phishing primitive.
   */
  returnUrl?: string;
  /**
   * Overrides the cart-derived idempotency key. Leave unset: the default is
   * derived from the cart, which is what makes a shopper's double-tap on "Pay"
   * return the SAME order instead of creating a second, abandoned one.
   */
  idempotencyKey?: string;
  /** Defaults to the outlet the storefront booted against. */
  outletId?: string;
  /** Forwarded verbatim to the provider's Drop-in (`showPayButton`, `locale`, field styling, …). */
  dropinConfiguration?: Record<string, unknown>;
}

/**
 * The created order. Deliberately says nothing about money having moved — see
 * `paymentStatus` and the `checkout` topic.
 */
export interface StartCheckoutOrder {
  orderId: string;
  receiptId: string;
  /** The SERVER-computed total in integer minor units — the only total that matters. */
  serverTotal: number;
  currency: string;
  /**
   * `ready` — the payment fields are mounted and the shopper can pay.
   * `unavailable` — THE ORDER EXISTS but no payment could be started, so the
   * shopper has NOT been charged. Never report this as a failed order.
   */
  paymentStatus: 'ready' | 'unavailable';
  /**
   * One-time password for reading this order back, returned only on the first
   * create. It is the ONLY route to this order's status — the guest token
   * grants order creation and deliberately not order reads — so a caller that
   * drops it cannot check whether the payment settled.
   */
  orderPassword?: string;
}

export interface StartCheckoutResponse {
  success: boolean;
  timestamp: string;
  order: StartCheckoutOrder;
}

/**
 * Creates the server-priced order and mounts the provider's hosted card fields.
 *
 * RESOLVES WHEN THE SHOPPER *CAN* PAY, NOT WHEN THEY HAVE. The shopper has not
 * typed a card yet when this returns. The outcome arrives on the `checkout`
 * topic instead.
 */
export type StartCheckout = (params: StartCheckoutParams) => Promise<StartCheckoutResponse>;
