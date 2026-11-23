// Address autocomplete for a store website's checkout: what the shopper typed in, matching
// addresses out, then the picked one as a full address (getAddressDetails). Served ONLY by the
// storefront runtime. Failures resolve with `success: false` and a `reason`; these never throw, and
// when lookup is not available the flow simply keeps its plain address fields.

/** One line to show in the dropdown. Pass its `id` to getAddressDetails when the shopper picks it. */
export interface AddressSuggestion {
  id: string;
  /** The whole line: "12 Water St, St. John's, NL, Canada". */
  label: string;
  /** The street part, for a two-line row: "12 Water St". */
  main: string;
  /** The rest: "St. John's, NL, Canada". */
  secondary: string;
}

export interface SearchAddressesParams {
  /** What the shopper typed so far. Under 3 characters answers no suggestions without a lookup. */
  query: string;
  /** ISO 3166-1 alpha-2. Defaults to the store's own country. */
  country?: string;
  /** Language of the suggestions, e.g. `fr`. */
  language?: string;
}

export interface SearchAddressesResponse {
  success: boolean;
  suggestions: AddressSuggestion[];
  /** false when this site has no address lookup: keep the plain fields and stop asking. */
  available: boolean;
  reason?: string;
}

/**
 * Addresses matching what the shopper typed, for an autocomplete dropdown. Call it as they type
 * (wait ~250 ms after the last keystroke); the runtime groups the searches and the pick into one
 * lookup session itself.
 */
export type SearchAddresses = (params: SearchAddressesParams) => Promise<SearchAddressesResponse>;
