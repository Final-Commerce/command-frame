// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with an emailed code, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

import type { ShopperAccountView } from '../get-shopper-account/types';

export interface SignInShopperParams {
  email: string;
  code: string;
}

export interface SignInShopperResponse {
  success: boolean;
  shopper?: ShopperAccountView;
  /** "That code is wrong", "Too many tries, get a new code", ... */
  reason?: string;
}

/** Sign in (or up) with the emailed code. The session is kept for this store only. */
export type SignInShopper = (params: SignInShopperParams) => Promise<SignInShopperResponse>;
