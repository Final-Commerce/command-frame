// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with an emailed code, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

/** A checkbox the checkout shows, with its wording and default. */
export interface ShopperCheckoutBox {
  id: 'accountOptIn' | 'marketingOptIn';
  label: string;
  checked: boolean;
}

export interface ShopperAccountView {
  name: string;
  email: string;
}

export type GetShopperAccountParams = Record<string, never>;

export interface GetShopperAccountResponse {
  success: boolean;
  signedIn: boolean;
  /** Present when signed in. */
  shopper?: ShopperAccountView;
  /** The account boxes for the checkout's contact step. A signed-in shopper gets only the news box. */
  boxes: ShopperCheckoutBox[];
  reason?: string;
}

/** Who is signed in at this store, and the checkout boxes to show. */
export type GetShopperAccount = (params?: GetShopperAccountParams) => Promise<GetShopperAccountResponse>;
