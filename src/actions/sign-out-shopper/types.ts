// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with a code by email or text, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

export type SignOutShopperParams = Record<string, never>;

export interface SignOutShopperResponse {
  success: boolean;
  reason?: string;
}

/** Ends this store's session on this device. */
export type SignOutShopper = (params?: SignOutShopperParams) => Promise<SignOutShopperResponse>;
