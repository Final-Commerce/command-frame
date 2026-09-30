// Attach Checkout Contact Types
//
// The second half of the online checkout. `startCheckout` creates the order and
// mounts the payment fields the moment a shopper ARRIVES; this puts their email
// on that same order once they have typed it.
//
// WHY THESE ARE TWO COMMANDS. The card fields cannot render without a payment
// session, a session needs a server-priced amount, and an amount needs an order.
// So the order has to exist before the shopper has typed anything. Demanding an
// email first is what forced the old "fill the form, then see the card fields"
// checkout — and it also meant every cart edit minted a NEW order, because the
// idempotency key moved with the cart.
//
// Served ONLY by the storefront runtime (a published website), like
// `startCheckout` itself. On a register it does not exist.

/**
 * Guest contact for the order. There is no shopper account, so this is the only
 * way to reach them — `email` is where the receipt goes and is required.
 */
export interface AttachCheckoutContactParams {
  email: string;
  name?: string;
  phone?: string;
  /** Defaults to the outlet the storefront booted against. */
  outletId?: string;
}

export interface AttachCheckoutContactResponse {
  /**
   * `false` means there was nothing to attach to — no checkout had been started
   * for this cart. It is NOT a failure to record the contact on an order that
   * exists, and it never means the shopper was charged.
   */
  attached: boolean;
  timestamp: string;
}

/**
 * Put the shopper's contact on the order `startCheckout` already created.
 *
 * Call it BEFORE paying, whenever the email is known — on blur, on submit, or
 * as the shopper leaves the contact step. It reuses the order's idempotency
 * key, so it updates that order rather than creating a second one.
 *
 * SAFE TO CALL TWICE. The server only ever ADDS contact to an order that has
 * none, so a later call cannot redirect a receipt that was already addressed.
 *
 * NEVER THROWS FOR A MISSING ORDER. Failing to record an email must not stop a
 * payment the shopper is trying to make, so the caller gets `attached: false`
 * and can carry on to pay.
 */
export type AttachCheckoutContact = (params: AttachCheckoutContactParams) => Promise<AttachCheckoutContactResponse>;
