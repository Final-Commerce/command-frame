// Set Variant Unavailable Types
export interface SetVariantUnavailableParams {
  /** Variant to mark or unmark. */
  variantId: string;
  /**
   * `true` marks the variant "can't be sold here right now" at the ACTIVE outlet; `false` removes the mark.
   * Independent of stock and of catalog visibility. Needs a connection: the host refuses offline.
   */
  unavailable: boolean;
}

export interface SetVariantUnavailableResponse {
  success: boolean;
  variantId: string;
  outletId: string;
  unavailable: boolean;
  timestamp: string;
}

export type SetVariantUnavailable = (params?: SetVariantUnavailableParams) => Promise<SetVariantUnavailableResponse>;
