// Get Address Options Types
//
// What an address form offers: countries, and the provinces of the countries that
// have them (Canada today). A flow renders these as dropdowns and keeps no list of
// its own, so what the shopper picks is always a code the shipping rules match.
//
// Served by the till and by the storefront runtime.

export interface AddressProvinceOption {
  /** Province code, e.g. `QC`. This is what goes in the address's `state`. */
  code: string;
  /** In the requested locale where we have it (English or French). */
  name: string;
}

export interface AddressCountryOption {
  /** ISO 3166-1 alpha-2, e.g. `CA`. This is what goes in the address's `country`. */
  code: string;
  name: string;
  /** Empty when the country has no province list; the form then shows a free text field. */
  provinces: AddressProvinceOption[];
}

export interface GetAddressOptionsParams {
  /** BCP 47 locale for the names, e.g. `fr-CA`. Defaults to `en`. */
  locale?: string;
}

export interface GetAddressOptionsResponse {
  /** Sorted by name in the requested locale. */
  countries: AddressCountryOption[];
  /** The store's own country, to preselect. Null when it isn't known. */
  defaultCountry: string | null;
  timestamp: string;
}

export type GetAddressOptions = (params?: GetAddressOptionsParams) => Promise<GetAddressOptionsResponse>;
