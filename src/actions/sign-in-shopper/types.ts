// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with a code by email or text, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

import type { ShopperAccountView } from '../get-shopper-account/types';

/** The same `email` or `phone` the code was sent to (or neither, after a guest checkout), and the code. */
export interface SignInShopperParams {
  email?: string;
  phone?: string;
  code: string;
}

export interface SignInShopperResponse {
  success: boolean;
  shopper?: ShopperAccountView;
  /** "That code is wrong", "Too many tries, get a new code", ... */
  reason?: string;
}

/**
 * Sign in (or up) with the code. The session is kept for this store only. Signing in fills the
 * checkout's contact and default address when they are empty, and the payment step then offers the
 * shopper's saved cards.
 */
export type SignInShopper = (params: SignInShopperParams) => Promise<SignInShopperResponse>;
