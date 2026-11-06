// The shopper account on a store's website (My Account's store-scoped twin): sign in or sign up
// with a code by email or text, see this store's orders. Served ONLY by the storefront runtime; on a
// register it does not exist. Every value comes back READY TO DISPLAY (the runtime formats money,
// dates and labels), so a flow shows it as it is and computes nothing. Failures resolve with
// `success: false` and a `reason` written for the shopper; these never throw.

/** A checkbox the checkout shows, with its wording and default. */
export interface ShopperCheckoutBox {
  /** `saveAddress` is offered to a signed-in shopper only; send it with the shipping address step's contact. */
  id: 'accountOptIn' | 'marketingOptIn' | 'saveAddress';
  label: string;
  checked: boolean;
}

export interface ShopperAccountView {
  name: string;
  /** null for an account made with a phone that has not added an email yet. */
  email: string | null;
  phone: string | null;
}

/** A saved address, as stored, plus one line to show it by. */
export interface ShopperAddressView {
  id: string;
  label: string | null;
  /** "12 Water St, St. John's, NL A1C 1A1" */
  line: string;
  isDefault: boolean;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postCode?: string;
  country?: string;
}

export type GetShopperAccountParams = Record<string, never>;

export interface GetShopperAccountResponse {
  success: boolean;
  signedIn: boolean;
  /** Present when signed in. */
  shopper?: ShopperAccountView;
  /** Signed in only: the saved addresses, the default first. The checkout prefills the default itself. */
  addresses?: ShopperAddressView[];
  /**
   * The account boxes for the checkout's contact step. A guest gets "Track this order" and the news
   * box; a signed-in shopper gets the news box and "Save this address" (ticked).
   */
  boxes: ShopperCheckoutBox[];
  reason?: string;
}

/** Who is signed in at this store, their saved addresses, and the checkout boxes to show. */
export type GetShopperAccount = (params?: GetShopperAccountParams) => Promise<GetShopperAccountResponse>;
