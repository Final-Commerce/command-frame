// The second half of address autocomplete: the suggestion the shopper picked, as a full address.
// Served ONLY by the storefront runtime. Failures resolve with `success: false`; never throws.

/** In the cart's shape: country ISO 3166-1 alpha-2, province or state as its code. */
export interface AddressDetails {
  address1: string;
  address2?: string;
  city?: string;
  state?: string;
  postCode?: string;
  country: string;
}

export interface GetAddressDetailsParams {
  /** A suggestion's `id`, from searchAddresses. */
  id: string;
  language?: string;
}

export interface GetAddressDetailsResponse {
  success: boolean;
  /** Ready for setOrderAddress. Add the shopper's name; keep anything they edit afterwards. */
  address?: AddressDetails;
  reason?: string;
}

/** The picked suggestion as a full address. Ends the lookup session the searches opened. */
export type GetAddressDetails = (params: GetAddressDetailsParams) => Promise<GetAddressDetailsResponse>;
