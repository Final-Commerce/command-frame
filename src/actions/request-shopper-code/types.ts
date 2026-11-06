// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with a code by email or text, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

/**
 * Where the code goes: an `email`, or a `phone` (a text message; any common spelling, the runtime
 * makes it E.164 with +1 when no country is given). Give one, not both. Give neither right after a
 * guest checkout to send it to the email that checkout used ("Email me a code" on the confirmation).
 */
export interface RequestShopperCodeParams {
  email?: string;
  phone?: string;
}

export interface RequestShopperCodeResponse {
  success: boolean;
  /** "We sent a 6-digit code to s…@example.com" (or "…by text to ••• 0101"). Never says who has an account. */
  message?: string;
  reason?: string;
}

/** Send a 6-digit sign-in code by email or text. It works at this store only. Signing up is the same step. */
export type RequestShopperCode = (params: RequestShopperCodeParams) => Promise<RequestShopperCodeResponse>;
