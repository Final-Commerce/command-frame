// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with an emailed code, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

export interface RequestShopperCodeParams {
  email: string;
}

export interface RequestShopperCodeResponse {
  success: boolean;
  /** "We sent a 6-digit code to s…@example.com". The same for every email: it never says who has an account. */
  message?: string;
  reason?: string;
}

/** Email a 6-digit sign-in code. The code works at this store only. Signing up is the same step. */
export type RequestShopperCode = (params: RequestShopperCodeParams) => Promise<RequestShopperCodeResponse>;
